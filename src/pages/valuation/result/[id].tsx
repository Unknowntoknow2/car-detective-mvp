
import React from 'react';
import { useRouter } from 'next/router';
import { MainLayout } from '@/components/layout';
import { ValuationResult } from '@/components/valuation/ValuationResult';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ValuationResultPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const handleGoBack = () => {
    router.back();
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleGoBack} 
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
            valuationId={id as string}
            isManualValuation={false}
          />
        </Card>
      </div>
    </MainLayout>
  );
};

export default ValuationResultPage;
