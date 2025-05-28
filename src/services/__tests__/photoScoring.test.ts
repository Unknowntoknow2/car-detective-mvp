import { analyzePhotos } from '@/services/photo/analyzePhotos';
import { supabase } from '@/integrations/supabase/client';

jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: jest.fn()
    }
  }
}));

describe('Photo Scoring Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully analyze photos and return scores', async () => {
    // Arrange
    const mockPhotoUrls = ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'];
    const mockValuationId = 'test-valuation-id';
    const mockScores = [
      { url: 'https://example.com/photo1.jpg', score: 0.75 },
      { url: 'https://example.com/photo2.jpg', score: 0.9 }
    ];
    const mockAiCondition = {
      condition: 'Good' as const,
      confidenceScore: 80,
      issuesDetected: ['Minor scratches']
    };
    
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: { scores: mockScores, aiCondition: mockAiCondition },
      error: null
    });

    // Act
    const result = await analyzePhotos(mockPhotoUrls, mockValuationId);

    // Assert
    expect(supabase.functions.invoke).toHaveBeenCalledWith('score-image', {
      body: { photoUrls: mockPhotoUrls, valuationId: mockValuationId }
    });
    expect(result).toEqual({
      overallScore: (0.75 + 0.9) / 2,
      individualScores: mockScores.map(score => ({
        url: score.url,
        score: score.score,
        isPrimary: false,
        explanation: undefined
      })),
      aiCondition: mockAiCondition
    });
  });

  it('should handle errors when the Supabase function fails', async () => {
    // Arrange
    const mockPhotoUrls = ['https://example.com/photo1.jpg'];
    const mockValuationId = 'test-valuation-id';
    const mockError = new Error('Failed to invoke Supabase function');
    
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: mockError
    });

    // Act & Assert
    await expect(analyzePhotos(mockPhotoUrls, mockValuationId)).rejects.toThrow(mockError.message);
    expect(supabase.functions.invoke).toHaveBeenCalledWith('score-image', {
      body: { photoUrls: mockPhotoUrls, valuationId: mockValuationId }
    });
  });

  it('should handle a missing scores array in the response', async () => {
    // Arrange
    const mockPhotoUrls = ['https://example.com/photo1.jpg'];
    const mockValuationId = 'test-valuation-id';
    
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: { aiCondition: {} },
      error: null
    });

    // Act & Assert
    await expect(analyzePhotos(mockPhotoUrls, mockValuationId)).rejects.toThrow('Invalid response from photo analysis service');
    expect(supabase.functions.invoke).toHaveBeenCalledWith('score-image', {
      body: { photoUrls: mockPhotoUrls, valuationId: mockValuationId }
    });
  });

  it('should handle an empty scores array in the response', async () => {
    // Arrange
    const mockPhotoUrls = ['https://example.com/photo1.jpg'];
    const mockValuationId = 'test-valuation-id';
    
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: { scores: [], aiCondition: {} },
      error: null
    });

    // Act
    const result = await analyzePhotos(mockPhotoUrls, mockValuationId);

    expect(result).toEqual({
      overallScore: NaN,
      individualScores: [],
      aiCondition: undefined
    });
    expect(supabase.functions.invoke).toHaveBeenCalledWith('score-image', {
      body: { photoUrls: mockPhotoUrls, valuationId: mockValuationId }
    });
  });
});
