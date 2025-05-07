
import { useState, useCallback } from 'react';
import { Photo, PhotoScore, PhotoScoringResult, AICondition } from '@/types/photo';
import { analyzePhotos } from '@/services/photo/analyzePhotos';
import { uploadPhotos } from '@/services/photo/uploadPhotoService';
import { generateUniqueId } from '@/utils/helpers';

export interface UsePhotoScoringOptions {
  valuationId?: string;
  onScoreChange?: (score: number) => void;
}

export function usePhotoScoring(options: UsePhotoScoringOptions = {}) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [photoScores, setPhotoScores] = useState<PhotoScore[]>([]);
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [bestPhoto, setBestPhoto] = useState<Photo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiCondition, setAiCondition] = useState<AICondition | null>(null);
  
  // Reset everything
  const reset = useCallback(() => {
    setPhotos([]);
    setPhotoScores([]);
    setOverallScore(null);
    setBestPhoto(null);
    setError(null);
    setAiCondition(null);
  }, []);
  
  // Handle file selection
  const handleFileSelect = useCallback((acceptedFiles: File[]) => {
    // Create photo objects with local URLs
    const newPhotos = acceptedFiles.map(file => ({
      id: generateUniqueId(),
      url: URL.createObjectURL(file),
      metadata: { file },
      uploading: false,
      uploaded: false
    }));
    
    setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
    return newPhotos;
  }, []);
  
  // Upload photos
  const uploadPhotoFiles = useCallback(async () => {
    if (photos.length === 0) {
      setError('No photos to upload');
      throw new Error('No photos to upload');
    }
    
    try {
      setIsUploading(true);
      setError(null);
      
      // Extract files from photo metadata
      const files = photos
        .map(photo => photo.metadata?.file as File)
        .filter(Boolean);
      
      // Mark photos as uploading
      setPhotos(prevPhotos => 
        prevPhotos.map(photo => ({ ...photo, uploading: true }))
      );
      
      // Upload files
      const uploadedPhotos = await uploadPhotos(files);
      
      // Update photos with uploaded status
      setPhotos(prevPhotos => 
        prevPhotos.map((photo, index) => ({
          ...photo,
          uploading: false,
          uploaded: true,
          url: uploadedPhotos[index]?.url || photo.url
        }))
      );
      
      return photos;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload photos');
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [photos]);
  
  // Analyze the photos to get scores
  const scorePhotos = useCallback(async () => {
    if (photos.length === 0) {
      setError('No photos to analyze');
      throw new Error('No photos to analyze');
    }
    
    try {
      setIsAnalyzing(true);
      setError(null);
      
      // Call the API to analyze photos
      const result = await analyzePhotos(photos);
      
      // Store the results
      setPhotoScores(result.individualScores);
      setOverallScore(result.score);
      setAiCondition(result.aiCondition);
      
      // Find the best photo (highest score)
      const bestScore = result.individualScores.reduce((max, item) => 
        item.score > max.score ? item : max
      , { url: '', score: 0, isPrimary: false });
      
      // Find the corresponding photo
      const best = photos.find(p => p.url === bestScore.url) || null;
      setBestPhoto(best);
      
      // Call the callback if provided
      if (options.onScoreChange) {
        options.onScoreChange(result.score);
      }
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze photos');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, [photos, options.onScoreChange]);
  
  // Handle both uploading and scoring in one function
  const processPhotos = useCallback(async () => {
    try {
      await uploadPhotoFiles();
      return await scorePhotos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process photos');
      throw err;
    }
  }, [uploadPhotoFiles, scorePhotos]);
  
  // Create a result object
  const result: PhotoScoringResult = {
    overallScore: overallScore || 0,
    individualScores: photoScores,
    aiCondition,
    // Add these properties to match what's used in tests
    error: error || undefined,
    photos,
    photoScore: overallScore || undefined,
    uploadPhotos: async (files: File[]) => {
      handleFileSelect(files);
      return uploadPhotoFiles();
    }
  };
  
  return {
    ...result,
    reset,
    isUploading,
    isAnalyzing,
    isLoading: isUploading || isAnalyzing,
    bestPhoto,
    handleFileSelect,
    uploadPhotos: uploadPhotoFiles,
    scorePhotos,
    processPhotos
  };
}
