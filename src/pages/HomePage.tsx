
import React, { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/home/HeroSection';
import { ValuePropositionSection } from '@/components/home/ValuePropositionSection';
import { PremiumServicesGrid } from '@/components/home/PremiumServicesGrid';

const HomePage: React.FC = () => {
  // Add diagnostic logging to confirm component is being rendered
  console.log('✅ HomePage loaded');

  useEffect(() => {
    console.log('✅ HomePage mounted in DOM');
  }, []);

  return (
    <MainLayout>
      {/* Fallback div to ensure something is visible even if components fail */}
      <div id="homepage-fallback" className="p-4 bg-yellow-100 text-black">
        It works! HomePage is rendering. If you see this message, the core routing is working.
      </div>
      
      <div className="min-h-screen">
        <HeroSection />
        <ValuePropositionSection />
        <PremiumServicesGrid />
      </div>
    </MainLayout>
  );
};

export default HomePage;
