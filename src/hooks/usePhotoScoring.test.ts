
import { renderHook, act } from '@testing-library/react';
import { usePhotoScoring } from './usePhotoScoring';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    storage: {
      from: jest.fn().mockReturnValue({
        upload: jest.fn(),
        getPublicUrl: jest.fn().mockImplementation((path) => ({
          data: { publicUrl: `https://example.com/${path}` }
        })),
      }),
    },
    functions: {
      invoke: jest.fn(),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn(),
      single: jest.fn(),
    }),
  },
}));

// Mock File and URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

describe('usePhotoScoring', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should upload photos and process scores successfully', async () => {
    // Mock successful file upload
    const mockUpload = jest.fn().mockResolvedValue({ error: null });
    (supabase.storage.from as jest.Mock).mockReturnValue({
      upload: mockUpload,
      getPublicUrl: jest.fn().mockImplementation((path) => ({
        data: { publicUrl: `https://example.com/${path}` }
      })),
    });

    // Mock photo scoring function responses for three photos
    const mockScoreFn = jest.fn()
      // First photo: Good condition
      .mockResolvedValueOnce({
        data: {
          score: 0.75,
          metadata: JSON.stringify({
            condition: 'Good',
            confidenceScore: 78,
            issuesDetected: ['Minor scratches']
          })
        },
        error: null
      })
      // Second photo: Excellent condition
      .mockResolvedValueOnce({
        data: {
          score: 0.9,
          metadata: JSON.stringify({
            condition: 'Excellent',
            confidenceScore: 85,
            issuesDetected: []
          })
        },
        error: null
      })
      // Third photo: Fair condition
      .mockResolvedValueOnce({
        data: {
          score: 0.6,
          metadata: JSON.stringify({
            condition: 'Fair',
            confidenceScore: 72,
            issuesDetected: ['Visible dent', 'Paint damage']
          })
        },
        error: null
      });

    (supabase.functions.invoke as jest.Mock).mockImplementation(mockScoreFn);

    // Create mock files
    const mockFiles = [
      new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
      new File(['test2'], 'test2.jpg', { type: 'image/jpeg' }),
      new File(['test3'], 'test3.jpg', { type: 'image/jpeg' }),
    ];

    // Render the hook with the modern approach
    const { result } = renderHook(() => usePhotoScoring('test-valuation-id'));

    // Upload the photos
    let uploadResult;
    await act(async () => {
      uploadResult = await result.current.uploadPhotos(mockFiles);
    });

    // Verify results
    expect(mockUpload).toHaveBeenCalledTimes(3);
    expect(supabase.functions.invoke).toHaveBeenCalledTimes(3);
    
    // Verify the photo score (should be the average of all scores)
    const expectedAvgScore = (0.75 + 0.9 + 0.6) / 3;
    expect(result.current.photoScore).toBeCloseTo(expectedAvgScore);
    
    // Verify AI condition - should be 'Good' as it's the dominant condition with high confidence
    expect(result.current.aiCondition).toEqual({
      condition: 'Excellent', // Highest confidence score
      confidenceScore: 85,
      issuesDetected: expect.arrayContaining(['Minor scratches', 'Visible dent', 'Paint damage']),
    });
    
    // Verify photos array populated
    expect(result.current.photos.length).toBe(3);
  });

  it('should handle errors during photo upload', async () => {
    // Mock failed file upload
    const mockError = new Error('Upload failed');
    (supabase.storage.from as jest.Mock).mockReturnValue({
      upload: jest.fn().mockRejectedValue(mockError),
      getPublicUrl: jest.fn(),
    });

    // Create mock file
    const mockFiles = [
      new File(['test'], 'test.jpg', { type: 'image/jpeg' }),
    ];

    // Render the hook with the modern approach
    const { result } = renderHook(() => usePhotoScoring('test-valuation-id'));

    // Upload the photos
    await act(async () => {
      await result.current.uploadPhotos(mockFiles);
    });

    // Verify error state
    expect(result.current.error).toBe('Failed to upload photos: Upload failed');
    expect(result.current.photos.length).toBe(0);
    expect(result.current.photoScore).toBeNull();
  });

  it('should handle partial success with one failed photo score', async () => {
    // Mock successful file upload
    const mockUpload = jest.fn().mockResolvedValue({ error: null });
    (supabase.storage.from as jest.Mock).mockReturnValue({
      upload: mockUpload,
      getPublicUrl: jest.fn().mockImplementation((path) => ({
        data: { publicUrl: `https://example.com/${path}` }
      })),
    });

    // Mock photo scoring function - two success, one failure
    const mockScoreFn = jest.fn()
      .mockResolvedValueOnce({
        data: {
          score: 0.8,
          metadata: JSON.stringify({
            condition: 'Good',
            confidenceScore: 80,
            issuesDetected: []
          })
        },
        error: null
      })
      .mockResolvedValueOnce({
        data: null,
        error: { message: 'Failed to process image' }
      })
      .mockResolvedValueOnce({
        data: {
          score: 0.7,
          metadata: JSON.stringify({
            condition: 'Good',
            confidenceScore: 75,
            issuesDetected: ['Minor wear']
          })
        },
        error: null
      });

    (supabase.functions.invoke as jest.Mock).mockImplementation(mockScoreFn);

    // Create mock files
    const mockFiles = [
      new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
      new File(['test2'], 'test2.jpg', { type: 'image/jpeg' }),
      new File(['test3'], 'test3.jpg', { type: 'image/jpeg' }),
    ];

    // Render the hook with the modern approach
    const { result } = renderHook(() => usePhotoScoring('test-valuation-id'));

    // Upload the photos
    await act(async () => {
      await result.current.uploadPhotos(mockFiles);
    });

    // Verify that we still get a partial result with the successful photos
    expect(result.current.error).toBe('One or more photos could not be processed');
    
    // Average should be calculated only from successful scores
    const expectedAvgScore = (0.8 + 0.7) / 2;
    expect(result.current.photoScore).toBeCloseTo(expectedAvgScore);
    
    // Should still have a condition assessment from successful photos
    expect(result.current.aiCondition).not.toBeNull();
    expect(result.current.aiCondition?.condition).toBe('Good');
    
    // Should have uploaded all 3 photos but only 2 should have scores
    expect(mockUpload).toHaveBeenCalledTimes(3);
    expect(result.current.photos.length).toBe(3);
  });
});
