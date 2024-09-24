import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import { viem } from "hardhat";
import { hexToString } from "viem";

async function deployContractFixture() {
  const publicClient = await viem.getPublicClient();
  const [owner, otherAccount] = await viem.getWalletClients();
  const contract = await viem.deployContract("CommitAndReveal", []);
  return {
    publicClient,
    owner,
    otherAccount,
    contract,
  };
}

describe("CommitReveal Scheme", () => {
  describe("When the contract is deployed", () => {
    it("Has a question", async () => {
      const { contract } = await loadFixture(deployContractFixture);
      const question = await contract.read.question();
      expect(hexToString(question, { size: 32 })).to.eql("What is 2 + 2?");
    });
  });

  // TODO
  describe("Successful conditions", () => {
    it("returns true when provided with the right answer");
    it("returns true when provided with a hash of the right wrong answer");
  });

  describe("Failure conditions", () => {
    it("returns false when provided with a wrong answer");
    it("returns false when provided with a hash of a wrong answer");
  });
});
