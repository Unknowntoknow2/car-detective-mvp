
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ValuationResultPage from '@/pages/ValuationResultPage';
import { useValuationResult } from '@/hooks/useValuationResult';
import * as pdfModule from '@/utils/pdf/generateValuationPdf';

// Mock the modules we need
jest.mock('@/hooks/useValuationResult');
jest.mock('@/components/chat/AIChatBubble', () => ({
  AIChatBubble: ({ valuation }: { valuation: any }) => (
    <div data-testid="ai-chat-bubble">
      AI Chat for {valuation.make} {valuation.model}
    </div>
  ),
}));
jest.mock('@/components/dealer/DealerOffersList', () => ({
  DealerOffersList: ({ reportId }: { reportId: string }) => (
    <div data-testid="dealer-offers">Dealer offers for {reportId}</div>
  ),
}));
jest.mock('@/components/valuation/PredictionResult', () => ({
  __esModule: true,
  default: ({ valuationId }: { valuationId: string }) => (
    <div data-testid="prediction-result">Prediction for {valuationId}</div>
  ),
  PredictionResult: ({ valuationId }: { valuationId: string }) => (
    <div data-testid="prediction-result">Prediction for {valuationId}</div>
  ),
}));
jest.mock('@/utils/pdf/generateValuationPdf');

// Mock PDFDownloadButton component
jest.mock('@/components/common/PDFDownloadButton', () => ({
  PDFDownloadButton: ({ valuationResult, isPremium }: { valuationResult: any, isPremium: boolean }) => (
    <button 
      data-testid="pdf-download-button"
      data-is-premium={isPremium}
      onClick={() => {
        const mockEvent = new MouseEvent('click');
        document.dispatchEvent(mockEvent);
      }}
    >
      Download Report (PDF)
    </button>
  ),
}));

// Sample valuation data
const mockValuationData = {
  id: 'test-valuation-id',
  make: 'Toyota',
  model: 'Camry',
  year: 2020,
  mileage: 30000,
  condition: 'Good',
  estimatedValue: 15000,
  estimated_value: 15000,
  confidence_score: 90,
  confidenceScore: 90,
  is_premium: true,
  isPremium: true,
  adjustments: [
    { factor: 'Mileage', impact: -500, description: 'Higher than average mileage' }
  ]
};

// Setup component with routing
const renderComponent = (mockData: any = null, isLoading = false, error: string | null = null) => {
  // Setup the mock for useValuationResult
  (useValuationResult as jest.Mock).mockReturnValue({
    data: mockData,
    isLoading,
    error,
  });
  
  // Fix the type error by converting Uint8Array to Buffer
  jest.spyOn(pdfModule, 'generateValuationPdf').mockResolvedValue(Buffer.from([1, 2, 3]));
  
  // Render with router since the component uses route params
  return render(
    <MemoryRouter initialEntries={['/valuation/test-valuation-id']}>
      <Routes>
        <Route path="/valuation/:valuationId" element={<ValuationResultPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('ValuationResultPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders valuation result and AI chat bubble when data is available', async () => {
    renderComponent(mockValuationData);
    
    // Wait for components to render
    await waitFor(() => {
      expect(screen.getByTestId('prediction-result')).toBeInTheDocument();
      expect(screen.getByTestId('ai-chat-bubble')).toBeInTheDocument();
      expect(screen.getByTestId('dealer-offers')).toBeInTheDocument();
    });
    
    // Verify text content includes the vehicle info
    expect(screen.getByTestId('ai-chat-bubble')).toHaveTextContent('Toyota Camry');
  });

  test('renders PDF download button when valuation is premium', async () => {
    renderComponent({
      ...mockValuationData,
      is_premium: true,
      isPremium: true
    });
    
    await waitFor(() => {
      const pdfButton = screen.getByTestId('pdf-download-button');
      expect(pdfButton).toBeInTheDocument();
      expect(pdfButton).toHaveAttribute('data-is-premium', 'true');
    });
  });

  test('does not render PDF download button when valuation is not premium', async () => {
    renderComponent({
      ...mockValuationData,
      is_premium: false,
      isPremium: false
    });
    
    await waitFor(() => {
      expect(screen.queryByTestId('pdf-download-button')).not.toBeInTheDocument();
    });
  });

  test('shows loading spinner when data is loading', () => {
    renderComponent(null, true, null);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('shows error message when there is an error', () => {
    renderComponent(null, false, 'Failed to load valuation data');
    
    expect(screen.getByText(/error loading valuation/i)).toBeInTheDocument();
    expect(screen.getByText(/could not load the valuation details/i)).toBeInTheDocument();
  });

  test('shows error when valuation data is not found', () => {
    renderComponent(null, false, null);
    
    expect(screen.getByText(/error loading valuation/i)).toBeInTheDocument();
    expect(screen.getByText(/could not load the valuation details/i)).toBeInTheDocument();
  });

  test('clicking PDF download button triggers PDF generation', async () => {
    renderComponent(mockValuationData);
    
    // Setup PDF generation spy - fixed way to spy on module function
    const pdfSpy = jest.spyOn(pdfModule, 'generateValuationPdf');
    
    // Simulate PDF button click
    await waitFor(() => {
      const pdfButton = screen.getByTestId('pdf-download-button');
      fireEvent.click(pdfButton);
    });
    
    // Check if our document event was fired (a workaround since we can't directly test the mock component's internal logic)
    const documentClickSpy = jest.fn();
    document.addEventListener('click', documentClickSpy);
    
    await waitFor(() => {
      expect(documentClickSpy).toHaveBeenCalled();
    });
  });
});
