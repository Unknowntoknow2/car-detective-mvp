
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Photo, PhotoScore } from '@/types/photo';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

export function usePhotoUpload(valuationId: string) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoScores, setPhotoScores] = useState<PhotoScore[]>([]);
  const [bestPhoto, setBestPhoto] = useState<Photo | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing photos on mount
  useEffect(() => {
    const fetchPhotos = async () => {
      if (!valuationId) return;

      try {
        // Fetch photos from valuation_photos table
        // Using any to work around TypeScript type issues
        const { data, error } = await supabase
          .from('valuation_photos' as any)
          .select('*')
          .eq('valuation_id', valuationId);

        if (error) throw error;

        if (data && data.length > 0) {
          // Convert to our Photo type
          const fetchedPhotos: Photo[] = data.map((item: any) => ({
            id: item.id,
            url: item.photo_url,
          }));
          
          setPhotos(fetchedPhotos);
          
          // Also set scores
          const fetchedScores: PhotoScore[] = data.map((item: any) => ({
            url: item.photo_url,
            score: item.score
          }));
          
          setPhotoScores(fetchedScores);
          
          // Find best photo (highest score)
          const highestScorePhoto = [...fetchedScores].sort((a, b) => b.score - a.score)[0];
          if (highestScorePhoto) {
            const bestPhotoData = fetchedPhotos.find(p => p.url === highestScorePhoto.url);
            if (bestPhotoData) {
              setBestPhoto(bestPhotoData);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching photos:', err);
        setError('Failed to load existing photos');
      }
    };

    fetchPhotos();
  }, [valuationId]);

  // Upload photos
  const uploadPhotos = async (files: File[]) => {
    if (!valuationId) {
      setError('No valuation ID provided');
      return;
    }

    if (!files.length) {
      setError('No files selected');
      return;
    }

    try {
      setError(null);
      setIsUploading(true);
      setProgress(0);

      // Filter valid files
      const validFiles: File[] = [];
      for (const file of files) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          console.warn(`Skipped file ${file.name}: Invalid type ${file.type}`);
          continue;
        }

        if (file.size > MAX_FILE_SIZE) {
          console.warn(`Skipped file ${file.name}: Size too large (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
          continue;
        }

        validFiles.push(file);
      }

      if (!validFiles.length) {
        setError('No valid files to upload. Please select JPEG or PNG images under 10MB.');
        setIsUploading(false);
        return;
      }

      const uploadedPhotos: Photo[] = [];
      const newScores: PhotoScore[] = [];

      // Upload each photo and process with the score-image function
      for (const [index, file] of validFiles.entries()) {
        // Create a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${valuationId}/${uuidv4()}.${fileExt}`;
        
        // Convert file to base64 for the score-image function
        const base64File = await fileToBase64(file);
        
        // Call the score-image function with the file data
        const { data: scoreData, error: scoreError } = await supabase.functions.invoke('score-image', {
          body: {
            file: base64File,
            fileName: `${file.name}`,
            valuationId
          }
        });
        
        if (scoreError) {
          console.error('Error scoring image:', scoreError);
          continue;
        }
        
        if (!scoreData) {
          console.error('No data returned from score-image function');
          continue;
        }
        
        // Extract the data from the function response
        const { url, score, id: photoId } = scoreData;
        
        if (!url) {
          console.error('No URL returned from score-image function');
          continue;
        }
        
        // Add to our list of photos
        const newPhoto: Photo = {
          id: photoId || uuidv4(),
          url
        };
        
        uploadedPhotos.push(newPhoto);
        
        // Add score data
        newScores.push({
          url,
          score: Number(score) || 0
        });
        
        // Update progress
        setProgress(Math.round(((index + 1) / validFiles.length) * 100));
      }

      // Update state
      setPhotos(prev => [...prev, ...uploadedPhotos]);
      setPhotoScores(prev => [...prev, ...newScores]);
      
      // Find new best photo if applicable
      updateBestPhoto([...photoScores, ...newScores], [...photos, ...uploadedPhotos]);
      
      return uploadedPhotos;
    } catch (err) {
      console.error('Error uploading photos:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload photos');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  // Helper to find the best photo based on scores
  const updateBestPhoto = (scores: PhotoScore[], photosList: Photo[]) => {
    if (!scores.length) return;
    
    // Find highest score
    const sorted = [...scores].sort((a, b) => b.score - a.score);
    if (sorted.length > 0) {
      const highestScore = sorted[0];
      const bestPhotoData = photosList.find(p => p.url === highestScore.url);
      if (bestPhotoData) {
        setBestPhoto(bestPhotoData);
      }
    }
  };

  // Delete a photo
  const deletePhoto = async (photo: Photo) => {
    if (!photo.id || !photo.url) return;
    
    try {
      // Delete from Supabase storage
      // Extract path from URL if needed
      const urlObj = new URL(photo.url);
      const filePath = urlObj.pathname.substring(urlObj.pathname.indexOf('/storage/') + 9);
      
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from('vehicle-photos')
          .remove([filePath]);
          
        if (storageError) {
          console.warn('Error removing from storage:', storageError);
          // Continue anyway to remove from DB
        }
      }
      
      // Delete from valuation_photos table
      const { error: dbError } = await supabase
        .from('valuation_photos' as any)
        .delete()
        .eq('id', photo.id);
        
      if (dbError) throw dbError;
      
      // Update state
      setPhotos(prev => prev.filter(p => p.id !== photo.id));
      setPhotoScores(prev => prev.filter(p => p.url !== photo.url));
      
      // Update best photo if needed
      if (bestPhoto?.id === photo.id) {
        const remainingScores = photoScores.filter(p => p.url !== photo.url);
        const remainingPhotos = photos.filter(p => p.id !== photo.id);
        updateBestPhoto(remainingScores, remainingPhotos);
      }
      
    } catch (err) {
      console.error('Error deleting photo:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete photo');
      throw err;
    }
  };

  return {
    photos,
    photoScores,
    bestPhoto,
    uploadPhotos,
    deletePhoto,
    isUploading,
    progress,
    error
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
