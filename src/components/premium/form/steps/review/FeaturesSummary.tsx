
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FormData } from '@/types/premium-valuation';
import { CheckCircle } from 'lucide-react';

interface FeaturesSummaryProps {
  formData: FormData;
}

export function FeaturesSummary({ formData }: FeaturesSummaryProps) {
  if (!formData.features || formData.features.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Features</h3>
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6 text-center text-muted-foreground">
            No features selected
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Features</h3>
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formData.features.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 py-2"
              >
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
