import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Private Impact Chain',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'e08e99d213c331aa0fd00f625de06e66',
  chains: [sepolia],
  ssr: false,
});
