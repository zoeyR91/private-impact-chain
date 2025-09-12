# Private Impact Chain

A fully homomorphic encryption (FHE) powered charity impact tracking platform that ensures complete privacy for donors while maintaining transparency and accountability in charitable giving.

## Features

- **FHE-Encrypted Donations**: All donation amounts and donor information are encrypted using fully homomorphic encryption
- **Anonymous Giving**: Donors can make completely anonymous donations while maintaining their reputation
- **Impact Tracking**: Real-time tracking of charitable impact with encrypted metrics
- **Reputation System**: Encrypted reputation scoring for both donors and organizations
- **Transparent Reporting**: Verified impact reports with cryptographic proof
- **Multi-Wallet Support**: Connect with various Web3 wallets including MetaMask, WalletConnect, and more

## Technologies

This project is built with:

- **Frontend**: Vite, TypeScript, React, shadcn-ui, Tailwind CSS
- **Web3**: Wagmi, Viem, Web3Modal for wallet connectivity
- **Blockchain**: Ethereum Sepolia testnet
- **FHE**: Zama's FHEVM for encrypted computations
- **Smart Contracts**: Solidity with FHE integration

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

```sh
# Clone the repository
git clone https://github.com/zoeyR91/private-impact-chain.git

# Navigate to the project directory
cd private-impact-chain

# Install dependencies
npm install

# Copy environment variables
cp env.example .env

# Start the development server
npm run dev
```

### Environment Configuration

Create a `.env` file with the following variables:

```env
# Chain Configuration
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990

# Wallet Connect Configuration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475

# Contract Configuration
VITE_SEPOLIA_CONTRACT_ADDRESS=your_contract_address_here
VITE_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
```

## Smart Contract

The project includes a comprehensive FHE-enabled smart contract (`PrivateImpactChain.sol`) that handles:

- Encrypted campaign creation and management
- Anonymous donation processing
- Impact report submission and verification
- Reputation system management
- Fund withdrawal mechanisms

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set the environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```sh
# Build the project
npm run build

# Deploy to your preferred hosting service
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please open an issue on GitHub.
