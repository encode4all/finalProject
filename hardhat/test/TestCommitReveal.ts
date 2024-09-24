import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import { viem } from "hardhat";
import { hexToString, stringToHex } from "viem";

async function deployContractFixture() {
  const SECRET_WORDS = "foo,bar";
  const publicClient = await viem.getPublicClient();
  const [owner, otherAccount] = await viem.getWalletClients();
  const contract = await viem.deployContract("CommitAndReveal", [
    "What are the secret words?",
  ]);
  return {
    publicClient,
    owner,
    otherAccount,
    contract,
    SECRET_WORDS,
  };
}

describe("CommitReveal Scheme", () => {
  describe("When the contract is deployed", () => {
    it("Has a question", async () => {
      const { contract } = await loadFixture(deployContractFixture);
      const question = await contract.read.question();
      expect(hexToString(question, { size: 32 })).to.eql(
        "What are the secret words?",
      );
    });
  });

  describe("Successful conditions", () => {
    it("returns true when provided with the right answer", async () => {
      const { contract, SECRET_WORDS } = await loadFixture(
        deployContractFixture,
      );
      const qaHashed = await contract.read.hashOfQuestionAndSecretAnswer;
      const rightAnswer = SECRET_WORDS;
      const checkedAnswer = await contract.read.checkSecret([rightAnswer]);
      expect(checkedAnswer).to.eq(true);
    });
    it("returns true when provided with a hash of the right answer", async () => {
      const { contract, SECRET_WORDS } = await loadFixture(
        deployContractFixture,
      );
      const hashedSecretWords = stringToHex(SECRET_WORDS);
      const checkedAnswer = await contract.read.checkSecretByHash([
        hashedSecretWords,
      ]);
      expect(checkedAnswer).to.eq(true);
    });
  });

  describe("Failure conditions", () => {
    it("returns false when provided with a wrong answer", async () => {
      const { contract } = await loadFixture(deployContractFixture);
      const wronganswer = "Alice,Bob";
      const checkedAnswer = await contract.read.checkSecret([wronganswer]);
      expect(checkedAnswer).to.eq(false);
    });
    it("returns false when provided with a hash of a wrong answer", async () => {
      const { contract } = await loadFixture(deployContractFixture);
      const hashedSecretWords = stringToHex("Alice,Bob");
      const checkedAnswer = await contract.read.checkSecretByHash([
        hashedSecretWords,
      ]);
      expect(checkedAnswer).to.eq(false);
    });
  });
});
