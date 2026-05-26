// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EIP712Upgradeable} from "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";

import {MscMarketStorage} from "./MscMarketStorage.sol";

abstract contract MscMarketSignature is EIP712Upgradeable, MscMarketStorage {
    using ECDSA for bytes32;

    function _hashListing(MarketStorage calldata marketStorage) internal view returns (bytes32) {
        return _hashTypedDataV4(
            keccak256(
                abi.encode(
                    LISTING_TYPEHASH,
                    marketStorage.number,
                    marketStorage.maker,
                    marketStorage.time,
                    marketStorage.amount,
                    marketStorage.price,
                    keccak256(bytes(marketStorage.tick))
                )
            )
        );
    }

    function _verifySign(bytes32 hashedMessage, bytes calldata signature, address signer)
        internal
        pure
        returns (bool isVerified)
    {
        (address recovered, ECDSA.RecoverError error,) = ECDSA.tryRecover(hashedMessage, signature);
        isVerified = error == ECDSA.RecoverError.NoError && recovered == signer;
    }
}
