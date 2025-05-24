
import { renderHook, act } from '../test-utils/testingLibraryHookStub';
import { usePhotoScoring } from './usePhotoScoring';
import { Photo } from '@/types/photo';

// Mock implementation
jest.mock('@/services/photoService', () => ({
  uploadPhotos: jest.fn().mockResolvedValue([
    'https://example.com/photo1.jpg'
  ]),
  deletePhoto: jest.fn().mockResolvedValue(true),
}));

describe('usePhotoScoring', () => {
  // Sample test data
  const mockPhotos: Photo[] = [
    {
      id: '1',
      file: new File(['test'], 'test1.jpg', { type: 'image/jpeg' }),
      preview: 'data:image/jpeg;base64,test1',
      name: 'test1.jpg',
      size: 1024,
      type: 'image/jpeg',
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty values', () => {
    const { result } = renderHook(() => usePhotoScoring());
    
    expect(result.current.isAnalyzing).toBe(false);
    expect(result.current.isUploading).toBe(false);
    expect(result.current.result).toBeNull();
    expect(result.current.photoScores).toEqual([]);
  });

  it('should handle photo analysis successfully', async () => {
    const { result, waitForNextUpdate } = renderHook(() => usePhotoScoring());
    
    act(() => {
      result.current.analyzePhotos(mockPhotos);
    });
    
    expect(result.current.isUploading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(result.current.isUploading).toBe(false);
    expect(result.current.result).not.toBeNull();
    expect(result.current.result?.photoUrls).toContain('https://example.com/photo1.jpg');
  });
  
  it('should handle photo deletion', async () => {
    const { result, waitForNextUpdate } = renderHook(() => usePhotoScoring());
    
    // First upload photos
    act(() => {
      result.current.analyzePhotos(mockPhotos);
    });
    
    await waitForNextUpdate();
    
    // Then delete a photo
    act(() => {
      result.current.deletePhoto('https://example.com/photo1.jpg');
    });
    
    expect(result.current.isDeleting).toBe(true);
    
    await waitForNextUpdate();
    
    expect(result.current.isDeleting).toBe(false);
  });
});
