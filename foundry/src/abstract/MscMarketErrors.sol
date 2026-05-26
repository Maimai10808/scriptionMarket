// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

abstract contract MscMarketErrors {
    error MscMarketV1__FeatureDisabled(string featurePoint);
    error MscMarketV1__PurchaseFailed();
    error MscMarketV1__WithdrawFailed();
    error MscMarketV1__InvalidSignature();
    error MscMarketV1__LengthNotEqual();
    error MscMarketV1__NotFailureOrder();
    error MscMarketV1__OrderIsProcessing();
}
