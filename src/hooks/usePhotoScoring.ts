
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Photo, 
  AICondition, 
  PhotoScoringResult,
  MIN_FILES,
  MAX_FILES,
  PhotoScore 
} from '@/types/photo';
import { 
  fetchValuationPhotos, 
  deletePhotos, 
  uploadAndAnalyzePhotos 
} from '@/services/photoService';

/**
 * Hook for managing vehicle photo uploads and AI-powered condition scoring
 */
export function usePhotoScoring(valuationId: string): PhotoScoringResult {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoScore, setPhotoScore] = useState<number | null>(null);
  const [aiCondition, setAiCondition] = useState<AICondition | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [individualScores, setIndividualScores] = useState<PhotoScore[]>([]);

  // Load existing photos and assessment if available
  useEffect(() => {
    async function loadExistingPhotos() {
      if (!valuationId) return;
      
      const { photos: loadedPhotos, photoScore: score, aiCondition: condition, individualScores: loadedScores } = 
        await fetchValuationPhotos(valuationId);
      
      if (loadedPhotos.length > 0) {
        setPhotos(loadedPhotos);
        setPhotoScore(score);
        setAiCondition(condition);
        if (loadedScores && loadedScores.length > 0) {
          setIndividualScores(loadedScores);
        }
      }
    }
    
    loadExistingPhotos();
  }, [valuationId]);

  /**
   * Resets the photo upload state and deletes all photos
   */
  const resetUpload = async () => {
    if (!photos.length) return;
    
    try {
      await deletePhotos(photos);
    } catch (error) {
      console.error("Error deleting photos:", error);
      toast.error("Failed to delete photos. Please try again.");
    }
    
    setPhotos([]);
    setPhotoScore(null);
    setAiCondition(null);
    setError(null);
    setUploadProgress(0);
    setIndividualScores([]);
  };

  /**
   * Uploads and analyzes photos
   */
  const uploadPhotos = async (files: File[]): Promise<{ 
    score: number, 
    aiCondition?: AICondition, 
    individualScores?: PhotoScore[] 
  } | null> => {
    // Verify minimum number of photos (including existing ones)
    if (files.length + photos.length < MIN_FILES) {
      toast.error(`Please select at least ${MIN_FILES} photos total. You need ${MIN_FILES - photos.length} more.`);
      return null;
    }
    
    // Verify we don't exceed maximum
    if (files.length + photos.length > MAX_FILES) {
      toast.error(`You can only upload up to ${MAX_FILES} photos in total.`);
      return null;
    }
    
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      setUploadProgress(20); // Show upload started
      
      // Process each photo with the analyze-photos edge function
      const result = await uploadAndAnalyzePhotos(valuationId, files);
      
      if (!result) {
        throw new Error("Failed to upload and analyze photos");
      }
      
      setUploadProgress(80);
      
      // Process the results
      const photoUrls = result.photoUrls || [];
      const newPhotos = photoUrls.map((url: string) => ({
        url,
        thumbnail: url
      }));
      
      setPhotos(prev => [...prev, ...newPhotos]);
      
      // Set score and AI condition
      setPhotoScore(result.score);
      
      // Store individual scores for each photo
      if (result.individualScores && result.individualScores.length > 0) {
        setIndividualScores(prev => [...prev, ...result.individualScores]);
      }
      
      // Check if result.aiCondition exists before setting state
      if (result.aiCondition) {
        setAiCondition(result.aiCondition);
      }
      
      setUploadProgress(100);
      
      // Return the score and aiCondition for the callback
      return {
        score: result.score,
        aiCondition: result.aiCondition,
        individualScores: result.individualScores
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Photo upload error:', err);
      return null;
    } finally {
      setIsUploading(false);
      setIsScoring(false);
    }
  };
  
  return {
    uploadPhotos,
    photos,
    photoScore,
    aiCondition,
    isUploading,
    isScoring,
    uploadProgress,
    error,
    resetUpload,
    individualScores
  };
}
