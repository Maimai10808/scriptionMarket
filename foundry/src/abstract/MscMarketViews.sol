// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {EIP712Upgradeable} from "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";

import {MscMarketStorage} from "./MscMarketStorage.sol";

abstract contract MscMarketViews is EIP712Upgradeable, MscMarketStorage {
    function computeFee(uint256 price) public view returns (uint256 fee) {
        fee = (price * uint256(s_feeBps)) / 100;
    }

    function getAdminAddress() public view returns (address adminAddress) {
        return s_adminAddress;
    }

    function getFeeBps() public view returns (uint96 feeBps) {
        return s_feeBps;
    }

    function getFeatureStatus(string memory feature) public view returns (bool isEnabled) {
        return s_featureIsEnabled[feature];
    }

    function getVersion() public pure returns (uint256 version) {
        version = 1;
    }

    function getDomainSeparator() public view returns (bytes32 domainSeparator) {
        domainSeparator = _domainSeparatorV4();
    }

    function getFailureOrder(address failureAddress) public view returns (uint256 failureAmount) {
        failureAmount = s_failureOrder[failureAddress];
    }

    function getOrderStatus(address processingAddress, uint256 number) public view returns (OrderStatus status) {
        status = s_processing[processingAddress][number];
    }
}
