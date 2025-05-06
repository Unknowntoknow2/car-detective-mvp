
import { useState, useCallback, useEffect } from 'react';
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
  uploadAndAnalyzePhotos,
} from '@/services/photoService';
import { errorHandler } from '@/utils/error-handling';

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
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;

  // Load existing photos and assessment if available
  useEffect(() => {
    async function loadExistingPhotos() {
      if (!valuationId) return;
      
      try {
        setIsLoading(true);
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
      } catch (err) {
        console.error("Error loading photos:", err);
        // Don't show error toast for initial load failures to avoid disrupting the flow
        setError("Unable to load existing photos. You can try uploading new ones.");
      } finally {
        setIsLoading(false);
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
    setRetryCount(0);
  };

  /**
   * Fallback scoring when AI analysis fails
   * Provides a basic score based on photo count and quality heuristics
   */
  const fallbackScoring = (photoUrls: string[]): { score: number; aiCondition: AICondition } => {
    // Simple heuristic: more photos = better score, up to a point
    const photoCountFactor = Math.min(photoUrls.length / MAX_FILES, 1);
    const fallbackScore = 0.5 + (photoCountFactor * 0.2); // Base 0.5, up to 0.7
    
    // Default condition assessment with low confidence
    const fallbackCondition: AICondition = {
      condition: 'Good', // Default to 'Good' as a safe middle ground
      confidenceScore: 40, // Low confidence since this is a fallback
      issuesDetected: [],
      aiSummary: 'Unable to fully analyze vehicle condition from the provided photos. This is an estimated assessment only.'
    };
    
    toast.info("AI analysis limited. Using basic photo assessment.", {
      description: "For better results, try uploading clearer photos from multiple angles."
    });
    
    return { score: fallbackScore, aiCondition: fallbackCondition };
  };

  /**
   * Uploads and analyzes photos with retry logic and fallback mechanism
   */
  const uploadPhotos = useCallback(async (files: File[]): Promise<{ 
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
    
    const toastId = toast.loading("Uploading and analyzing your vehicle photos...", {
      duration: 10000 // Longer duration since this operation can take time
    });
    
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
      
      // Store individual scores for each photo
      if (result.individualScores && result.individualScores.length > 0) {
        setIndividualScores(prev => [...prev, ...result.individualScores]);
      }
      
      // Set score and AI condition 
      if (result.score && result.score > 0) {
        setPhotoScore(result.score);
        
        // Check if result.aiCondition exists before setting state
        if (result.aiCondition) {
          setAiCondition(result.aiCondition);
        } else {
          // If photos uploaded but no AI condition returned, use fallback
          const fallback = fallbackScoring(photoUrls);
          setPhotoScore(fallback.score);
          setAiCondition(fallback.aiCondition);
          result.score = fallback.score;
          result.aiCondition = fallback.aiCondition;
        }
      } else {
        // If no score provided, use fallback scoring
        const fallback = fallbackScoring(photoUrls);
        setPhotoScore(fallback.score);
        setAiCondition(fallback.aiCondition);
        result.score = fallback.score;
        result.aiCondition = fallback.aiCondition;
      }
      
      setUploadProgress(100);
      toast.dismiss(toastId);
      toast.success(`${files.length} photos processed successfully`);
      
      // Return the score and aiCondition for the callback
      return {
        score: result.score,
        aiCondition: result.aiCondition,
        individualScores: result.individualScores
      };
    } catch (err) {
      toast.dismiss(toastId);
      
      // Implement retry logic
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        toast.info("Retrying photo analysis...", {
          description: `Attempt ${retryCount + 1} of ${MAX_RETRIES + 1}`
        });
        
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        return uploadPhotos(files);
      }
      
      // If all retries failed, use fallback scoring for the photos that were uploaded
      const fallbackUrls = files.map(file => URL.createObjectURL(file));
      const fallback = fallbackScoring(fallbackUrls);
      
      // Still save the uploads even if analysis failed
      setPhotos(prev => [
        ...prev, 
        ...files.map((file, idx) => ({
          url: fallbackUrls[idx],
          thumbnail: fallbackUrls[idx]
        }))
      ]);
      
      setPhotoScore(fallback.score);
      setAiCondition(fallback.aiCondition);
      
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      // Log the error for further analysis
      errorHandler.handle(err, 'Photo analysis');
      
      return {
        score: fallback.score,
        aiCondition: fallback.aiCondition,
        individualScores: []
      };
    } finally {
      setIsUploading(false);
      setIsScoring(false);
      setRetryCount(0);
    }
  }, [valuationId, photos, retryCount]);

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
    individualScores,
    isLoading: isUploading || isScoring
  };
}
