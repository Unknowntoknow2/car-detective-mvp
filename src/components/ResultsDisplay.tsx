import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

interface ResultsDisplayProps {
  valuation: number;
  conditionData?: {
    condition: any;
  };
  features?: any[];
}

const conditionDescriptions = {
  Poor: {
    description: "The vehicle has significant mechanical and/or cosmetic issues, requiring major repairs.",
    tip: "Expect a lower valuation due to the extensive work needed."
  },
  Fair: {
    description: "The vehicle has some mechanical and/or cosmetic issues, but is generally functional.",
    tip: "Some repairs may be needed to improve the vehicle's condition."
  },
  Good: {
    description: "The vehicle is in good condition with no major mechanical or cosmetic issues.",
    tip: "Expect a fair valuation reflecting the vehicle's well-maintained state."
  },
  Excellent: {
    description: "The vehicle is in excellent condition with no known issues and has been well-maintained.",
    tip: "Expect a higher valuation due to the vehicle's exceptional condition."
  }
};

const featureIcons = {
  Safety: <span className="text-green-500">🛡️</span>,
  Entertainment: <span className="text-blue-500">🎵</span>,
  Comfort: <span className="text-yellow-500">🛋️</span>,
  Performance: <span className="text-red-500">🏎️</span>,
  Other: null
};

// Add type guard to check for valid condition keys
const isValidCondition = (condition: any): condition is 'Poor' | 'Fair' | 'Good' | 'Excellent' => {
  return ['Poor', 'Fair', 'Good', 'Excellent'].includes(condition);
};

// Add type guard to check for valid feature category keys
const isValidFeatureCategory = (category: any): category is 'Safety' | 'Entertainment' | 'Comfort' | 'Performance' | 'Other' => {
  return ['Safety', 'Entertainment', 'Comfort', 'Performance', 'Other'].includes(category);
};

export function ResultsDisplay({ valuation, conditionData, features }: ResultsDisplayProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Valuation Result</CardTitle>
          <CardDescription>Based on the information provided, here is the estimated valuation.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-3xl font-bold">${valuation.toLocaleString()}</h2>
              <Badge variant="secondary">Estimated Value</Badge>
            </div>

            {conditionData && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Vehicle Condition</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  {isValidCondition(conditionData.condition) ? (
                    <>
                      <p className="mb-2">{conditionDescriptions[conditionData.condition].description}</p>
                      <p className="text-sm text-gray-600">{conditionDescriptions[conditionData.condition].tip}</p>
                    </>
                  ) : (
                    <p>No condition information available</p>
                  )}
                </div>
              </div>
            )}

            {features && features.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Selected Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map(feature => {
                    const category = feature.category && isValidFeatureCategory(feature.category) 
                      ? feature.category 
                      : 'Other';
                      
                    return (
                      <div key={feature.id} className="flex items-start space-x-2">
                        {featureIcons[category] || null}
                        <div>
                          <p className="font-medium">{feature.name}</p>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {!conditionData && !features && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Missing Information</AlertTitle>
          <AlertDescription>
            No additional details were provided. Please provide more information for a more accurate valuation.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
