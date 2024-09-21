import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import { viem } from "hardhat";

async function deployContractFixture(name: string, symbol: string) {
  const publicClient = await viem.getPublicClient();
  const [owner, ...otherAccounts] = await viem.getWalletClients();
  const contract = await viem.deployContract("BasicOnChainNft", [name, symbol]);
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
      const d = () => deployContractFixture(nftName, nftSymbol);

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
      const d = () => deployContractFixture(nftName, nftSymbol);

      const contractFixture = await loadFixture(d);
      contract = contractFixture.contract;
      owner = contractFixture.owner;
    });

    // it can mint
    it("can mint nft", async () => {
      const mintTx = await contract.write.mintNft([imageUri, description], {
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
      const imageURI2 =
        "ipfs://bafkreigvd6dtqh3hhuzszdfrsvvvm6wepkuxp5mujinzkldquzn7mwvmiu";
      const description2 = "It is indeed non fungible";
      it("can mint another token of same nft", async () => {
        const mintTx = await contract.write.mintNft([imageURI2, description2], {
          account: owner.account,
        });

        await waitForTrxSuccess(mintTx);

        const t_counter = await contract.read.getTokenCounter();
        expect(t_counter).to.eql(2n);
      });
      // can get back unique tokenUri
      it("can get tokenUri", async () => {
        const tokenUriFromNft: string = await contract.read.tokenURI([1n]);
        const decodedTokenValue = Buffer.from(
          tokenUriFromNft.replace("data:application/json;base64,", ""),
          "base64",
        ).toString("ascii");
        const expectedTokenValue = {
          name: nftName,
          description: description2,
          attributes: [],
          image: imageURI2,
        };
        expect(JSON.parse(decodedTokenValue)).to.eql(expectedTokenValue);
      });
    });
  });
});
