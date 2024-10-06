import("@nomicfoundation/hardhat-ethers");
import("@nomicfoundation/hardhat-toolbox");
import dotenv from "dotenv";
import hre from "hardhat";
dotenv.config({ path: "../../.env" });

async function deployContract(contractName: string, contractDeployArgs: any[]) {
  const Contract = await hre.ethers.getContractFactory(contractName);

  // Get the current fee data
  const feeData = await hre.ethers.provider.getFeeData();

  // Calculate gas settings that are likely to be accepted
  const maxFeePerGas = feeData.maxFeePerGas
    ? feeData.maxFeePerGas * BigInt(2)
    : null; // Double the suggested max fee
  const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas
    ? feeData.maxPriorityFeePerGas * BigInt(2)
    : null; // Double the suggested priority fee

  // Deploy the contract with the calculated gas settings
  const contract = await Contract.deploy(...contractDeployArgs, {
    maxFeePerGas,
    maxPriorityFeePerGas,
  });

  await contract.waitForDeployment();
  console.log(`${contractName} deployed to:`, await contract.getAddress());
  return contract;
}

async function main() {
  const aContract = await deployContract("CommitAndReveal", [
    "What are the secret words?",
  ]);
  const aContractAddress = await aContract.getAddress();

  const nftContract = await deployContract("BasicOnChainNft", [
    "Group4 NFT",
    "G04_NFT",
    "This NFT can only be minted once",
    "https://gateway.pinata.cloud/ipfs/bafybeidcwecintmlzlxsjs3gea63itszr56lgmix4qfjs3dwe4plsad3wq",
    aContractAddress,
  ]);
}

// Execute the main function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
