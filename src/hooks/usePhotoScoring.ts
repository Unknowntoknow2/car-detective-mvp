
import { useState } from 'react';
import { Photo, PhotoAnalysisResult } from '@/types/photo';
import { scorePhotos } from '@/services/photoService';
import { toast } from 'sonner';

export const usePhotoScoring = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PhotoAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addPhotos = (newPhotos: Photo[]) => {
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const updatePhotoStatus = (id: string, uploading: boolean, uploaded: boolean, error?: string) => {
    setPhotos(prevPhotos => 
      prevPhotos.map(photo => 
        photo.id === id 
          ? { ...photo, uploading, uploaded, error } 
          : photo
      )
    );
  };

  const removePhoto = (id: string) => {
    setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== id));
  };

  const markPhotoAsPrimary = (id: string) => {
    setPhotos(prevPhotos => 
      prevPhotos.map(photo => ({
        ...photo,
        isPrimary: photo.id === id
      }))
    );
  };

  const clearPhotos = () => {
    setPhotos([]);
    setAnalysisResult(null);
    setError(null);
  };

  const analyzePhotos = async () => {
    if (!photos.length) {
      setError('No photos to analyze');
      return null;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await scorePhotos(photos);
      
      // Update photos with scores
      setPhotos(prevPhotos => {
        return prevPhotos.map(photo => {
          const scoreData = result.individualScores.find(score => 
            score.url === (photo.url || photo.preview)
          );
          
          if (scoreData) {
            return {
              ...photo,
              score: scoreData.score,
              isPrimary: scoreData.isPrimary
            };
          }
          
          return photo;
        });
      });
      
      setAnalysisResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze photos';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    photos,
    setPhotos,
    addPhotos,
    updatePhotoStatus,
    removePhoto,
    markPhotoAsPrimary,
    clearPhotos,
    analyzePhotos,
    isAnalyzing,
    analysisResult,
    error
  };
};
