
import { useState } from 'react';
import { analyzePhotos } from '@/services/photo/analyzePhotos';
import { Photo, PhotoAnalysisResult, PhotoScore } from '@/types/photo';

interface UsePhotoScoringOptions {
  onSuccess?: (result: PhotoAnalysisResult) => void;
  onError?: (error: Error) => void;
}

export const usePhotoScoring = (options: UsePhotoScoringOptions = {}) => {
  const [result, setResult] = useState<PhotoAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const scorePhotos = async (photos: Photo[], valuationId: string): Promise<PhotoAnalysisResult | null> => {
    if (!photos.length) {
      const err = new Error('No photos provided');
      setError(err);
      options.onError?.(err);
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get photo URLs from photos
      const photoUrls = photos
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
  const preparePhotosForScoring = (photos: Photo[]): { photoUrls: string[] } => {
    // Extract URLs from photos, fallback to preview for local files
    const photoUrls = photos.map(photo => photo.url || photo.preview || '').filter(Boolean);
    
    return { photoUrls };
  };

  return {
    result,
    isLoading,
    error,
    scorePhotos,
    getBestPhoto,
    getAverageScore,
    markAsPrimary,
    preparePhotosForScoring
  };
};

export default usePhotoScoring;
