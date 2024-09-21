import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const accounts = process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY}`] : [];

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url:
        process.env.RPC_ENDPOINT ||
        "https://ethereum-sepolia-rpc.publicnode.com",
      accounts,
    },
  },
};

export default config;
