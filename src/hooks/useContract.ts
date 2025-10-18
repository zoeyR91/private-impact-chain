import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
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
    getCampaignData,
    isInitialized,
    contractAddress: CONTRACT_ADDRESS
  };
}
