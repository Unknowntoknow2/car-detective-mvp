
import { useState } from 'react';
import { Photo, PhotoAnalysisResult, PhotoScore } from '@/types/photo';
import * as photoScoringService from '@/services/photoScoringService';

export interface UsePhotoScoringResult {
  result: PhotoAnalysisResult | null;
  isLoading: boolean;
  error: Error | null;
  scorePhotos: (photos: Photo[], valuationId: string) => Promise<PhotoAnalysisResult | null>;
  getBestPhoto: () => PhotoScore | null;
  getAverageScore: () => number;
  markAsPrimary: (url: string) => void;
  preparePhotosForScoring: (photos: Photo[]) => Photo[];
}

export function usePhotoScoring(): UsePhotoScoringResult {
  const [result, setResult] = useState<PhotoAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const clearResult = () => {
    setResult(null);
  };

  const scorePhotos = async (
    photos: Photo[],
    valuationId: string
  ): Promise<PhotoAnalysisResult | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // Extract URLs from photos
      const photoUrls = photos.map(photo => photo.url || photo.preview || '').filter(Boolean);

      if (photoUrls.length === 0) {
        throw new Error('No photo URLs available for scoring');
      }

      // Use the photoScoringService to score the photos
      const scoringResult = await photoScoringService.scorePhotos(photoUrls, valuationId);
      
      // Convert the result to PhotoAnalysisResult format
      const analysisResult = photoScoringService.convertToPhotoAnalysisResult(scoringResult);
      
      setResult(analysisResult);
      return analysisResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred during photo scoring');
      setError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const markAsPrimary = (url: string) => {
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

  const getBestPhoto = (): PhotoScore | null => {
    if (!result || !result.individualScores || result.individualScores.length === 0) return null;
    return result.individualScores.find(s => s.isPrimary) || result.individualScores[0];
  };

  const getAverageScore = (): number => {
    if (!result || !result.individualScores || result.individualScores.length === 0) return 0;
    const sum = result.individualScores.reduce((acc, score) => acc + score.score, 0);
    return Math.round(sum / result.individualScores.length);
  };

  const preparePhotosForScoring = (photos: Photo[]): Photo[] => {
    return photos.filter(p => p.preview || p.url);
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
}
