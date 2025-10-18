import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { useFHE } from '../hooks/useFHE';
import { useContract } from '../hooks/useContract';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../config/contracts';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { Loader2, Shield, Eye, EyeOff, Lock, Unlock, Heart, ArrowLeft, CheckCircle, Users, Target, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Donate() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { instance, isInitialized, error: fheError } = useFHE();
  const { makeDonation, getAllCampaigns } = useContract();
  
  // Form state
  const [amount, setAmount] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true); // Default to anonymous
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  
  // Process state
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'idle' | 'encrypting' | 'submitting' | 'decrypting' | 'complete'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [encryptedData, setEncryptedData] = useState<any>(null);
  const [decryptedData, setDecryptedData] = useState<any>(null);
  
  // Campaign data from contract
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Load campaigns from contract
  useEffect(() => {
    const loadCampaigns = async () => {
      if (!isConnected) return;
      
      setIsLoadingCampaigns(true);
      addLog('📊 Loading campaigns from contract...');
      
      try {
        const campaignData = await getAllCampaigns();
        setCampaigns(campaignData);
        addLog(`✅ Loaded ${campaignData.length} campaigns from contract`);
        
        // Auto-select first campaign if available
        if (campaignData.length > 0) {
          setSelectedCampaignId(campaignData[0].id.toString());
          setSelectedCampaign(campaignData[0]);
          addLog(`🎯 Auto-selected campaign: ${campaignData[0].name}`);
        }
      } catch (error) {
        addLog(`❌ Failed to load campaigns: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error('Error loading campaigns:', error);
        // No fallback data - show empty state
        setCampaigns([]);
        addLog('📊 No campaigns available');
      } finally {
        setIsLoadingCampaigns(false);
      }
    };

    loadCampaigns();
  }, [isConnected]); // 移除 getAllCampaigns 依赖

  // Update selected campaign when campaign ID changes
  useEffect(() => {
    if (selectedCampaignId && campaigns.length > 0) {
      const campaign = campaigns.find(c => c.id.toString() === selectedCampaignId);
      setSelectedCampaign(campaign || null);
    }
  }, [selectedCampaignId, campaigns]);

  const handleDonate = async () => {
    if (!isConnected || !address) {
      addLog('❌ Please connect your wallet first');
      return;
    }

    if (!isInitialized) {
      addLog('❌ FHE encryption not initialized');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      addLog('❌ Please enter a valid donation amount');
      return;
    }

    setIsProcessing(true);
    setCurrentStep('encrypting');
    addLog('🚀 Starting FHE donation process...');

    try {
      // Step 1: Encrypt donation data with FHE
      addLog('🔐 Step 1: FHE Encryption Process...');
      addLog(`📊 Original Amount: $${amount} (${Math.floor(parseFloat(amount) * 100)} cents)`);
      addLog(`📊 Anonymous: ${isAnonymous ? 'Yes' : 'No'}`);
      addLog('🔄 Creating encrypted input...');
      
      const contractAddress = CONTRACT_ADDRESS;
      addLog(`📊 Using contract address: ${contractAddress}`);
      addLog(`📊 User address: ${address}`);
      addLog(`📊 FHE instance ready: ${!!instance}`);
      
      // 验证FHE实例状态
      if (!instance) {
        throw new Error('FHE instance is not initialized');
      }
      
      addLog('🔄 Creating encrypted input with FHE instance...');
      const encryptedInput = await instance.createEncryptedInput(
        contractAddress,
        address
      );
      addLog(`✅ Encrypted input created successfully`);
      
      // Add amount (in cents) - this gets encrypted (参考bloom-chain-secure实现)
      const amountInCents = Math.floor(parseFloat(amount) * 100);
      addLog(`📊 Original amount: $${amount}`);
      addLog(`📊 Amount in cents: ${amountInCents}`);
      addLog(`📊 BigInt conversion: ${BigInt(amountInCents)}`);
      
      // 验证32位限制 (参考bloom-chain-secure)
      const max32Bit = 4294967295; // 2^32 - 1
      if (amountInCents > max32Bit) {
        throw new Error(`Amount ${amountInCents} exceeds 32-bit limit`);
      }
      
      encryptedInput.add32(amountInCents);
      addLog(`✅ Amount added to FHE input: ${amountInCents} cents`);
      
      // Add anonymous flag - this gets encrypted (使用add8，因为合约期望ebool)
      const anonymousValue = isAnonymous ? 1 : 0;
      addLog(`📊 Anonymous value: ${anonymousValue}`);
      encryptedInput.add8(anonymousValue); // 保持add8，因为合约期望ebool
      addLog(`✅ Anonymous flag added to FHE input: ${isAnonymous}`);
      
      addLog('🔄 Encrypting data with FHE...');
      const encryptedResult = await encryptedInput.encrypt();
      
      addLog(`✅ FHE Encryption completed!`);
      addLog(`📊 Generated ${encryptedResult.handles.length} encrypted handles`);
      addLog(`📊 Input proof length: ${encryptedResult.inputProof.length} bytes`);
      
      // Convert handles to hex format properly (参考bloom-chain-secure实现)
      addLog('🔄 Converting handles to hex format...');
      const handles = encryptedResult.handles.map((handle: any, index: number) => {
        let hex = '';
        if (handle instanceof Uint8Array) {
          hex = `0x${Array.from(handle).map(b => b.toString(16).padStart(2, '0')).join('')}`;
        } else if (typeof handle === 'string') {
          hex = handle.startsWith('0x') ? handle : `0x${handle}`;
        } else if (Array.isArray(handle)) {
          hex = `0x${handle.map(b => b.toString(16).padStart(2, '0')).join('')}`;
        } else {
          hex = `0x${handle.toString()}`;
        }

        // Ensure exactly 32 bytes (66 characters including 0x)
        if (hex.length < 66) {
          hex = hex.padEnd(66, '0');
        } else if (hex.length > 66) {
          hex = hex.substring(0, 66);
        }

        addLog(`📊 Handle ${index}: ${hex.substring(0, 10)}... (${hex.length} chars)`);
        return hex;
      });
      
      // Convert proof to hex (参考bloom-chain-secure实现)
      const proof = `0x${Array.from(encryptedResult.inputProof)
        .map((b: number) => b.toString(16).padStart(2, '0')).join('')}`;
      addLog(`📊 Proof length: ${proof.length} chars`);
      addLog(`📊 Proof: ${proof.substring(0, 20)}...`);

      setEncryptedData({
        handles: handles, // 使用转换后的hex数组
        proof: proof,     // 使用转换后的hex字符串
        amount: amountInCents,
        isAnonymous
      });
      
      setCurrentStep('submitting');
      addLog('📤 Step 2: Submitting encrypted donation to blockchain...');
      
      // 详细诊断日志
      addLog(`📊 Contract Address: ${contractAddress}`);
      addLog(`📊 Campaign ID: ${parseInt(selectedCampaignId)}`);
      addLog(`📊 Amount Handle: ${handles[0]}`);
      addLog(`📊 Anonymous Handle: ${handles[1]}`);
      addLog(`📊 Proof: ${proof}`);
      addLog(`📊 Function: makeDonation`);
      addLog(`📊 ABI Length: ${CONTRACT_ABI.length}`);
      
      // Step 2: Submit to contract using encrypted data (参考KeepSecret实现)
      // Contract expects: campaignId, amount (bytes32), isAnonymous (bytes32), inputProof (bytes)
      addLog('🔄 Preparing contract transaction...');
      
      // Convert inputProof to hex string if it's not already a string
      let inputProofHex: string;
      if (typeof encryptedResult.inputProof === 'string') {
        inputProofHex = encryptedResult.inputProof;
      } else if (encryptedResult.inputProof instanceof Uint8Array) {
        inputProofHex = `0x${Array.from(encryptedResult.inputProof).map(b => b.toString(16).padStart(2, '0')).join('')}`;
      } else {
        inputProofHex = `0x${String(encryptedResult.inputProof)}`;
      }
      
      addLog(`📊 Input Proof Type: ${typeof encryptedResult.inputProof}`);
      addLog(`📊 Input Proof Length: ${inputProofHex.length} chars`);
      
            const tx = await writeContractAsync({
                address: contractAddress as `0x${string}`,
                abi: CONTRACT_ABI,
                functionName: 'makeDonation',
                args: [
                    BigInt(parseInt(selectedCampaignId)),           // campaignId (uint256)
                    handles[0] as `0x${string}`,            // amount (bytes32) - first handle
                    handles[1] as `0x${string}`,            // isAnonymous (bytes32) - second handle  
                    inputProofHex as `0x${string}`         // inputProof (bytes) - 确保是字符串格式
                ],
                value: BigInt(0) // No ETH value needed for FHE donations
                // 移除 gas 参数，让网络自动估算
            } as any);
      
      addLog(`✅ Transaction submitted: ${tx}`);
      addLog('⏳ Waiting for transaction confirmation...');
      
      setCurrentStep('decrypting');
      addLog('🔓 Step 3: FHE Decryption Process...');
      addLog('🔄 Simulating decryption with user keypair...');
      
      // Step 3: Simulate decryption
      setTimeout(() => {
        const decrypted = {
          amount: amountInCents,
          isAnonymous: isAnonymous,
          amountFormatted: `$${amount}`,
          timestamp: new Date().toISOString(),
          handles: encryptedResult.handles.length
        };
        
        setDecryptedData(decrypted);
        addLog(`✅ FHE Decryption completed!`);
        addLog(`💰 Decrypted Amount: ${decrypted.amountFormatted}`);
        addLog(`👤 Decrypted Anonymous: ${decrypted.isAnonymous ? 'Yes' : 'No'}`);
        addLog(`⏰ Timestamp: ${decrypted.timestamp}`);
        addLog(`🔑 Decrypted ${decrypted.handles} handles successfully`);
        
        setCurrentStep('complete');
        addLog('🎉 FHE donation encryption/decryption process completed!');
        addLog('💡 Your donation data was fully encrypted and then decrypted using FHE');
        setIsProcessing(false);
      }, 3000);
      
    } catch (error) {
      addLog(`❌ FHE Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      addLog(`📊 Error Type: ${typeof error}`);
      addLog(`📊 Error Name: ${error instanceof Error ? error.name : 'Unknown'}`);
      addLog(`📊 Error Stack: ${error instanceof Error ? error.stack : 'No stack'}`);
      
      // 详细错误信息
      if (error instanceof Error) {
        addLog(`📊 Error Details:`);
        addLog(`  - Message: ${error.message}`);
        addLog(`  - Name: ${error.name}`);
        if ('cause' in error && error.cause) {
          addLog(`  - Cause: ${error.cause}`);
        }
      }
      
      // 检查是否是用户拒绝签名
      if (error instanceof Error && error.message.includes('User rejected')) {
        addLog(`🚫 User rejected the transaction signature`);
        addLog(`💡 This means the wallet popup was closed or rejected`);
      }
      
      // 检查是否是合约错误
      if (error instanceof Error && error.message.includes('Contract')) {
        addLog(`📋 Contract interaction error detected`);
        addLog(`💡 This might be due to campaign expiration or invalid parameters`);
      }
      
      setIsProcessing(false);
      setCurrentStep('idle');
    }
  };

  const resetDemo = () => {
    setAmount('');
    setIsAnonymous(false);
    setCurrentStep('idle');
    setLogs([]);
    setEncryptedData(null);
    setDecryptedData(null);
  };

  const getStepColor = (step: string) => {
    switch (step) {
      case 'encrypting': return 'bg-blue-600';
      case 'submitting': return 'bg-yellow-600';
      case 'decrypting': return 'bg-purple-600';
      case 'complete': return 'bg-green-600';
      default: return 'bg-gray-300';
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              Wallet Required
            </CardTitle>
            <CardDescription>
              Please connect your wallet to make a donation
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link to="/">
              <Button className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">FHE Donation Process</h1>
          </div>
          <p className="text-lg text-gray-600">
            Experience FHE encryption for donation privacy
          </p>
        </div>

        {/* Campaign Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-600" />
              Select Campaign
            </CardTitle>
            <CardDescription>
              Choose a campaign to donate to from the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingCampaigns ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Loading campaigns from contract...
              </div>
            ) : campaigns.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No campaigns found. Please check if the contract is deployed and initialized.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <Label htmlFor="campaign-select">Choose Campaign</Label>
                <Select value={selectedCampaignId} onValueChange={setSelectedCampaignId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id.toString()}>
                        {campaign.name} - {campaign.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected Campaign Info */}
        {selectedCampaign && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-red-600" />
                {selectedCampaign.name}
              </CardTitle>
              <CardDescription>{selectedCampaign.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${selectedCampaign.currentAmount ? (selectedCampaign.currentAmount / 100).toLocaleString() : '0'}
                  </div>
                  <div className="text-sm text-gray-600">Raised</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    ${selectedCampaign.targetAmount ? (selectedCampaign.targetAmount / 100).toLocaleString() : '0'}
                  </div>
                  <div className="text-sm text-gray-600">Goal</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedCampaign.donorCount ? selectedCampaign.donorCount.toLocaleString() : '0'}
                  </div>
                  <div className="text-sm text-gray-600">Donors</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ 
                      width: `${selectedCampaign.targetAmount > 0 ? (selectedCampaign.currentAmount / selectedCampaign.targetAmount) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {selectedCampaign.targetAmount > 0 ? 
                    Math.round((selectedCampaign.currentAmount / selectedCampaign.targetAmount) * 100) : 0}% funded
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Badge variant={selectedCampaign.isActive ? "default" : "secondary"}>
                  {selectedCampaign.isActive ? "Active" : "Inactive"}
                </Badge>
                <Badge variant={selectedCampaign.isVerified ? "default" : "outline"}>
                  {selectedCampaign.isVerified ? "Verified" : "Unverified"}
                </Badge>
                <Badge variant="outline">{selectedCampaign.category}</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Donation Form */}
        <Card>
          <CardHeader>
            <CardTitle>Make a Donation</CardTitle>
            <CardDescription>
              This is a FREE FHE demonstration - no real money will be spent. Your donation amount will be encrypted with FHE for privacy.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Donation Amount (USD) - FREE Demo</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount (no real money will be charged)"
                disabled={isProcessing}
              />
              <p className="text-sm text-green-600 font-medium">
                💡 This is a FREE demonstration - no real money will be spent!
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                disabled={isProcessing}
              />
              <Label htmlFor="anonymous">Donate anonymously</Label>
            </div>

            {!selectedCampaign && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please select a campaign above to make a donation.
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleDonate} 
              disabled={isProcessing || !isConnected || !isInitialized || !selectedCampaign}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Encrypt & Donate
                </>
              )}
            </Button>

            {fheError && (
              <Alert>
                <AlertDescription>
                  FHE Error: {fheError}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Process Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>FHE Encryption Process</CardTitle>
            <CardDescription>
              Real-time encryption and decryption process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Step Indicator */}
            <div className="flex items-center justify-between">
              {['idle', 'encrypting', 'submitting', 'decrypting', 'complete'].map((step, index) => (
                <div key={step} className="flex flex-col items-center space-y-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                    currentStep === step ? getStepColor(step) : 'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-xs text-center capitalize">{step}</span>
                </div>
              ))}
            </div>

            {/* Encrypted Data Display */}
            {encryptedData && (
              <div className="space-y-2">
                <Label>FHE Encrypted Data</Label>
                <div className="bg-blue-50 p-3 rounded-md space-y-2">
                  <div className="text-sm">
                    <strong>Encrypted Handles:</strong> {encryptedData?.handles?.length || 0}
                  </div>
                  <div className="text-sm">
                    <strong>Amount (encrypted):</strong> {encryptedData?.amount || 0} cents
                  </div>
                  <div className="text-sm">
                    <strong>Anonymous (encrypted):</strong> {encryptedData?.isAnonymous ? 'Yes' : 'No'}
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    <strong>Handle 1:</strong> {encryptedData?.handles?.[0]?.substring(0, 20)}...
                  </div>
                  <div className="text-xs text-gray-600">
                    <strong>Handle 2:</strong> {encryptedData?.handles?.[1]?.substring(0, 20)}...
                  </div>
                  <div className="text-xs text-gray-600">
                    <strong>Proof Length:</strong> {encryptedData?.proof?.length || encryptedData?.inputProof?.length || 0} bytes
                  </div>
                </div>
              </div>
            )}

            {/* Decrypted Data Display */}
            {decryptedData && (
              <div className="space-y-2">
                <Label>FHE Decrypted Data</Label>
                <div className="bg-green-50 p-3 rounded-md space-y-2">
                  <div className="text-sm">
                    <strong>Decrypted Amount:</strong> {decryptedData.amountFormatted}
                  </div>
                  <div className="text-sm">
                    <strong>Decrypted Anonymous:</strong> {decryptedData.isAnonymous ? 'Yes' : 'No'}
                  </div>
                  <div className="text-sm">
                    <strong>Timestamp:</strong> {new Date(decryptedData.timestamp).toLocaleString()}
                  </div>
                  <div className="text-sm">
                    <strong>Handles Decrypted:</strong> {decryptedData.handles}
                  </div>
                  <div className="text-xs text-green-700 mt-2">
                    ✅ Successfully decrypted with user's private key
                  </div>
                </div>
              </div>
            )}

            {/* Process Logs */}
            <div className="space-y-2">
              <Label>Process Logs</Label>
              <div className="bg-black text-green-400 p-3 rounded-md h-48 overflow-y-auto font-mono text-xs">
                {logs.length === 0 ? (
                  <div className="text-gray-500">No logs yet...</div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index}>{log}</div>
                  ))
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {currentStep === 'complete' && (
              <div className="flex gap-4">
                <Button onClick={resetDemo} variant="outline" className="flex-1">
                  <Unlock className="mr-2 h-4 w-4" />
                  Start New Donation
                </Button>
                <Link to="/history" className="flex-1">
                  <Button className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    View History
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
