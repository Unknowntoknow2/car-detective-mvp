
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { Photo, PhotoScore, AICondition, MAX_FILES } from '@/types/photo';
import { scorePhotos } from '@/services/photoService';
import { toast } from 'sonner';

interface UsePhotoScoringProps {
  valuationId?: string;
  onScoreChange?: (score: number, condition?: AICondition) => void;
}

export function usePhotoScoring({ valuationId, onScoreChange }: UsePhotoScoringProps = {}) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoScores, setPhotoScores] = useState<PhotoScore[]>([]);
  const [aiCondition, setAiCondition] = useState<AICondition>({
    condition: null,
    confidenceScore: 0,
    issuesDetected: []
  });
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = useCallback((files: File[]) => {
    if (!files.length) return;
    
    // Limit to MAX_FILES total
    if (photos.length + files.length > MAX_FILES) {
      toast.error(`You can only upload up to ${MAX_FILES} photos.`);
      return;
    }

    // Create photo objects from files
    const newPhotos: Photo[] = Array.from(files).map(file => ({
      id: uuidv4(),
      name: file.name,
      size: file.size,
      type: file.type,
      file,
      uploaded: false,
      uploading: false
    })) as Photo[];

    setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
  }, [photos]);

  const uploadPhotos = async (files: File[]): Promise<Photo[]> => {
    if (!valuationId) {
      throw new Error('ValuationId is required to upload photos');
    }

    const uploadedPhotos: Photo[] = [];

    for (const file of files) {
      try {
        const filename = `${valuationId}/${uuidv4()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('vehicle-photos')
          .upload(filename, file);

        if (error) throw error;

        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/vehicle-photos/${data?.path}`;
        
        uploadedPhotos.push({
          id: uuidv4(),
          url,
          name: file.name,
          size: file.size,
          type: file.type,
          uploaded: true
        });
      } catch (error: any) {
        console.error('Error uploading photo:', error);
      }
    }

    return uploadedPhotos;
  };

  const createPhotoScores = async (): Promise<PhotoScore[]> => {
    if (!valuationId || !photos.length) {
      return [];
    }

    try {
      const photoUrls = photos.map(p => p.url).filter(Boolean);
      if (!photoUrls.length) return [];

      const result = await scorePhotos(photoUrls, valuationId);
      
      if (result.error) {
        setError(result.error);
        return [];
      }
      
      if (result.aiCondition) {
        setAiCondition(result.aiCondition);
        
        // Call the onScoreChange callback if provided
        if (onScoreChange && result.overallScore) {
          onScoreChange(result.overallScore, result.aiCondition);
        }
      }
      
      return result.individualScores || [];
    } catch (error: any) {
      setError(error.message || 'Failed to score photos');
      return [];
    }
  };

  const handleUpload = async () => {
    if (!valuationId) {
      setError('Valuation ID is required for photo upload');
      return [];
    }

    setIsUploading(true);
    setError('');
    
    try {
      // Upload photos that have files attached
      const photosToUpload = photos.filter(p => p.file && !p.uploaded);
      const filesToUpload = photosToUpload.map(p => p.file).filter(Boolean) as File[];
      
      if (filesToUpload.length) {
        const uploadedPhotos = await uploadPhotos(filesToUpload);
        setPhotos(prev => [...prev.filter(p => p.uploaded || !p.file), ...uploadedPhotos]);
      }
      
      // Score all photos
      const allPhotos = [...photos.filter(p => p.uploaded), ...photosToUpload];
      if (allPhotos.length > 0) {
        const scores = await createPhotoScores();
        setPhotoScores(scores);
      }
      
      return allPhotos;
    } catch (error: any) {
      setError(error.message || 'Error uploading photos');
      console.error('Photo upload error:', error);
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
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
    // Expose these for tests
    uploadPhotos,
    createPhotoScores
  };
}
