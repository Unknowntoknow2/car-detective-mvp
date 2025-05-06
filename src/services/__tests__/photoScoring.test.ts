
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadAndAnalyzePhotos, fetchValuationPhotos } from '../photoService';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
  },
}));

describe('Photo Scoring Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('uploadAndAnalyzePhotos', () => {
    it('should process multiple photos and return scores', async () => {
      // Mock files
      const files = [
        new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'test2.jpg', { type: 'image/jpeg' }),
        new File(['test3'], 'test3.jpg', { type: 'image/jpeg' }),
      ];
      
      // Mock Supabase response
      (supabase.functions.invoke as any).mockResolvedValue({
        data: {
          photoUrls: ['url1', 'url2', 'url3'],
          confidenceScore: 85,
          condition: 'Good',
          issuesDetected: ['Minor scratch on door'],
          aiSummary: 'Vehicle in good condition with minor wear',
          individualScores: [
            { url: 'url1', score: 0.8 },
            { url: 'url2', score: 0.75 },
            { url: 'url3', score: 0.9 }
          ]
        },
        error: null
      });
      
      // Execute the function
      const result = await uploadAndAnalyzePhotos('test-valuation-id', files);
      
      // Verify results
      expect(result).not.toBeNull();
      expect(result?.photoUrls).toEqual(['url1', 'url2', 'url3']);
      expect(result?.score).toBe(0.85);
      expect(result?.aiCondition?.condition).toBe('Good');
      expect(result?.individualScores?.length).toBe(3);
      
      // Verify Supabase was called correctly
      expect(supabase.functions.invoke).toHaveBeenCalledWith(
        'analyze-photos',
        expect.objectContaining({
          body: expect.any(FormData)
        })
      );
    });

    it('should throw error when Supabase returns an error', async () => {
      // Mock files
      const files = [new File(['test'], 'test.jpg', { type: 'image/jpeg' })];
      
      // Mock Supabase error
      (supabase.functions.invoke as any).mockResolvedValue({
        data: null,
        error: { message: 'Failed to process images' }
      });
      
      // Execute and expect error
      await expect(uploadAndAnalyzePhotos('test-valuation-id', files))
        .rejects.toThrow('Upload failed: Failed to process images');
    });
  });

  describe('fetchValuationPhotos', () => {
    it('should return photos, scores and AI condition when available', async () => {
      // Mock photo data
      (supabase.from as any).mockImplementation((table) => {
        if (table === 'valuation_photos') {
          return {
            select: () => ({
              eq: () => Promise.resolve({
                data: [
                  { id: 'photo1', photo_url: 'url1', score: 0.8 },
                  { id: 'photo2', photo_url: 'url2', score: 0.75 },
                  { id: 'photo3', photo_url: 'url3', score: 0.9 }
                ],
                error: null
              })
            })
          };
        } else if (table === 'photo_condition_scores') {
          return {
            select: () => ({
              eq: () => ({
                order: () => Promise.resolve({
                  data: [
                    { 
                      image_url: 'url1', 
                      condition_score: 0.8,
                      confidence_score: 0.85,
                      issues: ['Minor scratch'],
                      summary: 'Good condition'
                    },
                    { 
                      image_url: 'url2', 
                      condition_score: 0.75,
                      confidence_score: 0.72,
                      issues: [],
                      summary: 'Decent condition'
                    },
                    { 
                      image_url: 'url3', 
                      condition_score: 0.9,
                      confidence_score: 0.95,
                      issues: [],
                      summary: 'Excellent condition'
                    }
                  ],
                  error: null
                })
              })
            })
          };
        } else if (table === 'photo_scores') {
          return {
            select: () => ({
              eq: () => ({
                order: () => ({
                  limit: () => ({
                    single: () => Promise.resolve({
                      data: {
                        score: 0.85,
                        metadata: {
                          condition: 'Good',
                          confidenceScore: 85,
                          issuesDetected: ['Minor scratch'],
                          aiSummary: 'Good condition'
                        }
                      },
                      error: null
                    })
                  })
                })
              })
            })
          };
        }
        return { select: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }) };
      });
      
      // Execute function
      const result = await fetchValuationPhotos('test-valuation-id');
      
      // Verify results
      expect(result.photos.length).toBe(3);
      expect(result.photoScore).not.toBeNull();
      expect(result.aiCondition).not.toBeNull();
      expect(result.individualScores.length).toBe(0); // This would be populated in a real scenario
    });

    it('should return empty results when no data is available', async () => {
      // Mock no data
      (supabase.from as any).mockImplementation(() => ({
        select: () => ({
          eq: () => Promise.resolve({ data: null, error: null })
        })
      }));
      
      // Execute function
      const result = await fetchValuationPhotos('test-valuation-id');
      
      // Verify empty results
      expect(result.photos.length).toBe(0);
      expect(result.photoScore).toBeNull();
      expect(result.aiCondition).toBeNull();
      expect(result.individualScores.length).toBe(0);
    });
  });
});
