
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ValuationResult } from '@/components/valuation/ValuationResult';

describe('ValuationResult', () => {
  const mockValuationData = {
    success: true,
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    mileage: 45000,
    condition: 'excellent',
    zipCode: '90210',
    estimatedValue: 21500,
    confidenceScore: 0.91,
    valuationId: 'test-val-001',
  };

  it('renders vehicle info correctly', () => {
    render(
      <ValuationResult
        valuationId={mockValuationData.valuationId}
        isManualValuation={false}
        manualValuationData={mockValuationData}
      />
    );

    expect(screen.getByText(/Toyota Camry/i)).toBeInTheDocument();
    expect(screen.getByText(/2020/i)).toBeInTheDocument();
    expect(screen.getByText(/\$21,500/)).toBeInTheDocument();
    expect(screen.getByText(/Confidence Score/i)).toBeInTheDocument();
  });

  it('displays mileage and ZIP code correctly', () => {
    render(
      <ValuationResult
        valuationId={mockValuationData.valuationId}
        isManualValuation={false}
        manualValuationData={mockValuationData}
      />
    );

    expect(screen.getByText(/45,000 miles/i)).toBeInTheDocument();
    expect(screen.getByText(/ZIP 90210/i)).toBeInTheDocument();
  });

  it('renders confidence score as a percentage', () => {
    render(
      <ValuationResult
        valuationId={mockValuationData.valuationId}
        isManualValuation={false}
        manualValuationData={mockValuationData}
      />
    );

    expect(screen.getByText(/91% Confidence/i)).toBeInTheDocument();
  });
});
