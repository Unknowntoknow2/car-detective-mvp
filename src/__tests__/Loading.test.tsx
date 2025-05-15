
import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from '@/components/ui/Loading';

describe('Loading component', () => {
  it('renders the loading spinner with text', () => {
    render(<Loading />);
    
    // Check for the loading spinner
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    
    // Check for loading text
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  
  it('has the correct styling classes', () => {
    render(<Loading />);
    
    // Verify correct styling classes
    const container = screen.getByText('Loading...').parentElement?.parentElement;
    expect(container).toHaveClass('flex');
    expect(container).toHaveClass('items-center');
    expect(container).toHaveClass('justify-center');
  });
});
