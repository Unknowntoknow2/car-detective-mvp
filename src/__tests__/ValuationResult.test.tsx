import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ValuationResult from '@/components/valuation/ValuationResult';
import { generateValuationExplanation } from '@/utils/generateValuationExplanation';
import * as rtl from '@testing-library/react';
const { screen, waitFor } = rtl;

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
    make: 'Toyota',
    model: 'Camry',
    year: 2018,
    mileage: 50000,
    condition: 'Good',
    location: '90210',
    valuation: 15000,
    valuationId: 'test-valuation-id' // Add the required valuationId prop
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading state initially', () => {
    // Mock successful explanation generation
    mockGenerateValuationExplanation.mockResolvedValue('This is a test explanation');
    
    render(<ValuationResult {...defaultProps} />);
    
    // Should show loading state initially
    expect(screen.getByText('Generating explanation...')).toBeInTheDocument();
  });

  test('displays explanation when loaded successfully', async () => {
    const testExplanation = 'This is a test explanation for the valuation';
    mockGenerateValuationExplanation.mockResolvedValue(testExplanation);
    
    render(<ValuationResult {...defaultProps} />);
    
    // Wait for the explanation to load
    await waitFor(() => {
      expect(screen.getByText(testExplanation)).toBeInTheDocument();
    });
  });

  test('displays error message when explanation fails to load', async () => {
    mockGenerateValuationExplanation.mockRejectedValue(new Error('API error'));
    
    render(<ValuationResult {...defaultProps} />);
    
    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('Failed to load explanation:')).toBeInTheDocument();
    });
  });

  test('regenerates explanation when refresh button is clicked', async () => {
    const testExplanation = 'Initial explanation';
    mockGenerateValuationExplanation.mockResolvedValue(testExplanation);
    
    render(<ValuationResult {...defaultProps} />);
    
    // Wait for the initial explanation to load
    await waitFor(() => {
      expect(screen.getByText(testExplanation)).toBeInTheDocument();
    });
    
    // Setup mock for regeneration
    const newExplanation = 'Regenerated explanation';
    mockGenerateValuationExplanation.mockResolvedValue(newExplanation);
    
    // Click the regenerate button
    const regenerateButton = screen.getByText(/Regenerate Explanation/i);
    userEvent.click(regenerateButton);
    
    // Should show loading state again
    expect(screen.getByText('Regenerating...')).toBeInTheDocument();
    
    // Should eventually show the new explanation
    await waitFor(() => {
      expect(screen.getByText(newExplanation)).toBeInTheDocument();
    });
    
    // The function should have been called twice
    expect(mockGenerateValuationExplanation).toHaveBeenCalledTimes(2);
  });
});
