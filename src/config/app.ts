// Application configuration
export const APP_CONFIG = {
  // Application metadata
  app: {
    name: "Private Impact Chain",
    version: "1.0.0",
    description: "Privacy-preserving charity platform with FHE encryption",
    author: "ElonWills",
    repository: "https://github.com/zoeyR91/private-impact-chain"
  },
  
  // Feature flags
  features: {
    fheEncryption: true,
    campaignCreation: true,
    donationProcessing: true,
    impactReporting: true,
    reputationSystem: true,
    aclPermissions: true
  },
  
  // UI Configuration
  ui: {
    theme: "light",
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b",
    accentColor: "#8b5cf6",
    borderRadius: "0.5rem"
  },
  
  // Campaign configuration
  campaign: {
    maxNameLength: 100,
    maxDescriptionLength: 1000,
    maxCategoryLength: 50,
    minTargetAmount: 100, // $1.00 in cents
    maxTargetAmount: 100000000, // $1,000,000 in cents
    minDuration: 86400, // 1 day in seconds
    maxDuration: 31536000, // 1 year in seconds
    categories: [
      "Environment",
      "Education", 
      "Healthcare",
      "Poverty",
      "Disaster Relief",
      "Animal Welfare",
      "Community Development",
      "Technology",
      "Arts & Culture",
      "Other"
    ]
  },
  
  // Donation configuration
  donation: {
    minAmount: 100, // $1.00 in cents
    maxAmount: 10000000, // $100,000 in cents
    defaultAmounts: [1000, 2500, 5000, 10000, 25000], // $10, $25, $50, $100, $250
    allowAnonymous: true,
    requireWallet: true
  },
  
  // FHE Configuration
  fhe: {
    encryptionTypes: {
      amount: "euint32",
      isAnonymous: "ebool",
      beneficiariesReached: "euint32",
      fundsUtilized: "euint32",
      impactMetrics: "euint32",
      reputation: "euint32"
    },
    maxValues: {
      uint32: 4294967295,
      uint8: 255
    }
  },
  
  // Security configuration
  security: {
    requireVerification: false,
    allowEmergencyWithdraw: true,
    maxGasPrice: "100000000000", // 100 gwei
    timeoutMs: 30000 // 30 seconds
  },
  
  // Analytics configuration
  analytics: {
    enabled: import.meta.env.MODE === 'production',
    trackEvents: [
      'campaign_created',
      'donation_made',
      'impact_reported',
      'campaign_verified'
    ]
  }
} as const;

// Get configuration for specific feature
export function getFeatureConfig(feature: keyof typeof APP_CONFIG.features) {
  return APP_CONFIG.features[feature];
}

// Get campaign configuration
export function getCampaignConfig() {
  return APP_CONFIG.campaign;
}

// Get donation configuration  
export function getDonationConfig() {
  return APP_CONFIG.donation;
}

// Get FHE configuration
export function getFHEConfig() {
  return APP_CONFIG.fhe;
}

// Check if feature is enabled
export function isFeatureEnabled(feature: keyof typeof APP_CONFIG.features): boolean {
  return APP_CONFIG.features[feature];
}
