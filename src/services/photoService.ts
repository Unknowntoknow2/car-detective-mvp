
import { Photo } from '@/types/photo';
import { uploadPhotos } from './photo/uploadPhotoService';
import { analyzePhotos, uploadAndAnalyzePhotos } from './photo/analyzePhotos';

export {
  uploadPhotos,
  analyzePhotos,
  uploadAndAnalyzePhotos
};

// Re-export types
export type { Photo };
