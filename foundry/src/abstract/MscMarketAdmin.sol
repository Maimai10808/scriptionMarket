// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import {MscMarketErrors} from "./MscMarketErrors.sol";
import {MscMarketStorage} from "./MscMarketStorage.sol";

abstract contract MscMarketAdmin is OwnableUpgradeable, MscMarketErrors, MscMarketStorage {
    function setAdminAddress(address newAdminAddress) public onlyOwner {
        transferOwnership(newAdminAddress);
        s_adminAddress = newAdminAddress;
    }

    function setFeeBps(uint96 newFeeBps) external onlyOwner {
        s_feeBps = newFeeBps;
    }

    function setFeatureStatus(string memory feature, bool enabled) public onlyOwner {
        s_featureIsEnabled[feature] = enabled;
    }

    function setAllFeatuteStatus(bool enabled) public onlyOwner {
        s_featureIsEnabled["list"] = enabled;
        s_featureIsEnabled["buy"] = enabled;
        s_featureIsEnabled["withdraw"] = enabled;
    }

    function mscWithdraw() external onlyOwner {
        if (!s_featureIsEnabled["withdraw"]) {
            revert MscMarketV1__FeatureDisabled("withdraw");
        }

        (bool success,) = s_adminAddress.call{value: address(this).balance}("");

        if (!success) revert MscMarketV1__WithdrawFailed();
    }

    function manualGetIncome(address seller) public {
        if (s_failureOrder[seller] == 0) {
            revert MscMarketV1__NotFailureOrder();
        }

        uint256 failureAmount = s_failureOrder[seller];
        s_failureOrder[seller] = 0;

        (bool success,) = seller.call{value: failureAmount}("");

        if (!success) {
            s_failureOrder[seller] = failureAmount;
            revert MscMarketV1__PurchaseFailed();
        }
    }
}
