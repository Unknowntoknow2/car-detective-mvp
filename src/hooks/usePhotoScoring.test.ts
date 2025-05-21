
import { renderHook, act } from '@testing-library/react-hooks';
import { usePhotoScoring } from './usePhotoScoring';
import { scorePhotos, analyzePhotos } from '@/services/photoScoringService';

// Mock the photoScoringService
jest.mock('@/services/photoScoringService', () => ({
  scorePhotos: jest.fn(),
  analyzePhotos: jest.fn()
}));

// Mock the supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    storage: {
      from: () => ({
        upload: jest.fn().mockResolvedValue({ data: { path: 'test-path' }, error: null })
      })
    }
  }
}));

describe('usePhotoScoring', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePhotoScoring({ valuationId: 'test-id' }));
    
    expect(result.current.photos).toEqual([]);
    expect(result.current.isAnalyzing).toBe(false);
    expect(result.current.isUploading).toBe(false);
    expect(result.current.analysisResult).toBe(null);
    expect(result.current.error).toBe(null);
    expect(result.current.photoScores).toEqual([]);
  });

  it('should handle file selection', () => {
    const { result } = renderHook(() => usePhotoScoring({ valuationId: 'test-id' }));
    
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    act(() => {
      result.current.handleFileSelect([mockFile]);
    });
    
    expect(result.current.photos.length).toBe(1);
    expect(result.current.photos[0].file).toBe(mockFile);
    expect(result.current.photos[0].name).toBe('test.jpg');
  });

  it('should upload a photo', async () => {
    const { result } = renderHook(() => usePhotoScoring({ valuationId: 'test-id' }));
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    let uploadPromise: Promise<any>;
    
    await act(async () => {
      uploadPromise = result.current.uploadPhoto(mockFile);
      await uploadPromise;
    });
    
    expect(result.current.photos.length).toBe(1);
    expect(result.current.photos[0].uploaded).toBe(true);
  });

  it('should analyze photos', async () => {
    const mockScoringResult = {
      photoScore: 0.85,
      individualScores: [
        { url: 'test-url', score: 0.85, isPrimary: true }
      ],
      photoUrls: ['test-url'],
      aiCondition: { condition: 'Good', confidenceScore: 85, issuesDetected: [] }
    };
    
    (scorePhotos as jest.Mock).mockResolvedValue(mockScoringResult);
    
    const { result } = renderHook(() => usePhotoScoring({ valuationId: 'test-id' }));
    
    // Set up some photos
    act(() => {
      result.current.photos = [
        { id: '1', url: 'test-url', uploaded: true, file: new File([''], 'test.jpg') }
      ];
    });
    
    let analyzePromise: Promise<any>;
    
    await act(async () => {
      analyzePromise = result.current.analyzePhotos();
      await analyzePromise;
    });
    
    expect(scorePhotos).toHaveBeenCalledWith(['test-url'], 'test-id');
    expect(result.current.analysisResult).toBeTruthy();
    expect(result.current.photoScores.length).toBe(1);
  });

  it('should batch upload and analyze photos', async () => {
    const mockScoringResult = {
      photoScore: 0.85,
      individualScores: [
        { url: 'test-url', score: 0.85, isPrimary: true }
      ],
      photoUrls: ['test-url'],
      aiCondition: { condition: 'Good', confidenceScore: 85, issuesDetected: [] }
    };
    
    (scorePhotos as jest.Mock).mockResolvedValue(mockScoringResult);
    
    const { result } = renderHook(() => usePhotoScoring({ valuationId: 'test-id' }));
    
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    act(() => {
      result.current.handleFileSelect([mockFile]);
    });
    
    let uploadPromise: Promise<any>;
    
    await act(async () => {
      uploadPromise = result.current.handleUpload();
      await uploadPromise;
    });
    
    expect(result.current.photoScores.length).toBe(1);
  });

  it('should create photo scores from photos', () => {
    const { result } = renderHook(() => usePhotoScoring({ valuationId: 'test-id' }));
    
    act(() => {
      result.current.photos = [
        { id: '1', url: 'url1', uploaded: true, score: 0.8, isPrimary: true },
        { id: '2', url: 'url2', uploaded: true, score: 0.7, isPrimary: false }
      ];
    });
    
    let scores: any[] = [];
    
    act(() => {
      scores = result.current.createPhotoScores();
    });
    
    expect(scores.length).toBe(2);
    expect(scores[0].url).toBe('url1');
    expect(scores[0].score).toBe(0.8);
    expect(scores[0].isPrimary).toBe(true);
  });
});
