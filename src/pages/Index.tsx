import React from 'react';
import { Link } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Heart, Shield, Eye, Lock, Zap, Users, Target, TrendingUp, ArrowRight, Play, Droplets } from 'lucide-react';

const Index = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();

  const handleConnectWallet = () => {
    if (isConnected) {
      disconnect();
    } else {
      open();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Private Impact Chain</h1>
            </div>
            <Badge variant="outline" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              FHE Encrypted
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
              FHE Donation Demo
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the power of Fully Homomorphic Encryption in charity donations. 
              FREE demo with test USDC - no real money required!
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="w-full sm:w-auto"
              onClick={handleConnectWallet}
            >
              <Shield className="mr-2 h-5 w-5" />
              {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
            </Button>
            {isConnected && (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/donate">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <Heart className="mr-2 h-5 w-5" />
                    Make Donation
                  </Button>
                </Link>
                <Link to="/history">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <Eye className="mr-2 h-5 w-5" />
                    View History
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          {isConnected && address && (
            <div className="mt-4 text-center">
              <Badge variant="outline" className="text-sm">
                Connected: {address.slice(0, 6)}...{address.slice(-4)}
              </Badge>
            </div>
          )}
        </div>
      </div>
      
      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            FHE Encryption Features
          </h2>
          <p className="text-xl text-gray-600">
            FREE demo showcasing donation amount encryption and decryption
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Lock className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Amount Encryption</CardTitle>
              <CardDescription>
                Donation amounts are encrypted with FHE before blockchain storage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Amount encrypted with euint32</li>
                <li>• Anonymous status encrypted with ebool</li>
                <li>• Zero-knowledge proof generation</li>
                <li>• On-chain encrypted storage</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Privacy Protection</CardTitle>
              <CardDescription>
                Only you can decrypt your donation data with your private key
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• User-controlled decryption</li>
                <li>• Private key management</li>
                <li>• ACL permissions</li>
                <li>• Complete data privacy</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Zap className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Real-time Demo</CardTitle>
              <CardDescription>
                Watch FHE encryption/decryption process with test USDC
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Live encryption process</li>
                <li>• Real-time decryption</li>
                <li>• Process logs</li>
                <li>• No real money required</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Demo Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Try the FHE Demo
            </CardTitle>
            <CardDescription className="text-lg">
              Experience donation encryption and decryption with test USDC
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Lock className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold">1. Encrypt</h3>
                <p className="text-sm text-gray-600">Donation amount encrypted with FHE</p>
              </div>
              <div className="space-y-2">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold">2. Store</h3>
                <p className="text-sm text-gray-600">Encrypted data stored on blockchain</p>
              </div>
              <div className="space-y-2">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Eye className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold">3. Decrypt</h3>
                <p className="text-sm text-gray-600">Decrypt with your private key</p>
              </div>
            </div>
            
            <Link to="/donate">
              <Button size="lg" className="w-full sm:w-auto">
                <Shield className="mr-2 h-5 w-5" />
                Start Donating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-6 w-6 text-blue-400" />
            <h3 className="text-xl font-bold">Private Impact Chain</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Privacy-preserving charity platform with FHE encryption
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <span>Built with FHE Technology</span>
            <span>•</span>
            <span>Test USDC Demo</span>
            <span>•</span>
            <span>Open Source</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
