
// @vitest-environment jsdom
import React from 'react';
import { render } from '@testing-library/react';
import { ZipCodeInput } from '../ZipCodeInput';
import { validateZipCode } from '@/utils/validation/zipCodeValidator';
import { vi } from 'vitest';
import '@testing-library/jest-dom'; // Import Jest DOM extensions correctly

// Import directly from @testing-library/dom
import { screen, fireEvent, waitFor } from '@testing-library/dom';

// Mock the validateZipCode function
vi.mock('@/utils/validation/zipCodeValidator', () => ({
  validateZipCode: vi.fn(),
  debounce: (fn: any) => fn // Mock debounce to run immediately
}));

describe('ZipCodeInput', () => {
  const mockOnChange = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    (validateZipCode as any).mockResolvedValue({ isValid: true, city: 'Test City', state: 'TS' });
  });

  it('renders correctly', () => {
    render(<ZipCodeInput value="" onChange={mockOnChange} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('restricts input to numbers only', () => {
    render(<ZipCodeInput value="" onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'abc123def' } });
    expect(mockOnChange).toHaveBeenCalledWith('123');
  });

  it('limits input to 5 characters', () => {
    render(<ZipCodeInput value="" onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: '1234567890' } });
    expect(mockOnChange).toHaveBeenCalledWith('12345');
  });

  it('validates the ZIP code when 5 digits are entered', async () => {
    render(<ZipCodeInput value="12345" onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: '12345' } });
    
    await waitFor(() => {
      expect(validateZipCode).toHaveBeenCalledWith('12345');
    });
  });

  it('validates the ZIP code on blur', async () => {
    render(<ZipCodeInput value="12345" onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(validateZipCode).toHaveBeenCalledWith('12345');
    });
  });

  it('does not validate if fewer than 5 digits', async () => {
    render(<ZipCodeInput value="1234" onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: '1234' } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(validateZipCode).not.toHaveBeenCalled();
    });
  });

  it('shows error for invalid ZIP codes', async () => {
    (validateZipCode as any).mockResolvedValue({ isValid: false });
    
    render(<ZipCodeInput value="12345" onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: '12345' } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid zip code/i)).toBeInTheDocument();
    });
  });

  it('shows city and state for valid ZIP codes', async () => {
    (validateZipCode as any).mockResolvedValue({ isValid: true, city: 'Test City', state: 'TS' });
    
    render(<ZipCodeInput value="12345" onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: '12345' } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(screen.getByText('Test City, TS')).toBeInTheDocument();
    });
  });
});
