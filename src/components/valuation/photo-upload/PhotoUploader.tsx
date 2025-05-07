
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  Upload, 
  X, 
  Image, 
  Loader, 
  Check, 
  Trash2 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useValuationContext } from '@/hooks/useValuationContext';
import { supabase } from '@/integrations/supabase/client';
import { PhotoGrid } from './PhotoGrid';
import { PhotoUploadDropzone } from './PhotoUploadDropzone';
import { PhotoPreview } from './PhotoPreview';
import { usePhotoUpload } from './usePhotoUpload';
import { Photo } from '@/types/photo';

interface PhotoUploaderProps {
  valuationId: string;
  onScoreUpdate?: (score: number, bestPhotoUrl?: string) => void;
  maxPhotos?: number;
  minRequired?: number;
  isPremium?: boolean;
}

export function PhotoUploader({
  valuationId,
  onScoreUpdate,
  maxPhotos = 5,
  minRequired = 3,
  isPremium = false
}: PhotoUploaderProps) {
  const { toast } = useToast();
  const { 
    photos, 
    uploadPhotos, 
    deletePhoto, 
    isUploading, 
    progress, 
    error, 
    photoScores,
    bestPhoto
  } = usePhotoUpload(valuationId);

  // Effect to call the parent onScoreUpdate when scores or best photo changes
  useEffect(() => {
    if (photoScores.length > 0 && onScoreUpdate) {
      // Calculate average score
      const avgScore = photoScores.reduce((sum, photo) => sum + photo.score, 0) / photoScores.length;
      onScoreUpdate(avgScore, bestPhoto?.url);
    }
  }, [photoScores, bestPhoto, onScoreUpdate]);

  const handleFilesSelected = async (files: File[]) => {
    try {
      await uploadPhotos(files);
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Could not upload photos",
        variant: "destructive"
      });
    }
  };

  const handleDeletePhoto = async (photo: Photo) => {
    try {
      await deletePhoto(photo);
      toast({
        title: "Photo deleted",
        description: "The photo has been removed",
      });
    } catch (err) {
      toast({
        title: "Deletion failed",
        description: err instanceof Error ? err.message : "Could not delete photo",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Vehicle Photos</h3>
        </div>
        <Badge variant={isPremium ? "default" : "outline"} className={isPremium ? "bg-gradient-to-r from-primary to-indigo-600" : ""}>
          {isPremium ? "Premium" : "Standard"}
        </Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Upload {minRequired}-{maxPhotos} photos of your vehicle. Our AI will analyze them to assess your vehicle's condition.
        {isPremium && " Premium analysis provides detailed condition reports and value adjustments."}
      </p>

      {/* Show dropzone if under max photos or no photos */}
      {photos.length < maxPhotos && (
        <PhotoUploadDropzone 
          onFilesSelect={handleFilesSelected}
          isLoading={isUploading}
          currentFileCount={photos.length}
          additionalMode={photos.length > 0}
          minRequired={minRequired}
        />
      )}

      {/* Upload progress */}
      {isUploading && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Uploading & Analyzing...</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive rounded-md text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Photo grid with previews */}
      {photos.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">
            Uploaded Photos ({photos.length}/{maxPhotos})
          </h4>
          <PhotoGrid
            photos={photos}
            photoScores={photoScores}
            bestPhotoId={bestPhoto?.id}
            onDelete={handleDeletePhoto}
            isUploading={isUploading}
          />
        </div>
      )}
      
      {/* Tips for better photos */}
      {photos.length > 0 && photos.length < minRequired && (
        <p className="text-xs text-amber-600 mt-4">
          *Adding at least {minRequired} photos is recommended for accurate condition assessment
        </p>
      )}
    </Card>
  );
}
