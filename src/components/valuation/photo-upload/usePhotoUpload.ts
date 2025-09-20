
import { useState, useCallback } from "react";
import { Photo } from "@/types/photo";
import { v4 as uuidv4 } from "uuid";

interface UsePhotoUploadReturn {
  photos: Photo[];
  isUploading: boolean;
  error: string | null;
  addPhotos: (files: File[]) => void;
  removePhoto: (id: string) => void;
  clearPhotos: () => void;
}

export function usePhotoUpload(): UsePhotoUploadReturn {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPhotos = useCallback((files: File[]) => {
    const newPhotos: Photo[] = files.map(file => ({
      id: uuidv4(),
      url: URL.createObjectURL(file), // Add required url property
      file,
      name: file.name,
      preview: URL.createObjectURL(file),
      uploading: false,
      uploaded: false,
      size: file.size,
      type: file.type,
    }));

    setPhotos(prev => [...prev, ...newPhotos]);
  }, []);

  const removePhoto = useCallback((id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  }, []);

  const clearPhotos = useCallback(() => {
    setPhotos([]);
    setError(null);
  }, []);

  return {
    photos,
    isUploading,
    error,
    addPhotos,
    removePhoto,
    clearPhotos,
  };
}
