import React from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect } from 'wagmi';
import { WalletStatus } from "./WalletStatus";
import { DonationModal } from "./DonationModal";
import { Button } from "@/components/ui/button";

export const WalletConnect = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    open();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <div className="space-y-6">
      <WalletStatus
        isConnected={isConnected}
        walletAddress={address || ""}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />
      
      {isConnected && (
        <div className="text-center">
          <DonationModal
            campaignName="Selected Campaign"
            trigger={
              <Button variant="campaign" size="lg" className="text-lg px-8 py-4">
                Make Anonymous Donation
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
};