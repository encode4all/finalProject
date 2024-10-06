import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";
// import "@nomicfoundation/hardhat-toolbox-viem";

import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const accounts = process.env.PRIVATE_KEY
  ? [`0x${process.env.PRIVATE_KEY}`]
  : [];

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url:
        process.env.RPC_ENDPOINT ||
        "https://ethereum-sepolia-rpc.publicnode.com",
      accounts,
    },
    neoxTestnet: {
      chainId: 12227332,
      url: "https://neoxt4seed1.ngd.network/",
      accounts: accounts,
    },
  },
};

export default config;
