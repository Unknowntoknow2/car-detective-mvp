import { describe, it, expect, vi } from 'vitest';
import { getPrioritizedValuationData, getDataSourceExplanation } from '@/utils/followUpDataPrioritization';

// Mock Supabase for testing
const mockSupabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        order: () => ({
          maybeSingle: () => Promise.resolve({ data: null, error: null })
        })
      })
    })
  })
};

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase
}));

describe('Follow-up Data Prioritization', () => {
  it('should prioritize user-provided data over system defaults', async () => {
    const result = await getPrioritizedValuationData('test-vin', {
      mileage: 50000,
      condition: 'good',
      zipCode: '90210'
    });

    expect(result.dataSource).toBe('initial_input');
    expect(result.followUpCompleted).toBe(false);
    expect(result.prioritizedFields.mileage.source).toBe('initial_input');
    expect(result.prioritizedFields.mileage.confidence).toBe('medium');
  });

  it('should generate appropriate data source explanations', () => {
    const prioritizedData = {
      mileage: 50000,
      condition: 'good',
      zipCode: '90210',
      dataSource: 'user_followup' as const,
      followUpCompleted: true,
      prioritizedFields: {
        mileage: { value: 50000, source: 'user_followup' as const, confidence: 'high' as const },
        condition: { value: 'good', source: 'user_followup' as const, confidence: 'high' as const },
        zipCode: { value: '90210', source: 'user_followup' as const, confidence: 'high' as const }
      }
    };

    const explanation = getDataSourceExplanation(prioritizedData);
    expect(explanation).toContain('enhanced follow-up data');
    expect(explanation).toContain('improved accuracy');
  });

  it('should handle system defaults when no user data available', async () => {
    const result = await getPrioritizedValuationData('test-vin', {});

    expect(result.mileage).toBe(60000); // Default value
    expect(result.condition).toBe('good'); // Default value
    expect(result.zipCode).toBe('94016'); // Default value
    expect(result.prioritizedFields.mileage.source).toBe('system_default');
    expect(result.prioritizedFields.mileage.confidence).toBe('low');
  });
});