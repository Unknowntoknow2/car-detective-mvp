
import { PhotoUploadDropzone } from './photo-upload/PhotoUploadDropzone';
import { PhotoPreview } from './photo-upload/PhotoPreview';
import { PhotoUploadError } from './photo-upload/PhotoUploadError';
import { Badge } from '@/components/ui/badge';
import { usePhotoScoring } from '@/hooks/usePhotoScoring';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface PhotoUploadAndScoreProps {
  valuationId: string;
  onScoreChange?: (score: number, aiCondition?: any) => void;
}

export function PhotoUploadAndScore({ valuationId, onScoreChange }: PhotoUploadAndScoreProps) {
  const {
    uploadPhotos,
    photos,
    photoScore,
    aiCondition,
    isUploading,
    isScoring,
    uploadProgress,
    error,
    resetUpload
  } = usePhotoScoring(valuationId);
  
  const handleFileSelection = async (files: File[]) => {
    const result = await uploadPhotos(files);
    
    // Call the onScoreChange callback if provided
    if (result && onScoreChange) {
      onScoreChange(result.score, result.aiCondition);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Vehicle Photo Analysis</h3>
        <Badge variant="outline" className="bg-primary/10">AI-Powered</Badge>
      </div>
      
      {photos.length < 3 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Enhanced valuation with photos</AlertTitle>
          <AlertDescription>
            Upload at least 3 photos (up to 5) of your vehicle for an AI-enhanced valuation that's more accurate.
          </AlertDescription>
        </Alert>
      )}
      
      {photos.length === 0 ? (
        <PhotoUploadDropzone 
          onFilesSelect={handleFileSelection}
          isLoading={isUploading || isScoring}
          currentFileCount={photos.length}
        />
      ) : (
        <PhotoPreview
          photos={photos}
          photoScore={photoScore}
          isUploading={isUploading}
          isScoring={isScoring}
          uploadProgress={uploadProgress}
          onRemove={resetUpload}
          aiCondition={aiCondition}
        />
      )}
      
      {photos.length < 5 && photos.length > 0 && !isUploading && !isScoring && (
        <PhotoUploadDropzone 
          onFilesSelect={handleFileSelection}
          isLoading={isUploading || isScoring}
          currentFileCount={photos.length}
        />
      )}
      
      <PhotoUploadError error={error} />
      
      <div className="text-xs text-gray-500">
        <p>Upload 3-5 clear photos of your vehicle to improve valuation accuracy.</p>
        <p>Include exterior from different angles, interior, and any damage for the best results.</p>
        <p>Our AI will analyze the condition and features to provide a more personalized estimate.</p>
      </div>
    </div>
  );
}
