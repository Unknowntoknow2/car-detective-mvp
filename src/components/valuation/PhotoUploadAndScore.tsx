
import { useState } from 'react';
import { PhotoUploadDropzone } from './photo-upload/PhotoUploadDropzone';
import { PhotoPreview } from './photo-upload/PhotoPreview';
import { PhotoUploadError } from './photo-upload/PhotoUploadError';
import { PhotoHeader } from './photo-upload/PhotoHeader';
import { PhotoGuidance, PhotoTips } from './photo-upload/PhotoGuidance';
import { usePhotoScoring } from '@/hooks/usePhotoScoring';

interface PhotoUploadAndScoreProps {
  valuationId: string;
  onScoreChange?: (score: number, aiCondition?: any) => void;
  isPremium?: boolean;
}

export function PhotoUploadAndScore({ 
  valuationId, 
  onScoreChange,
  isPremium = false 
}: PhotoUploadAndScoreProps) {
  const {
    uploadPhotos,
    photos,
    photoScore,
    aiCondition,
    isUploading,
    isScoring,
    uploadProgress,
    error,
    resetUpload,
    individualScores
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
      <PhotoHeader isPremium={isPremium} />
      
      <PhotoGuidance photoCount={photos.length} />
      
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
          individualScores={individualScores}
        />
      )}
      
      {photos.length < MAX_FILES && photos.length > 0 && !isUploading && !isScoring && (
        <PhotoUploadDropzone 
          onFilesSelect={handleFileSelection}
          isLoading={isUploading || isScoring}
          currentFileCount={photos.length}
        />
      )}
      
      <PhotoUploadError error={error} />
      
      <PhotoTips />
    </div>
  );
}
