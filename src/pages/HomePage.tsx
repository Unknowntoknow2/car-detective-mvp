
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/home/HeroSection';
import { ValuePropositionSection } from '@/components/home/ValuePropositionSection';
import { PremiumServicesGrid } from '@/components/home/PremiumServicesGrid';

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      <div className="min-h-screen">
        <HeroSection />
        <ValuePropositionSection />
        <PremiumServicesGrid />
      </div>
    </MainLayout>
  );
};

export default HomePage;
