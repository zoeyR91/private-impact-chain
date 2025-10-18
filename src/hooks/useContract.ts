import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract, usePublicClient } from 'wagmi';
import { useFHE } from './useFHE';
import { 
  createDonationInput, 
  createCampaignInput, 
  createImpactReportInput,
  createVerificationInput,
  createReputationInput,
  decryptCampaignData,
  decryptDonationData,
  decryptImpactReportData,
  decryptDonorProfileData
} from '../lib/fheUtils';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contracts';

// All contract configuration is now imported from config files

export function useContract() {
  const { address } = useAccount();
  const { instance, isInitialized } = useFHE();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  // Create Campaign
  const createCampaign = async (
    name: string,
    description: string,
    category: string,
    targetAmount: number,
    duration: number
  ) => {
    if (!address) {
      throw new Error('Wallet not initialized');
    }

    // Campaign创建不使用FHE加密，直接使用普通参数
    console.log('📝 Creating campaign without FHE encryption:', {
      name,
      description,
      category,
      targetAmount,
      duration
    });

    const tx = await writeContractAsync({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'createCampaign',
      args: [
        name,
        description,
        category,
        targetAmount,
        duration
      ]
    });

    return tx;
  };

  // Make Donation
  const makeDonation = async (
    campaignId: number,
    amount: number,
    isAnonymous: boolean
  ) => {
    if (!instance || !address) {
      throw new Error('FHE instance or wallet not initialized');
    }

    const encryptedInput = await createDonationInput(
      instance,
      CONTRACT_ADDRESS,
      address,
      amount,
      isAnonymous
    );

    const tx = await writeContractAsync({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'makeDonation',
      args: [
        campaignId,
        encryptedInput.handles[0],
        encryptedInput.handles[1],
        encryptedInput.inputProof
      ],
      value: BigInt(amount * 1e18) // Convert to wei
    });

    return tx;
  };

  // Submit Impact Report
  const submitImpactReport = async (
    campaignId: number,
    beneficiariesReached: number,
    fundsUtilized: number,
    impactMetrics: number,
    reportHash: string,
    evidenceHash: string
  ) => {
    if (!instance || !address) {
      throw new Error('FHE instance or wallet not initialized');
    }

    const encryptedInput = await createImpactReportInput(
      instance,
      CONTRACT_ADDRESS,
      address,
      beneficiariesReached,
      fundsUtilized,
      impactMetrics
    );

    const tx = await writeContractAsync({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'submitImpactReport',
      args: [
        campaignId,
        encryptedInput.handles[0],
        encryptedInput.handles[1],
        encryptedInput.handles[2],
        reportHash,
        evidenceHash,
        encryptedInput.inputProof
      ]
    });

    return tx;
  };

  // Get all campaigns (public data only)
  const getAllCampaigns = async () => {
    try {
      if (!publicClient) {
        console.warn('Public client not available, returning mock data');
        // Return mock data when public client is not available
        return [
          {
            id: 0,
            name: "Clean Water Initiative",
            description: "Providing access to clean drinking water in underserved communities worldwide",
            category: "Environment",
            targetAmount: 5000000, // $50,000 in cents
            currentAmount: 2850000, // $28,500 in cents
            donorCount: 12847,
            impactScore: 95,
            isActive: true,
            isVerified: true,
            organizer: "0x1234567890123456789012345678901234567890",
            startTime: Math.floor(Date.now() / 1000) - 86400 * 30, // 30 days ago
            endTime: Math.floor(Date.now() / 1000) + 86400 * 30 // 30 days from now
          },
          {
            id: 1,
            name: "Education for All",
            description: "Building schools and providing educational resources in developing countries",
            category: "Education",
            targetAmount: 7500000, // $75,000 in cents
            currentAmount: 3200000, // $32,000 in cents
            donorCount: 8542,
            impactScore: 88,
            isActive: true,
            isVerified: true,
            organizer: "0x2345678901234567890123456789012345678901",
            startTime: Math.floor(Date.now() / 1000) - 86400 * 15, // 15 days ago
            endTime: Math.floor(Date.now() / 1000) + 86400 * 45 // 45 days from now
          },
          {
            id: 2,
            name: "Medical Relief Fund",
            description: "Providing emergency medical supplies and healthcare access",
            category: "Healthcare",
            targetAmount: 10000000, // $100,000 in cents
            currentAmount: 1500000, // $15,000 in cents
            donorCount: 3241,
            impactScore: 92,
            isActive: true,
            isVerified: false,
            organizer: "0x3456789012345678901234567890123456789012",
            startTime: Math.floor(Date.now() / 1000) - 86400 * 7, // 7 days ago
            endTime: Math.floor(Date.now() / 1000) + 86400 * 60 // 60 days from now
          }
        ];
      }

      // Try to read from contract
      try {
        // Get campaign counter
        const campaignCount = await publicClient.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: CONTRACT_ABI,
          functionName: 'campaignCounter'
        });

        const totalCount = Number(campaignCount);
        console.log(`Found ${totalCount} campaigns in contract`);

        const campaigns = [];
        
        // Fetch each campaign
        for (let i = 0; i < totalCount; i++) {
          try {
            const campaignData = await publicClient.readContract({
              address: CONTRACT_ADDRESS as `0x${string}`,
              abi: CONTRACT_ABI,
              functionName: 'campaigns',
              args: [BigInt(i)]
            });

            if (campaignData) {
              campaigns.push({
                id: i,
                name: campaignData.name,
                description: campaignData.description,
                category: campaignData.category,
                targetAmount: Number(campaignData.targetAmount),
                currentAmount: Number(campaignData.currentAmount),
                donorCount: Number(campaignData.donorCount),
                impactScore: Number(campaignData.impactScore),
                isActive: campaignData.isActive,
                isVerified: campaignData.isVerified,
                organizer: campaignData.organizer,
                startTime: Number(campaignData.startTime),
                endTime: Number(campaignData.endTime)
              });
            }
          } catch (error) {
            console.warn(`Failed to fetch campaign ${i}:`, error);
          }
        }

        return campaigns;
      } catch (contractError) {
        console.warn('Contract read failed, using mock data:', contractError);
        // Fallback to mock data if contract read fails
        return [
          {
            id: 0,
            name: "Clean Water Initiative",
            description: "Providing access to clean drinking water in underserved communities worldwide",
            category: "Environment",
            targetAmount: 5000000,
            currentAmount: 2850000,
            donorCount: 12847,
            impactScore: 95,
            isActive: true,
            isVerified: true,
            organizer: "0x1234567890123456789012345678901234567890",
            startTime: Math.floor(Date.now() / 1000) - 86400 * 30,
            endTime: Math.floor(Date.now() / 1000) + 86400 * 30
          }
        ];
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  };

  // Get Campaign Data (with decryption)
  const getCampaignData = async (campaignId: number) => {
    if (!instance || !address) {
      throw new Error('FHE instance or wallet not initialized');
    }

    // Get basic campaign info
    const basicInfo = await useReadContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'getCampaignInfo',
      args: [campaignId]
    });

    // Get encrypted data
    const encryptedData = await useReadContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'getCampaignEncryptedData',
      args: [campaignId]
    });

    // Decrypt the encrypted data
    const decryptedData = await decryptCampaignData(
      instance,
      CONTRACT_ADDRESS,
      address,
      null, // signer would be needed for actual decryption
      {
        targetAmount: encryptedData.data?.[0] || '',
        currentAmount: encryptedData.data?.[1] || '',
        donorCount: encryptedData.data?.[2] || '',
        impactScore: encryptedData.data?.[3] || '',
        isActive: encryptedData.data?.[4] || '',
        isVerified: encryptedData.data?.[5] || ''
      }
    );

    return {
      ...basicInfo.data,
      ...decryptedData
    };
  };

  return {
    createCampaign,
    makeDonation,
    submitImpactReport,
    getAllCampaigns,
    getCampaignData,
    isInitialized,
    contractAddress: CONTRACT_ADDRESS
  };
}
