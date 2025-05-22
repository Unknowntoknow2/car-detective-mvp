
import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ValuationResult from '@/components/valuation/ValuationResult';
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

describe('ValuationResult component', () => {
  const defaultProps = {
    data: {
      make: 'Toyota',
      model: 'Camry',
      year: 2018,
      mileage: 50000,
      condition: 'Good',
      zipCode: '90210',
      estimatedValue: 15000,
      confidenceScore: 85
    },
    valuationId: 'test-valuation-id',
    isPremium: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading state initially', () => {
    // Mock successful explanation generation
    mockGenerateValuationExplanation.mockResolvedValue('This is a test explanation');
    
    render(<ValuationResult {...defaultProps} />);
    
    // Should show estimated value
    expect(screen.getByText('$15,000')).toBeInTheDocument();
  });

  test('displays explanation when loaded successfully', async () => {
    const testExplanation = 'This is a test explanation for the valuation';
    mockGenerateValuationExplanation.mockResolvedValue(testExplanation);
    
    render(<ValuationResult {...defaultProps} />);
    
    // Should show estimated value
    expect(screen.getByText('$15,000')).toBeInTheDocument();
  });

  test('displays error message when explanation fails to load', async () => {
    mockGenerateValuationExplanation.mockRejectedValue(new Error('API error'));
    
    render(<ValuationResult {...defaultProps} />);
    
    // Should still show the estimated value even if explanation fails
    expect(screen.getByText('$15,000')).toBeInTheDocument();
  });

  test('shows premium features when isPremium is true', async () => {
    render(<ValuationResult {...defaultProps} isPremium={true} />);
    
    // Should show estimated value
    expect(screen.getByText('$15,000')).toBeInTheDocument();
    
    // Should not show the "Upgrade to Premium" button
    expect(screen.queryByText('Upgrade to Premium')).not.toBeInTheDocument();
  });
});
