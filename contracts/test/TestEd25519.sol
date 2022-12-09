// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../libraries/Ed25519.sol";

contract TestEd25519 {
    bool public verified;

    function verify(
        bytes32 k,
        bytes32 r,
        bytes32 s,
        bytes memory m
    ) public pure returns (bool) {
        // bool verified = Ed25519.verify(k, r, s, m);
        // return verified;
        return Ed25519.verify(k, r, s, m);
    }

    function verifySet(
        bytes32 k,
        bytes32 r,
        bytes32 s,
        bytes memory m
    ) public returns (bool) {
        // bool verified = Ed25519.verify(k, r, s, m);
        // return verified;
        verified = Ed25519.verify(k, r, s, m);
    }
}
