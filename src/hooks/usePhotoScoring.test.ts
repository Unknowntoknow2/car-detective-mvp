
import { renderHook, act } from '@testing-library/react-hooks';
import { usePhotoScoring, UsePhotoScoringOptions } from './usePhotoScoring';
import { analyzePhotos } from '@/services/photo/analyzePhotos';
import { uploadPhotos } from '@/services/photo/uploadPhotoService';

// Mock the services
jest.mock('@/services/photo/analyzePhotos');
jest.mock('@/services/photo/uploadPhotoService');

// Create mock photo file
const createMockFile = (
  name = 'test-photo.jpg',
  type = 'image/jpeg',
  size = 1024
) => {
  const file = new File(['mock content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

describe('usePhotoScoring', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock implementations
    (uploadPhotos as jest.Mock).mockResolvedValue([
      { id: 'photo1', url: 'https://example.com/photo1.jpg', uploaded: true },
      { id: 'photo2', url: 'https://example.com/photo2.jpg', uploaded: true }
    ]);
    
    (analyzePhotos as jest.Mock).mockResolvedValue({
      overallScore: 85,
      individualScores: [
        { url: 'https://example.com/photo1.jpg', score: 90, isPrimary: true },
        { url: 'https://example.com/photo2.jpg', score: 80, isPrimary: false }
      ],
      aiCondition: {
        condition: 'Good',
        confidenceScore: 85,
        issuesDetected: ['Minor scratches']
      }
    });
  });
  
  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePhotoScoring({ valuationId: 'test-valuation-id' }));
    
    expect(result.current.photos).toEqual([]);
    expect(result.current.isUploading).toBe(false);
    expect(result.current.error).toBe('');
    expect(typeof result.current.handleFileSelect).toBe('function');
    expect(typeof result.current.uploadPhotos).toBe('function');
    expect(typeof result.current.removePhoto).toBe('function');
  });
  
  it('should handle file selection', () => {
    const { result } = renderHook(() => usePhotoScoring({ valuationId: 'test-valuation-id' }));
    const mockFiles = [createMockFile(), createMockFile('photo2.jpg')];
    
    act(() => {
      result.current.handleFileSelect(mockFiles);
    });
    
    expect(result.current.photos.length).toBe(2);
    expect(result.current.photos[0].id).toBeDefined();
    expect(result.current.photos[0].uploading).toBe(false);
    expect(result.current.photos[0].uploaded).toBe(false);
  });
  
  it('should upload photos and analyze them', async () => {
    const { result, waitForNextUpdate } = renderHook(() => usePhotoScoring({ valuationId: 'test-valuation-id' }));
    const mockFiles = [createMockFile(), createMockFile('photo2.jpg')];
    
    act(() => {
      result.current.handleFileSelect(mockFiles);
    });
    
    expect(result.current.photos.length).toBe(2);
    
    // Start upload
    let uploadPromise;
    await act(async () => {
      uploadPromise = result.current.uploadPhotos();
      expect(result.current.isUploading).toBe(true);
      await waitForNextUpdate();
    });
    
    // Wait for upload to complete
    await act(async () => {
      await uploadPromise;
    });
    
    expect(uploadPhotos).toHaveBeenCalled();
    expect(analyzePhotos).toHaveBeenCalled();
    expect(result.current.isUploading).toBe(false);
    expect(result.current.photos[0].uploaded).toBe(true);
    expect(result.current.createPhotoScores().length).toBe(2);
    expect(result.current.createPhotoScores()[0].score).toBe(90);
  });
  
  it('should handle upload errors', async () => {
    (uploadPhotos as jest.Mock).mockRejectedValue(new Error('Upload failed'));
    
    const { result, waitForNextUpdate } = renderHook(() => usePhotoScoring({ valuationId: 'test-valuation-id' }));
    const mockFiles = [createMockFile()];
    
    act(() => {
      result.current.handleFileSelect(mockFiles);
    });
    
    // Start upload and catch error
    let caughtError;
    await act(async () => {
      try {
        const uploadPromise = result.current.uploadPhotos();
        expect(result.current.isUploading).toBe(true);
        await waitForNextUpdate();
        await uploadPromise;
      } catch (error) {
        caughtError = error;
      }
    });
    
    expect(caughtError).toBeDefined();
    expect(result.current.isUploading).toBe(false);
    expect(result.current.error).toContain('Upload failed');
    expect(result.current.photos[0].error).toBeDefined();
  });
  
  it('should remove photos', () => {
    const { result } = renderHook(() => usePhotoScoring({ valuationId: 'test-valuation-id' }));
    const mockFiles = [createMockFile(), createMockFile('photo2.jpg')];
    
    act(() => {
      result.current.handleFileSelect(mockFiles);
    });
    
    expect(result.current.photos.length).toBe(2);
    
    act(() => {
      result.current.removePhoto(result.current.photos[0].id);
    });
    
    expect(result.current.photos.length).toBe(1);
    expect(result.current.photos[0].name).toBe('photo2.jpg');
  });
  
  it('should handle analyze errors', async () => {
    (uploadPhotos as jest.Mock).mockResolvedValue([
      { id: 'photo1', url: 'https://example.com/photo1.jpg', uploaded: true }
    ]);
    (analyzePhotos as jest.Mock).mockRejectedValue(new Error('Analysis failed'));
    
    const { result, waitForNextUpdate } = renderHook(() => usePhotoScoring({ valuationId: 'test-valuation-id' }));
    const mockFiles = [createMockFile()];
    
    act(() => {
      result.current.handleFileSelect(mockFiles);
    });
    
    // Start upload
    let caughtError;
    await act(async () => {
      try {
        const uploadPromise = result.current.uploadPhotos();
        expect(result.current.isUploading).toBe(true);
        await waitForNextUpdate();
        await uploadPromise;
      } catch (error) {
        caughtError = error;
      }
    });
    
    expect(caughtError).toBeDefined();
    expect(result.current.isUploading).toBe(false);
    expect(result.current.error).toContain('Analysis failed');
  });
});
