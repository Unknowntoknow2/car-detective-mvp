
import { useState, useCallback } from 'react';
import { Photo, PhotoScore, PhotoScoringResult } from '@/types/photo';
import { analyzePhotos } from '@/services/photo/analyzePhotos';
import { uploadPhotos } from '@/services/photo/uploadPhotoService';
import { v4 as uuidv4 } from 'uuid';

export interface UsePhotoScoringOptions {
  valuationId: string;
}

export function usePhotoScoring({ valuationId }: UsePhotoScoringOptions) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoScores, setPhotoScores] = useState<PhotoScore[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  
  // Handle file selection
  const handleFileSelect = useCallback((files: File[] | FileList) => {
    const fileArray = Array.from(files);
    const newPhotos: Photo[] = fileArray.map(file => ({
      id: uuidv4(),
      name: file.name,
      size: file.size,
      type: file.type,
      file,
      uploaded: false,
      uploading: false
    }));
    
    setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
    return newPhotos;
  }, []);
  
  // Remove a photo
  const removePhoto = useCallback((photoId: string) => {
    setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== photoId));
  }, []);
  
  // Add explanation to a photo
  const addExplanation = useCallback((photoId: string, explanation: string) => {
    setPhotos(prevPhotos => 
      prevPhotos.map(photo => 
        photo.id === photoId ? { ...photo, explanation } : photo
      )
    );
  }, []);
  
  // Upload photos to storage
  const uploadPhotosHandler = useCallback(async () => {
    if (!photos.length) {
      setError('No photos to upload');
      return [];
    }
    
    setIsUploading(true);
    setError('');
    
    try {
      // Mark all photos as uploading
      setPhotos(prevPhotos => 
        prevPhotos.map(photo => ({ ...photo, uploading: true, error: undefined }))
      );
      
      // Upload all photos
      const uploadedPhotos = await uploadPhotos(photos, valuationId);
      setPhotos(uploadedPhotos);
      
      // Check if any uploads failed
      const failedUploads = uploadedPhotos.filter(photo => !!photo.error);
      if (failedUploads.length > 0) {
        throw new Error(`Failed to upload ${failedUploads.length} photos`);
      }
      
      // Get URLs of successfully uploaded photos
      const photoUrls = uploadedPhotos
        .filter(photo => photo.url && photo.uploaded)
        .map(photo => photo.url!);
      
      // Analyze photos
      const results = await analyzePhotos(photoUrls, valuationId);
      setPhotoScores(results.individualScores);
      
      return uploadedPhotos;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process photos';
      setError(errorMessage);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [photos, valuationId]);
  
  // Create photo scores from current state
  const createPhotoScores = useCallback(() => {
    return photoScores;
  }, [photoScores]);
  
  return {
    photos,
    isUploading,
    error,
    handleFileSelect,
    uploadPhotos: uploadPhotosHandler,
    removePhoto,
    addExplanation,
    createPhotoScores
  };
}
