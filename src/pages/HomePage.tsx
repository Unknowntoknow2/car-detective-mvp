
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { EnhancedHomePage } from '@/components/home/EnhancedHomePage';
import { SEO } from '@/components/layout/seo';

export default function HomePage() {
  return (
    <MainLayout>
      <SEO 
        title="Car Detective | AI-Powered Vehicle Valuation"
        description="Get accurate, data-driven valuations for your vehicle with our advanced AI technology. Compare market prices and receive detailed reports."
        image="/images/hero-car.png"
      />
      <EnhancedHomePage />
    </MainLayout>
  );
}
