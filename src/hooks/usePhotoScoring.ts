
import { useState, useCallback } from 'react';
import { Photo, PhotoAnalysisResult, PhotoScore, AICondition } from '@/types/photo';
import { v4 as uuidv4 } from 'uuid';
import { analyzePhotos } from '@/services/photo/analyzePhotos';
import { uploadPhotos } from '@/services/photo/uploadPhotoService';

interface UsePhotoScoringOptions {
  valuationId: string;
}

export function usePhotoScoring({ valuationId }: UsePhotoScoringOptions) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [scoringResult, setScoringResult] = useState<PhotoAnalysisResult | null>(null);
  const [photoScores, setPhotoScores] = useState<PhotoScore[]>([]);
  
  const handleFileSelect = useCallback((files: File[]) => {
    const newPhotos: Photo[] = Array.from(files).map(file => ({
      id: uuidv4(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      file,
      uploading: false,
      uploaded: false
    }));
    
    setPhotos(prev => [...prev, ...newPhotos]);
  }, []);
  
  const handleUpload = useCallback(async () => {
    if (photos.length === 0) {
      setError('No photos to upload');
      return Promise.reject(new Error('No photos to upload'));
    }
    
    setIsUploading(true);
    setError('');
    
    try {
      // Mark photos as uploading
      setPhotos(prev => prev.map(photo => ({ ...photo, uploading: true })));
      
      // Upload photos to service
      const photosToUpload = photos.filter(p => !p.uploaded && p.file);
      const photoFiles = photosToUpload.map(p => p.file as File);
      
      // Convert File[] to Photo[] (with necessary properties) before uploading
      const photosForUpload: Photo[] = photoFiles.map(file => ({
        id: uuidv4(),
        url: URL.createObjectURL(file),
        file
      }));
      
      const uploadedPhotos = await uploadPhotos(photosForUpload, valuationId);
      
      // Update local state with uploaded photos
      setPhotos(prev => prev.map(photo => {
        const uploadedPhoto = uploadedPhotos.find(up => up.id === photo.id);
        if (uploadedPhoto) {
          return { ...photo, ...uploadedPhoto, uploading: false, uploaded: true };
        }
        return photo;
      }));
      
      // Analyze photos
      const photoUrls = uploadedPhotos.map(p => p.url);
      const result = await analyzePhotos(photoUrls, valuationId);
      
      // Convert PhotoScoringResult to PhotoAnalysisResult
      const analysisResult: PhotoAnalysisResult = {
        overallScore: result.overallScore || result.score || 0,
        individualScores: result.individualScores || [],
        aiCondition: result.aiCondition
      };
      
      setScoringResult(analysisResult);
      
      if (result.individualScores && Array.isArray(result.individualScores)) {
        setPhotoScores(result.individualScores);
      }
      
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to upload and analyze photos';
      setError(errorMessage);
      
      // Mark photos with error
      setPhotos(prev => prev.map(photo => {
        if (photo.uploading) {
          return { ...photo, uploading: false, error: errorMessage };
        }
        return photo;
      }));
      
      return Promise.reject(new Error(errorMessage));
    } finally {
      setIsUploading(false);
    }
  }, [photos, valuationId]);
  
  const removePhoto = useCallback((id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  }, []);
  
  const createPhotoScores = useCallback(() => {
    if (!scoringResult || !scoringResult.individualScores) {
      return [];
    }
    return scoringResult.individualScores;
  }, [scoringResult]);
  
  return {
    photos,
    setPhotos,
    isUploading,
    error,
    scoringResult,
    photoScores,
    handleFileSelect,
    handleUpload,
    removePhoto,
    createPhotoScores
  };
}
