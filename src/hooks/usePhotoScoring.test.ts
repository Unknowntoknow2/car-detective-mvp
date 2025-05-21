import { renderHook, act } from '@testing-library/react-hooks';
import { usePhotoScoring } from './usePhotoScoring';

// Mock dependencies
jest.mock('@/services/photoScoringService', () => ({
  uploadPhotoForScoring: jest.fn()
}));

// Import the mocked module
import { uploadPhotoForScoring } from '@/services/photoScoringService';

describe('usePhotoScoring', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePhotoScoring('test-valuation-id'));
    
    expect(result.current.isUploading).toBe(false);
    expect(result.current.photoScore).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should handle photo upload success', async () => {
    // Mock successful upload with a score
    const mockScore = 85;
    (uploadPhotoForScoring as jest.Mock).mockResolvedValue({ 
      score: mockScore, 
      success: true 
    });
    
    const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    const { result, waitForNextUpdate } = renderHook(() => 
      usePhotoScoring('test-valuation-id')
    );
    
    // Start upload
    let uploadPromise: Promise<any>;
    
    act(() => {
      uploadPromise = result.current.uploadPhoto(testFile);
    });
    
    // Wait for state to update
    await waitForNextUpdate();
    
    // Upload should be in progress
    expect(result.current.isUploading).toBe(true);
    
    // Wait for upload to complete
    await uploadPromise;
    await waitForNextUpdate();
    
    // Verify final state
    expect(result.current.isUploading).toBe(false);
    expect(result.current.photoScore).toBe(mockScore);
    expect(result.current.error).toBeNull();
    
    // Verify the upload function was called correctly
    expect(uploadPhotoForScoring).toHaveBeenCalledWith(
      'test-valuation-id',
      testFile
    );
  });

  it('should handle photo upload failure', async () => {
    // Mock a failed upload
    (uploadPhotoForScoring as jest.Mock).mockRejectedValue(new Error('Upload failed'));
    
    const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    const { result, waitForNextUpdate } = renderHook(() => 
      usePhotoScoring('test-valuation-id')
    );
    
    // Start upload
    let uploadPromise: Promise<any>;
    
    act(() => {
      uploadPromise = result.current.uploadPhoto(testFile);
    });
    
    // Wait for state to update
    await waitForNextUpdate();
    
    // Upload should be in progress
    expect(result.current.isUploading).toBe(true);
    
    // Wait for upload to complete
    try {
      await uploadPromise;
    } catch {}
    await waitForNextUpdate();
    
    // Verify final state
    expect(result.current.isUploading).toBe(false);
    expect(result.current.photoScore).toBeNull();
    expect(result.current.error).toBe('Failed to upload photo and get score.');
  });

  it('should reset state when valuationId changes', () => {
    const { result, rerender } = renderHook(
      (valuationId) => usePhotoScoring(valuationId),
      {
        initialProps: 'test-valuation-id-1',
      }
    );

    // Initial state
    expect(result.current.isUploading).toBe(false);
    expect(result.current.photoScore).toBeNull();
    expect(result.current.error).toBeNull();

    // Simulate a score being set
    act(() => {
      result.current.setPhotoScore(75);
    });
    expect(result.current.photoScore).toBe(75);

    // Rerender with a new valuationId
    rerender('test-valuation-id-2');

    // Verify that the state has been reset
    expect(result.current.isUploading).toBe(false);
    expect(result.current.photoScore).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
