import { viem } from "hardhat";
import { toHex, hexToString } from "viem";
import { sepolia } from "viem/chains";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

async function deployContract(contractName: string, contractDeployArgs: any[]) {
  const publicClient = await viem.getPublicClient();
  const [deployer, otherAccount] = await viem.getWalletClients({
    chain: sepolia,
    account: `0x${process.env.PRIVATE_KEY}` as `0x${string}`,
  });
  const contract = await viem.deployContract(contractName, contractDeployArgs);
  return { publicClient, deployer, otherAccounts: [otherAccount], contract };
}

async function main() {
  const { contract: verifierContract } = await deployContract("CommitAndReveal", ["What are the secret words?"]);
  const { contract, deployer } = await deployContract("BasicOnChainNft", [
    "Group4 NFT",
    "G04_NFT",
    "This NFT can only be minted once",
    "https://gateway.pinata.cloud/ipfs/bafkreidhwavkuiusnl3d6hsg3fambn4typtkdvqzpletiyp3mn6bfoqvvu",
    verifierContract.address,
  ]);


  console.log(`Deployed verifier contract to ${verifierContract.address} by ${deployer.account.address}`);

  console.log(
    `Deployed on chain contract to ${contract.address} by ${deployer.account.address}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
