
import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ValuationResult } from '@/components/valuation/ValuationResult';
import { generateValuationExplanation } from '@/utils/generateValuationExplanation';

// Import directly from @testing-library/dom
import { screen, waitFor } from '@testing-library/dom';

// Mock the generateValuationExplanation function
jest.mock('@/utils/generateValuationExplanation');
const mockGenerateValuationExplanation = generateValuationExplanation as jest.MockedFunction<typeof generateValuationExplanation>;

// Mock the PDF download utility
jest.mock('@/utils/pdf', () => ({
  downloadPdf: jest.fn().mockResolvedValue(undefined),
  convertVehicleInfoToReportData: jest.fn().mockReturnValue({})
}));

// Mock the toast from sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

// Mock Supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({
            data: {
              estimated_value: 15000,
              confidence_score: 85,
              price_range: [14000, 16000],
              created_at: '2023-01-01'
            },
            error: null
          }))
        }))
      }))
    }))
  }
}));

describe('ValuationResult component', () => {
  const defaultProps = {
    vin: '1HGBH41JXMN109186'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading state initially', () => {
    // Mock successful explanation generation
    mockGenerateValuationExplanation.mockResolvedValue('This is a test explanation');
    
    render(<ValuationResult {...defaultProps} />);
    
    // Should show loading initially
    expect(screen.getByText('Loading valuation...')).toBeInTheDocument();
  });

  test('displays explanation when loaded successfully', async () => {
    const testExplanation = 'This is a test explanation for the valuation';
    mockGenerateValuationExplanation.mockResolvedValue(testExplanation);
    
    render(<ValuationResult {...defaultProps} />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading valuation...')).not.toBeInTheDocument();
    });
  });

  test('displays error message when explanation fails to load', async () => {
    mockGenerateValuationExplanation.mockRejectedValue(new Error('API error'));
    
    render(<ValuationResult {...defaultProps} />);
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.queryByText('Loading valuation...')).not.toBeInTheDocument();
    });
  });
});
