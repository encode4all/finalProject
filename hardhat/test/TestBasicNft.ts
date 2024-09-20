import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import { viem } from "hardhat";
import { hexToString } from "viem";


async function deployContractFixture(name: string, symbol: string) {
    const publicClient = await viem.getPublicClient();
    const [owner, otherAccount] = await viem.getWalletClients();
    const contract = await viem.deployContract("BasicNft", [name, symbol]);
    return {
      publicClient,
      owner,
      otherAccount,
      contract,
    };
  }

  
describe("BasicNFT scheme", () => {
  describe("when deployed", () => {
    it("has initiated defaults", async () => {
      const nftName = "NFT_name";
      const nftSymbol = "NFT";
      const d = () => deployContractFixture(nftName, nftSymbol);
      const { contract } = await loadFixture(d);

      const [name, symbol] = await Promise.all([
        contract.read.name(),
        contract.read.symbol()
      ]);

      expect(name).to.eql(nftName);
      expect(symbol).to.eql(nftSymbol);
    });

    // it can mint
    // can get back uniqye tokenUri
  });
});
