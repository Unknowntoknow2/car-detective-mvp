
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PremiumFeatureLock } from '@/components/premium/PremiumFeatureLock';
import { StarRating } from './StarRating';

interface PhotoConditionScoreProps {
  valuationId: string;
  photoUrl?: string;
  isPremium?: boolean;
  onUpgrade?: () => void;
}

export function PhotoConditionScore({
  valuationId,
  photoUrl,
  isPremium = false,
  onUpgrade
}: PhotoConditionScoreProps) {
  // If not premium, show the lock component
  if (!isPremium) {
    return (
      <PremiumFeatureLock
        valuationId={valuationId}
        feature="photo condition analysis"
        ctaText="Unlock Photo Analysis"
        returnUrl={`/valuation/${valuationId}`}
      />
    );
  }
  
  // If no photo URL is provided
  if (!photoUrl) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Photo Analysis</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-muted-foreground">
            No photos were provided for this valuation.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Mock data for demo purposes
  const mockAnalysis = {
    overallCondition: 'Good',
    conditionScore: 7.5,
    exteriorGrade: 8,
    interiorGrade: 7,
    detectedIssues: [
      'Minor scratches on front bumper',
      'Light wear on driver seat'
    ]
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Photo Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img 
              src={photoUrl} 
              alt="Vehicle" 
              className="w-full h-auto object-cover rounded-md" 
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Overall Condition
              </p>
              <p className="text-xl font-semibold">
                {mockAnalysis.overallCondition}
              </p>
              <StarRating 
                rating={mockAnalysis.conditionScore} 
                maxRating={10} 
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Exterior
                </p>
                <StarRating rating={mockAnalysis.exteriorGrade} maxRating={10} />
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Interior
                </p>
                <StarRating rating={mockAnalysis.interiorGrade} maxRating={10} />
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Detected Issues
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {mockAnalysis.detectedIssues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
