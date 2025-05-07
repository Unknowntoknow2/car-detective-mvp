
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Photo, PhotoScore, AICondition, MAX_FILES, PhotoScoringResult } from '@/types/photo';
import { analyzePhotos } from '@/services/photo/analyzePhotos';
import { uploadPhotos as uploadPhotoService } from '@/services/photo/uploadPhotoService';

export interface UsePhotoScoringOptions {
  valuationId: string;
}

export function usePhotoScoring({ valuationId }: UsePhotoScoringOptions) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoScores, setPhotoScores] = useState<PhotoScore[]>([]);
  const [aiCondition, setAiCondition] = useState<AICondition>({
    condition: null,
    confidenceScore: 0
  });
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = useCallback((files: File[]) => {
    if (!files.length) return;

    const newPhotos: Photo[] = Array.from(files).map(file => ({
      id: uuidv4(),
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
      file,
      uploaded: false,
      uploading: false
    }));

    setPhotos(prev => {
      // Don't exceed MAX_FILES
      const combinedPhotos = [...prev, ...newPhotos].slice(0, MAX_FILES);
      return combinedPhotos;
    });
  }, []);

  const uploadPhotos = async () => {
    if (!photos.length) return [];
    
    setIsUploading(true);
    setError('');
    
    try {
      // Mark photos as uploading
      setPhotos(photos.map(p => ({ ...p, uploading: true })));
      
      // Upload the photos
      const uploadedPhotos = await uploadPhotoService(
        photos.filter(p => !p.uploaded).map(p => p.file as File),
        valuationId
      );
      
      // Update photos with upload status
      setPhotos(prevPhotos => 
        prevPhotos.map(photo => {
          const uploaded = uploadedPhotos.find(up => up.name === photo.name);
          if (uploaded) {
            return {
              ...photo,
              uploaded: true,
              uploading: false,
              url: uploaded.url
            };
          }
          return photo;
        })
      );
      
      // Analyze photos after upload
      const analysis = await analyzePhotos(uploadedPhotos.map(p => p.url), valuationId);
      
      setPhotoScores(analysis.individualScores || []);
      
      if (analysis.aiCondition) {
        setAiCondition(analysis.aiCondition);
      }
      
      return uploadedPhotos;
    } catch (error: any) {
      console.error('Photo upload/analysis error:', error);
      const errorMessage = error.message || 'Failed to upload or analyze photos';
      
      setError(errorMessage);
      
      // Mark photos with error
      setPhotos(photos.map(p => p.uploading ? { ...p, uploading: false, error: errorMessage } : p));
      
      throw new Error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = useCallback((id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  }, []);

  const createPhotoScores = useCallback((): PhotoScore[] => {
    return photoScores;
  }, [photoScores]);

  const handleUpload = async () => {
    return await uploadPhotos();
  };

  return {
    photos,
    photoScores,
    aiCondition,
    isUploading,
    error,
    handleFileSelect,
    handleUpload,
    removePhoto,
    uploadPhotos,
    createPhotoScores,
  };
}
