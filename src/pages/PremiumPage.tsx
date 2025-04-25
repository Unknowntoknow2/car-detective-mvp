
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useRef } from 'react';
import { useState } from 'react';
import { HeroSection } from '@/components/premium/HeroSection';
import { ComparisonSection } from '@/components/premium/ComparisonSection';
import { FeaturesSection } from '@/components/premium/FeaturesSection';
import { ValuationForm } from '@/components/premium/ValuationForm';
import { AnnouncementBar } from '@/components/marketing/AnnouncementBar';
import { CookieBanner } from '@/components/privacy/CookieBanner';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleHistoryTab } from '@/components/premium/VehicleHistoryTab';
import { MarketOffersTab } from '@/components/premium/MarketOffersTab';

export default function PremiumPage() {
  const { t } = useTranslation('common');
  const formRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [cardRotation, setCardRotation] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Handle 3D card effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    
    setCardRotation({ x: rotateX, y: rotateY });
  };
  
  const handleMouseLeave = () => {
    setCardRotation({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen bg-slate-50" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <AnnouncementBar />
      <Navbar />
      <main>
        <HeroSection 
          scrollToFeatures={scrollToFeatures} 
          scrollToForm={scrollToForm} 
          cardRef={cardRef} 
          cardRotation={cardRotation} 
        />
        <FeaturesSection featuresRef={featuresRef} />
        <ComparisonSection scrollToForm={scrollToForm} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Tabs defaultValue="valuation" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="valuation">Valuation</TabsTrigger>
              <TabsTrigger value="history">Vehicle History</TabsTrigger>
              <TabsTrigger value="market">Market Offers</TabsTrigger>
            </TabsList>
            <TabsContent value="valuation">
              <ValuationForm formRef={formRef} />
            </TabsContent>
            <TabsContent value="history">
              <VehicleHistoryTab 
                historyData={{
                  reportUrl: "https://mock-carfax.com/report/123",
                  reportData: {
                    owners: 2,
                    accidentsReported: 1,
                    damageTypes: ['Minor collision'],
                    serviceRecords: 3,
                    titleEvents: ['Clean title'],
                    estimatedValueImpact: -500
                  }
                }} 
              />
            </TabsContent>
            <TabsContent value="market">
              <MarketOffersTab 
                averages={{
                  'Facebook Marketplace': 24500,
                  'Craigslist': 23800,
                  'OfferUp': 25100,
                  'Carvana': 26000
                }}
                sources={{
                  'Facebook Marketplace': 'https://www.facebook.com/marketplace',
                  'Craigslist': 'https://craigslist.org',
                  'OfferUp': 'https://offerup.com',
                  'Carvana': 'https://www.carvana.com'
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
