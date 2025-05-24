
import { renderHook, act } from '../test-utils/testingLibraryHookStub';
import { usePhotoScoring } from './usePhotoScoring';
import { Photo } from '@/types/photo';

// Mock implementation
jest.mock('@/services/photoService', () => ({
  uploadPhotos: jest.fn().mockResolvedValue({
    photoUrls: ['https://example.com/photo1.jpg'],
    score: 0.85,
    confidence: 0.9,
    issues: [],
    individualScores: [
      { url: 'https://example.com/photo1.jpg', score: 0.85 }
    ]
  }),
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
    },
    {
      id: '2',
      file: new File(['test'], 'test2.jpg', { type: 'image/jpeg' }),
      preview: 'data:image/jpeg;base64,test2',
      name: 'test2.jpg',
      size: 1024,
      type: 'image/jpeg',
    },
  ];

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
    expect(result.current.result).toEqual({
      photoId: expect.any(String),
      score: 0.85,
      confidence: 0.9,
      issues: [],
      url: 'https://example.com/photo1.jpg',
      photoUrls: ['https://example.com/photo1.jpg'],
      individualScores: [
        { url: 'https://example.com/photo1.jpg', score: 0.85 }
      ]
    });
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
    expect(result.current.photoScores).toEqual([]);
  });
  
  it('should handle photo replacement', async () => {
    const { result, waitForNextUpdate } = renderHook(() => usePhotoScoring());
    
    // First upload initial photos
    act(() => {
      result.current.analyzePhotos(mockPhotos);
    });
    
    await waitForNextUpdate();
    
    // Then replace with new photos
    const newMockPhotos = [
      {
        id: '3',
        file: new File(['newtest'], 'newtest.jpg', { type: 'image/jpeg' }),
        preview: 'data:image/jpeg;base64,newtest',
        name: 'newtest.jpg',
        size: 2048,
        type: 'image/jpeg',
      },
    ];
    
    act(() => {
      result.current.analyzePhotos(newMockPhotos);
    });
    
    expect(result.current.isUploading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(result.current.isUploading).toBe(false);
    expect(result.current.result).toEqual({
      photoId: expect.any(String),
      score: 0.85,
      confidence: 0.9,
      issues: [],
      url: 'https://example.com/photo1.jpg',
      photoUrls: ['https://example.com/photo1.jpg'],
      individualScores: [
        { url: 'https://example.com/photo1.jpg', score: 0.85 }
      ]
    });
  });
});
