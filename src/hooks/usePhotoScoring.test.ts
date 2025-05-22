
import { renderHook, act } from '@testing-library/react-hooks';
import { usePhotoScoring } from './usePhotoScoring';
import { Photo, PhotoScore } from '@/types/photo';
import * as photoScoringService from '@/services/photoScoringService';

// Mock the photo scoring service
jest.mock('@/services/photoScoringService', () => ({
  scorePhotos: jest.fn().mockResolvedValue({
    photoUrls: ['url1', 'url2'],
    score: 85,
    aiCondition: {
      condition: 'Good',
      confidenceScore: 0.85,
      issuesDetected: [],
      summary: 'Vehicle is in good condition'
    },
    individualScores: [
      { url: 'url1', score: 80, isPrimary: false },
      { url: 'url2', score: 90, isPrimary: true }
    ]
  }),
  convertToPhotoAnalysisResult: jest.fn().mockImplementation((result) => ({
    photoUrls: result.photoUrls || [result.photoUrl],
    overallScore: result.score || 0,
    score: result.score || 0,
    aiCondition: result.aiCondition,
    individualScores: result.individualScores || []
  }))
}));

describe('usePhotoScoring', () => {
  // Updated test to match the new hook interface
  test('should initialize with empty state', () => {
    const { result } = renderHook(() => usePhotoScoring());
    
    expect(result.current.result).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
  
  // Mocked version of tests for backward compatibility
  test('should score photos successfully', async () => {
    const { result, waitForNextUpdate } = renderHook(() => usePhotoScoring());
    
    const mockPhotos: Photo[] = [
      { 
        id: '123', 
        url: 'url1',
        preview: 'preview-url1'
      }
    ];
    
    let analysisResult;
    await act(async () => {
      analysisResult = await result.current.scorePhotos(mockPhotos, 'test-valuation-id');
      await waitForNextUpdate();
    });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.result).not.toBeNull();
    expect(analysisResult).toHaveProperty('overallScore');
    expect(analysisResult).toHaveProperty('individualScores');
  });
  
  test('should get best photo', () => {
    const { result } = renderHook(() => usePhotoScoring());
    
    // Manually set result state for testing
    act(() => {
      // @ts-ignore - Directly setting private state for testing
      result.current.result = {
        overallScore: 85,
        individualScores: [
          { url: 'url1', score: 80, isPrimary: false },
          { url: 'url2', score: 90, isPrimary: true }
        ]
      };
    });
    
    const bestPhoto = result.current.getBestPhoto();
    expect(bestPhoto).not.toBeNull();
    expect(bestPhoto?.url).toBe('url2');
    expect(bestPhoto?.isPrimary).toBe(true);
  });
  
  test('should calculate average score', () => {
    const { result } = renderHook(() => usePhotoScoring());
    
    // Manually set result state for testing
    act(() => {
      // @ts-ignore - Directly setting private state for testing
      result.current.result = {
        overallScore: 85,
        individualScores: [
          { url: 'url1', score: 80, isPrimary: false },
          { url: 'url2', score: 90, isPrimary: true }
        ]
      };
    });
    
    const averageScore = result.current.getAverageScore();
    expect(averageScore).toBe(85);
  });
  
  test('should mark photo as primary', () => {
    const { result } = renderHook(() => usePhotoScoring());
    
    // Manually set result state for testing
    act(() => {
      // @ts-ignore - Directly setting private state for testing
      result.current.result = {
        overallScore: 85,
        individualScores: [
          { url: 'url1', score: 80, isPrimary: false },
          { url: 'url2', score: 90, isPrimary: true }
        ]
      };
    });
    
    act(() => {
      result.current.markAsPrimary('url1');
    });
    
    const bestPhoto = result.current.getBestPhoto();
    expect(bestPhoto?.url).toBe('url1');
    expect(bestPhoto?.isPrimary).toBe(true);
  });
});
