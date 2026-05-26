// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

import {MscMarketAdmin} from "./abstract/MscMarketAdmin.sol";
import {MscMarketEvents} from "./abstract/MscMarketEvents.sol";
import {MscMarketSignature} from "./abstract/MscMarketSignature.sol";
import {MscMarketViews} from "./abstract/MscMarketViews.sol";

contract MscMarketV1 is
    Initializable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable,
    MscMarketAdmin,
    MscMarketEvents,
    MscMarketSignature,
    MscMarketViews
{
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    fallback() external payable {}

    receive() external payable {}

    function initialize(address adminAddress, uint96 feeBps) public initializer {
        __Ownable_init(adminAddress);
        __EIP712_init("MscMarketV1", "1.0");
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();

        s_adminAddress = adminAddress;
        s_feeBps = feeBps;

        s_featureIsEnabled["list"] = true;
        s_featureIsEnabled["buy"] = true;
        s_featureIsEnabled["withdraw"] = true;
    }

    function mscPurchase(MarketStorage calldata marketStorage, bytes calldata signature) external payable nonReentrant {
        if (!s_featureIsEnabled["buy"]) {
            revert MscMarketV1__FeatureDisabled("buy");
        }

        if (s_processing[marketStorage.maker][marketStorage.number] != OrderStatus.Listing) {
            revert MscMarketV1__OrderIsProcessing();
        }

        if (msg.value < marketStorage.price) {
            revert MscMarketV1__PurchaseFailed();
        }

        bytes32 hashedMessage = _hashListing(marketStorage);

        if (!_verifySign(hashedMessage, signature, marketStorage.maker)) {
            revert MscMarketV1__InvalidSignature();
        }

        s_processing[marketStorage.maker][marketStorage.number] = OrderStatus.Sold;

        uint256 sellerIncome = marketStorage.price - computeFee(marketStorage.price);

        (bool success,) = marketStorage.maker.call{value: sellerIncome}("");

        if (!success) revert MscMarketV1__PurchaseFailed();

        emit mxcscriptions_protocol_TransferMSC20Token(
            marketStorage.maker, msg.sender, marketStorage.number, marketStorage.amount
        );
    }

    function mscBatchPurchase(MarketStorage[] calldata marketStorages, bytes[] calldata signatures, uint256 totalPrice)
        external
        payable
        nonReentrant
    {
        if (!s_featureIsEnabled["buy"]) {
            revert MscMarketV1__FeatureDisabled("buy");
        }

        if (marketStorages.length != signatures.length) {
            revert MscMarketV1__LengthNotEqual();
        }

        uint256 computedTotalPrice;
        for (uint256 i = 0; i < marketStorages.length; i++) {
            computedTotalPrice += marketStorages[i].price;
        }

        if (totalPrice != computedTotalPrice || msg.value < computedTotalPrice) {
            revert MscMarketV1__PurchaseFailed();
        }

        for (uint256 i = 0; i < marketStorages.length; i++) {
            MarketStorage calldata marketStorage = marketStorages[i];

            if (s_processing[marketStorage.maker][marketStorage.number] != OrderStatus.Listing) {
                continue;
            }

            bytes32 hashedMessage = _hashListing(marketStorage);

            if (!_verifySign(hashedMessage, signatures[i], marketStorage.maker)) {
                continue;
            }

            s_processing[marketStorage.maker][marketStorage.number] = OrderStatus.Sold;

            uint256 sellerIncome = marketStorage.price - computeFee(marketStorage.price);

            (bool success,) = marketStorage.maker.call{value: sellerIncome}("");

            if (!success) {
                s_failureOrder[marketStorage.maker] += sellerIncome;
                continue;
            }

            emit mxcscriptions_protocol_TransferMSC20Token(
                marketStorage.maker, msg.sender, marketStorage.number, marketStorage.amount
            );
        }
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
