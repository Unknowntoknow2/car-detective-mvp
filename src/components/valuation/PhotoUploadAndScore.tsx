
import { useState, useEffect } from 'react';
import { PhotoUploadDropzone } from './photo-upload/PhotoUploadDropzone';
import { PhotoPreview } from './photo-upload/PhotoPreview';
import { PhotoUploadError } from './photo-upload/PhotoUploadError';
import { PhotoHeader } from './photo-upload/PhotoHeader';
import { PhotoGuidance, PhotoTips } from './photo-upload/PhotoGuidance';
import { usePhotoScoring } from '@/hooks/usePhotoScoring';
import { MAX_FILES, MIN_FILES, Photo, PhotoScore } from '@/types/photo';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

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
    individualScores,
    isLoading
  } = usePhotoScoring(valuationId);
  
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [showTips, setShowTips] = useState<boolean>(true);
  
  useEffect(() => {
    // Hide tips after 10 seconds if photos are uploaded
    if (photos.length > 0) {
      const timer = setTimeout(() => setShowTips(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [photos.length]);
  
  const handleFileSelection = async (files: File[]) => {
    setValidationMessage(null);
    
    if (isRequired && photos.length === 0 && files.length < MIN_FILES) {
      setValidationMessage(`At least ${MIN_FILES} photos are required for accurate valuation.`);
      return;
    }
    
    try {
      // Show initial processing toast
      toast.loading("Processing your photos...", { id: "photo-processing" });
      
      const result = await uploadPhotos(files);
      
      toast.dismiss("photo-processing");
      
      // Call the onScoreChange callback if provided
      if (result && onScoreChange) {
        onScoreChange(result.score, result.aiCondition);
        
        // Show success toast with more detailed information
        if (result.individualScores && result.individualScores.length > 0) {
          toast.success(`${files.length} photos analyzed successfully`, {
            description: `AI detected ${result.aiCondition?.condition || 'Good'} condition with ${Math.round(result.aiCondition?.confidenceScore || 0)}% confidence.`
          });
        }
      }
    } catch (err) {
      toast.dismiss("photo-processing");
      toast.error('Failed to upload photos. Please try again.', {
        description: 'You can still proceed with your valuation, but it may be less accurate.',
        action: {
          label: 'Try Again',
          onClick: () => handleFileSelection(files)
        }
      });
      console.error('Error uploading photos:', err);
    }
  };
  
  // Function to add more photos
  const handleAddMorePhotos = (files: File[]) => {
    const remainingSlots = MAX_FILES - photos.length;
    if (remainingSlots <= 0) {
      toast.error(`Maximum of ${MAX_FILES} photos reached`);
      return;
    }
    
    // If more files selected than slots available, trim the selection
    const filesToUpload = files.slice(0, remainingSlots);
    if (filesToUpload.length !== files.length) {
      toast.warning(`Only uploading first ${filesToUpload.length} photos due to ${MAX_FILES} photo limit`);
    }
    
    handleFileSelection(filesToUpload);
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
      
      {isLoading && (
        <div className="bg-muted p-4 rounded-md space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Processing your photos...</span>
            <span className="text-xs text-muted-foreground">{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Our AI is analyzing your vehicle photos. This may take a moment.
          </p>
        </div>
      )}
      
      {photos.length === 0 ? (
        <PhotoUploadDropzone 
          onFilesSelect={handleFileSelection}
          isLoading={isLoading}
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
      
      {photos.length < MAX_FILES && photos.length > 0 && !isLoading && (
        <div>
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('additional-photo-input')?.click()}
            className="w-full flex items-center justify-center gap-2"
            type="button"
          >
            <ImagePlus className="h-4 w-4" />
            Add More Photos ({photos.length}/{MAX_FILES})
          </Button>
          <input
            id="additional-photo-input"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) {
                handleAddMorePhotos(Array.from(e.target.files));
                e.target.value = ''; // Reset input
              }
            }}
          />
        </div>
      )}
      
      {validationMessage && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{validationMessage}</AlertDescription>
        </Alert>
      )}
      
      <PhotoUploadError error={error} />
      
      {showTips && <PhotoTips />}
      
      {error && photoScore && (
        <Alert variant="warning" className="bg-amber-50 border-amber-200">
          <AlertTitle className="flex items-center gap-2">
            <InfoIcon className="h-4 w-4" />
            Limited Analysis Mode
          </AlertTitle>
          <AlertDescription>
            We encountered some issues analyzing your photos, but we've still provided a basic assessment.
            For more accurate results, you might want to try uploading clearer photos from multiple angles.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
