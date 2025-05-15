
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PDFDownloadButton } from '@/components/common/PDFDownloadButton';
import { generateValuationPdf } from '@/utils/pdf/generateValuationPdf';
import { toast } from '@/components/ui/use-toast';
import * as fileSaver from 'file-saver';

// Mock the dependencies
jest.mock('@/utils/pdf/generateValuationPdf');
jest.mock('@/components/ui/use-toast');
jest.mock('file-saver');

describe('PDFDownloadButton', () => {
  const mockValuationResult = {
    id: 'test-id',
    make: 'Toyota',
    model: 'Corolla',
    year: 2020,
    mileage: 15000,
    condition: 'Excellent',
    estimated_value: 18000,
    estimatedValue: 18000,
    confidence_score: 95,
    confidenceScore: 95,
    zipCode: '90210',
    zip: '90210',
    adjustments: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (generateValuationPdf as jest.Mock).mockResolvedValue(new Uint8Array([1, 2, 3]));
  });

  test('renders premium download button when isPremium is true', () => {
    render(<PDFDownloadButton valuationResult={mockValuationResult} isPremium={true} />);
    
    expect(screen.getByRole('button', { name: /download report/i })).toBeInTheDocument();
    expect(screen.queryByText(/upgrade to premium/i)).not.toBeInTheDocument();
  });

  test('renders disabled button with tooltip when isPremium is false', () => {
    render(<PDFDownloadButton valuationResult={mockValuationResult} isPremium={false} />);
    
    const button = screen.getByRole('button', { name: /download report/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    
    // Verify tooltip trigger is present
    expect(screen.getByText(/upgrade to premium to download/i)).toBeInTheDocument();
  });

  test('clicking download button triggers PDF generation for premium users', async () => {
    render(<PDFDownloadButton valuationResult={mockValuationResult} isPremium={true} />);
    
    const button = screen.getByRole('button', { name: /download report/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(generateValuationPdf).toHaveBeenCalled();
      expect(fileSaver.saveAs).toHaveBeenCalled();
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        description: expect.stringContaining("successfully")
      }));
    });
  });

  test('shows loading spinner when generating PDF', async () => {
    // Mock a delay in PDF generation
    (generateValuationPdf as jest.Mock).mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve(new Uint8Array([1, 2, 3])), 100);
      });
    });
    
    render(<PDFDownloadButton valuationResult={mockValuationResult} isPremium={true} />);
    
    const button = screen.getByRole('button', { name: /download report/i });
    fireEvent.click(button);
    
    // Check for loading spinner
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Wait for completion
    await waitFor(() => {
      expect(generateValuationPdf).toHaveBeenCalled();
      expect(fileSaver.saveAs).toHaveBeenCalled();
    });
  });

  test('handles error during PDF generation', async () => {
    (generateValuationPdf as jest.Mock).mockRejectedValue(new Error('PDF generation failed'));
    
    render(<PDFDownloadButton valuationResult={mockValuationResult} isPremium={true} />);
    
    const button = screen.getByRole('button', { name: /download report/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        description: expect.stringContaining("Failed to generate"),
        variant: "destructive"
      }));
    });
  });

  test('does not allow non-premium users to download PDF', async () => {
    render(<PDFDownloadButton valuationResult={mockValuationResult} isPremium={false} />);
    
    const button = screen.getByRole('button', { name: /download report/i });
    expect(button).toBeDisabled();
    
    // Try to click the button (should not trigger any action)
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(generateValuationPdf).not.toHaveBeenCalled();
      expect(fileSaver.saveAs).not.toHaveBeenCalled();
    });
  });
});
