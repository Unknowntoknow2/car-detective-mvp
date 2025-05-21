
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PhotoUpload } from '@/components/premium/lookup/PhotoUpload';

interface PhotoUploadStepProps {
  onPhotoAnalysisComplete: (vehicleData: any) => void;
}

export function PhotoUploadStep({ onPhotoAnalysisComplete }: PhotoUploadStepProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Upload Vehicle Photos</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Upload photos of your vehicle to help our AI analyze its condition and identify key features.
        </p>
        
        <PhotoUpload onPhotoAnalysisComplete={onPhotoAnalysisComplete} />
      </CardContent>
    </Card>
  );
}
