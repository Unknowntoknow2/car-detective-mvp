
import { renderHook, act } from '@testing-library/react-hooks';
import { usePhotoScoring } from './usePhotoScoring';
import { Photo, PhotoScore } from '@/types/photo';

// Mock the photo analysis service
jest.mock('@/services/photo/analyzePhotos', () => ({
  analyzePhotos: jest.fn().mockResolvedValue({
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
  })
}));

describe('usePhotoScoring', () => {
  test('should initialize with empty photos', () => {
    const { result } = renderHook(() => usePhotoScoring());
    
    expect(result.current.photos).toEqual([]);
    expect(result.current.isAnalyzing).toBe(false);
    expect(result.current.isUploading).toBe(false);
    expect(result.current.analysisResult).toBeNull();
    expect(result.current.photoScores).toEqual([]);
  });
  
  test('should add photos', () => {
    const { result } = renderHook(() => usePhotoScoring());
    
    const mockPhoto: Photo = {
      id: '123',
      url: 'test-url',
      preview: 'test-preview',
      file: new File([''], 'test.jpg', { type: 'image/jpeg' }),
      name: 'test.jpg',
      uploaded: true,
      uploading: false
    };
    
    act(() => {
      result.current.addPhotos([mockPhoto]);
    });
    
    expect(result.current.photos.length).toBe(1);
    expect(result.current.photos[0].id).toBe('123');
  });
  
  test('should handle file selection', () => {
    const { result } = renderHook(() => usePhotoScoring());
    
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    
    act(() => {
      result.current.handleFileSelect([mockFile]);
    });
    
    expect(result.current.photos.length).toBe(1);
    expect(result.current.photos[0].name).toBe('test.jpg');
  });
  
  test('should upload a photo', async () => {
    const { result, waitForNextUpdate } = renderHook(() => usePhotoScoring());
    
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    
    await act(async () => {
      const newPhoto = await result.current.uploadPhoto(mockFile);
      expect(newPhoto.name).toBe('test.jpg');
      expect(newPhoto.uploading).toBe(true);
      await waitForNextUpdate();
    });
    
    // Verify upload completed
    const uploadedPhoto = result.current.photos.find(p => p.name === 'test.jpg');
    expect(uploadedPhoto).toBeDefined();
    expect(uploadedPhoto?.uploaded).toBe(true);
  });
  
  test('should analyze photos', async () => {
    const { result, waitForNextUpdate } = renderHook(() => usePhotoScoring());
    
    // Add a photo first
    const mockPhoto: Photo = {
      id: '123',
      url: 'url1',
      preview: 'preview',
      file: new File([''], 'test.jpg', { type: 'image/jpeg' }),
      name: 'test.jpg',
      uploaded: true,
      uploading: false
    };
    
    act(() => {
      result.current.addPhotos([mockPhoto]);
    });
    
    // Analyze photos
    let analysisResult;
    await act(async () => {
      analysisResult = await result.current.analyzePhotos();
      await waitForNextUpdate();
    });
    
    expect(result.current.isAnalyzing).toBe(false);
    expect(result.current.analysisResult).not.toBeNull();
    expect(result.current.photoScores.length).toBe(2);
    expect(analysisResult?.score).toBe(85);
  });
  
  test('should clear photos', () => {
    const { result } = renderHook(() => usePhotoScoring());
    
    // Add a photo
    const mockPhoto: Photo = {
      id: '123',
      url: 'test-url',
      file: new File([''], 'test.jpg', { type: 'image/jpeg' }),
      name: 'test.jpg',
      uploaded: true,
      uploading: false
    };
    
    act(() => {
      result.current.addPhotos([mockPhoto]);
    });
    
    expect(result.current.photos.length).toBe(1);
    
    // Clear photos
    act(() => {
      result.current.clearPhotos();
    });
    
    expect(result.current.photos.length).toBe(0);
    expect(result.current.analysisResult).toBeNull();
  });
});
