import React from 'react';
import { Heading } from "@/components/ui-kit/typography";
import { BodyM, BodyS } from "@/components/ui-kit/typography";
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const PhotoAnalysis = () => {
  // Mock data for photo analysis
  const photoAnalysis = {
    overallCondition: 'Good',
    confidenceScore: 85,
    issues: [
      { name: 'Minor scratches', severity: 'low', impact: -150 },
      { name: 'Wheel curb rash', severity: 'medium', impact: -350 },
    ],
    positives: [
      { name: 'Clean interior', impact: +200 },
      { name: 'No visible dents', impact: +100 },
    ],
    photoCount: 8,
    photoQuality: 'High',
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'medium':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Heading className="text-2xl font-bold mb-4">Vehicle Photo Analysis</Heading>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="p-4 border">
          <div className="flex justify-between items-center mb-4">
            <Heading className="text-lg font-semibold">Condition Assessment</Heading>
            <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">
              {photoAnalysis.photoQuality} Quality
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <BodyM>Overall Condition</BodyM>
              <Badge className={cn(
                photoAnalysis.overallCondition === 'Excellent' ? 'bg-green-50 text-green-700 border-green-200' :
                photoAnalysis.overallCondition === 'Good' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                photoAnalysis.overallCondition === 'Fair' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                'bg-red-50 text-red-700 border-red-200'
              )}>
                {photoAnalysis.overallCondition}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <BodyM>Confidence Score</BodyM>
              <div className="flex items-center">
                <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                  <div 
                    className={cn(
                      "h-full rounded-full",
                      photoAnalysis.confidenceScore > 80 ? "bg-green-500" :
                      photoAnalysis.confidenceScore > 60 ? "bg-blue-500" :
                      photoAnalysis.confidenceScore > 40 ? "bg-yellow-500" : "bg-red-500"
                    )}
                    style={{ width: `${photoAnalysis.confidenceScore}%` }}
                  />
                </div>
                <BodyS className="font-medium">{photoAnalysis.confidenceScore}%</BodyS>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <BodyM>Photos Analyzed</BodyM>
              <BodyS className="font-medium">{photoAnalysis.photoCount} photos</BodyS>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border">
          <Heading className="text-lg font-semibold mb-4">Value Impact</Heading>
          
          <div className="space-y-3">
            {photoAnalysis.issues.map((issue, index) => (
              <div key={`issue-${index}`} className="flex justify-between items-center">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                  <BodyM>{issue.name}</BodyM>
                </div>
                <Badge variant="outline" className={cn("font-mono", getSeverityColor(issue.severity))}>
                  {issue.impact.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </Badge>
              </div>
            ))}
            
            {photoAnalysis.positives.map((positive, index) => (
              <div key={`positive-${index}`} className="flex justify-between items-center">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <BodyM>{positive.name}</BodyM>
                </div>
                <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200 font-mono">
                  +{positive.impact.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-start">
          <div className="mr-3 mt-1">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <BodyM className="font-medium">Photo Analysis Disclaimer</BodyM>
            <BodyS className="text-gray-600 mt-1">
              This analysis is based on the photos provided and may not capture all vehicle conditions.
              For the most accurate valuation, we recommend an in-person inspection by a certified mechanic.
            </BodyS>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoAnalysis;
