
import { render } from '@testing-library/react';
import * as rtl from '@testing-library/react';
const { screen, fireEvent } = rtl;
import { describe, it, expect, vi } from 'vitest';
import { FactorSlider, ConditionOption } from '../FactorSlider';

describe('Factor Slider Components', () => {
  const mockAccidentOptions: ConditionOption[] = [
    { value: 0, label: 'No Accidents', tip: 'No accidents – full value', multiplier: 1.00 },
    { value: 25, label: '1 Accident', tip: '1 accident (approximately -5% value)', multiplier: 0.95 },
    { value: 50, label: '2 Accidents', tip: '2 accidents (approximately -10% value)', multiplier: 0.90 },
    { value: 75, label: '3 Accidents', tip: '3 accidents (approximately -15% value)', multiplier: 0.85 },
    { value: 100, label: '4+ Accidents', tip: '4+ accidents (approximately -25% value)', multiplier: 0.75 },
  ];

  const mockOnChange = vi.fn();

  it('renders the accidents slider with correct label and initial value', () => {
    render(
      <FactorSlider
        id="accident-factor"
        label="Accident Count"
        options={mockAccidentOptions}
        value={0}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Accident Count')).toBeInTheDocument();
    expect(screen.getByText('No Accidents')).toBeInTheDocument();
    expect(screen.getByText('No accidents – full value')).toBeInTheDocument();
  });

  it('updates tip text when slider value changes', () => {
    const { rerender } = render(
      <FactorSlider
        id="accident-factor"
        label="Accident Count"
        options={mockAccidentOptions}
        value={0}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('No accidents – full value')).toBeInTheDocument();

    // Update the value
    rerender(
      <FactorSlider
        id="accident-factor"
        label="Accident Count"
        options={mockAccidentOptions}
        value={50}
        onChange={mockOnChange}
      />
    );

    // Check if the tip text is updated
    expect(screen.getByText('2 accidents (approximately -10% value)')).toBeInTheDocument();
    expect(screen.queryByText('No accidents – full value')).not.toBeInTheDocument();
  });

  it('calls onChange when slider value changes', () => {
    render(
      <FactorSlider
        id="accident-factor"
        label="Accident Count"
        options={mockAccidentOptions}
        value={0}
        onChange={mockOnChange}
      />
    );

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: 50 } });
    
    expect(mockOnChange).toHaveBeenCalledWith(50);
  });
});
