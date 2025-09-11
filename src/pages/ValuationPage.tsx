import React from 'react';
import { UnifiedLookupTabs } from '@/components/lookup/UnifiedLookupTabs';
import { ProfessionalCard, CardContent } from '@/components/ui/enhanced/ProfessionalCard';

export default function ValuationPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Get Your Vehicle Valuation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enter your VIN or license plate to get an instant, accurate vehicle valuation.
          </p>
        </div>
        
        <ProfessionalCard variant="elevated" className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <UnifiedLookupTabs />
          </CardContent>
        </ProfessionalCard>
      </div>
    </div>
  );
}