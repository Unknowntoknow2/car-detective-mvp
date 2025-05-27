
import { useState, useCallback } from 'react';
import { Photo, PhotoScore, PhotoAnalysisResult } from '@/types/photo';
import { uploadPhotos, deletePhoto } from '@/services/realPhotoService';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export function useRealPhotoScoring() {
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
      const filesToUpload = photos
        .filter(photo => photo.file)
        .map(photo => photo.file as File);
      
      if (filesToUpload.length === 0) {
        throw new Error('No valid files to upload');
      }
      
      // Upload photos
      const uploadedUrls = await uploadPhotos(filesToUpload);
      
      // Analyze photos using AI
      const { data, error } = await supabase.functions.invoke('analyze-photos', {
        body: { photoUrls: uploadedUrls }
      });
      
      if (error) {
        throw new Error(`Analysis failed: ${error.message}`);
      }
      
      const analysisResult: PhotoAnalysisResult = {
        photoId: uuidv4(),
        score: data.overallScore || 85,
        confidence: data.confidence || 0.85,
        issues: data.issues || [],
        url: uploadedUrls[0],
        photoUrls: uploadedUrls,
        individualScores: data.individualScores || uploadedUrls.map((url, index) => ({
          url,
          score: data.scores?.[index] || 80,
          isPrimary: index === 0
        })),
        aiCondition: data.aiCondition || {
          condition: 'Good',
          confidenceScore: 0.85,
          issuesDetected: data.issues || [],
          summary: data.summary || 'Vehicle appears to be in good condition'
        }
      };
      
      setResult(analysisResult);
      
      if (analysisResult.individualScores) {
        setPhotoScores(analysisResult.individualScores);
      }
      
    } catch (err: any) {
      console.error('Photo analysis error:', err);
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
      
      setPhotoScores(prev => prev.filter(score => score.url !== url));
      
      if (result && result.photoUrls) {
        const updatedPhotoUrls = result.photoUrls.filter((photoUrl: string) => photoUrl !== url);
        
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
      console.error('Photo delete error:', err);
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
