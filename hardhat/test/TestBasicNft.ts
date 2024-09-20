import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import { viem } from "hardhat";
import { hexToString } from "viem";


async function deployContractFixture(name: string, symbol: string) {
  const publicClient = await viem.getPublicClient();
  const [owner, ...otherAccounts] = await viem.getWalletClients();
  const contract = await viem.deployContract("BasicNft", [name, symbol]);
  return {
    publicClient,
    owner,
    otherAccounts,
    contract,
  };
}

async function waitForTrxSuccess(hash: `0x${string}`) {
  const publicClient = await viem.getPublicClient();

  const trxReceipt = await publicClient.waitForTransactionReceipt({ hash });

  if (trxReceipt.status !== 'success') {
    throw new Error(`${hash} transaction not successful`);
  }

  return trxReceipt;
}


describe("BasicNFT scheme", () => {


  let owner: { account: any };
  let contract: any;
  describe("when deployed", () => {

    const nftName = "NFT_name";
    const nftSymbol = "NFT";

    before(async ()  => {
      const d = () => deployContractFixture(nftName, nftSymbol);

      const contractFixture = await loadFixture(d);
      contract = contractFixture.contract;
      owner = contractFixture.owner;
    });

    it("has initiated defaults", async () => {
      const [name, symbol] = await Promise.all([
        contract.read.name(),
        contract.read.symbol()
      ]);

      expect(name).to.eql(nftName);
      expect(symbol).to.eql(nftSymbol);
    });
  });

  describe("flows & usecases", () => {
    const nftName = "NFT_name";
    const nftSymbol = "NFT";
    const tokenUri = "ipfs://foobar";
    before(async ()  => {
      const d = () => deployContractFixture(nftName, nftSymbol);

      const contractFixture = await loadFixture(d);
      contract = contractFixture.contract;
      owner = contractFixture.owner;
    });

    // it can mint
    it('can mint nft', async () => {
      const mintTx = await contract.write.mintNft([tokenUri], {
        account: owner.account,
      });

      await waitForTrxSuccess(mintTx);

      const t_counter = await contract.read.getTokenCounter();
      expect(t_counter).to.eql(1n);

    });
    // can get back uniqye tokenUri
    it('can get tokenUri', async () => {

      const tokenUriFromNft = await contract.read.tokenURI([0n]);
      expect(tokenUriFromNft).to.eql(tokenUri);
    });
  });
});
