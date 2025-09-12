import { DonationHero } from "@/components/DonationHero";
import { CampaignCard } from "@/components/CampaignCard";
import { WalletConnect } from "@/components/WalletConnect";

const Index = () => {
  // Mock campaign data
  const campaigns = [
    {
      name: "Democratic Leadership Fund",
      description: "Supporting progressive candidates and democratic values across the nation",
      totalRaised: 2850000,
      goal: 5000000,
      donorCount: 12847,
      image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=300&fit=crop"
    },
    {
      name: "Republican Victory Initiative",
      description: "Advancing conservative principles and supporting Republican candidates nationwide",
      totalRaised: 3200000,
      goal: 6000000,
      donorCount: 15632,
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop"
    },
    {
      name: "Independent Voices Coalition",
      description: "Empowering independent candidates and promoting bipartisan solutions",
      totalRaised: 890000,
      goal: 2000000,
      donorCount: 4521,
      image: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?w=400&h=300&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <DonationHero />
      
      {/* Campaigns Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Active Campaigns
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Support the political movements you believe in while maintaining complete privacy. 
              All donations are encrypted and anonymous.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {campaigns.map((campaign, index) => (
              <CampaignCard
                key={index}
                {...campaign}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Wallet Connect Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Connect your wallet and start making anonymous political donations today. 
            Your privacy is guaranteed, your impact is real.
          </p>
          
          <WalletConnect />
        </div>
      </section>
    </div>
  );
};

export default Index;
