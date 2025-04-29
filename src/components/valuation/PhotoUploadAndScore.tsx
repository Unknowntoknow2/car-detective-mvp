
import { PhotoUploadDropzone } from './photo-upload/PhotoUploadDropzone';
import { PhotoPreview } from './photo-upload/PhotoPreview';
import { PhotoUploadError } from './photo-upload/PhotoUploadError';
import { Badge } from '@/components/ui/badge';
import { usePhotoScoring } from '@/hooks/usePhotoScoring';

interface PhotoUploadAndScoreProps {
  valuationId: string;
  onScoreChange?: (score: number) => void;
}

export function PhotoUploadAndScore({ valuationId, onScoreChange }: PhotoUploadAndScoreProps) {
  const {
    uploadPhoto,
    photoUrl,
    thumbnailUrl,
    photoScore,
    isUploading,
    isScoring,
    uploadProgress,
    error,
    resetUpload
  } = usePhotoScoring(valuationId);
  
  const handleFileSelection = async (file: File) => {
    const score = await uploadPhoto(file);
    
    // Call the onScoreChange callback if provided
    if (score && onScoreChange) {
      onScoreChange(score);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Vehicle Photo Analysis</h3>
        <Badge variant="outline" className="bg-primary/10">AI-Powered</Badge>
      </div>
      
      {!photoUrl ? (
        <PhotoUploadDropzone 
          onFileSelect={handleFileSelection}
          isLoading={isUploading || isScoring}
        />
      ) : (
        <PhotoPreview
          photoUrl={photoUrl}
          thumbnailUrl={thumbnailUrl}
          photoScore={photoScore}
          isUploading={isUploading}
          isScoring={isScoring}
          uploadProgress={uploadProgress}
          onRemove={resetUpload}
        />
      )}
      
      <PhotoUploadError error={error} />
      
      <div className="text-xs text-gray-500">
        <p>Upload a clear photo of your vehicle to improve valuation accuracy.</p>
        <p>Our AI will analyze the condition and features to provide a more personalized estimate.</p>
      </div>
    </div>
  );
}
