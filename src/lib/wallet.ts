import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiProvider } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { http } from 'viem'

// Using the provided WalletConnect Project ID
export const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'e08e99d213c331aa0fd00f625de06e66'

// Create wagmiConfig for Web3Modal - Sepolia testnet only
export const config = defaultWagmiConfig({
  chains: [sepolia],
  projectId,
  metadata: {
    name: 'Private Impact Chain',
    description: 'FHE-Encrypted Charity Impact Tracking',
    url: 'https://private-impact-chain.vercel.app',
    icons: ['https://private-impact-chain.vercel.app/favicon.ico']
  },
  transports: {
    [sepolia.id]: http(import.meta.env.VITE_SEPOLIA_RPC_URL || 'https://1rpc.io/sepolia'),
  }
})

// Create Web3Modal instance
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: 'light',
  themeVariables: {
    '--w3m-color-mix': '#10B981',
    '--w3m-color-mix-strength': 40
  }
})

export const supportedChains = [sepolia];

// Contract addresses for Sepolia testnet
export const contractAddresses = {
  [sepolia.id]: import.meta.env.VITE_SEPOLIA_CONTRACT_ADDRESS || '',
};

// RPC URLs for Sepolia testnet
export const rpcUrls = {
  [sepolia.id]: import.meta.env.VITE_SEPOLIA_RPC_URL || 'https://1rpc.io/sepolia',
};
