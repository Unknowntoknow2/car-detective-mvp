<<<<<<< HEAD

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
=======
import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ValuationResult from "@/components/valuation/ValuationResult";
import { generateValuationExplanation } from "@/utils/generateValuationExplanation";

// Import directly from @testing-library/dom
import { screen, waitFor } from "@testing-library/dom";

// Mock the generateValuationExplanation function
jest.mock("@/utils/generateValuationExplanation");
const mockGenerateValuationExplanation =
  generateValuationExplanation as jest.MockedFunction<
    typeof generateValuationExplanation
  >;

// Mock the PDF download utility
jest.mock("@/utils/pdf", () => ({
  downloadPdf: jest.fn().mockResolvedValue(undefined),
  convertVehicleInfoToReportData: jest.fn().mockReturnValue({}),
}));

// Mock the toast from sonner
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("ValuationResult component", () => {
  const defaultProps = {
    make: "Toyota",
    model: "Camry",
    year: 2018,
    mileage: 50000,
    condition: "Good",
    location: "90210",
    valuation: 15000,
    valuationId: "test-valuation-id", // Add the required valuationId prop
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
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

<<<<<<< HEAD
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
=======
  test("displays loading state initially", () => {
    // Mock successful explanation generation
    mockGenerateValuationExplanation.mockResolvedValue(
      "This is a test explanation",
    );

    render(<ValuationResult {...defaultProps} />);

    // Should show loading state initially
    expect(screen.getByText("Generating explanation...")).toBeInTheDocument();
  });

  test("displays explanation when loaded successfully", async () => {
    const testExplanation = "This is a test explanation for the valuation";
    mockGenerateValuationExplanation.mockResolvedValue(testExplanation);

    render(<ValuationResult {...defaultProps} />);

    // Wait for the explanation to load
    await waitFor(() => {
      expect(screen.getByText(testExplanation)).toBeInTheDocument();
    });
  });

  test("displays error message when explanation fails to load", async () => {
    mockGenerateValuationExplanation.mockRejectedValue(new Error("API error"));

    render(<ValuationResult {...defaultProps} />);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText("Failed to load explanation:"))
        .toBeInTheDocument();
    });
  });

  test("regenerates explanation when refresh button is clicked", async () => {
    const testExplanation = "Initial explanation";
    mockGenerateValuationExplanation.mockResolvedValue(testExplanation);

    render(<ValuationResult {...defaultProps} />);

    // Wait for the initial explanation to load
    await waitFor(() => {
      expect(screen.getByText(testExplanation)).toBeInTheDocument();
    });

    // Setup mock for regeneration
    const newExplanation = "Regenerated explanation";
    mockGenerateValuationExplanation.mockResolvedValue(newExplanation);

    // Click the regenerate button
    const regenerateButton = screen.getByText(/Regenerate Explanation/i);
    userEvent.click(regenerateButton);

    // Should show loading state again
    expect(screen.getByText("Regenerating...")).toBeInTheDocument();

    // Should eventually show the new explanation
    await waitFor(() => {
      expect(screen.getByText(newExplanation)).toBeInTheDocument();
    });

    // The function should have been called twice
    expect(mockGenerateValuationExplanation).toHaveBeenCalledTimes(2);
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  });
});
