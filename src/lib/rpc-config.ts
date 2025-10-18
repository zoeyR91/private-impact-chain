// RPC configuration with fallback nodes
export const RPC_CONFIG = {
  primary: 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  fallbacks: [
    'https://rpc.sepolia.org',
    'https://sepolia.gateway.tenderly.co',
    'https://ethereum-sepolia-rpc.publicnode.com',
    'https://sepolia.drpc.org',
    'https://sepolia-rpc.publicnode.com',
    'https://sepolia.blockpi.network/v1/rpc/public',
    'https://sepolia.g.alchemy.com/v2/demo'
  ]
};

// Get RPC URL with fallback logic
export const getRpcUrl = (): string => {
  const envUrl = import.meta.env.VITE_SEPOLIA_RPC_URL;
  if (envUrl) {
    return envUrl;
  }
  return RPC_CONFIG.primary;
};

// RPC health check
export const checkRpcHealth = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1
      })
    });
    return response.ok;
  } catch (error) {
    console.warn(`RPC health check failed for ${url}:`, error);
    return false;
  }
};

// Get best available RPC URL
export const getBestRpcUrl = async (): Promise<string> => {
  const primaryUrl = getRpcUrl();
  
  // Check primary URL first
  if (await checkRpcHealth(primaryUrl)) {
    return primaryUrl;
  }
  
  // Try fallback URLs
  for (const fallbackUrl of RPC_CONFIG.fallbacks) {
    if (await checkRpcHealth(fallbackUrl)) {
      console.log(`Using fallback RPC: ${fallbackUrl}`);
      return fallbackUrl;
    }
  }
  
  // If all fail, return primary (will show error to user)
  console.warn('All RPC endpoints failed, using primary');
  return primaryUrl;
};
