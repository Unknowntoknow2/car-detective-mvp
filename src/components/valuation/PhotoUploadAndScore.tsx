import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PhotoUploader } from './photo-upload/PhotoUploader';
import { AICondition } from '@/types/photo';

interface PhotoUploadAndScoreProps {
  valuationId: string;
  onScoreChange?: (score: number, aiCondition?: AICondition) => void;
  isPremium?: boolean;
}

export function PhotoUploadAndScore({ 
  valuationId, 
  onScoreChange,
  isPremium = false
}: PhotoUploadAndScoreProps) {
  const [photoScore, setPhotoScore] = useState<number | null>(null);
  const [bestPhotoUrl, setBestPhotoUrl] = useState<string | undefined>(undefined);
  
  const handleScoreUpdate = (score: number, bestPhoto?: string) => {
    setPhotoScore(score);
    setBestPhotoUrl(bestPhoto);
    
    // Generate AI condition from score
    if (onScoreChange) {
      const condition: AICondition = {
        condition: getConditionFromScore(score),
        confidenceScore: score * 100,
        issuesDetected: []
      };
      
      onScoreChange(score, condition);
    }
  };
  
  // Helper to map score to condition
  const getConditionFromScore = (score: number): 'Excellent' | 'Good' | 'Fair' | 'Poor' => {
    if (score >= 0.85) return 'Excellent';
    if (score >= 0.70) return 'Good';
    if (score >= 0.50) return 'Fair';
    return 'Poor';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Photos</CardTitle>
        <CardDescription>
          Upload photos of your vehicle for AI-powered condition assessment
          {isPremium && " with premium analysis"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PhotoUploader 
          valuationId={valuationId}
          onScoreUpdate={handleScoreUpdate}
          isPremium={isPremium}
        />
        
        {photoScore !== null && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <h4 className="font-medium mb-2">Photo Analysis Result</h4>
            <p className="text-sm text-muted-foreground">
              Based on your photos, your vehicle appears to be in 
              <span className="font-semibold"> {getConditionFromScore(photoScore)} </span> 
              condition with a confidence score of {Math.round(photoScore * 100)}%.
            </p>
            {bestPhotoUrl && (
              <div className="mt-3">
                <p className="text-sm mb-2">Best representative photo:</p>
                <img 
                  src={bestPhotoUrl} 
                  alt="Best vehicle condition photo" 
                  className="max-h-40 rounded-md object-cover" 
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
