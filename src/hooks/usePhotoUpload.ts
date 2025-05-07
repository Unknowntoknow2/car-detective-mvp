
import { useState, useCallback } from 'react';
import { Photo, PhotoScore, MAX_FILES } from '@/types/photo';
import { generateUniqueId } from '@/utils/helpers';
import { uploadPhotos as uploadPhotosService } from '@/services/photo/uploadPhotoService';

export interface UsePhotoUploadOptions {
  valuationId: string;
}

export function usePhotoUpload({ valuationId }: UsePhotoUploadOptions) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  
  const handleFileSelect = useCallback((files: File[] | FileList) => {
    const fileArray = Array.from(files);
    
    // Check if adding these files would exceed the max
    if (photos.length + fileArray.length > MAX_FILES) {
      setError(`You can only upload a maximum of ${MAX_FILES} photos`);
      return [];
    }
    
    // Create Photo objects
    const newPhotos: Photo[] = fileArray.map(file => ({
      id: generateUniqueId(),
      url: URL.createObjectURL(file),
      metadata: {
        file,
        filename: file.name,
        size: file.size,
        type: file.type
      }
    }));
    
    setPhotos(prev => [...prev, ...newPhotos]);
    setError('');
    return newPhotos;
  }, [photos]);
  
  const removePhoto = useCallback((photoId: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  }, []);
  
  const addExplanation = useCallback((photoId: string, explanation: string) => {
    setPhotos(prev => 
      prev.map(photo => 
        photo.id === photoId ? { ...photo, explanation } : photo
      )
    );
  }, []);
  
  const uploadPhotos = useCallback(async () => {
    try {
      setIsUploading(true);
      setError('');
      
      // Get files from photo metadata
      const files = photos
        .map(photo => photo.metadata?.file as File)
        .filter(Boolean);
      
      if (files.length === 0) {
        throw new Error('No files to upload');
      }
      
      // Upload photos (in a real app, this would upload to a storage service)
      const uploadedPhotos = await uploadPhotosService(files);
      
      // Update local state with uploaded photos
      setPhotos(prev => 
        prev.map((photo, index) => ({
          ...photo,
          ...uploadedPhotos[index],
          uploaded: true
        }))
      );
      
      return uploadedPhotos;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload photos';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [photos]);
  
  const createPhotoScores = useCallback((): PhotoScore[] => {
    return photos.map(photo => {
      // Generate a random score between 0.6 and 0.9
      const score = Math.random() * 0.3 + 0.6;
      
      return {
        url: photo.url,
        score,
        explanation: photo.explanation || getRandomExplanation(score)
      };
    });
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

// Helper function for demo purposes
function getRandomExplanation(score: number): string {
  if (score > 0.85) {
    return "This photo shows the vehicle in excellent condition with no visible damage.";
  } else if (score > 0.7) {
    return "The vehicle appears to be in good condition with minor signs of wear.";
  } else if (score > 0.5) {
    return "This image shows some moderate wear and potential issues that may need attention.";
  } else {
    return "This photo indicates significant damage or wear that will impact the vehicle's value.";
  }
}
