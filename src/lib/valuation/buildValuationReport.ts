import { renderHook, act } from '@testing-library/react-hooks';
import { usePhotoScoring } from './usePhotoScoring';

// Mock Supabase integration
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    storage: {
      from: () => ({
        upload: jest.fn(() => ({ data: {}, error: null })),
        getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'http://mocked-url.com/photo.jpg' } }))
      })
    },
    from: () => ({
      insert: jest.fn(() => ({ error: null }))
    })
  }
}));

// Mock UUID
jest.mock('uuid', () => ({ v4: () => 'mocked-uuid' }));

// Delay mock
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('usePhotoScoring Hook', () => {
  it('should upload and score a photo correctly', async () => {
    const { result } = renderHook(() => usePhotoScoring('valuation-123'));

    const file = new File(['fake'], 'photo.png', { type: 'image/png' });

    await act(async () => {
      await result.current.handleFileSelect(file);
    });

    expect(result.current.photos).toHaveLength(1);
    expect(result.current.photoScores[0]).toBeGreaterThanOrEqual(0.6);
    expect(result.current.photoScores[0]).toBeLessThanOrEqual(0.95);
    expect(result.current.isUploading).toBe(false);
    expect(result.current.isScoring).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should reset state properly', async () => {
    const { result } = renderHook(() => usePhotoScoring('valuation-123'));

    act(() => {
      result.current.setPhotos([{ photoUrl: 'url', thumbnailUrl: 'url', score: 0.88, valuationId: 'valuation-123' }]);
    });

    act(() => {
      result.current.resetUpload();
    });

    expect(result.current.photos).toHaveLength(0);
    expect(result.current.error).toBe(null);
    expect(result.current.uploadProgress).toBe(0);
  });

  it('should allow removing individual photos', async () => {
    const { result } = renderHook(() => usePhotoScoring('valuation-123'));

    act(() => {
      result.current.setPhotos([
        { photoUrl: 'url1', thumbnailUrl: 'url1', score: 0.88, valuationId: 'valuation-123' },
        { photoUrl: 'url2', thumbnailUrl: 'url2', score: 0.77, valuationId: 'valuation-123' }
      ]);
    });

    act(() => {
      result.current.removePhoto(0);
    });

    expect(result.current.photos).toHaveLength(1);
    expect(result.current.photos[0].photoUrl).toBe('url2');
  });
});
