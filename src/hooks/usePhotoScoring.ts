
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Photo {
  url: string;
  thumbnail?: string;
  id?: string;
}

interface AICondition {
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
}

// Interface for custom Supabase tables not in the generated types
interface ValuationPhoto {
  id: string;
  valuation_id: string;
  photo_url: string;
  score: number;
  uploaded_at: string;
}

export function usePhotoScoring(valuationId: string) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoScore, setPhotoScore] = useState<number | null>(null);
  const [aiCondition, setAiCondition] = useState<AICondition | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Load existing photos and assessment if available
  useEffect(() => {
    async function loadExistingPhotos() {
      if (!valuationId) return;
      
      try {
        // Get existing photos
        // Use 'any' type assertion for Supabase queries to tables not in generated types
        const { data: photoData, error: photoError } = await supabase
          .from('valuation_photos')
          .select('*')
          .eq('valuation_id', valuationId);
        
        if (photoError) {
          console.log('Error loading photos:', photoError);
          return;
        }
        
        if (photoData && photoData.length > 0) {
          const loadedPhotos = photoData.map((photo: ValuationPhoto) => ({
            url: photo.photo_url,
            thumbnail: photo.photo_url,
            id: photo.id
          }));
          
          setPhotos(loadedPhotos);
          
          // If we have photos, check for AI assessment
          const { data: aiData, error: aiError } = await supabase
            .from('photo_scores')
            .select('*')
            .eq('valuation_id', valuationId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          
          if (!aiError && aiData) {
            setPhotoScore(aiData.score * 100); // Convert from 0-1 to 0-100
            
            // Extract AI condition analysis from metadata
            if (aiData.metadata) {
              const metadata = aiData.metadata as any;
              if (metadata.condition) {
                setAiCondition({
                  condition: metadata.condition,
                  confidenceScore: metadata.confidenceScore || 70,
                  issuesDetected: metadata.issuesDetected || [],
                  aiSummary: metadata.aiSummary
                });
              }
            }
          }
        }
      } catch (err) {
        console.log('Error loading existing photo data:', err);
      }
    }
    
    loadExistingPhotos();
  }, [valuationId]);

  const resetUpload = async () => {
    // Delete photos from storage
    for (const photo of photos) {
      if (photo.id) {
        try {
          await supabase
            .from('valuation_photos')
            .delete()
            .eq('id', photo.id);
        } catch (err) {
          console.error('Error deleting photo record:', err);
        }
      }
    }
    
    setPhotos([]);
    setPhotoScore(null);
    setAiCondition(null);
    setError(null);
    setUploadProgress(0);
  };

  const uploadPhotos = async (files: File[]): Promise<{ score: number, aiCondition?: AICondition } | null> => {
    // Verify minimum number of photos (including existing ones)
    if (files.length + photos.length < MIN_FILES) {
      toast.error(`Please select at least ${MIN_FILES} photos total. You need ${MIN_FILES - photos.length} more.`);
      return null;
    }
    
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      // Create form data to send to the edge function
      const formData = new FormData();
      formData.append('valuationId', valuationId);
      
      // Add files to formData
      files.forEach((file, index) => {
        formData.append(`photos[${index}]`, file);
      });
      
      setUploadProgress(20); // Show upload started
      
      // Call the analyze-photos edge function with FormData
      const { data, error: uploadError } = await supabase.functions
        .invoke('analyze-photos', {
          body: formData,
        });
      
      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }
      
      setUploadProgress(80);
      
      // Process the results
      const photoUrls = data.photoUrls || [];
      const newPhotos = photoUrls.map((url: string) => ({
        url,
        thumbnail: url
      }));
      
      setPhotos(prev => [...prev, ...newPhotos]);
      
      // Set AI condition data
      const condition = data.condition;
      const confidenceScore = data.confidenceScore;
      const issuesDetected = data.issuesDetected;
      const aiSummary = data.aiSummary;
      
      setPhotoScore(confidenceScore);
      setAiCondition({
        condition,
        confidenceScore,
        issuesDetected,
        aiSummary
      });
      
      setUploadProgress(100);
      
      return {
        score: confidenceScore,
        aiCondition: {
          condition,
          confidenceScore,
          issuesDetected,
          aiSummary
        }
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
    resetUpload
  };
}
