
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { analyzePhotos } from '@/services/photo/analyzePhotos';
import { uploadPhotos } from '@/services/photo/uploadPhotoService';
import { Photo, PhotoScore, AICondition, PhotoScoringResult } from '@/types/photo';

export interface UsePhotoScoringOptions {
  valuationId: string;
}

export function usePhotoScoring({ valuationId }: UsePhotoScoringOptions) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoScores, setPhotoScores] = useState<PhotoScore[]>([]);
  const [aiCondition, setAICondition] = useState<AICondition | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = useCallback((files: File[]) => {
    const newPhotos: Photo[] = Array.from(files).map(file => ({
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
  }, []);

  const handleUpload = useCallback(async () => {
    if (photos.length === 0) return;
    
    setIsUploading(true);
    setError('');
    
    try {
      const photosToUpload = photos.filter(photo => !photo.uploaded && photo.file);
      
      if (photosToUpload.length === 0) {
        setIsUploading(false);
        return;
      }
      
      // Upload photos and get URLs
      const uploadedPhotos = await uploadPhotos(photosToUpload, valuationId);
      
      // Update photos state with uploaded status
      setPhotos(prevPhotos => 
        prevPhotos.map(photo => {
          const uploaded = uploadedPhotos.find(up => up.id === photo.id);
          if (uploaded) {
            return { ...photo, ...uploaded };
          }
          return photo;
        })
      );
      
      // Get photo URLs for analysis
      const photoUrls = uploadedPhotos
        .filter(photo => photo.uploaded && photo.url)
        .map(photo => photo.url);
      
      if (photoUrls.length === 0) {
        throw new Error('No photos were successfully uploaded');
      }
      
      // Analyze photos
      const result = await analyzePhotos(photoUrls, valuationId);
      
      // Update states with results
      setPhotoScores(result.individualScores);
      setAICondition(result.aiCondition || null);
      
    } catch (err: any) {
      setError(err.message || 'Failed to upload or analyze photos');
      console.error('Photo upload/analysis error:', err);
    } finally {
      setIsUploading(false);
    }
  }, [photos, valuationId]);

  const removePhoto = useCallback((id: string) => {
    setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== id));
  }, []);

  return {
    photos,
    photoScores,
    aiCondition,
    isUploading,
    error,
    handleFileSelect,
    handleUpload,
    removePhoto
  };
}
