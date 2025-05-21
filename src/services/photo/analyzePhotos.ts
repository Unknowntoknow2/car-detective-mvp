
import { Photo, PhotoAnalysisResult } from '@/types/photo';

export const analyzePhotos = async (photos: Photo[]): Promise<PhotoAnalysisResult> => {
  try {
    console.log('Analyzing photos', photos);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock photo analysis result
    const result: PhotoAnalysisResult = {
      photoUrls: photos.map(p => p.url || p.preview || ''),
      score: 85,
      aiCondition: {
        condition: 'Good',
        confidenceScore: 85,
        issuesDetected: ['Minor scratch on driver door', 'Light wear on seats'],
        summary: 'Vehicle appears to be in good condition with minor cosmetic issues'
      },
      individualScores: photos.map((p, index) => ({
        url: p.url || p.preview || '',
        score: 75 + Math.floor(Math.random() * 20),
        isPrimary: index === 0
      }))
    };
    
    return result;
  } catch (error) {
    console.error('Error analyzing photos:', error);
    throw new Error('Failed to analyze photos');
  }
};
