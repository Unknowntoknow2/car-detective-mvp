import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/design-system';
import { Button } from '@/components/ui/button';
import { Share, Download, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useValuationResult } from '@/hooks/useValuationResult';
import { Loader2, AlertCircle } from 'lucide-react';
import { AIChatBubble } from '@/components/chat/AIChatBubble';
import { DealerOffersList } from '@/components/dealer/DealerOffersList';
import { PDFDownloadButton } from '@/components/common/PDFDownloadButton';
import PredictionResult from '@/components/valuation/PredictionResult';

// Add a type definition for conditionInfo:
interface ConditionInfo {
  Poor: { description: string; tip: string };
  Fair: { description: string; tip: string };
  Good: { description: string; tip: string };
  Excellent: { description: string; tip: string };
}

// Add a type definition for featureCategories:
interface FeatureCategories {
  Safety: React.ReactElement;
  Entertainment: React.ReactElement;
  Comfort: React.ReactElement;
  Performance: React.ReactElement;
  Other: null;
}

const conditionInfo: ConditionInfo = {
  Poor: {
    description: 'Vehicle has significant mechanical and/or cosmetic issues.',
    tip: 'Consider a professional inspection before making an offer.'
  },
  Fair: {
    description: 'Vehicle has some mechanical and/or cosmetic issues.',
    tip: 'Factor in repair costs when determining the vehicle\'s value.'
  },
  Good: {
    description: 'Vehicle is in good condition with no major issues.',
    tip: 'This vehicle is likely to provide reliable transportation.'
  },
  Excellent: {
    description: 'Vehicle is in excellent condition with no known issues.',
    tip: 'This vehicle is likely to be a great investment.'
  }
};

const featureCategories = {
  Safety: <Element>Safety</Element>,
  Entertainment: <Element>Entertainment</Element>,
  Comfort: <Element>Comfort</Element>,
  Performance: <Element>Performance</Element>,
  Other: null
};

function Element({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {children}
    </div>
  );
}

export default function ResultsDisplay() {
  const { valuationId } = useParams<{ valuationId: string }>();
  const { data, isLoading, error } = useValuationResult(valuationId || '');

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading valuation data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Card className="p-6 bg-red-50">
          <CardContent className="p-0">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-red-700 mb-2">
                  Error Loading Valuation
                </h2>
                <p className="text-red-600">
                  Could not load the valuation details. Please try again or contact support.
                </p>
                <Button variant="outline" className="mt-4">
                  Start New Valuation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Card className="p-6">
          <CardContent className="p-0 text-center">
            <h2 className="text-xl font-bold mb-4">No Valuation Data</h2>
            <p className="text-muted-foreground mb-6">
              There is no valuation data to display. Please start a new valuation.
            </p>
            <Button>Start New Valuation</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    make,
    model,
    year,
    mileage,
    condition,
    estimatedValue,
    confidenceScore,
    adjustments,
    features,
    isPremium
  } = data;

  // Type assertion for condition
  const conditionKey = (condition || 'Good') as keyof ConditionInfo;
  const conditionData = conditionInfo[conditionKey];

  const totalAdjustments = adjustments?.reduce((sum: number, adj: any) => sum + (adj.impact || 0), 0) || 0;

  return (
    <section className="container grid items-center justify-center gap-6 pt-6 md:pt-10 pb-8 md:pb-14">
      <SectionHeader
        title="Valuation Result"
        description="Here is the valuation result for your vehicle"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Make</p>
                  <p className="font-medium">{make}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Model</p>
                  <p className="font-medium">{model}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Year</p>
                  <p className="font-medium">{year}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Mileage</p>
                  <p className="font-medium">{mileage}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Condition</p>
                  <p className="font-medium">{condition}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Estimated Value</p>
                  <p className="font-medium">{formatCurrency(estimatedValue)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Confidence Score</p>
                  <p className="font-medium">{confidenceScore}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Adjustments</p>
                  <p className="font-medium">{totalAdjustments}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Condition Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">{conditionData?.description}</p>
              <p className="text-sm">{conditionData?.tip}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {features?.map((feature, index) => {
                  const category = index % 5 === 0 ? 'Safety' : index % 5 === 1 ? 'Entertainment' : index % 5 === 2 ? 'Comfort' : index % 5 === 3 ? 'Performance' : 'Other';
                  const categoryKey = (category || 'Other') as keyof FeatureCategories;
                  const CategoryIcon = featureCategories[categoryKey];

                  return (
                    <div key={index} className="flex items-center gap-2">
                      {CategoryIcon && CategoryIcon}
                      <p className="text-sm">{feature}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="flex-1 gap-2">
                  <Share className="h-4 w-4" />
                  Share Result
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button className="flex-1 gap-2">
                  Get Premium Report
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isPremium && (
        <PDFDownloadButton valuationResult={data} isPremium={isPremium} />
      )}

      <AIChatBubble valuation={data} />

      {valuationId && (
        <DealerOffersList reportId={valuationId} />
      )}

      {valuationId && (
        <PredictionResult valuationId={valuationId} />
      )}
    </section>
  );
}
