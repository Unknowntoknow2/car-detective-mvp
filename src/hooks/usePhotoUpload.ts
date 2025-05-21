
import { useState, useCallback } from 'react';
import { Photo, PhotoScore, AICondition } from '@/types/photo';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UsePhotoUploadProps {
  valuationId: string;
}

export function usePhotoUpload({ valuationId }: UsePhotoUploadProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add photos to the state
  const handleFileSelect = useCallback((files: File[]) => {
    const newPhotos: Photo[] = Array.from(files).map(file => ({
      id: uuidv4(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: URL.createObjectURL(file),
      uploading: false,
      uploaded: false,
      url: undefined // Explicitly set url to undefined
    }));

    setPhotos(prev => [...prev, ...newPhotos]);
  }, []);

  // Remove a photo from the state
  const removePhoto = useCallback((id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  }, []);

  // Upload photos to storage
  const uploadPhotos = useCallback(async () => {
    if (photos.length === 0) return [];
    
    try {
      setIsUploading(true);
      setError(null);
      
      const uploadPromises = photos.map(async (photo) => {
        // Skip already uploaded photos
        if (photo.uploaded && photo.url) {
          return photo;
        }
        
        if (!photo.file) {
          throw new Error(`No file available for photo ${photo.id}`);
        }
        
        // Update photo status
        setPhotos(prev => prev.map(p => 
          p.id === photo.id ? { ...p, uploading: true } : p
        ));
        
        // Create filename with valuation ID
        const filename = `${valuationId}/${photo.id}-${photo.file.name}`;
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('vehicle-photos')
          .upload(filename, photo.file);
          
        if (error) {
          throw error;
        }
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('vehicle-photos')
          .getPublicUrl(data?.path || filename);
          
        const url = urlData.publicUrl;
        
        // Update photo with URL and status
        const updatedPhoto = {
          ...photo,
          url,
          uploading: false,
          uploaded: true
        };
        
        // Update photo in state
        setPhotos(prev => prev.map(p => 
          p.id === photo.id ? updatedPhoto : p
        ));
        
        return updatedPhoto;
      });
      
      const uploadedPhotos = await Promise.all(uploadPromises);
      return uploadedPhotos;
    } catch (err: any) {
      console.error('Error uploading photos:', err);
      setError(`Error uploading photos: ${err.message || 'Unknown error'}`);
      return [];
    } finally {
      setIsUploading(false);
    }
  }, [photos, valuationId]);

  // Create initial photo scores based on basic properties
  const createPhotoScores = useCallback(() => {
    const photoScores: PhotoScore[] = photos.map(photo => {
      // Calculate a basic score based on file properties
      // This is a placeholder - in a real application, you'd use more sophisticated scoring
      const fileSize = photo.size || 0;
      const isJpegOrPng = photo.type?.includes('jpeg') || photo.type?.includes('png');
      
      // Basic score calculation
      let score = 0.5; // Base score
      
      // Adjust score based on file size (larger files often have more detail)
      if (fileSize > 2 * 1024 * 1024) score += 0.2; // > 2MB
      else if (fileSize > 1 * 1024 * 1024) score += 0.1; // > 1MB
      
      // Adjust score based on image type
      if (isJpegOrPng) score += 0.1;
      
      // Cap score at 1.0
      score = Math.min(score, 1.0);
      
      return {
        url: photo.url || '',
        score,
        isPrimary: false
      };
    });
    
    // Mark highest scoring photo as primary
    if (photoScores.length > 0) {
      let highestScore = 0;
      let primaryIndex = 0;
      
      photoScores.forEach((score, index) => {
        if (score.score > highestScore) {
          highestScore = score.score;
          primaryIndex = index;
        }
      });
      
      photoScores[primaryIndex].isPrimary = true;
    }
    
    return photoScores;
  }, [photos]);

  // Analyze photos with AI (mock - would call an API in a real application)
  const analyzePhotos = useCallback(async (photoUrls: string[], valuationId: string) => {
    try {
      // In a real application, you would call an API for AI analysis
      // Here, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI condition assessment
      const mockConditions = ['Excellent', 'Good', 'Fair', 'Poor'] as const;
      const randomIndex = Math.floor(Math.random() * 3); // Bias toward better conditions
      
      const mockIssues = [
        ['Minor scratches on bumper'],
        ['Light scuffs on wheels', 'Small dent on driver door'],
        ['Paint fade visible', 'Moderate wear on interior', 'Several scratches']
      ];
      
      // Generate AI assessment
      const aiCondition: AICondition = {
        condition: mockConditions[randomIndex],
        confidenceScore: 75 + Math.floor(Math.random() * 20), // 75-95%
        issuesDetected: randomIndex > 0 ? mockIssues[randomIndex - 1] : [],
        summary: `Vehicle appears to be in ${mockConditions[randomIndex]} condition overall.`
      };
      
      // Store the assessment in the database (mock)
      console.log('Storing AI assessment for valuation:', valuationId, aiCondition);
      
      // Return the analysis result
      return {
        aiCondition,
        photoScores: createPhotoScores()
      };
    } catch (err: any) {
      console.error('Error analyzing photos:', err);
      setError(`Error analyzing photos: ${err.message || 'Unknown error'}`);
      return null;
    }
  }, [createPhotoScores]);

  // Add explanation to a photo
  const addExplanation = useCallback((id: string, explanation: string) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === id ? { ...photo, explanation } : photo
    ));
  }, []);

  return {
    photos,
    isUploading,
    error,
    handleFileSelect,
    uploadPhotos,
    removePhoto,
    addExplanation,
    createPhotoScores,
    analyzePhotos
  };
}
