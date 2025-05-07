
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
    
    setPhotos(prev => [...prev, ...newPhotos]);
  }, []);

  const removePhoto = useCallback((id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  }, []);

  const uploadAndAnalyzePhotos = useCallback(async () => {
    if (photos.length === 0) {
      setError('No photos to upload');
      return;
    }

    try {
      setIsUploading(true);
      setError('');
      
      // Upload photos
      const uploadedPhotos = await uploadPhotos(photos, valuationId);
      setPhotos(uploadedPhotos);
      
      // Get URLs of uploaded photos
      const photoUrls = uploadedPhotos
        .filter(p => p.uploaded && p.url)
        .map(p => p.url);
      
      if (photoUrls.length === 0) {
        throw new Error('No photos were successfully uploaded');
      }
      
      // Analyze photos
      const analysisResult = await analyzePhotos(photoUrls, valuationId);
      
      // Update state with results
      setPhotoScores(analysisResult.individualScores);
      setAICondition(analysisResult.aiCondition || null);
      
      return analysisResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during photo upload/analysis';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [photos, valuationId]);

  const createPhotoScores = useCallback(() => {
    return photoScores;
  }, [photoScores]);

  const addExplanation = useCallback((photoId: string, explanation: string) => {
    setPhotos(prev => 
      prev.map(photo => 
        photo.id === photoId 
          ? { ...photo, explanation } 
          : photo
      )
    );
  }, []);

  return {
    photos,
    isUploading,
    error,
    handleFileSelect,
    uploadPhotos: uploadAndAnalyzePhotos,
    removePhoto,
    addExplanation,
    createPhotoScores,
    aiCondition
  };
}
