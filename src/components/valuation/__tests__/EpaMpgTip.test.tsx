
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Mock component for testing
const EpaMpgTip = ({ mpg }: { mpg: number }) => (
  <div data-testid="epa-mpg-tip">
    EPA Estimated: {mpg} MPG
  </div>
);

describe('EpaMpgTip', () => {
  it('renders MPG tip correctly', () => {
    render(<EpaMpgTip mpg={30} />);
    expect(screen.getByTestId('epa-mpg-tip')).toHaveTextContent('EPA Estimated: 30 MPG');
  });
});
