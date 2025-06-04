<<<<<<< HEAD

import { useState, useCallback } from 'react';
import { Photo, PhotoScore, PhotoAnalysisResult } from '@/types/photo';
import { uploadPhotos, deletePhoto } from '@/services/photoService';
import { v4 as uuidv4 } from 'uuid';
=======
import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  AICondition,
  Photo,
  PhotoAnalysisResult,
  PhotoScore,
  PhotoScoringResult,
} from "@/types/photo";
import { scorePhotos } from "@/services/photoService";
import process from "node:process";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export function usePhotoScoring() {
  const [isUploading, setIsUploading] = useState(false);
<<<<<<< HEAD
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
=======
  const [analysisResult, setAnalysisResult] = useState<
    PhotoAnalysisResult | null
  >(null);
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PhotoAnalysisResult | null>(null);
  const [photoScores, setPhotoScores] = useState<PhotoScore[]>([]);

<<<<<<< HEAD
  const analyzePhotos = useCallback(async (photos: Photo[]) => {
    if (photos.length === 0) return;
    
=======
  const handleFileSelect = useCallback((files: File[]) => {
    const newPhotos = files.map((file) => ({
      id: Math.random().toString(36).substring(2),
      file,
      name: file.name,
      uploading: false,
      uploaded: false,
    }));

    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
  }, []);

  const uploadPhoto = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const filename = `${valuationId}/${
        Math.random().toString(36).substring(2)
      }-${file.name}`;
      const { data, error } = await supabase.storage
        .from("vehicle-photos")
        .upload(filename, file);

      if (error) throw error;

      const url =
        `${process.env.SUPABASE_URL}/storage/v1/object/public/vehicle-photos/${data?.path}`;

      const newPhoto: Photo = {
        id: filename,
        file: file,
        name: file.name,
        url: url,
        uploading: false,
        uploaded: true,
      };

      setPhotos((prevPhotos) => [...prevPhotos, newPhoto]);
      return newPhoto;
    } catch (error: any) {
      const errorMsg = error.message || "Failed to upload photo";
      setError(errorMsg);
      console.error("Photo upload error:", error);
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
      const uploadedPhotos = photos.filter((photo) =>
        photo.uploaded && photo.file
      );

      if (uploadedPhotos.length === 0) {
        throw new Error("No uploaded photos to analyze");
      }

      // Extract URLs from photos
      const photoUrls = uploadedPhotos.map((photo) => photo.url as string);

      // Call API to score photos
      const result = await scorePhotos(photoUrls, valuationId);

      const analysisData: PhotoAnalysisResult = {
        photoUrls: photoUrls,
        score: result.photoScore || result.score || 0,
        aiCondition: result.aiCondition,
        individualScores: result.individualScores,
      };

      setAnalysisResult(analysisData);

      // Update photos with scores if individual scores are available
      if (result.individualScores && result.individualScores.length > 0) {
        const updatedPhotos = [...photos];
        const newPhotoScores: PhotoScore[] = [];

        result.individualScores.forEach((scoreData) => {
          newPhotoScores.push(scoreData);
          const photoIndex = updatedPhotos.findIndex((p) =>
            p.url === scoreData.url
          );
          if (photoIndex >= 0) {
            updatedPhotos[photoIndex] = {
              ...updatedPhotos[photoIndex],
              score: scoreData.score,
              isPrimary: scoreData.isPrimary,
            };
          }
        });

        setPhotos(updatedPhotos);
        setPhotoScores(newPhotoScores);
      }

      return result;
    } catch (error: any) {
      const errorMsg = error.message || "Failed to analyze photos";
      setError(errorMsg);
      console.error("Photo analysis error:", error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [photos, valuationId]);

  const handleUpload = useCallback(async () => {
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    setIsUploading(true);
    setError(null);

    try {
<<<<<<< HEAD
      // Prepare files for upload
      const filesToUpload = photos
        .filter(photo => photo.file)
        .map(photo => photo.file as File);
      
      if (filesToUpload.length === 0) {
        throw new Error('No valid files to upload');
      }
      
      // Upload photos and get URLs
      const uploadedUrls = await uploadPhotos(filesToUpload);
      
      // Create mock analysis result
      const mockResult: PhotoAnalysisResult = {
        photoId: uuidv4(),
        score: 85,
        confidence: 0.85,
        issues: ['Minor scratches on rear bumper', 'Small dent on driver door'],
        url: uploadedUrls[0],
        photoUrls: uploadedUrls,
        individualScores: uploadedUrls.map((url, index) => ({
          url,
          score: index === 0 ? 85 : Math.floor(Math.random() * 30) + 60,
          isPrimary: index === 0
        })),
        aiCondition: {
          condition: 'Good',
          confidenceScore: 0.85,
          issuesDetected: ['Minor scratches on rear bumper', 'Small dent on driver door'],
          summary: 'Vehicle is in good condition with minor cosmetic issues'
        }
      };
      
      // Update result with the response
      setResult(mockResult);
      
      // Set photo scores from individual scores
      if (mockResult.individualScores && mockResult.individualScores.length > 0) {
        setPhotoScores(mockResult.individualScores);
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
  
=======
      // Process each photo for upload
      const uploadPromises = photos
        .filter((p) => !p.uploaded && p.file)
        .map((photo) => {
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
      const errorMsg = error.message || "Failed to upload photos";
      setError(errorMsg);
      console.error("Upload error:", error);
      throw error;
    }
  }, [photos]);

  // Helper function to upload a single photo file
  const uploadPhotoFile = async (file: File, photoId: string) => {
    try {
      const filename = `${valuationId}/${
        Math.random().toString(36).substring(2)
      }-${file.name}`;
      const { data, error } = await supabase.storage
        .from("vehicle-photos")
        .upload(filename, file);

      if (error) throw error;

      const url =
        `${process.env.SUPABASE_URL}/storage/v1/object/public/vehicle-photos/${data?.path}`;

      markPhotoAsUploaded(photoId, url);
      return url;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const removePhoto = useCallback((photoId: string) => {
    setPhotos((prevPhotos) =>
      prevPhotos.filter((photo) => photo.id !== photoId)
    );
  }, []);

  // Mark a photo as uploading
  const markPhotoAsUploading = useCallback((photoId: string) => {
    setPhotos((prevPhotos) =>
      prevPhotos.map((photo) =>
        photo.id === photoId ? { ...photo, uploading: true } : photo
      )
    );
  }, []);

  // Mark a photo as uploaded
  const markPhotoAsUploaded = useCallback((photoId: string, url?: string) => {
    setPhotos((prevPhotos) =>
      prevPhotos.map((photo) =>
        photo.id === photoId
          ? {
            ...photo,
            uploading: false,
            uploaded: true,
            ...(url ? { url } : {}),
          }
          : photo
      )
    );
  }, []);

  // Create photo scores array from photos
  const createPhotoScores = useCallback(() => {
    const scores = photos
      .filter((photo) => photo.uploaded && photo.url)
      .map((photo) => ({
        url: photo.url as string,
        score: photo.score || 0.7, // Default score if not available
        isPrimary: photo.isPrimary || false,
      }));

    setPhotoScores(scores);
    return scores;
  }, [photos]);

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  return {
    isUploading,
    isDeleting,
    isAnalyzing,
    error,
    result,
    photoScores,
    analyzePhotos,
<<<<<<< HEAD
    deletePhoto: deletePhotoById,
    resetState
=======
    removePhoto,
    markPhotoAsUploading,
    markPhotoAsUploaded,
    handleFileSelect,
    handleUpload,
    createPhotoScores,
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  };
}
