import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye } from "lucide-react";
import encryptedBanner from "@/assets/encrypted-banner.jpg";
import { DonationModal } from "./DonationModal";

export const DonationHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Encrypted Background Banner */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${encryptedBanner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-secondary/80"></div>
        <div className="absolute inset-0 bg-gradient-encrypted opacity-20 animate-encrypted-pulse"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6 animate-slide-in">
        <div className="flex justify-center items-center gap-4 mb-8">
          <Shield className="h-12 w-12 text-white" />
          <Lock className="h-10 w-10 text-privacy" />
          <Eye className="h-8 w-8 text-white opacity-50" />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
          Support <span className="text-privacy">Privately</span>,<br />
          Impact <span className="text-secondary">Publicly</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
          Make confidential charitable donations while keeping your identity and donation amount secure. 
          All contributions are verifiable through our encrypted transparency system.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <DonationModal
            campaignName="Featured Campaign"
            trigger={
              <Button variant="campaign" size="lg" className="text-lg px-8 py-4">
                Connect Wallet & Donate
              </Button>
            }
          />
          <Button variant="privacy" size="lg" className="text-lg px-8 py-4">
            Learn About Privacy
          </Button>
        </div>

        {/* Privacy Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-white">
          <div className="text-center">
            <Shield className="h-8 w-8 text-privacy mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Complete Anonymity</h3>
            <p className="text-white/80">Your identity remains completely private</p>
          </div>
          <div className="text-center">
            <Lock className="h-8 w-8 text-privacy mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Encrypted Amounts</h3>
            <p className="text-white/80">Donation amounts are encrypted and secure</p>
          </div>
          <div className="text-center">
            <Eye className="h-8 w-8 text-privacy mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Public Totals</h3>
            <p className="text-white/80">Total raised is transparent and verifiable</p>
          </div>
        </div>
      </div>
    </section>
  );
};