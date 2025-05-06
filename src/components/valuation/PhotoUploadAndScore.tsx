
import { useState } from 'react';
import { PhotoUploadDropzone } from './photo-upload/PhotoUploadDropzone';
import { PhotoPreview } from './photo-upload/PhotoPreview';
import { PhotoUploadError } from './photo-upload/PhotoUploadError';
import { PhotoHeader } from './photo-upload/PhotoHeader';
import { PhotoGuidance, PhotoTips } from './photo-upload/PhotoGuidance';
import { usePhotoScoring } from '@/hooks/usePhotoScoring';
import { MAX_FILES, MIN_FILES } from '@/types/photo';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

interface PhotoUploadAndScoreProps {
  valuationId: string;
  onScoreChange?: (score: number, aiCondition?: any) => void;
  isPremium?: boolean;
  isRequired?: boolean;
}

export function PhotoUploadAndScore({ 
  valuationId, 
  onScoreChange,
  isPremium = false,
  isRequired = false
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
  
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  
  const handleFileSelection = async (files: File[]) => {
    setValidationMessage(null);
    
    if (isRequired && photos.length === 0 && files.length < MIN_FILES) {
      setValidationMessage(`At least ${MIN_FILES} photos are required for accurate valuation.`);
      return;
    }
    
    const result = await uploadPhotos(files);
    
    // Call the onScoreChange callback if provided
    if (result && onScoreChange) {
      onScoreChange(result.score, result.aiCondition);
    }
  };
  
  return (
    <div className="space-y-4">
      <PhotoHeader isPremium={isPremium} />
      
      {isRequired && photos.length === 0 && (
        <Alert variant="destructive">
          <AlertTitle className="flex items-center gap-2">
            <InfoIcon className="h-4 w-4" />
            Photos Required
          </AlertTitle>
          <AlertDescription>
            Please upload at least {MIN_FILES} photos of your vehicle for our AI analysis to determine its condition.
            This is required to continue with your valuation.
          </AlertDescription>
        </Alert>
      )}
      
      <PhotoGuidance photoCount={photos.length} />
      
      {photos.length === 0 ? (
        <PhotoUploadDropzone 
          onFilesSelect={handleFileSelection}
          isLoading={isUploading || isScoring}
          currentFileCount={photos.length}
          minRequired={isRequired ? MIN_FILES : undefined}
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
          additionalMode={true}
        />
      )}
      
      {validationMessage && (
        <Alert variant="warning" className="mt-2">
          <AlertDescription>{validationMessage}</AlertDescription>
        </Alert>
      )}
      
      <PhotoUploadError error={error} />
      
      <PhotoTips />
    </div>
  );
}
