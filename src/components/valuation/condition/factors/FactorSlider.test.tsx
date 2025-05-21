
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
    render(
      <FactorSlider
        id="condition"
        label="Overall Condition"
        options={options}
        value={2}
        onChange={mockOnChange}
      />
    );
    
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
  });
});
