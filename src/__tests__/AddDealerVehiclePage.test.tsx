
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AddDealerVehiclePage } from '@/pages/dealer/AddDealerVehiclePage';
import { vehicleSchema } from '@/components/dealer/schemas/vehicleSchema';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mock Supabase client with proper from().insert().select() chain
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn(),
    auth: {
      getUser: jest.fn()
    }
  },
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock zod validation (if used)
jest.mock('@/components/dealer/schemas/vehicleSchema', () => ({
  vehicleSchema: {
    safeParse: jest.fn(),
  },
}));

describe('AddDealerVehiclePage', () => {
  const mockNavigate = jest.fn();
  
  // Sample vehicle data for tests
  const sampleVehicleData = {
    make: 'Honda',
    model: 'Accord',
    year: 2021,
    price: 25000,
    mileage: 45000,
    vin: '1HGCM82633A004352',
    condition: 'Good',
    description: 'Well maintained sedan with all service records'
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    
    // Mock successful schema validation by default
    (vehicleSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: sampleVehicleData
    });
    
    // Mock successful Supabase getUser
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'test-dealer-id' } },
      error: null
    });
    
    // Mock successful Supabase insertion
    const mockFrom = supabase.from as jest.Mock;
    const mockInsert = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({
      data: { id: '123', ...sampleVehicleData },
      error: null
    });
    
    mockFrom.mockReturnValue({
      insert: mockInsert,
      select: mockSelect,
      single: mockSingle
    });
  });
  
  test('renders all form fields correctly', () => {
    render(<AddDealerVehiclePage />);
    
    // Check for all form fields existence
    expect(screen.getByLabelText(/make/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mileage/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/vin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/condition/i)).toBeInTheDocument();
    
    // Check for buttons
    expect(screen.getByRole('button', { name: /submit|save|add vehicle/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });
  
  test('displays validation errors when submitting empty form', async () => {
    // Mock validation failure
    (vehicleSchema.safeParse as jest.Mock).mockReturnValue({
      success: false,
      error: {
        format: () => ({
          make: { _errors: ['Make is required'] },
          model: { _errors: ['Model is required'] },
          year: { _errors: ['Year is required'] },
          price: { _errors: ['Price is required'] },
          condition: { _errors: ['Condition is required'] }
        })
      }
    });
    
    render(<AddDealerVehiclePage />);
    
    // Submit empty form
    const submitButton = screen.getByRole('button', { name: /submit|save|add vehicle/i });
    fireEvent.click(submitButton);
    
    // Check for validation error messages
    await waitFor(() => {
      expect(screen.getByText(/make is required/i)).toBeInTheDocument();
      expect(screen.getByText(/model is required/i)).toBeInTheDocument();
      expect(screen.getByText(/year is required/i)).toBeInTheDocument();
      expect(screen.getByText(/price is required/i)).toBeInTheDocument();
      expect(screen.getByText(/condition is required/i)).toBeInTheDocument();
    });
    
    // Ensure form wasn't submitted
    // Using proper chaining for the mock
    const mockFrom = supabase.from as jest.Mock;
    expect(mockFrom).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
  
  test('displays validation error for invalid VIN', async () => {
    // Set up the component
    render(<AddDealerVehiclePage />);
    
    // Enter invalid VIN (too short)
    const vinInput = screen.getByLabelText(/vin/i);
    fireEvent.change(vinInput, { target: { value: '12345' } });
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit|save|add vehicle/i });
    
    // Mock VIN-specific validation failure
    (vehicleSchema.safeParse as jest.Mock).mockReturnValue({
      success: false,
      error: {
        format: () => ({
          vin: { _errors: ['VIN must be 17 characters'] }
        })
      }
    });
    
    fireEvent.click(submitButton);
    
    // Check for VIN validation error message
    await waitFor(() => {
      expect(screen.getByText(/vin must be 17 characters/i)).toBeInTheDocument();
    });
  });
  
  test('successfully submits form with valid data', async () => {
    render(<AddDealerVehiclePage />);
    
    // Fill all form fields
    fireEvent.change(screen.getByLabelText(/make/i), { target: { value: sampleVehicleData.make } });
    fireEvent.change(screen.getByLabelText(/model/i), { target: { value: sampleVehicleData.model } });
    fireEvent.change(screen.getByLabelText(/year/i), { target: { value: sampleVehicleData.year } });
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: sampleVehicleData.price } });
    fireEvent.change(screen.getByLabelText(/mileage/i), { target: { value: sampleVehicleData.mileage } });
    fireEvent.change(screen.getByLabelText(/vin/i), { target: { value: sampleVehicleData.vin } });
    
    // For a select input like condition
    fireEvent.change(screen.getByLabelText(/condition/i), { target: { value: sampleVehicleData.condition } });
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit|save|add vehicle/i });
    fireEvent.click(submitButton);
    
    // Verify Supabase getUser was called
    await waitFor(() => {
      expect(supabase.auth.getUser).toHaveBeenCalled();
    });
    
    // Verify Supabase insert was called with correct data
    await waitFor(() => {
      const mockFrom = supabase.from as jest.Mock;
      expect(mockFrom).toHaveBeenCalledWith('dealer_vehicles');
      expect(toast.success).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/dealer/inventory');
    });
  });
  
  test('prevents double form submissions', async () => {
    // Mock a delayed response from Supabase
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'test-dealer-id' } },
      error: null
    });
    
    const mockFrom = supabase.from as jest.Mock;
    const mockInsert = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockImplementation(() => 
      new Promise(resolve => {
        setTimeout(() => {
          resolve({
            data: { id: '123', ...sampleVehicleData },
            error: null
          });
        }, 1000);
      })
    );
    
    mockFrom.mockReturnValue({
      insert: mockInsert,
      select: mockSelect,
      single: mockSingle
    });
    
    render(<AddDealerVehiclePage />);
    
    // Fill required fields (simplified for test brevity)
    fireEvent.change(screen.getByLabelText(/make/i), { target: { value: sampleVehicleData.make } });
    fireEvent.change(screen.getByLabelText(/model/i), { target: { value: sampleVehicleData.model } });
    fireEvent.change(screen.getByLabelText(/year/i), { target: { value: sampleVehicleData.year } });
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: sampleVehicleData.price } });
    fireEvent.change(screen.getByLabelText(/condition/i), { target: { value: sampleVehicleData.condition } });
    
    // Submit form multiple times
    const submitButton = screen.getByRole('button', { name: /submit|save|add vehicle/i });
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);
    
    // Verify Supabase auth.getUser was called only once
    await waitFor(() => {
      expect(supabase.auth.getUser).toHaveBeenCalledTimes(1);
    });
  });
  
  test('navigates to dashboard when cancel button is clicked', () => {
    render(<AddDealerVehiclePage />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/dealer/inventory');
  });
  
  test('displays error toast when Supabase insertion fails', async () => {
    // Mock Supabase getUser success
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'test-dealer-id' } },
      error: null
    });
    
    // Mock Supabase insertion failure
    const mockFrom = supabase.from as jest.Mock;
    const mockInsert = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({
      data: null,
      error: { message: 'Database error' }
    });
    
    mockFrom.mockReturnValue({
      insert: mockInsert,
      select: mockSelect,
      single: mockSingle
    });
    
    render(<AddDealerVehiclePage />);
    
    // Fill required fields (simplified)
    fireEvent.change(screen.getByLabelText(/make/i), { target: { value: sampleVehicleData.make } });
    fireEvent.change(screen.getByLabelText(/model/i), { target: { value: sampleVehicleData.model } });
    fireEvent.change(screen.getByLabelText(/year/i), { target: { value: sampleVehicleData.year } });
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: sampleVehicleData.price } });
    fireEvent.change(screen.getByLabelText(/condition/i), { target: { value: sampleVehicleData.condition } });
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit|save|add vehicle/i });
    fireEvent.click(submitButton);
    
    // Verify error toast was shown
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
