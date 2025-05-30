
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { ValuationResult } from '@/components/valuation/ValuationResult';
import { PremiumPdfSection } from '@/components/valuation/PremiumPdfSection';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useValuationResult } from '@/hooks/useValuationResult';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

const ValuationResultPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: valuationResult, isLoading, error } = useValuationResult(id || '');
  const { isPremium } = usePremiumStatus();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <Loading />
        </div>
      </MainLayout>
    );
  }

  if (error || !valuationResult) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <ErrorMessage 
            message="The valuation result you're looking for doesn't exist or has been removed."
          />
          <Button 
            onClick={() => window.history.back()} 
            className="mt-4"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => window.history.back()} 
            variant="outline" 
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Valuation Results</h1>
        </div>

        <Card className="p-6">
          <ValuationResult 
            valuationId={id} 
            data={{
              ...valuationResult,
              success: true,
              valuationId: id || valuationResult.id,
              condition: valuationResult.condition || 'Good'
            }}
            isPremium={isPremium || false}
          />
        </Card>

        {/* Premium PDF Section - only show for premium users */}
        {(isPremium || false) && (
          <PremiumPdfSection 
            valuationResult={valuationResult}
            isPremium={isPremium || false}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default ValuationResultPage;
