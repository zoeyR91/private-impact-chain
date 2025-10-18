const { HardhatUserConfig } = require("hardhat/config");
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("@fhevm/hardhat-plugin");
require("dotenv/config");

const config = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
        viaIR: true  // Required for FHE contracts
      }
    }
  },
  networks: {
    sepolia: {
      url: process.env.VITE_SEPOLIA_RPC_URL || "https://1rpc.io/sepolia",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "J8PU7AX1JX3RGEH1SNGZS4628BAH192Y3N"
  },
  sourcify: {
    enabled: true,
  },
  fhevm: {
    network: "sepolia"
  }
};

module.exports = config;
