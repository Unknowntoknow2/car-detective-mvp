
import { useState } from 'react';
import { Photo, PhotoAnalysisResult, PhotoScore } from '@/types/photo';
import { toast } from 'sonner';
import { analyzePhotos } from '@/services/photo/analyzePhotos';

// Export the scorePhotos function for compatibility with tests
export const scorePhotos = async (photos: Photo[]): Promise<PhotoAnalysisResult> => {
  return await analyzePhotos(photos);
};

export const usePhotoScoring = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PhotoAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [photoScores, setPhotoScores] = useState<PhotoScore[]>([]);

  const handleFileSelect = (files: File[]) => {
    const newPhotos = files.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: URL.createObjectURL(file),
      uploading: false,
      uploaded: false,
      url: ''  // Add empty url property to satisfy the type
    }));
    
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const addPhotos = (newPhotos: Photo[]) => {
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const updatePhotoStatus = (id: string, uploading: boolean, uploaded: boolean, error?: string) => {
    setPhotos(prevPhotos => 
      prevPhotos.map(photo => 
        photo.id === id 
          ? { ...photo, uploading, uploaded, error } 
          : photo
      )
    );
  };

  const removePhoto = (id: string) => {
    setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== id));
  };

  const markPhotoAsPrimary = (id: string) => {
    setPhotos(prevPhotos => 
      prevPhotos.map(photo => ({
        ...photo,
        isPrimary: photo.id === id
      }))
    );
  };

  const clearPhotos = () => {
    setPhotos([]);
    setAnalysisResult(null);
    setError(null);
    setPhotoScores([]);
  };

  const uploadPhoto = async (file: File) => {
    const photoId = Math.random().toString(36).substring(2, 9);
    const newPhoto: Photo = {
      id: photoId,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: URL.createObjectURL(file),
      uploading: true,
      uploaded: false,
      url: ''  // Add empty url property to satisfy the type
    };
    
    // Add the new photo to state
    setPhotos(prev => [...prev, newPhoto]);
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update photo as uploaded
    updatePhotoStatus(photoId, false, true);
    
    return newPhoto;
  };

  const handleUpload = async () => {
    setIsUploading(true);
    setError(null);
    
    try {
      // Simulate uploading all photos
      for (const photo of photos) {
        if (!photo.uploaded && photo.file) {
          updatePhotoStatus(photo.id, true, false);
          await new Promise(resolve => setTimeout(resolve, 500));
          updatePhotoStatus(photo.id, false, true);
        }
      }
      
      // Analyze after upload
      await analyzePhotos();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload photos';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const analyzePhotos = async () => {
    if (!photos.length) {
      setError('No photos to analyze');
      return null;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await scorePhotos(photos);
      
      // Update photos with scores
      setPhotos(prevPhotos => {
        return prevPhotos.map(photo => {
          const scoreData = result.individualScores.find(score => 
            score.url === (photo.url || photo.preview)
          );
          
          if (scoreData) {
            return {
              ...photo,
              score: scoreData.score,
              isPrimary: scoreData.isPrimary
            };
          }
          
          return photo;
        });
      });
      
      // Set the scores state
      setPhotoScores(result.individualScores);
      
      setAnalysisResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze photos';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const createPhotoScores = (): PhotoScore[] => {
    return photos
      .filter(photo => photo.uploaded && photo.url)
      .map(photo => ({
        url: photo.url || '',
        score: photo.score || 0,
        isPrimary: !!photo.isPrimary
      }));
  };

  return {
    photos,
    setPhotos,
    addPhotos,
    updatePhotoStatus,
    removePhoto,
    markPhotoAsPrimary,
    clearPhotos,
    analyzePhotos,
    isAnalyzing,
    isUploading,
    analysisResult,
    error,
    handleFileSelect,
    uploadPhoto,
    handleUpload,
    photoScores,
    createPhotoScores
  };
};
