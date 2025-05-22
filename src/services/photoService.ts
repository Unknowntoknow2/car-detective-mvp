
import { AICondition, Photo, PhotoAnalysisResult, PhotoScore } from '@/types/photo';

// Simulate photo analysis service
export const analyzePhotos = async (
  photoUrls: string[]
): Promise<PhotoAnalysisResult> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return mock response
  return {
    photoUrls,
    overallScore: 85, // Add required overallScore field
    score: 85,
    aiCondition: {
      condition: 'Good',
      confidenceScore: 0.85,
      issuesDetected: ['Minor scratches on rear bumper', 'Small dent on driver door'],
      summary: 'Vehicle is in good condition with minor cosmetic issues'
    },
    individualScores: [
      { url: photoUrls[0], score: 85, isPrimary: true },
      ...photoUrls.slice(1).map(url => ({ url, score: Math.round(Math.random() * 30 + 60), isPrimary: false }))
    ]
  };
};

// Simulate photo upload service
export const uploadPhotos = async (files: File[]): Promise<string[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate fake URLs
  const urls = files.map(file => URL.createObjectURL(file));
  
  return urls;
};

// Function to analyze a single photo for its condition
export const analyzePhotoCondition = async (photoUrl: string): Promise<AICondition> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Return mock condition assessment
  return {
    condition: 'Good',
    confidenceScore: 0.82,
    issuesDetected: ['Minor scratches', 'Small dent'],
    summary: 'The vehicle appears to be in good condition overall with some minor cosmetic issues.'
  };
};

// Enhanced function to analyze multiple photos
export const analyzeBatchPhotos = async (
  photoUrls: string[]
): Promise<PhotoAnalysisResult> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock enhanced analysis
  return {
    photoUrls,
    overallScore: 88, // Add required overallScore field
    score: 88,
    aiCondition: {
      condition: 'Good',
      confidenceScore: 0.88,
      issuesDetected: ['Minor wear on interior', 'Light scratches on exterior'],
      summary: 'Based on multiple photos, the vehicle is in good condition with normal wear for its age.'
    },
    individualScores: photoUrls.map(url => ({
      url,
      score: Math.round(Math.random() * 20 + 70),
      isPrimary: false,
      explanation: 'Photo shows vehicle in good condition'
    }))
  };
};
