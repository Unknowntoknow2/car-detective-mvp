
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Camera, Lock } from 'lucide-react';
import { AICondition } from '@/types/photo';
import { PremiumFeatureLock } from '@/components/premium/PremiumFeatureLock';
import { cn } from '@/lib/utils';

interface PhotoConditionScoreProps {
  photoUrl?: string;
  photoUrls?: string[];
  aiCondition?: AICondition;
  isPremium: boolean;
  onUpgrade: () => void;
  valuationId?: string;
  className?: string;
}

export function PhotoConditionScore({
  photoUrl,
  photoUrls = [],
  aiCondition,
  isPremium,
  onUpgrade,
  valuationId,
  className
}: PhotoConditionScoreProps) {
  // Use the first photo URL from the array if provided, otherwise fall back to photoUrl
  const mainPhotoUrl = photoUrls.length > 0 ? photoUrls[0] : photoUrl;
  
  // If we don't have any photo, early return with an explanatory message
  if (!mainPhotoUrl && !photoUrls.length) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader>
          <CardTitle>Vehicle Condition Analysis</CardTitle>
          <CardDescription>No photos available for this valuation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <Camera className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground mb-4">
              Upload photos during the valuation process to receive a detailed condition analysis.
            </p>
            <Button variant="outline">Start New Valuation with Photos</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // If user doesn't have premium access, show the premium lock
  if (!isPremium) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader>
          <CardTitle>Vehicle Condition Analysis</CardTitle>
          <CardDescription>Analyze photos to determine vehicle condition</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {/* Show the photo but blur it */}
          <div className="relative">
            <div className="aspect-video bg-muted overflow-hidden blur-sm">
              <img 
                src={mainPhotoUrl} 
                alt="Vehicle" 
                className="w-full h-full object-cover" 
              />
            </div>
            
            {/* Premium overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <PremiumFeatureLock 
                valuationId={valuationId || ''}
                feature="photo condition analysis"
                ctaText="Unlock Photo Analysis"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Default condition data if none provided
  const conditionData = aiCondition || {
    condition: 'Good',
    confidenceScore: 75,
    issuesDetected: [
      'Minor paint scratches',
      'Light interior wear',
      'Normal tire wear'
    ],
    summary: 'Vehicle appears to be in good overall condition with minor wear consistent with age and mileage.'
  };
  
  // Map condition to a star rating (1-5)
  const getStarRating = (condition: string): number => {
    const conditionMap: Record<string, number> = {
      'Excellent': 5,
      'Very Good': 4,
      'Good': 3,
      'Fair': 2,
      'Poor': 1
    };
    
    return conditionMap[condition] || 3;
  };
  
  const starRating = getStarRating(conditionData.condition);
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle>Vehicle Condition Analysis</CardTitle>
        <CardDescription>
          AI-powered analysis based on your vehicle photos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Photo display */}
        <div className="aspect-video bg-muted rounded-md overflow-hidden">
          <img 
            src={mainPhotoUrl} 
            alt="Vehicle" 
            className="w-full h-full object-cover" 
          />
        </div>
        
        {/* Star rating */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Condition Rating:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={cn(
                  "h-5 w-5", 
                  star <= starRating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                )} 
              />
            ))}
            <span className="ml-2 font-medium">{conditionData.condition}</span>
          </div>
        </div>
        
        {/* Condition summary */}
        <div>
          <h3 className="font-medium mb-2">Condition Summary</h3>
          <p className="text-muted-foreground text-sm">{conditionData.summary}</p>
        </div>
        
        {/* Issues detected */}
        {conditionData.issuesDetected && conditionData.issuesDetected.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Issues Detected</h3>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              {conditionData.issuesDetected.map((issue, idx) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Additional photos */}
        {photoUrls.length > 1 && (
          <div>
            <h3 className="font-medium mb-2">Additional Photos</h3>
            <div className="grid grid-cols-3 gap-2">
              {photoUrls.slice(1, 4).map((url, idx) => (
                <div key={idx} className="aspect-square bg-muted rounded-md overflow-hidden">
                  <img 
                    src={url} 
                    alt={`Vehicle photo ${idx + 2}`}
                    className="w-full h-full object-cover" 
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
