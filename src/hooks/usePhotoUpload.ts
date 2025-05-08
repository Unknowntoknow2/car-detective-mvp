
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Photo, PhotoScore } from '@/types/photo';

interface UsePhotoUploadOptions {
  valuationId: string;
  maxPhotos?: number;
}

export function usePhotoUpload({ valuationId, maxPhotos = 6 }: UsePhotoUploadOptions) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileSelect = useCallback((files: File[]) => {
    // Limit number of files that can be added
    const newFiles = files.slice(0, maxPhotos - photos.length);
    
    if (newFiles.length === 0) {
      return;
    }
    
    // Create photo objects from files
    const newPhotos: Photo[] = newFiles.map(file => ({
      id: uuidv4(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploading: false,
      uploaded: false
    }));
    
    setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
  }, [photos.length, maxPhotos]);
  
  const removePhoto = useCallback((photoToRemove: Photo) => {
    setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== photoToRemove.id));
    
    // Revoke object URL to prevent memory leaks
    if (photoToRemove.url && photoToRemove.file) {
      URL.revokeObjectURL(photoToRemove.url);
    }
  }, []);
  
  const uploadPhotos = useCallback(async () => {
    if (photos.length === 0) {
      setError('No photos to upload');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      // Mark all photos as uploading
      setPhotos(prevPhotos => 
        prevPhotos.map(photo => ({ ...photo, uploading: true }))
      );
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mark photos as uploaded
      setPhotos(prevPhotos => 
        prevPhotos.map(photo => ({ 
          ...photo, 
          uploading: false, 
          uploaded: true 
        }))
      );
      
      return true;
    } catch (error) {
      setError('Failed to upload photos');
      console.error('Photo upload error:', error);
      return false;
    } finally {
      setIsUploading(false);
    }
  }, [photos]);
  
  const addExplanation = useCallback((photoId: string, explanation: string) => {
    setPhotos(prevPhotos => 
      prevPhotos.map(photo => 
        photo.id === photoId ? { ...photo, explanation } : photo
      )
    );
  }, []);
  
  const createPhotoScores = useCallback((): PhotoScore[] => {
    return photos.map(photo => ({
      url: photo.url,
      score: Math.random() * 0.4 + 0.6, // Random score between 0.6 and 1.0
      isPrimary: false,
      issues: []
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
