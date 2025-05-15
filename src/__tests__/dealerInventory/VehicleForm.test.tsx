
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { DealerVehicleForm } from '@/components/dealer/forms/DealerVehicleForm';

// Mock the form submission handler
const mockOnSubmit = vi.fn();

// Mock the useVehicleUpload hook
vi.mock('@/components/dealer/hooks/useVehicleUpload', () => ({
  useVehicleUpload: () => ({
    isUploading: false,
    uploadProgress: 0,
    photoUrls: [],
    setPhotoUrls: vi.fn(),
    handlePhotoUpload: vi.fn(),
    removePhoto: vi.fn(),
    addVehicle: mockOnSubmit,
    updateVehicle: vi.fn()
  })
}));

describe('DealerVehicleForm', () => {
  beforeEach(() => {
    mockOnSubmit.mockReset();
  });
  
  it('renders the form with all required fields', () => {
    render(<DealerVehicleForm isEditing={false} onSuccess={vi.fn()} />);
    
    // Check for required form fields
    expect(screen.getByLabelText(/make/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mileage/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/condition/i)).toBeInTheDocument();
    
    // Check for submit button
    expect(screen.getByRole('button', { name: /add vehicle|submit|save/i })).toBeInTheDocument();
  });
  
  it('validates required fields on submission', async () => {
    render(<DealerVehicleForm isEditing={false} onSuccess={vi.fn()} />);
    
    // Try to submit without filling required fields
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /add vehicle|submit|save/i }));
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getAllByText(/required|is required/i).length).toBeGreaterThan(0);
    });
    
    // Make sure submission handler wasn't called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
  
  it('submits form with valid data', async () => {
    render(<DealerVehicleForm isEditing={false} onSuccess={vi.fn()} />);
    
    const user = userEvent.setup();
    
    // Fill out required fields
    await user.type(screen.getByLabelText(/make/i), 'Toyota');
    await user.type(screen.getByLabelText(/model/i), 'Camry');
    await user.type(screen.getByLabelText(/year/i), '2020');
    await user.type(screen.getByLabelText(/price/i), '25000');
    await user.type(screen.getByLabelText(/mileage/i), '30000');
    await user.selectOptions(screen.getByLabelText(/condition/i), 'Excellent');
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /add vehicle|submit|save/i }));
    
    // Check that submission handler was called with correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        price: 25000,
        mileage: 30000,
        condition: 'Excellent'
      }));
    });
  });
  
  it('prefills form data in edit mode', () => {
    const vehicleData = {
      id: '123',
      make: 'Honda',
      model: 'Accord',
      year: 2019,
      price: 22000,
      mileage: 40000,
      condition: 'Good',
      status: 'available',
      photos: ['http://example.com/photo.jpg']
    };
    
    render(
      <DealerVehicleForm 
        isEditing={true} 
        onSuccess={vi.fn()} 
        vehicleData={vehicleData} 
      />
    );
    
    // Check if form is prefilled with vehicle data
    expect(screen.getByLabelText(/make/i)).toHaveValue('Honda');
    expect(screen.getByLabelText(/model/i)).toHaveValue('Accord');
    expect(screen.getByLabelText(/year/i)).toHaveValue('2019');
    expect(screen.getByLabelText(/price/i)).toHaveValue('22000');
    expect(screen.getByLabelText(/mileage/i)).toHaveValue('40000');
    
    // Check if submit button text indicates edit mode
    expect(screen.getByRole('button', { name: /update|save changes/i })).toBeInTheDocument();
  });
  
  it('shows loading state when submitting', async () => {
    // Mock loading state
    vi.mock('@/components/dealer/hooks/useVehicleUpload', () => ({
      useVehicleUpload: () => ({
        isUploading: true,
        uploadProgress: 50,
        photoUrls: [],
        setPhotoUrls: vi.fn(),
        handlePhotoUpload: vi.fn(),
        removePhoto: vi.fn(),
        addVehicle: mockOnSubmit,
        updateVehicle: vi.fn()
      })
    }));
    
    render(<DealerVehicleForm isEditing={false} onSuccess={vi.fn()} />);
    
    // Check for loading indicator
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    // Check submit button is disabled
    expect(screen.getByRole('button', { name: /add vehicle|submit|save/i })).toBeDisabled();
  });
});
