// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

abstract contract MscMarketStorage {
    enum OrderStatus {
        Listing,
        Canceled,
        Sold
    }

    struct MarketStorage {
        uint256 number;
        address maker;
        uint256 time;
        uint256 amount;
        uint256 price;
        string tick;
    }

    bytes32 internal constant LISTING_TYPEHASH =
        keccak256("Listing(uint256 number,address maker,uint256 time,uint256 amount,uint256 price,string tick)");

    uint96 internal s_feeBps;
    address internal s_adminAddress;

    mapping(string featurePoint => bool isEnabled) internal s_featureIsEnabled;
    mapping(address seller => uint256 amount) internal s_failureOrder;

    mapping(address seller => mapping(uint256 number => OrderStatus)) internal s_processing;
}
