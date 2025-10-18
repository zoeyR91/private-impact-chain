import { CONTRACT_ADDRESS } from './contracts';

// Environment configuration
export const ENV_CONFIG = {
  // Network configuration
  network: {
    chainId: 11155111, // Sepolia
    name: "Sepolia",
    rpcUrl: process.env.VITE_SEPOLIA_RPC_URL || "https://1rpc.io/sepolia",
    explorer: "https://sepolia.etherscan.io"
  },
  
  // Contract configuration
  contract: {
    address: CONTRACT_ADDRESS,
    network: "sepolia"
  },
  
  // API Keys
  apiKeys: {
    etherscan: process.env.ETHERSCAN_API_KEY || "J8PU7AX1JX3RGEH1SNGZS4628BAH192Y3N",
    walletConnect: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "e08e99d213c331aa0fd00f625de06e66"
  },
  
  // FHE Configuration
  fhe: {
    sdkVersion: "0.2.0",
    cdnUrl: "https://cdn.zama.ai/relayer-sdk-js/0.2.0/relayer-sdk-js.umd.cjs",
    maxUint32: 4294967295,
    maxUint8: 255
  },
  
  // Development settings
  development: {
    debug: process.env.NODE_ENV === 'development',
    logLevel: process.env.VITE_LOG_LEVEL || 'info'
  }
} as const;

// Validate environment variables
export function validateEnvironment() {
  const required = [
    'VITE_SEPOLIA_RPC_URL',
    'VITE_SEPOLIA_CONTRACT_ADDRESS'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
    console.warn('Using default values for development');
  }
  
  return {
    isValid: missing.length === 0,
    missing
  };
}

// Get environment-specific configuration
export function getEnvironmentConfig() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    isDevelopment,
    isProduction,
    network: ENV_CONFIG.network,
    contract: ENV_CONFIG.contract,
    fhe: ENV_CONFIG.fhe
  };
}
