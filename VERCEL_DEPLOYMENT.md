# Vercel Deployment Guide for Private Impact Chain

## Step-by-Step Manual Deployment Instructions

### Prerequisites
- GitHub account with access to the repository
- Vercel account (free tier available)
- Environment variables ready

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" and choose "Continue with GitHub"
3. Authorize Vercel to access your GitHub account

### Step 2: Import Project
1. In Vercel dashboard, click "New Project"
2. Find and select `zoeyR91/private-impact-chain` repository
3. Click "Import"

### Step 3: Configure Project Settings
1. **Project Name**: `private-impact-chain` (or your preferred name)
2. **Framework Preset**: Vite
3. **Root Directory**: `./` (default)
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Install Command**: `npm install`

### Step 4: Set Environment Variables
Click "Environment Variables" and add the following:

```
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID
VITE_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID
NEXT_PUBLIC_INFURA_API_KEY=YOUR_INFURA_API_KEY
VITE_SEPOLIA_CONTRACT_ADDRESS=your_contract_address_here
VITE_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY
```

**Important**: Replace `your_contract_address_here` with the actual deployed contract address.

### Step 5: Deploy
1. Click "Deploy" button
2. Wait for the build process to complete (usually 2-3 minutes)
3. Your app will be available at the provided Vercel URL

### Step 6: Custom Domain (Optional)
1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed by Vercel

### Step 7: Automatic Deployments
- Every push to the `main` branch will trigger automatic deployment
- Pull requests will create preview deployments
- You can manage deployments in the "Deployments" tab

## Environment Variables Reference

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_CHAIN_ID` | `11155111` | Sepolia testnet chain ID |
| `NEXT_PUBLIC_RPC_URL` | `https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY` | Sepolia RPC endpoint |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | `YOUR_WALLET_CONNECT_PROJECT_ID` | WalletConnect project ID |
| `VITE_WALLET_CONNECT_PROJECT_ID` | `YOUR_WALLET_CONNECT_PROJECT_ID` | WalletConnect project ID for Vite |
| `NEXT_PUBLIC_INFURA_API_KEY` | `YOUR_INFURA_API_KEY` | Infura API key |
| `VITE_SEPOLIA_CONTRACT_ADDRESS` | `your_contract_address` | Deployed contract address |
| `VITE_SEPOLIA_RPC_URL` | `https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY` | Contract RPC URL |

## Troubleshooting

### Build Failures
- Check that all environment variables are set correctly
- Ensure the contract address is valid and deployed
- Verify that all dependencies are properly installed

### Wallet Connection Issues
- Confirm WalletConnect project ID is correct
- Check that the RPC URL is accessible
- Ensure the chain ID matches Sepolia (11155111)

### Contract Interaction Issues
- Verify the contract address is correct
- Check that the contract is deployed on Sepolia
- Ensure the contract ABI is up to date

## Post-Deployment Checklist

- [ ] Environment variables are set correctly
- [ ] Build completed successfully
- [ ] Wallet connection works
- [ ] Contract interactions function properly
- [ ] All features are accessible
- [ ] Custom domain is configured (if applicable)

## Support

If you encounter any issues during deployment:
1. Check the Vercel build logs
2. Verify environment variables
3. Test locally with `npm run build`
4. Contact support through GitHub issues

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Web3Modal Documentation](https://docs.walletconnect.com/web3modal/about)
- [Wagmi Documentation](https://wagmi.sh/)
