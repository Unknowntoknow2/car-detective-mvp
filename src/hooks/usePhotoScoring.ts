
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export function usePhotoScoring(valuationId: string) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [photoScore, setPhotoScore] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const resetUpload = useCallback(() => {
    setPhotoUrl(null);
    setThumbnailUrl(null);
    setPhotoScore(null);
    setIsUploading(false);
    setIsScoring(false);
    setUploadProgress(0);
    setError(null);
  }, []);

  const uploadPhoto = useCallback(async (file: File): Promise<number | null> => {
    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${valuationId}/${uuidv4()}.${fileExt}`;
      const filePath = `vehicle-photos/${fileName}`;
      
      // Check if bucket exists and create it if not
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(bucket => bucket.name === 'vehicle-photos')) {
        console.log('Creating vehicle-photos bucket');
        await supabase.storage.createBucket('vehicle-photos', {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
          fileSizeLimit: 5 * 1024 * 1024 // 5MB
        });
      }
      
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vehicle-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          onUploadProgress: (progress) => {
            setUploadProgress(Math.round((progress.loaded / progress.total) * 100));
          }
        });
        
      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }
      
      // Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('vehicle-photos')
        .getPublicUrl(fileName);
        
      setPhotoUrl(publicUrl);
      setIsUploading(false);
      
      // Now score the image using the edge function
      setIsScoring(true);
      const { data: scoreData, error: scoreError } = await supabase.functions.invoke('score-image', {
        body: { 
          valuation_id: valuationId,
          image_url: publicUrl
        }
      });
      
      if (scoreError) {
        throw new Error(`Scoring failed: ${scoreError.message}`);
      }
      
      // Set the score and thumbnail URL from the response
      setPhotoScore(scoreData.score);
      setThumbnailUrl(scoreData.thumbnail_url);
      
      toast.success('Photo analyzed successfully');
      return scoreData.score;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error(`Failed to process image: ${errorMessage}`);
      console.error('Photo scoring error:', err);
      return null;
    } finally {
      setIsUploading(false);
      setIsScoring(false);
    }
  }, [valuationId]);

  return {
    uploadPhoto,
    photoUrl,
    thumbnailUrl,
    photoScore,
    isUploading,
    isScoring,
    uploadProgress,
    error,
    resetUpload
  };
}
