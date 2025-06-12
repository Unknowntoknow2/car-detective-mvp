import React from 'react';
import ManualValuationPage from '@/pages/valuation/manual/ManualValuationPage'; // ✅ NO CURLY BRACES

export default function ValuationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ManualValuationPage />
    </div>
  );
}
