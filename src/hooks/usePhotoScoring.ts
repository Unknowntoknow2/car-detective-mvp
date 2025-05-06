
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Photo, PhotoScore, PhotoScoringResult, AICondition } from '@/types/photo';

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const UPLOAD_TIMEOUT = 30000; // 30 seconds
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function usePhotoScoring(valuationId?: string): PhotoScoringResult {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoScore, setPhotoScore] = useState<number | null>(null);
  const [aiCondition, setAICondition] = useState<AICondition | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [individualScores, setIndividualScores] = useState<PhotoScore[]>([]);

  // Reset the uploader state
  const resetUpload = async () => {
    setPhotos([]);
    setPhotoScore(null);
    setAICondition(null);
    setIsUploading(false);
    setIsScoring(false);
    setUploadProgress(0);
    setError(null);
    setIndividualScores([]);
    
    // Delete any previously uploaded photos if valuationId is provided
    if (valuationId) {
      try {
        await supabase
          .from('photo_scores')
          .delete()
          .eq('valuation_id', valuationId);
        
        await supabase
          .from('photo_condition_scores')
          .delete()
          .eq('valuation_id', valuationId);
          
        console.log('Deleted previous photo records for valuation:', valuationId);
      } catch (err) {
        console.error('Error cleaning up previous photos:', err);
        // Don't throw here, we'll continue with the new upload
      }
    }
    
    return Promise.resolve();
  };

  // Upload and score photos
  const uploadPhotos = useCallback(async (files: File[]) => {
    if (!valuationId) {
      setError("No valuation ID provided");
      return null;
    }
    
    if (files.length === 0) {
      setError("No files selected");
      return null;
    }

    try {
      setError(null);
      setIsUploading(true);
      setUploadProgress(0);
      
      // Validate files
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];
      
      for (const file of files) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          invalidFiles.push(`${file.name} (invalid type)`);
          continue;
        }
        
        if (file.size > MAX_UPLOAD_SIZE) {
          invalidFiles.push(`${file.name} (too large, max 5MB)`);
          continue;
        }
        
        validFiles.push(file);
      }
      
      if (invalidFiles.length > 0) {
        toast.warning(`Some files were skipped`, {
          description: invalidFiles.join(', ')
        });
      }
      
      if (validFiles.length === 0) {
        setIsUploading(false);
        setError("No valid files to upload");
        return null;
      }
      
      // Process files
      const uploadedPhotos: Photo[] = [];
      const scoredPhotos: PhotoScore[] = [];
      let totalScore = 0;
      
      // Progress tracking
      const totalSteps = validFiles.length * 2; // Upload + scoring for each file
      let completedSteps = 0;
      
      // Upload each photo and calculate its score
      for (const file of validFiles) {
        try {
          // Create a readable file name
          const fileExt = file.name.split('.').pop();
          const fileName = `${valuationId}-${Date.now()}.${fileExt}`;
          
          // Upload the file
          const { data: photoData, error: uploadError } = await supabase.functions.invoke('score-image', {
            body: { 
              file: await fileToBase64(file),
              fileName,
              valuationId
            }
          });
          
          if (uploadError) throw new Error(uploadError.message);
          
          // Update progress
          completedSteps++;
          setUploadProgress(Math.floor((completedSteps / totalSteps) * 100));
          
          if (!photoData) {
            throw new Error("No data returned from image scoring function");
          }
          
          const { url, score, bestPhoto = false } = photoData;
          
          // Store the uploaded photo
          uploadedPhotos.push({ url, id: fileName });
          
          // Store individual score
          scoredPhotos.push({ 
            url, 
            score: Number(score) || 0,
            isPrimary: bestPhoto 
          });
          
          // Update the total score
          totalScore += Number(score) || 0;
          
          // Update progress again (for scoring step)
          completedSteps++;
          setUploadProgress(Math.floor((completedSteps / totalSteps) * 100));
        } catch (error) {
          console.error("Error processing photo:", error);
          toast.error(`Failed to process photo: ${file.name}`);
        }
      }
      
      // Calculate the average score
      const averageScore = scoredPhotos.length > 0 ? totalScore / scoredPhotos.length : 0;
      
      // Get AI condition assessment
      setIsScoring(true);
      
      try {
        const { data: aiData, error: aiError } = await supabase.functions.invoke('analyze-vehicle-condition', {
          body: { 
            valuationId,
            photoUrls: uploadedPhotos.map(p => p.url),
            individualScores: scoredPhotos
          }
        });
        
        if (aiError) {
          console.error("AI condition analysis error:", aiError);
        } else if (aiData) {
          setAICondition(aiData);
          
          // Save condition data to database
          await supabase.from('photo_condition_scores').upsert({
            valuation_id: valuationId,
            condition_score: aiData.condition ? mapConditionToScore(aiData.condition) : 0,
            confidence_score: aiData.confidenceScore || 0,
            issues: aiData.issuesDetected || [],
            summary: aiData.aiSummary || ''
          });
        }
      } catch (err) {
        console.error("Error analyzing vehicle condition:", err);
      }
      
      // Update state
      setPhotos(uploadedPhotos);
      setPhotoScore(averageScore);
      setIndividualScores(scoredPhotos);
      
      return {
        score: averageScore,
        aiCondition,
        individualScores: scoredPhotos
      };
    } catch (err) {
      console.error("Upload photos error:", err);
      setError(err instanceof Error ? err.message : String(err));
      toast.error("Failed to upload and score photos");
      return null;
    } finally {
      setIsUploading(false);
      setIsScoring(false);
      setUploadProgress(100);
    }
  }, [valuationId, aiCondition]);

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

// Helper function to convert a file to base64
async function fileToBase64(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

// Helper function to map condition string to numeric score
function mapConditionToScore(condition: string | null): number {
  if (!condition) return 0;
  
  switch (condition.toLowerCase()) {
    case 'excellent': return 100;
    case 'good': return 75;
    case 'fair': return 50;
    case 'poor': return 25;
    default: return 0;
  }
}
