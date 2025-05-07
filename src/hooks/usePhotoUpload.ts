
import { useState, useCallback } from 'react';
import { Photo, PhotoScore } from '@/types/photo';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

export interface UsePhotoUploadOptions {
  valuationId: string;
}

export function usePhotoUpload({ valuationId }: UsePhotoUploadOptions) {
  const [photos, setPhotos] = useState<Photo[]>([]);
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
      url: URL.createObjectURL(file),
      uploaded: false,
      uploading: false
    }));
    
    setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
    return newPhotos;
  }, []);
  
  // Remove a photo
  const removePhoto = useCallback((photoId: string) => {
    setPhotos(prevPhotos => {
      // Revoke the URL to avoid memory leaks
      const photoToRemove = prevPhotos.find(p => p.id === photoId);
      if (photoToRemove?.url) {
        URL.revokeObjectURL(photoToRemove.url);
      }
      return prevPhotos.filter(photo => photo.id !== photoId);
    });
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
  const uploadPhotos = useCallback(async () => {
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
      
      // Simulate upload for now - in a real app, this would be a real upload
      // This is just placeholder code for the demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mark all as uploaded
      setPhotos(prevPhotos => 
        prevPhotos.map(photo => ({ ...photo, uploading: false, uploaded: true }))
      );
      
      return photos;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload photos';
      setError(errorMessage);
      
      // Mark failed uploads
      setPhotos(prevPhotos => 
        prevPhotos.map(photo => 
          photo.uploading ? { ...photo, uploading: false, error: errorMessage } : photo
        )
      );
      
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [photos]);
  
  // Create photo scores from current state
  const createPhotoScores = useCallback((): PhotoScore[] => {
    return photos
      .filter(photo => photo.uploaded && photo.url)
      .map(photo => ({
        url: photo.url!,
        score: Math.random() * 100, // Simulate scores for demo
        isPrimary: false,
        explanation: photo.explanation
      }));
  }, [photos]);
  
  return {
    photos,
    isUploading,
    error,
    handleFileSelect,
    uploadPhotos,
    removePhoto,
    addExplanation,
    createPhotoScores
  };
}
