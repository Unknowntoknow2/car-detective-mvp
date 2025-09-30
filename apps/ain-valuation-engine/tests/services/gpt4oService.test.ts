// Mock OpenAI
const mockCreate = jest.fn();
jest.mock('openai', () => {
  class MockOpenAI {
    chat = {
      completions: {
        create: mockCreate
      }
    };
  }
  return {
    __esModule: true,
    default: MockOpenAI
  };
});
import { getAIResponse } from '../../src/ain-backend/gpt4oService';

describe('GPT-4o Service', () => {
  const mockContext = {
    conversationHistory: ['Hello'],
    vehicleData: {
      year: 2020,
      make: 'Toyota',
      model: 'Camry'
    },
    userIntent: 'valuation'
  };

  beforeEach(() => {
    jest.resetModules();
    mockCreate.mockReset();
    jest.clearAllMocks();
    process.env.VITE_OPENAI_API_KEY = 'test-key';
  });

  afterEach(() => {
    delete process.env.VITE_OPENAI_API_KEY;
  });

  it('should return AI response with valid input', async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: 'Based on the vehicle data provided, this is a 2020 Toyota Camry.' } }]
    });
    const result = await getAIResponse('Tell me about this car', mockContext);
    expect(result).toBe('Based on the vehicle data provided, this is a 2020 Toyota Camry.');
    expect(mockCreate).toHaveBeenCalledWith({
      model: 'gpt-4o',
      messages: expect.arrayContaining([
        expect.objectContaining({
          role: 'system',
          content: expect.stringContaining('vehicle valuation')
        }),
        expect.objectContaining({
          role: 'user',
          content: expect.stringContaining('Tell me about this car')
        })
      ]),
      max_tokens: 500,
      temperature: 0.7
    });
  });

  it('should handle OpenAI API errors gracefully', async () => {
    mockCreate.mockRejectedValue(new Error('API rate limit exceeded'));
    const result = await getAIResponse('Test input', mockContext);
    expect(result).toBe("I'm currently unable to process your request. Please try again later.");
  });

  it('should handle empty response from OpenAI', async () => {
    mockCreate.mockResolvedValue({ choices: [] });
    const result = await getAIResponse('Test input', mockContext);
    expect(result).toBe("I'm sorry, I couldn't process your request.");
  });

  it('should include context in the request', async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: 'Response with context' } }]
    });
    await getAIResponse('Test input', mockContext);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({
            content: expect.stringContaining(JSON.stringify(mockContext))
          })
        ])
      })
    );
  });
});
