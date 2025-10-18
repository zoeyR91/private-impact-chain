export interface FHEInstance {
  createEncryptedInput: (contractAddress: string, userAddress: string) => EncryptedInput;
  generateKeypair: () => Keypair;
  userDecrypt: (
    handleContractPairs: Array<{ handle: Uint8Array; contractAddress: string }>,
    address: string,
    signer: any
  ) => Promise<Record<string, any>>;
  userDecryptEuint: (
    type: any,
    handle: Uint8Array,
    contractAddress: string,
    signer: any
  ) => Promise<any>;
}

export interface EncryptedInput {
  add32: (value: number) => EncryptedInput;
  add8: (value: number) => EncryptedInput;
  add64: (value: number) => EncryptedInput;
  add256: (value: number) => EncryptedInput;
  addBool: (value: boolean) => EncryptedInput;
  addAddress: (value: string) => EncryptedInput;
  encrypt: () => Promise<EncryptedResult>;
}

export interface EncryptedResult {
  handles: Uint8Array[];
  inputProof: Uint8Array;
}

export interface Keypair {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
}

export interface CampaignData {
  id: number;
  name: string;
  description: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  donorCount: number;
  impactScore: number;
  isActive: boolean;
  isVerified: boolean;
  organizer: string;
  startTime: number;
  endTime: number;
}

export interface DonationData {
  id: number;
  amount: number;
  campaignId: number;
  donor: string;
  timestamp: number;
  isAnonymous: boolean;
}

export interface ImpactReportData {
  id: number;
  campaignId: number;
  beneficiariesReached: number;
  fundsUtilized: number;
  impactMetrics: number;
  isVerified: boolean;
  reportHash: string;
  evidenceHash: string;
  reporter: string;
  timestamp: number;
}

export interface DonorProfileData {
  totalDonated: number;
  donationCount: number;
  reputationScore: number;
  isVerified: boolean;
  encryptedProfile: string;
}
