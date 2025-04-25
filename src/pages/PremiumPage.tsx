
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementBar } from '@/components/marketing/AnnouncementBar';
import { CarfaxBadge } from '@/components/premium/hero/CarfaxBadge';
import { PremiumHero } from '@/components/premium/sections/PremiumHero';
import { PremiumValuationTabs } from '@/components/premium/sections/PremiumValuationTabs';
import { FeatureCards } from '@/components/premium/hero/FeatureCards';
import { useRef } from 'react';

export default function PremiumPage() {
  const formRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="min-h-screen bg-slate-50">
      <AnnouncementBar />
      <Navbar />
      <main>
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <CarfaxBadge />
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Premium Vehicle Valuation
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get the most accurate valuation with our professional-grade service, including CARFAX® report and market analysis.
            </p>
            
            <FeatureCards />
          </div>
        </section>

        <section ref={formRef} id="premium-valuation" className="py-12">
          <div className="max-w-7xl mx-auto">
            <PremiumValuationTabs />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
