// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface IVerifier {
    function checkSecret(string calldata) external view returns (bool);
    function checkSecretByHash(bytes calldata) external view returns (bool);
}
