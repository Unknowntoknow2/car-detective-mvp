
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { PhotoUploadList } from './PhotoUploadList';
import { usePhotoUpload } from '@/hooks/usePhotoUpload';
import { PhotoScore, AICondition } from '@/types/photo';
import { MAX_FILES, MIN_FILES } from '@/types/photo';

interface PhotoUploaderProps {
  valuationId: string;
  onScoreUpdate?: (score: number, bestPhoto?: string) => void;
  isPremium?: boolean;
}

export function PhotoUploader({ 
  valuationId,
  onScoreUpdate,
  isPremium = false
}: PhotoUploaderProps) {
  const [scoringComplete, setScoringComplete] = useState(false);
  
  const { 
    photos, 
    isUploading,
    error,
    handleFileSelect,
    uploadPhotos,
    removePhoto,
    addExplanation,
    createPhotoScores
  } = usePhotoUpload({
    valuationId
  });
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleFileSelect(acceptedFiles);
  }, [handleFileSelect]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: MAX_FILES,
    maxSize: 10 * 1024 * 1024 // 10MB
  });
  
  const handleAnalyzePhotos = async () => {
    await uploadPhotos();
    const photoScores = createPhotoScores();
    
    // Find best photo (highest score)
    let bestScore = 0;
    let bestPhotoUrl = '';
    
    photoScores.forEach(score => {
      if (score.score > bestScore) {
        bestScore = score.score;
        bestPhotoUrl = score.url;
      }
    });
    
    // Call parent's callback with the score
    if (onScoreUpdate) {
      onScoreUpdate(
        photoScores.reduce((sum, item) => sum + item.score, 0) / photoScores.length,
        bestPhotoUrl
      );
    }
    
    setScoringComplete(true);
  };
  
  return (
    <div className="space-y-4">
      {!scoringComplete && (
        <>
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className="h-8 w-8 text-gray-400" />
              <p className="text-sm font-medium">
                Drag & drop your vehicle photos here
              </p>
              <p className="text-xs text-muted-foreground">
                Or click to browse (max {MAX_FILES} photos, 10MB each)
              </p>
            </div>
          </div>
          
          {photos.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <PhotoUploadList photos={photos} onRemove={removePhoto} />
                <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={handleAnalyzePhotos}
                    disabled={isUploading || photos.length < MIN_FILES}
                  >
                    {isUploading ? 'Uploading...' : 'Analyze Photos'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}
        </>
      )}
      
      {scoringComplete && (
        <Card className="bg-slate-50 border border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <ImageIcon className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium text-green-700">
                Photo analysis complete! {isPremium ? 'Premium condition assessment included.' : ''}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
