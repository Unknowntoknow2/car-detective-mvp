
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FormData } from '@/types/premium-valuation';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, Upload, X, Camera, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { MAX_FILES, MIN_FILES, Photo } from '@/types/photo';

interface PhotoUploadStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
  onPhotoUpload?: (photos: File[]) => Promise<void>;
  isProcessing?: boolean;
}

export function PhotoUploadStep({
  step,
  formData,
  setFormData,
  updateValidity,
  onPhotoUpload,
  isProcessing = false
}: PhotoUploadStepProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Always mark this step as valid since photos are optional
  React.useEffect(() => {
    updateValidity(step, true);
  }, [step, updateValidity]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      // Limit to MAX_FILES
      const filesToAdd = acceptedFiles.slice(0, MAX_FILES - photos.length);
      
      if (filesToAdd.length === 0) {
        toast.error(`Maximum ${MAX_FILES} photos allowed`);
        return;
      }

      // Create preview URLs and add to photos array
      const newPhotos = filesToAdd.map((file) => ({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: URL.createObjectURL(file),
        uploading: false,
        uploaded: false
      }));

      const updatedPhotos = [...photos, ...newPhotos];
      setPhotos(updatedPhotos);
      
      // Update formData with new photos
      const photoFiles = updatedPhotos
        .filter(p => p.file)
        .map(p => p.file as File);
        
      setFormData(prev => ({
        ...prev,
        photos: photoFiles
      }));

      // If there are enough photos, trigger AI analysis
      if (photoFiles.length >= MIN_FILES && onPhotoUpload) {
        setUploadProgress(25);
        await onPhotoUpload(photoFiles);
        setUploadProgress(100);
        
        // Update all photos to uploaded status
        setPhotos(prev => 
          prev.map(photo => ({
            ...photo,
            uploading: false,
            uploaded: true
          }))
        );
      }
    },
    [photos, setFormData, onPhotoUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/heic': ['.heic'],
      'image/heif': ['.heif']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: MAX_FILES,
    disabled: photos.length >= MAX_FILES || isProcessing
  });

  const removePhoto = (id: string) => {
    setPhotos(photos.filter(photo => photo.id !== id));
    
    // Update formData.photos
    const updatedPhotos = photos
      .filter(photo => photo.id !== id)
      .filter(p => p.file)
      .map(p => p.file as File);
      
    setFormData(prev => ({
      ...prev,
      photos: updatedPhotos
    }));
  };

  return (
    <Card className="animate-in fade-in duration-500">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-semibold mb-4">Upload Vehicle Photos</h2>
        <p className="text-muted-foreground mb-6">
          Photos help our AI provide a more accurate valuation. Upload at least {MIN_FILES} photo of your vehicle.
        </p>

        <div className="space-y-6">
          {/* Dropzone area */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
            } ${photos.length >= MAX_FILES || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-2">
              {isDragActive ? (
                <>
                  <Upload className="h-10 w-10 text-primary" />
                  <p>Drop your photos here</p>
                </>
              ) : (
                <>
                  <Camera className="h-10 w-10 text-muted-foreground" />
                  <p>Drag & drop photos here, or click to select files</p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG • Up to 10MB • Max {MAX_FILES} photos
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Processing indicator */}
          {isProcessing && (
            <div className="p-4 bg-blue-50 text-blue-700 rounded-md flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <div>
                <p className="font-medium">Analyzing photos with AI...</p>
                <p className="text-sm">We're processing your photos to assess vehicle condition</p>
              </div>
              <Progress value={uploadProgress} className="h-2 ml-auto w-1/4" />
            </div>
          )}

          {/* Photo thumbnails */}
          {photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {photos.map(photo => (
                <div key={photo.id} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-md overflow-hidden border">
                    <img
                      src={photo.preview}
                      alt={photo.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Remove button */}
                  {!isProcessing && (
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-white rounded-full text-gray-700 hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  
                  {/* Upload status */}
                  {photo.uploaded && (
                    <div className="absolute bottom-2 right-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Photo count and help text */}
          <div className="flex justify-between text-sm text-muted-foreground">
            <p>
              {photos.length} of {MAX_FILES} photos added
              {photos.length >= MIN_FILES ? (
                <span className="text-green-600 ml-2">(Minimum met)</span>
              ) : (
                <span className="text-amber-600 ml-2">
                  (Add at least {MIN_FILES - photos.length} more)
                </span>
              )}
            </p>
          </div>
          
          {formData.photoAnalysisResult && (
            <div className="p-4 bg-green-50 text-green-700 rounded-md">
              <h3 className="font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                AI Analysis Complete
              </h3>
              <p className="mt-1 text-sm">
                Condition: <span className="font-medium">{formData.photoAnalysisResult.aiCondition?.condition || 'Good'}</span> •
                Confidence: <span className="font-medium">{formData.photoAnalysisResult.aiCondition?.confidenceScore || 80}%</span>
              </p>
              {formData.photoAnalysisResult.aiCondition?.issuesDetected?.length > 0 && (
                <p className="mt-1 text-sm">
                  Issues detected: {formData.photoAnalysisResult.aiCondition.issuesDetected.join(', ')}
                </p>
              )}
            </div>
          )}
          
          {/* Skip button */}
          {!formData.photoAnalysisResult && !isProcessing && photos.length === 0 && (
            <div className="text-center pt-4">
              <Button variant="outline" type="button" onClick={() => {}}>
                Skip Photo Analysis
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Photos are recommended for accurate valuations, but optional.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
