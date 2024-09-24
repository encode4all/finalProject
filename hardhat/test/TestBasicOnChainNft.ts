import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import { viem } from "hardhat";

async function deployContractFixture(
  name: string,
  symbol: string,
  description: string,
  imageUri: string,
) {
  const publicClient = await viem.getPublicClient();
  const [owner, ...otherAccounts] = await viem.getWalletClients();
  const contractCR = await viem.deployContract("CommitAndReveal", [
    "What are the secret words?",
  ]);
  const contract = await viem.deployContract("BasicOnChainNft", [
    name,
    symbol,
    description,
    imageUri,
    contractCR.address,
  ]);
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

  if (trxReceipt.status !== "success") {
    throw new Error(`${hash} transaction not successful`);
  }

  return trxReceipt;
}

describe("BasicOnChainNFT scheme", () => {
  let owner: { account: any };
  let contract: any;
  describe("when deployed", () => {
    const nftName = "NFT_name";
    const nftSymbol = "NFT";

    before(async () => {
      const d = () => deployContractFixture(nftName, nftSymbol, "", "");

      const contractFixture = await loadFixture(d);
      contract = contractFixture.contract;
      owner = contractFixture.owner;
    });

    it("has initiated defaults", async () => {
      const [name, symbol] = await Promise.all([
        contract.read.name(),
        contract.read.symbol(),
      ]);

      expect(name).to.eql(nftName);
      expect(symbol).to.eql(nftSymbol);
    });
  });

  describe("flows & usecases", () => {
    const nftName = "NFT_name";
    const nftSymbol = "NFT";
    const imageUri = "ipfs://foobar";
    const description = "An NFT with its metadata on chain";
    before(async () => {
      const d = () =>
        deployContractFixture(nftName, nftSymbol, description, imageUri);

      const contractFixture = await loadFixture(d);
      contract = contractFixture.contract;
      owner = contractFixture.owner;
    });

    // it can mint
    it("can mint nft", async () => {
      const mintTx = await contract.write.mintNft([], {
        account: owner.account,
      });

      await waitForTrxSuccess(mintTx);

      const t_counter = await contract.read.getTokenCounter();
      expect(t_counter).to.eql(1n);
    });
    // can get back unique tokenUri
    it("can get tokenUri", async () => {
      const tokenUriFromNft: string = await contract.read.tokenURI([0n]);
      const decodedTokenValue = Buffer.from(
        tokenUriFromNft.replace("data:application/json;base64,", ""),
        "base64",
      ).toString("ascii");
      const expectedTokenValue = {
        name: nftName,
        description,
        attributes: [],
        image: imageUri,
      };
      expect(JSON.parse(decodedTokenValue)).to.eql(expectedTokenValue);
    });

    describe("Mints different nft", () => {
      it("cannot mint another token of same nft", async () => {
        const mintTx = contract.write.mintNft([], {
          account: owner.account,
        });

        expect(mintTx).to.eventually.be.rejected.and.be.an.instanceOf(Error);

        const t_counter = await contract.read.getTokenCounter();
        expect(t_counter).to.eql(1n);
      });

      // can get back unique tokenUri
      it("can get tokenUri", async () => {
        const tokenUriFromNft: string = await contract.read.tokenURI([0n]);
        const decodedTokenValue = Buffer.from(
          tokenUriFromNft.replace("data:application/json;base64,", ""),
          "base64",
        ).toString("ascii");
        const expectedTokenValue = {
          name: nftName,
          description,
          attributes: [],
          image: imageUri,
        };
        expect(JSON.parse(decodedTokenValue)).to.eql(expectedTokenValue);

        const nonExistentToken = contract.read.tokenURI([0n]);

        expect(nonExistentToken).to.eventually.be.rejected.and.be.an.instanceOf(
          Error,
        );
      });
    });
  });
});
