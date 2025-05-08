
import { useState, useCallback } from 'react';
import { Photo, MAX_FILES, PhotoAnalysisResult } from '@/types/photo';

export function usePhotoScoring(initialPhotos: Photo[] = []) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [scoringResult, setScoringResult] = useState<PhotoAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const analyzePhotos = useCallback(async () => {
    if (!photos.length) {
      setError('No photos to analyze');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis result
      const mockResult: PhotoAnalysisResult = {
        overallScore: 0.85,
        individualScores: photos.map(photo => ({
          url: photo.url,
          score: Math.random() * 0.4 + 0.6, // Random score between 0.6 and 1.0
          isPrimary: false
        })),
        aiCondition: {
          condition: 'Good',
          confidenceScore: 85,
          issuesDetected: ['Minor scratches on driver side', 'Small dent on rear bumper']
        }
      };
      
      // Set primary photo
      if (mockResult.individualScores.length > 0) {
        const highestScoreIndex = mockResult.individualScores
          .map((s, i) => ({ index: i, score: s.score }))
          .sort((a, b) => b.score - a.score)[0].index;
          
        mockResult.individualScores[highestScoreIndex].isPrimary = true;
      }
      
      setScoringResult(mockResult);
      return mockResult;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Photo analysis failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [photos]);
  
  return {
    photos,
    setPhotos,
    scoringResult,
    isLoading,
    error,
    analyzePhotos
  };
}
