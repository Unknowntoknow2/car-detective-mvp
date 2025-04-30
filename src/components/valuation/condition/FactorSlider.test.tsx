
import { render, screen, fireEvent } from '@testing-library/react';
import { FactorSlider, ConditionOption } from './FactorSlider';

describe('FactorSlider Component', () => {
  const mockOptions: ConditionOption[] = [
    { value: 0, label: 'Poor', tip: 'Needs major repairs', multiplier: 0.75 },
    { value: 25, label: 'Fair', tip: 'Could use improvement', multiplier: 0.85 },
    { value: 50, label: 'Good', tip: 'Standard condition', multiplier: 0.95 },
    { value: 75, label: 'Very Good', tip: 'Better than average', multiplier: 1.00 },
    { value: 100, label: 'Excellent', tip: 'Like new condition', multiplier: 1.05 },
  ];

  const mockOnChange = jest.fn();

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
    
    // Check if the current value's label is displayed
    expect(screen.getByText('Good')).toBeInTheDocument();
    
    // Check if the tip for the selected value is shown
    expect(screen.getByText('Tip:')).toBeInTheDocument();
    expect(screen.getByText('Standard condition')).toBeInTheDocument();
  });

  it('calls onChange when slider value changes', () => {
    render(
      <FactorSlider
        id="test-slider"
        label="Test Slider"
        options={mockOptions}
        value={50}
        onChange={mockOnChange}
      />
    );

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: 75 } });
    
    expect(mockOnChange).toHaveBeenCalledWith(75);
  });

  it('updates displayed tip when value changes', () => {
    const { rerender } = render(
      <FactorSlider
        id="test-slider"
        label="Test Slider"
        options={mockOptions}
        value={50}
        onChange={mockOnChange}
      />
    );

    // Check initial tip
    expect(screen.getByText('Standard condition')).toBeInTheDocument();
    
    // Update the value
    rerender(
      <FactorSlider
        id="test-slider"
        label="Test Slider"
        options={mockOptions}
        value={75}
        onChange={mockOnChange}
      />
    );
    
    // Check if the tip updated
    expect(screen.getByText('Better than average')).toBeInTheDocument();
    expect(screen.queryByText('Standard condition')).not.toBeInTheDocument();
  });

  it('displays all option labels as marks', () => {
    render(
      <FactorSlider
        id="test-slider"
        label="Test Slider"
        options={mockOptions}
        value={50}
        onChange={mockOnChange}
      />
    );

    // Check if all option labels are displayed as marks
    mockOptions.forEach(option => {
      expect(screen.getAllByText(option.label).length).toBeGreaterThanOrEqual(1);
    });
  });
});
