
import { useState, useCallback } from 'react';
import { Photo, PhotoScore, PhotoAnalysisResult } from '@/types/photo';
import { uploadPhotos, deletePhoto } from '@/services/photoService';
import { v4 as uuidv4 } from 'uuid';

export function usePhotoScoring() {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PhotoAnalysisResult | null>(null);
  const [photoScores, setPhotoScores] = useState<PhotoScore[]>([]);

  const analyzePhotos = useCallback(async (photos: Photo[]) => {
    if (photos.length === 0) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      // Prepare files for upload
      const filesToUpload = photos
        .filter(photo => photo.file)
        .map(photo => photo.file as File);
      
      if (filesToUpload.length === 0) {
        throw new Error('No valid files to upload');
      }
      
      // Upload photos and get analysis
      const response = await uploadPhotos(filesToUpload);
      
      // Update result with the response
      setResult({
        photoId: uuidv4(),
        score: response.score,
        confidence: response.confidence,
        issues: response.issues,
        url: response.photoUrls[0],
        photoUrls: response.photoUrls,
        individualScores: response.individualScores || [],
        aiCondition: response.aiCondition
      });
      
      // Set photo scores from individual scores
      if (response.individualScores && response.individualScores.length > 0) {
        setPhotoScores(response.individualScores);
      }
      
    } catch (err: any) {
      console.error('Error analyzing photos:', err);
      setError(err.message || 'Failed to analyze photos');
    } finally {
      setIsUploading(false);
    }
  }, []);
  
  const deletePhotoById = useCallback(async (url: string) => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await deletePhoto(url);
      
      // Remove the deleted photo from scores
      setPhotoScores(prev => prev.filter(score => score.url !== url));
      
      // Update result if needed
      if (result && result.photoUrls) {
        const updatedPhotoUrls = result.photoUrls.filter(photoUrl => photoUrl !== url);
        
        if (updatedPhotoUrls.length === 0) {
          setResult(null);
        } else {
          setResult({
            ...result,
            photoUrls: updatedPhotoUrls,
            url: updatedPhotoUrls[0]
          });
        }
      }
      
    } catch (err: any) {
      console.error('Error deleting photo:', err);
      setError(err.message || 'Failed to delete photo');
    } finally {
      setIsDeleting(false);
    }
  }, [result]);
  
  const resetState = useCallback(() => {
    setResult(null);
    setPhotoScores([]);
    setError(null);
  }, []);
  
  return {
    isUploading,
    isDeleting,
    isAnalyzing,
    error,
    result,
    photoScores,
    analyzePhotos,
    deletePhoto: deletePhotoById,
    resetState
  };
}
