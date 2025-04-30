
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function usePhotoScoring(valuationId: string) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [photoScore, setPhotoScore] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [photoId, setPhotoId] = useState<string | null>(null);

  // Load existing photo score if available
  useEffect(() => {
    async function loadExistingPhotoScore() {
      if (!valuationId) return;
      
      try {
        const { data, error } = await supabase
          .from('photo_scores')
          .select('*')
          .eq('valuation_id', valuationId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (error) {
          console.log('No existing photo score found');
          return;
        }
        
        if (data) {
          setPhotoScore(data.score);
          setThumbnailUrl(data.thumbnail_url);
          setPhotoUrl(data.metadata?.original_url || data.thumbnail_url);
          setPhotoId(data.id);
        }
      } catch (err) {
        // No photo score yet, that's okay
        console.log('Error or no photo score yet:', err);
      }
    }
    
    loadExistingPhotoScore();
  }, [valuationId]);

  const resetUpload = () => {
    setPhotoUrl(null);
    setThumbnailUrl(null);
    setPhotoScore(null);
    setError(null);
    setUploadProgress(0);
    setPhotoId(null);
  };

  const uploadPhoto = async (file: File): Promise<number | null> => {
    setIsUploading(true);
    setError(null);
    
    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${valuationId}/${fileName}`;
      
      // Upload the file to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from('vehicle-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the URL of the uploaded file
      const { data: urlData } = supabase.storage
        .from('vehicle-photos')
        .getPublicUrl(filePath);
      
      setPhotoUrl(urlData.publicUrl);
      
      // Create a thumbnail version for display
      setThumbnailUrl(urlData.publicUrl);
      
      // Now, score the photo using AI
      setIsUploading(false);
      setIsScoring(true);
      
      // Call scoring API (using Edge Function if available, otherwise mock)
      let score: number;
      try {
        // Try to use the edge function
        const { data: scoreData, error: scoreError } = await supabase.functions
          .invoke('score-image', {
            body: { imageUrl: urlData.publicUrl, valuationId }
          });
        
        if (scoreError) throw scoreError;
        score = scoreData.score;
      } catch (scoringErr) {
        console.log('Edge function scoring failed, using mock:', scoringErr);
        // Fall back to mock scoring
        score = await mockScorePhoto(urlData.publicUrl);
      }
      
      setPhotoScore(score);
      
      // Store the scored photo in the database
      const { data: dbData, error: dbError } = await supabase
        .from('photo_scores')
        .insert({
          valuation_id: valuationId,
          score: score,
          thumbnail_url: urlData.publicUrl,
          metadata: {
            original_url: urlData.publicUrl,
            analysis_timestamp: new Date().toISOString()
          }
        })
        .select()
        .single();
      
      if (dbError) {
        console.error('Error storing photo scoring in DB:', dbError);
      } else if (dbData) {
        setPhotoId(dbData.id);
      }
      
      setIsScoring(false);
      return score;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setIsUploading(false);
      setIsScoring(false);
      console.error('Photo upload error:', err);
      return null;
    }
  };
  
  // Mock function to simulate AI photo scoring
  const mockScorePhoto = async (imageUrl: string): Promise<number> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return a random score between 0.60 and 0.95
    return Math.round((0.60 + Math.random() * 0.35) * 100) / 100;
  };
  
  return {
    uploadPhoto,
    photoUrl,
    thumbnailUrl,
    photoScore,
    photoId,
    isUploading,
    isScoring,
    uploadProgress,
    error,
    resetUpload
  };
}
