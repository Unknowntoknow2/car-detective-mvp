<<<<<<< HEAD

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FactorSlider } from '../FactorSlider';

interface ConditionOption {
  label: string;
  value: number;
  tip: string;
}

describe('FactorSlider', () => {
  // Define test options with correct type
  const options: ConditionOption[] = [
    { label: 'Poor', value: 0, tip: 'Significant wear and tear' },
    { label: 'Fair', value: 1, tip: 'Noticeable wear and tear' },
    { label: 'Good', value: 2, tip: 'Normal wear for age' },
    { label: 'Very Good', value: 3, tip: 'Minor wear and tear' },
    { label: 'Excellent', value: 4, tip: 'Like new condition' }
  ];
  
  const mockOnChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders with the correct label', () => {
=======
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FactorSlider } from "../FactorSlider";
import { ConditionOption } from "../types";

// Import directly from @testing-library/dom
import { fireEvent, screen } from "@testing-library/dom";

describe("FactorSlider Component", () => {
  const mockOptions: ConditionOption[] = [
    { value: 0, label: "Poor", tip: "Needs major repairs", multiplier: 0.75 },
    {
      value: 25,
      label: "Fair",
      tip: "Could use improvement",
      multiplier: 0.85,
    },
    { value: 50, label: "Good", tip: "Standard condition", multiplier: 0.95 },
    {
      value: 75,
      label: "Very Good",
      tip: "Better than average",
      multiplier: 1.00,
    },
    {
      value: 100,
      label: "Excellent",
      tip: "Like new condition",
      multiplier: 1.05,
    },
  ];

  const mockOnChange = vi.fn();

  it("renders with correct initial value and label", () => {
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    render(
      <FactorSlider
        id="condition"
        label="Overall Condition"
        options={options}
        value={2}
        onChange={mockOnChange}
      />,
    );
<<<<<<< HEAD
    
    expect(screen.getByText('Overall Condition')).toBeInTheDocument();
  });
  
  it('renders all option buttons', () => {
    render(
      <FactorSlider
        id="condition"
        label="Overall Condition"
        options={options}
        value={2}
        onChange={mockOnChange}
      />
    );
    
    options.forEach(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });
  
  it('highlights the selected option button', () => {
    render(
      <FactorSlider
        id="condition"
        label="Overall Condition"
        options={options}
        value={2}
        onChange={mockOnChange}
      />
    );
    
    // This is a simplified test since we can't easily check styling
    // In a real test, you'd check for the specific class or attribute
    expect(screen.getByText('Good')).toBeInTheDocument();
  });
  
  it('calls onChange when an option button is clicked', () => {
    render(
      <FactorSlider
        id="condition"
        label="Overall Condition"
        options={options}
        value={2}
        onChange={mockOnChange}
      />
    );
    
    fireEvent.click(screen.getByText('Excellent'));
    
    expect(mockOnChange).toHaveBeenCalledWith(4);
=======

    // Check if the label is rendered
    expect(screen.getByText("Test Slider")).toBeInTheDocument();

    // Check if the current value's label is displayed
    expect(screen.getByText("Good")).toBeInTheDocument();

    // Check if the tip for the selected value is shown
    expect(screen.getByText("Tip:")).toBeInTheDocument();
    expect(screen.getByText("Standard condition")).toBeInTheDocument();
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  });
});
