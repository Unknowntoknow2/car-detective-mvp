
import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorMessage from '@/components/ui/ErrorMessage';

describe('ErrorMessage component', () => {
  it('renders the error message', () => {
    const errorMessage = 'Something went wrong';
    render(<ErrorMessage message={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument(); // AlertCircle icon
  });
  
  it('applies the correct styling classes', () => {
    render(<ErrorMessage message="Error" />);
    
    const container = screen.getByText('Error').parentElement;
    expect(container).toHaveClass('flex');
    expect(container).toHaveClass('text-destructive');
  });
  
  it('accepts and applies additional className', () => {
    render(<ErrorMessage message="Error" className="custom-class" />);
    
    const container = screen.getByText('Error').parentElement;
    expect(container).toHaveClass('custom-class');
  });
  
  it('returns null when message is empty', () => {
    const { container } = render(<ErrorMessage message="" />);
    
    expect(container).toBeEmptyDOMElement();
  });
});
