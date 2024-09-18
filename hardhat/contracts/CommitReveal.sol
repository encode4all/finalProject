// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract CommitAndReveal {
    //check function behaviour using these values
    bytes32 public question = "What is 2 + 2?";
    // the secret is the answer to question above, or one you set
    uint16 public secretAnswer;
    // the hash of the question and the secretAnswer, used to verify the secret
    bytes32 public hashOfQuestionAndSecretAnswer =
        0x189b4bdfefd3b123e8e7970b2b8a21dfc32f8539c8688014e2c5427a1c22f1e9;

    // check if the hash of the secret and question matches the saved hash
    function checkSecret(uint16 _secretAnswer) public view returns (bool) {
        bytes32 _question = question;
        return
            keccak256(abi.encodePacked(_question, _secretAnswer)) ==
            hashOfQuestionAndSecretAnswer;
    }

    //set a new question
    function setQuestion(bytes32 _question) public {
        require(
            _question.length <= 32,
            "The question length cannot exceed 32 bytes"
        );
        question = _question;
    }

    //set a new answer
    function setAnswer(uint16 _answer) public {
        require(
            _answer < type(uint16).max,
            "The answer cannot be greater than 65535"
        );
        secretAnswer = _answer;
    }

    //hash the question and answer
    function hashQandA() public returns (bytes32) {
        return
            hashOfQuestionAndSecretAnswer = keccak256(
                abi.encodePacked(question, secretAnswer)
            );
    }
}
