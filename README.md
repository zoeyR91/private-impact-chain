# Private Impact Chain

A fully homomorphic encryption (FHE) powered charity impact tracking platform that ensures complete privacy for donors while maintaining transparency and accountability in charitable giving.

## 🎥 Demo Video

[![Private Impact Chain Demo](https://img.shields.io/badge/📹_Watch_Demo-Video-blue)](./private-impact-compressed.mp4)

**Demo Video**: [private-impact-compressed.mp4](./private-impact-compressed.mp4) (3.8MB, High Quality)

## 🏗️ Smart Contract

**Contract Address**: `0xf7161613284Fe6D6128CA347D13e18AA4D6388A4`  
**Network**: Ethereum Sepolia Testnet  
**Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0xf7161613284Fe6D6128CA347D13e18AA4D6388A4)

## ✨ Key Features

- **🔐 FHE-Encrypted Donations**: All donation amounts and donor information are encrypted using fully homomorphic encryption
- **👤 Anonymous Giving**: Donors can make completely anonymous donations while maintaining their reputation
- **📊 Impact Tracking**: Real-time tracking of charitable impact with encrypted metrics
- **⭐ Reputation System**: Encrypted reputation scoring for both donors and organizations
- **📋 Transparent Reporting**: Verified impact reports with cryptographic proof
- **🔗 Multi-Wallet Support**: Connect with various Web3 wallets including MetaMask, WalletConnect, and more
- **🌐 Live Demo**: Fully functional on Sepolia testnet with real FHE encryption

## 🚀 Deployment Status

- ✅ **Smart Contract**: Deployed and verified on Sepolia testnet
- ✅ **Frontend**: Live on Vercel with latest optimizations
- ✅ **FHE Integration**: Fully functional with Zama FHEVM
- ✅ **Gas Optimization**: Ultra-minimal contract for efficient transactions
- ✅ **Demo Ready**: Complete end-to-end FHE donation flow

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: Vite + React + TypeScript
- **UI**: shadcn-ui + Tailwind CSS
- **Web3**: Wagmi + Viem + RainbowKit
- **FHE SDK**: @zama-fhe/relayer-sdk

### Blockchain & FHE
- **Network**: Ethereum Sepolia Testnet
- **FHE Engine**: Zama FHEVM
- **Encryption**: Fully Homomorphic Encryption for sensitive data
- **Gas Optimization**: Ultra-minimal contract design

### Smart Contract Features
- **Public Data**: Campaign information (transparent)
- **Encrypted Data**: Donation amounts, anonymity status
- **Gas Efficient**: Optimized for minimal transaction costs
- **FHE Integration**: Real-time encrypted computations

### Security & Privacy
- **Zero-Knowledge**: Donor information remains private
- **Encrypted Storage**: All sensitive data is FHE-encrypted
- **Transparent Verification**: Public campaign data for accountability
- **Anonymous Donations**: Optional complete anonymity

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH (get from [Sepolia Faucet](https://sepoliafaucet.com/))

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

### Environment Variables

The following environment variables are configured by default:

```bash
# Contract Configuration (Latest)
VITE_SEPOLIA_CONTRACT_ADDRESS=0xf7161613284Fe6D6128CA347D13e18AA4D6388A4
VITE_SEPOLIA_RPC_URL=https://1rpc.io/sepolia

# Wallet Connect
VITE_WALLET_CONNECT_PROJECT_ID=e08e99d213c331aa0fd00f625de06e66
```

### Live Demo

🌐 **Try the live demo**: [Private Impact Chain on Vercel](https://private-impact-chain.vercel.app)

- Connect your wallet to Sepolia testnet
- Browse available campaigns
- Make FHE-encrypted donations
- Experience complete privacy with full transparency

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
