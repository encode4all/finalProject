// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {IVerifier} from "./Iverifier.sol";

contract CommitAndReveal is IVerifier {
    // TODO store question and answer per token
    //check function behaviour using these values
    bytes public question;
    
    // the hash of the question and the secretAnswer, used to verify the secret
    bytes32 public hashOfQuestionAndSecretAnswer =
        0x3de33a73c66afd29d5dd3fb34535ef6827096595a74c7c898a6d0f239b59805a;

    constructor(string memory _question) {
        question = abi.encodePacked(_question);
    }

    //  hash the user inputs. Hash together with question and see if it matches secretHashQA
    function checkSecret(string calldata _userInput) public view returns (bool) {
        bytes memory _secretAnswer = abi.encodePacked(_userInput);
        return
            keccak256(abi.encodePacked(question, _secretAnswer)) ==
            hashOfQuestionAndSecretAnswer;
    }

    // this would be the function called by the API because we can hash the userInput offchain and see if it matches
    function checkSecretByHash(bytes calldata _secretAnswerHash) public view returns (bool) {
        return
            keccak256(abi.encodePacked(question, _secretAnswerHash)) ==
            hashOfQuestionAndSecretAnswer;
    }

    function qAhash (string calldata _question, string calldata _answer) public pure returns (bytes32) {
        bytes memory localQuestion = abi.encodePacked(_question);
        bytes memory localAnswer = abi.encodePacked(_answer);
        return  keccak256(abi.encodePacked(localQuestion, localAnswer));
    }

    //helper functions

    //used for hashing input to verify `checkSecretByHash` functionality
    function hashInput(string calldata _input) public pure returns (bytes memory){
        return abi.encodePacked(_input);
     }
     //used for human readable format of question
    function decodeQuestion () public view returns (string memory){
        return string(question);
    }
}
