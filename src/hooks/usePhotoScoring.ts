
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Photo, PhotoScore, PhotoScoringResult, AICondition, PhotoAnalysisResult } from '@/types/photo';
import { scorePhotos } from '@/services/photoService';

interface UsePhotoScoringOptions {
  valuationId: string;
}

export function usePhotoScoring({ valuationId }: UsePhotoScoringOptions) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PhotoAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [photoScores, setPhotoScores] = useState<PhotoScore[]>([]);
  
  const handleFileSelect = useCallback((files: File[]) => {
    const newPhotos: Photo[] = files.map(file => ({
      id: Math.random().toString(36).substring(2),
      file,
      name: file.name,
      uploading: false,
      uploaded: false,
      url: undefined // Explicitly set url to undefined
    }));
    
    setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
  }, []);
  
  const uploadPhoto = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const filename = `${valuationId}/${Math.random().toString(36).substring(2)}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('vehicle-photos')
        .upload(filename, file);
        
      if (error) throw error;
      
      const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/vehicle-photos/${data?.path}`;
      
      const newPhoto: Photo = {
        id: filename,
        file: file,
        name: file.name,
        url: url,
        uploading: false,
        uploaded: true
      };
      
      setPhotos(prevPhotos => [...prevPhotos, newPhoto]);
      return newPhoto;
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to upload photo';
      setError(errorMsg);
      console.error('Photo upload error:', error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [valuationId]);
  
  const analyzePhotos = useCallback(async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Get all photos that have been uploaded
      const uploadedPhotos = photos.filter(photo => photo.uploaded && photo.url);
      
      if (uploadedPhotos.length === 0) {
        throw new Error('No uploaded photos to analyze');
      }
      
      // Extract URLs from photos
      const photoUrls = uploadedPhotos.map(photo => photo.url as string);
      
      // Call API to score photos
      const result = await scorePhotos(photoUrls, valuationId);
      
      const analysisData: PhotoAnalysisResult = {
        photoUrls: photoUrls,
        score: result.photoScore || result.score || 0,
        aiCondition: result.aiCondition,
        individualScores: result.individualScores
      };
      
      setAnalysisResult(analysisData);
      
      // Update photos with scores if individual scores are available
      if (result.individualScores && result.individualScores.length > 0) {
        const updatedPhotos = [...photos];
        const newPhotoScores: PhotoScore[] = [];
        
        result.individualScores.forEach(scoreData => {
          newPhotoScores.push(scoreData);
          const photoIndex = updatedPhotos.findIndex(p => p.url === scoreData.url);
          if (photoIndex >= 0) {
            updatedPhotos[photoIndex] = {
              ...updatedPhotos[photoIndex],
              score: scoreData.score,
              isPrimary: scoreData.isPrimary
            };
          }
        });
        
        setPhotos(updatedPhotos);
        setPhotoScores(newPhotoScores);
      }
      
      return result;
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to analyze photos';
      setError(errorMsg);
      console.error('Photo analysis error:', error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [photos, valuationId]);
  
  const handleUpload = useCallback(async () => {
    setIsUploading(true);
    setError(null);
    
    try {
      // Process each photo for upload
      const uploadPromises = photos
        .filter(p => !p.uploaded && p.file)
        .map(photo => {
          markPhotoAsUploading(photo.id);
          return uploadPhotoFile(photo.file as File, photo.id);
        });
      
      await Promise.all(uploadPromises);
      
      // Now analyze all photos
      const result = await analyzePhotos();
      setIsUploading(false);
      return result;
    } catch (error: any) {
      setIsUploading(false);
      const errorMsg = error.message || 'Failed to upload photos';
      setError(errorMsg);
      console.error('Upload error:', error);
      throw error;
    }
  }, [photos]);
  
  // Helper function to upload a single photo file
  const uploadPhotoFile = async (file: File, photoId: string) => {
    try {
      const filename = `${valuationId}/${Math.random().toString(36).substring(2)}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('vehicle-photos')
        .upload(filename, file);
        
      if (error) throw error;
      
      const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/vehicle-photos/${data?.path}`;
      
      markPhotoAsUploaded(photoId, url);
      return url;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };
  
  const removePhoto = useCallback((photoId: string) => {
    setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== photoId));
  }, []);
  
  // Mark a photo as uploading
  const markPhotoAsUploading = useCallback((photoId: string) => {
    setPhotos(prevPhotos => 
      prevPhotos.map(photo => 
        photo.id === photoId ? { ...photo, uploading: true } : photo
      )
    );
  }, []);
  
  // Mark a photo as uploaded
  const markPhotoAsUploaded = useCallback((photoId: string, url?: string) => {
    setPhotos(prevPhotos => 
      prevPhotos.map(photo => 
        photo.id === photoId ? { 
          ...photo, 
          uploading: false, 
          uploaded: true,
          ...(url ? { url } : {})
        } : photo
      )
    );
  }, []);
  
  // Create photo scores array from photos
  const createPhotoScores = useCallback(() => {
    const scores = photos
      .filter(photo => photo.uploaded && photo.url)
      .map(photo => ({
        url: photo.url as string,
        score: photo.score || 0.7, // Default score if not available
        isPrimary: photo.isPrimary || false
      }));
    
    setPhotoScores(scores);
    return scores;
  }, [photos]);
  
  return {
    photos,
    isAnalyzing,
    isUploading,
    analysisResult,
    error,
    photoScores,
    uploadPhoto,
    analyzePhotos,
    removePhoto,
    markPhotoAsUploading,
    markPhotoAsUploaded,
    handleFileSelect,
    handleUpload,
    createPhotoScores
  };
}
