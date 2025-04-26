
import { useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementBar } from '@/components/marketing/AnnouncementBar';
import { PremiumHero } from '@/components/premium/sections/PremiumHero';
import { PremiumValuationTabs } from '@/components/premium/sections/PremiumValuationTabs';
import { ComparisonSection } from '@/components/premium/ComparisonSection';
import { PremiumFeaturesTabs } from '@/components/premium/features/PremiumFeaturesTabs';

export default function PremiumPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      <AnnouncementBar />
      <Navbar />
      <main>
        <PremiumHero scrollToForm={scrollToForm} />
        
        <PremiumFeaturesTabs />
        
        <ComparisonSection scrollToForm={scrollToForm} />
        
        <section ref={formRef} id="premium-valuation" className="py-12 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                Premium Valuation Tool
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose your preferred method to get your comprehensive vehicle valuation.
              </p>
            </div>
            <PremiumValuationTabs />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
