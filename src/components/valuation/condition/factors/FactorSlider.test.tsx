
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FactorSlider } from '../FactorSlider';
import { ConditionOption } from '../types';

// Import directly from @testing-library/dom
import { screen, fireEvent } from '@testing-library/dom';

describe('FactorSlider Component', () => {
  const mockOptions: ConditionOption[] = [
    { value: 0, label: 'Poor', tip: 'Needs major repairs', multiplier: 0.75 },
    { value: 25, label: 'Fair', tip: 'Could use improvement', multiplier: 0.85 },
    { value: 50, label: 'Good', tip: 'Standard condition', multiplier: 0.95 },
    { value: 75, label: 'Very Good', tip: 'Better than average', multiplier: 1.00 },
    { value: 100, label: 'Excellent', tip: 'Like new condition', multiplier: 1.05 },
  ];

  const mockOnChange = vi.fn();

  it('renders with correct initial value and label', () => {
    render(
      <FactorSlider
        id="test-slider"
        label="Test Slider"
        options={mockOptions}
        value={50}
        onChange={mockOnChange}
      />
    );

    // Check if the label is rendered
    expect(screen.getByText('Test Slider')).toBeInTheDocument();
    
    // Check if the options are displayed
    expect(screen.getByText('Poor')).toBeInTheDocument();
    expect(screen.getByText('Good')).toBeInTheDocument();
    expect(screen.getByText('Excellent')).toBeInTheDocument();
  });
});
