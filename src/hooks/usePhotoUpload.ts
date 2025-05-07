
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateUniqueId } from '@/utils/helpers';
import { Photo, PhotoScore } from '@/types/photo';

interface UsePhotoUploadOptions {
  valuationId?: string;
  maxFiles?: number;
}

export function usePhotoUpload({ valuationId, maxFiles = 5 }: UsePhotoUploadOptions = {}) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to generate a file path for storage
  const generateFilePath = (valuationId: string, fileName: string): string => {
    const timestamp = new Date().getTime();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    return `valuations/${valuationId}/photos/${timestamp}_${sanitizedFileName}`;
  };

  // Function to upload a single file to Supabase Storage
  const uploadFileToStorage = async (file: File, valuationId: string): Promise<string> => {
    if (!valuationId) {
      throw new Error('Valuation ID is required for upload');
    }

    const filePath = generateFilePath(valuationId, file.name);
    
    const { data, error } = await supabase.storage
      .from('vehicle-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('vehicle-photos')
      .getPublicUrl(data.path);
    
    return publicUrl;
  };

  // Function to handle file selection
  const handleFileSelect = useCallback((files: FileList | File[]): Photo[] => {
    const selected = Array.from(files);
    
    // Check if adding these files would exceed the maximum
    if (photos.length + selected.length > maxFiles) {
      setError(`You can only upload a maximum of ${maxFiles} photos.`);
      return photos;
    }
    
    // Create Photo objects for each selected file
    const newPhotos = selected.map((file) => ({
      id: generateUniqueId(),
      url: URL.createObjectURL(file),
      uploading: false,
      uploaded: false,
      metadata: {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        file // Store the actual File object for later upload
      }
    }));
    
    // Update state
    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
    setError(null);
    
    return newPhotos;
  }, [photos, maxFiles]);

  // Function to upload all non-uploaded photos
  const uploadPhotos = useCallback(async (): Promise<Photo[]> => {
    if (!valuationId) {
      setError('Valuation ID is required for upload');
      return photos;
    }
    
    // Find photos that need to be uploaded
    const photosToUpload = photos.filter(photo => !photo.uploaded && !photo.uploading);
    
    if (photosToUpload.length === 0) {
      return photos; // Nothing to upload
    }
    
    setIsUploading(true);
    setError(null);
    
    // Mark photos as uploading
    setPhotos(prevPhotos => 
      prevPhotos.map(photo => 
        photosToUpload.some(p => p.id === photo.id)
          ? { ...photo, uploading: true }
          : photo
      )
    );
    
    try {
      // Upload each photo
      const uploadedPhotos = await Promise.all(
        photosToUpload.map(async (photo) => {
          try {
            // Get the File object from metadata
            const file = photo.metadata?.file as File;
            
            if (!file) {
              throw new Error(`No file found for photo ${photo.id}`);
            }
            
            // Upload to storage
            const publicUrl = await uploadFileToStorage(file, valuationId);
            
            // Update photo object
            return {
              ...photo,
              url: publicUrl, // Replace object URL with storage URL
              uploading: false,
              uploaded: true,
              explanation: photo.explanation || 'Photo of vehicle'
            };
          } catch (err) {
            // Handle individual upload errors
            return {
              ...photo,
              uploading: false,
              error: err instanceof Error ? err.message : 'Upload failed',
            };
          }
        })
      );
      
      // Update state with uploaded photos
      setPhotos(prevPhotos => 
        prevPhotos.map(photo => {
          const updatedPhoto = uploadedPhotos.find(p => p.id === photo.id);
          return updatedPhoto || photo;
        })
      );
      
      // Return successful uploads
      return uploadedPhotos.filter(photo => photo.uploaded);
    } catch (err) {
      // Handle overall upload error
      setError(err instanceof Error ? err.message : 'Failed to upload photos');
      
      // Mark all as not uploading
      setPhotos(prevPhotos => 
        prevPhotos.map(photo => ({
          ...photo,
          uploading: false,
        }))
      );
      
      return photos;
    } finally {
      setIsUploading(false);
    }
  }, [photos, valuationId]);

  // Function to remove a photo
  const removePhoto = useCallback((photoId: string) => {
    setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== photoId));
  }, []);

  // Function to add explanations to photos
  const addExplanation = useCallback((photoId: string, explanation: string) => {
    setPhotos(prevPhotos => 
      prevPhotos.map(photo =>
        photo.id === photoId
          ? { ...photo, explanation }
          : photo
      )
    );
  }, []);

  // Function to create PhotoScore objects from Photos
  const createPhotoScores = useCallback((): PhotoScore[] => {
    return photos
      .filter(photo => photo.uploaded)
      .map(photo => ({
        url: photo.url,
        score: 0, // Default score before analysis
        explanation: photo.explanation
      }));
  }, [photos]);

  // Return the hook values
  return {
    photos,
    isUploading,
    error,
    handleFileSelect,
    uploadPhotos,
    removePhoto,
    addExplanation,
    createPhotoScores,
  };
}
