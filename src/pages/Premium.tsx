
import React from 'react';
import { SEO } from '@/components/layout/seo';
import PremiumValuationForm from '@/components/premium/form/PremiumValuationForm'; 
import { Layout } from '@/components/layout';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <div className="min-h-screen">{children}</div>;
};

export default function Premium() {
  return (
    <Layout>
      <SEO title="Premium Valuation" description="Get a premium valuation for your vehicle" />
      <PremiumValuationForm />
    </Layout>
  );
}
