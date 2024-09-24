// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {IVerifier} from "./Iverifier.sol";

abstract contract CommitAndReveal is IVerifier {
    // TODO store question and answer per token
    //check function behaviour using these values
    bytes32 public question;
    // the secret is the answer to question above, or one you set
    uint16 private secretAnswer;
    // the hash of the question and the secretAnswer, used to verify the secret
    bytes32 public hashOfQuestionAndSecretAnswer =
        0x189b4bdfefd3b123e8e7970b2b8a21dfc32f8539c8688014e2c5427a1c22f1e9;

    constructor(string memory _question) {
        question = keccak256(abi.encode(_question));
    }

    // check if the hash of the secret and question matches the saved hash
    function checkSecret(uint16 _secretAnswer) public view returns (bool) {
        bytes32 _question = question;
        return
            keccak256(abi.encodePacked(_question, _secretAnswer)) ==
            hashOfQuestionAndSecretAnswer;
    }

    // TODO
    function checkSecretHash(bytes32 _secretAnswerHash) public view returns (bool) {
        bytes32 _question = question;
        return
            keccak256(abi.encodePacked(_question, _secretAnswerHash)) ==
            hashOfQuestionAndSecretAnswer;
    }

    //hash the question and answer
    function hashQandA() public returns (bytes32) {
        return
            hashOfQuestionAndSecretAnswer = keccak256(
                abi.encodePacked(question, secretAnswer)
            );
    }
}
