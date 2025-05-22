
import { useState } from 'react';
import { analyzePhotos } from '@/services/photo/analyzePhotos';
import { Photo, PhotoAnalysisResult, PhotoScore } from '@/types/photo';

interface UsePhotoScoringOptions {
  onSuccess?: (result: PhotoAnalysisResult) => void;
  onError?: (error: Error) => void;
}

export const usePhotoScoring = (options: UsePhotoScoringOptions = {}) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [result, setResult] = useState<PhotoAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // For compatibility with existing code
  const analysisResult = result;
  const photoScores = result?.individualScores || [];

  const addPhotos = (newPhotos: Photo[]) => {
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const clearPhotos = () => {
    setPhotos([]);
    setResult(null);
  };

  const handleFileSelect = (files: File[]) => {
    const newPhotos = files.map(file => ({
      id: Math.random().toString(36).substring(2, 15),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: URL.createObjectURL(file),
      uploading: false,
      uploaded: false
    }));

    addPhotos(newPhotos);
  };

  const uploadPhoto = async (file: File): Promise<Photo> => {
    setIsUploading(true);
    try {
      // Create a new photo object
      const newPhoto: Photo = {
        id: Math.random().toString(36).substring(2, 15),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: URL.createObjectURL(file),
        uploading: true,
        uploaded: false
      };
      
      addPhotos([newPhoto]);
      
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update photo status after "upload"
      const updatedPhotos = photos.map(p => 
        p.id === newPhoto.id 
          ? { ...p, uploading: false, uploaded: true, url: p.preview } 
          : p
      );
      
      setPhotos(updatedPhotos);
      
      // Return the updated photo
      return {
        ...newPhoto,
        uploading: false,
        uploaded: true,
        url: newPhoto.preview
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to upload photo');
      setError(error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const analyzePhotos = async (valuationId?: string): Promise<PhotoAnalysisResult | null> => {
    if (!photos.length) {
      const err = new Error('No photos to analyze');
      setError(err);
      options.onError?.(err);
      return null;
    }

    try {
      setIsAnalyzing(true);
      setError(null);

      // Get photo URLs from photos
      const photoUrls = photos
        .filter(photo => photo.url || photo.preview)
        .map(photo => photo.url || photo.preview as string);

      if (!photoUrls.length) {
        throw new Error('No valid photo URLs found');
      }

      // Call the photo analysis service
      const analysisResult = await scorePhotos(photos, valuationId || 'test-id');
      setResult(analysisResult);
      options.onSuccess?.(analysisResult);
      
      return analysisResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to analyze photos');
      setError(error);
      options.onError?.(error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const scorePhotos = async (photosToScore: Photo[], valuationId: string): Promise<PhotoAnalysisResult | null> => {
    if (!photosToScore.length) {
      const err = new Error('No photos provided');
      setError(err);
      options.onError?.(err);
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get photo URLs from photos
      const photoUrls = photosToScore
        .filter(photo => photo.url) // Filter out photos without URLs
        .map(photo => photo.url as string); // We've filtered out undefined values

      if (!photoUrls.length) {
        throw new Error('No valid photo URLs found');
      }

      // Call the photo analysis service
      const result = await analyzePhotos(photoUrls, valuationId);
      setResult(result);
      options.onSuccess?.(result);
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to score photos');
      setError(error);
      options.onError?.(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Select the best photo based on score
  const getBestPhoto = (): PhotoScore | null => {
    if (!result || !result.individualScores.length) return null;

    const sorted = [...result.individualScores].sort((a, b) => b.score - a.score);
    return sorted[0];
  };

  // Calculate average score
  const getAverageScore = (): number => {
    if (!result || !result.individualScores.length) return 0;
    
    const sum = result.individualScores.reduce((total, item) => total + item.score, 0);
    return sum / result.individualScores.length;
  };

  // Mark a photo as primary
  const markAsPrimary = (url: string): void => {
    if (!result) return;

    const updatedScores = result.individualScores.map(score => ({
      ...score,
      isPrimary: score.url === url
    }));

    setResult({
      ...result,
      individualScores: updatedScores
    });
  };

  // Transform Photos to format expected by backend
  const preparePhotosForScoring = (photosToPrep: Photo[]): { photoUrls: string[] } => {
    // Extract URLs from photos, fallback to preview for local files
    const photoUrls = photosToPrep.map(photo => photo.url || photo.preview || '').filter(Boolean);
    
    return { photoUrls };
  };

  return {
    photos,
    result,
    isLoading,
    isAnalyzing,
    isUploading,
    error,
    analysisResult,
    photoScores,
    addPhotos,
    clearPhotos,
    handleFileSelect,
    uploadPhoto,
    analyzePhotos,
    scorePhotos,
    getBestPhoto,
    getAverageScore,
    markAsPrimary,
    preparePhotosForScoring
  };
};

export default usePhotoScoring;
