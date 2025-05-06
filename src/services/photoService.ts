
// Export all photo-related services from individual modules
export { fetchValuationPhotos } from './photo/fetchPhotos';
export { deletePhotos } from './photo/deletePhotos';
export { uploadAndAnalyzePhotos } from './photo/analyzePhotos';
export type { PhotoAnalysisResult, PhotoUploadResponse } from './photo/types';
