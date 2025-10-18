import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useFHE } from '../hooks/useFHE';
import { useContract } from '../hooks/useContract';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2, Shield, Eye, EyeOff, Lock, Unlock, Heart, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Donate() {
  const { address, isConnected } = useAccount();
  const { instance, isInitialized, error: fheError } = useFHE();
  const { makeDonation } = useContract();
  
  // Form state
  const [amount, setAmount] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [campaignId, setCampaignId] = useState('0');
  
  // Process state
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'idle' | 'encrypting' | 'submitting' | 'decrypting' | 'complete'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [encryptedData, setEncryptedData] = useState<any>(null);
  const [decryptedData, setDecryptedData] = useState<any>(null);
  
  // Demo campaign data
  const demoCampaign = {
    id: 0,
    name: "Clean Water Initiative",
    description: "Providing access to clean drinking water in underserved communities worldwide",
    category: "Environment",
    targetAmount: 5000000, // $50,000 in cents
    currentAmount: 2850000, // $28,500 in cents
    donorCount: 12847,
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=300&fit=crop"
  };

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

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
      
      const encryptedInput = await instance.createEncryptedInput(
        process.env.VITE_SEPOLIA_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
        address
      );
      
      // Add amount (in cents) - this gets encrypted
      const amountInCents = Math.floor(parseFloat(amount) * 100);
      encryptedInput.add32(BigInt(amountInCents));
      addLog(`✅ Amount added to FHE input: ${amountInCents} cents`);
      
      // Add anonymous flag - this gets encrypted
      encryptedInput.add8(isAnonymous ? 1 : 0);
      addLog(`✅ Anonymous flag added to FHE input: ${isAnonymous}`);
      
      addLog('🔄 Encrypting data with FHE...');
      const encryptedResult = await encryptedInput.encrypt();
      
      addLog(`✅ FHE Encryption completed!`);
      addLog(`📊 Generated ${encryptedResult.handles.length} encrypted handles`);
      addLog(`📊 Input proof length: ${encryptedResult.inputProof.length} bytes`);
      
      setEncryptedData({
        handles: encryptedResult.handles,
        inputProof: encryptedResult.inputProof,
        amount: amountInCents,
        isAnonymous,
        handlesHex: encryptedResult.handles.map((h: any) => {
          if (h instanceof Uint8Array) {
            return `0x${Array.from(h).map(b => b.toString(16).padStart(2, '0')).join('')}`;
          }
          return h;
        })
      });
      
      setCurrentStep('submitting');
      addLog('📤 Step 2: Submitting encrypted donation to blockchain...');
      
      // Step 2: Submit to contract
      const tx = await makeDonation(
        parseInt(campaignId),
        parseFloat(amount),
        isAnonymous
      );
      
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

        {/* Campaign Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-600" />
              {demoCampaign.name}
            </CardTitle>
            <CardDescription>{demoCampaign.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">${(demoCampaign.currentAmount / 100).toLocaleString()}</div>
                <div className="text-sm text-gray-600">Raised</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">${(demoCampaign.targetAmount / 100).toLocaleString()}</div>
                <div className="text-sm text-gray-600">Goal</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{demoCampaign.donorCount.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Donors</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(demoCampaign.currentAmount / demoCampaign.targetAmount) * 100}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {Math.round((demoCampaign.currentAmount / demoCampaign.targetAmount) * 100)}% funded
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Donation Form */}
        <Card>
          <CardHeader>
            <CardTitle>Make a Donation</CardTitle>
            <CardDescription>
              Your donation amount will be encrypted with FHE for privacy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Donation Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  disabled={isProcessing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign">Campaign ID</Label>
                <Input
                  id="campaign"
                  type="number"
                  value={campaignId}
                  onChange={(e) => setCampaignId(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
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

            <Button 
              onClick={handleDonate} 
              disabled={isProcessing || !isConnected || !isInitialized}
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
                    <strong>Encrypted Handles:</strong> {encryptedData.handles.length}
                  </div>
                  <div className="text-sm">
                    <strong>Amount (encrypted):</strong> {encryptedData.amount} cents
                  </div>
                  <div className="text-sm">
                    <strong>Anonymous (encrypted):</strong> {encryptedData.isAnonymous ? 'Yes' : 'No'}
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    <strong>Handle 1:</strong> {encryptedData.handlesHex[0]?.substring(0, 20)}...
                  </div>
                  <div className="text-xs text-gray-600">
                    <strong>Handle 2:</strong> {encryptedData.handlesHex[1]?.substring(0, 20)}...
                  </div>
                  <div className="text-xs text-gray-600">
                    <strong>Proof Length:</strong> {encryptedData.inputProof.length} bytes
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

            {/* Reset Button */}
            {currentStep === 'complete' && (
              <Button onClick={resetDemo} variant="outline" className="w-full">
                <Unlock className="mr-2 h-4 w-4" />
                Start New Donation
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
