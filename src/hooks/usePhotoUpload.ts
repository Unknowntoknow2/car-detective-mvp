
import { useState, useEffect } from 'react';
import { Photo, PhotoScore, AICondition } from '@/types/photo';
import { uploadAndScorePhotos, deletePhoto } from '@/services/photo/uploadPhotoService';
import { fetchValuationPhotos } from '@/services/photo/fetchPhotos';

export function usePhotoUpload(valuationId: string) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoScores, setPhotoScores] = useState<PhotoScore[]>([]);
  const [bestPhoto, setBestPhoto] = useState<Photo | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [aiCondition, setAiCondition] = useState<AICondition | null>(null);

  const fetchPhotos = async () => {
    if (!valuationId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Use type assertion to handle the type mismatch with fetchValuationPhotos
      const fetchedPhotos = await fetchValuationPhotos(valuationId) as unknown as Photo[];
      
      if (Array.isArray(fetchedPhotos)) {
        setPhotos(fetchedPhotos);
        
        // Fetch scores from Supabase
        const { data: scores, error: scoresError } = await supabase
          .from('photo_scores')
          .select('*')
          .eq('valuation_id', valuationId);
          
        if (!scoresError && scores) {
          const photoScores: PhotoScore[] = scores.map(s => ({
            url: s.thumbnail_url || '',
            score: s.score,
            isPrimary: s.metadata?.isPrimary || false
          }));
          
          setPhotoScores(photoScores);
          
          // Find best photo
          const best = photoScores.find(p => p.isPrimary);
          if (best) {
            const bestPhotoObj = fetchedPhotos.find(p => p.url === best.url);
            if (bestPhotoObj) {
              setBestPhoto(bestPhotoObj);
            }
          }
        }
        
        // Get AI condition assessment if available
        const { data: photoCondition, error: conditionError } = await supabase
          .from('photo_condition_scores')
          .select('*')
          .eq('valuation_id', valuationId)
          .maybeSingle();
          
        if (!conditionError && photoCondition) {
          setAiCondition({
            condition: getConditionFromScore(photoCondition.condition_score),
            confidenceScore: photoCondition.confidence_score,
            issuesDetected: photoCondition.issues || [],
            aiSummary: photoCondition.summary || ''
          });
        }
      }
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError('Failed to load photos');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to map score to condition
  const getConditionFromScore = (score: number): 'Excellent' | 'Good' | 'Fair' | 'Poor' | null => {
    if (score >= 0.85) return 'Excellent';
    if (score >= 0.70) return 'Good';
    if (score >= 0.50) return 'Fair';
    if (score > 0) return 'Poor';
    return null;
  };

  useEffect(() => {
    fetchPhotos();
  }, [valuationId]);

  // Upload new photos
  const uploadPhotos = async (files: File[]) => {
    if (!valuationId) {
      setError('No valuation ID provided');
      return null;
    }
    
    if (files.length === 0) {
      return null;
    }
    
    try {
      setIsUploading(true);
      setProgress(0);
      setError(null);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 300);
      
      // Upload all files
      const result = await uploadAndScorePhotos(valuationId, files);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Update the state with new photos
      await fetchPhotos();
      
      return {
        score: result.bestPhoto?.score || 0,
        individualScores: result.scores
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload photos');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Delete a photo
  const handleDeletePhoto = async (photo: Photo) => {
    if (!photo.id) {
      setError('Cannot delete photo without ID');
      return;
    }
    
    try {
      await deletePhoto(valuationId, photo.id);
      await fetchPhotos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete photo');
    }
  };

  // Reset all state
  const resetUpload = async () => {
    setPhotos([]);
    setPhotoScores([]);
    setBestPhoto(null);
    setIsUploading(false);
    setProgress(0);
    setError(null);
    await fetchPhotos();
  };

  return {
    photos,
    photoScores,
    bestPhoto,
    isUploading,
    isLoading,
    progress,
    error,
    uploadPhotos,
    deletePhoto: handleDeletePhoto,
    resetUpload,
    aiCondition
  };
}
