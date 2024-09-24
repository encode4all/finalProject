// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface IVerifier {
    function checkSecret(uint16) external view returns (bool);
    function checkSecretHash(bytes32) external view returns (bool);
}