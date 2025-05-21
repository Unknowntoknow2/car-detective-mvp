
import { renderHook, act } from '@testing-library/react-hooks';
import { usePhotoScoring } from './usePhotoScoring';
import { scorePhotos } from '@/services/photoScoringService';

// Mock the photoScoringService
jest.mock('@/services/photoScoringService', () => ({
  scorePhotos: jest.fn(),
  analyzePhotos: jest.fn()
}));

describe('usePhotoScoring', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should initialize with empty photos array', () => {
    const { result } = renderHook(() => usePhotoScoring({ valuationId: 'test-valuation-id' }));
    
    expect(result.current.photos).toEqual([]);
    expect(result.current.isAnalyzing).toBe(false);
    expect(result.current.isUploading).toBe(false);
    expect(result.current.analysisResult).toBeNull();
    expect(result.current.photoScores).toEqual([]);
  });
  
  it('should add photos when handleFileSelect is called', () => {
    const { result } = renderHook(() => usePhotoScoring({ valuationId: 'test-valuation-id' }));
    
    const mockFiles = [
      new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
      new File(['test2'], 'test2.jpg', { type: 'image/jpeg' })
    ];
    
    act(() => {
      result.current.handleFileSelect(mockFiles);
    });
    
    expect(result.current.photos.length).toBe(2);
    expect(result.current.photos[0].name).toBe('test1.jpg');
    expect(result.current.photos[1].name).toBe('test2.jpg');
  });
  
  it('should upload and analyze photos', async () => {
    const mockScoringResult = {
      photoScore: 0.85,
      score: 0.85,
      individualScores: [
        { url: 'test-url-1', score: 0.8 },
        { url: 'test-url-2', score: 0.9 }
      ],
      photoUrls: ['test-url-1', 'test-url-2'],
      bestPhotoUrl: 'test-url-2',
      aiCondition: { 
        condition: 'Good', 
        confidenceScore: 80, 
        issuesDetected: [] 
      }
    };
    
    // Setup mock return value
    (scorePhotos as jest.Mock).mockResolvedValue(mockScoringResult);
    
    const { result, waitForNextUpdate } = renderHook(() => 
      usePhotoScoring({ valuationId: 'test-valuation-id' })
    );
    
    // Add some photos
    const mockFiles = [
      new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
      new File(['test2'], 'test2.jpg', { type: 'image/jpeg' })
    ];
    
    let uploadPromise;
    
    act(() => {
      result.current.handleFileSelect(mockFiles);
      uploadPromise = result.current.handleUpload();
    });
    
    // Wait for the async operations to complete
    await act(async () => {
      await uploadPromise;
    });
    
    expect(result.current.photoScores.length).toBe(2);
    expect(result.current.analysisResult).not.toBeNull();
    expect(result.current.analysisResult?.score).toBe(0.85);
  });
  
  it('should handle errors during photo analysis', async () => {
    (scorePhotos as jest.Mock).mockRejectedValue(new Error('Analysis failed'));
    
    const { result } = renderHook(() => 
      usePhotoScoring({ valuationId: 'test-valuation-id' })
    );
    
    // Add some photos
    const mockFiles = [
      new File(['test1'], 'test1.jpg', { type: 'image/jpeg' })
    ];
    
    let uploadPromise;
    
    act(() => {
      result.current.handleFileSelect(mockFiles);
      uploadPromise = result.current.handleUpload();
    });
    
    // Wait for the async operations to complete
    await act(async () => {
      try {
        await uploadPromise;
      } catch (error) {
        // Expected error
      }
    });
    
    expect(result.current.error).not.toBeNull();
  });
  
  it('should create photo scores from photos', () => {
    const { result } = renderHook(() => 
      usePhotoScoring({ valuationId: 'test-valuation-id' })
    );
    
    // Add photos with urls
    act(() => {
      // @ts-ignore - Manually setting properties for testing
      result.current.photos = [
        { id: '1', url: 'test-url-1', uploaded: true, score: 0.7 },
        { id: '2', url: 'test-url-2', uploaded: true, score: 0.8, isPrimary: true }
      ];
    });
    
    let scores;
    act(() => {
      scores = result.current.createPhotoScores();
    });
    
    expect(scores.length).toBe(2);
    expect(scores[0].score).toBe(0.7);
    expect(scores[1].score).toBe(0.8);
    expect(scores[1].isPrimary).toBe(true);
  });
});
