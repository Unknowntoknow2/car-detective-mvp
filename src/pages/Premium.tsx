
import React from 'react';
import { SEO } from '@/components/layout/seo';
import PremiumValuationForm from '@/components/premium/form/PremiumValuationForm'; // ✅ Fixed: Using default import
import { Layout } from '@/components/layout';

export default function Premium() {
  return (
    <Layout>
      <SEO title="Premium Valuation" description="Get a premium valuation for your vehicle" />
      <PremiumValuationForm />
    </Layout>
  );
}
