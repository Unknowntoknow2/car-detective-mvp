
import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import AddDealerVehiclePage from '@/pages/dealer/AddDealerVehiclePage';

// Mock dependencies
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock Supabase
const mockSupabase = {
  from: vi.fn(),
  auth: {
    getUser: vi.fn(),
  },
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase,
}));

// Mock vehicle schema
const mockVehicleSchema = {
  parse: vi.fn(),
};

vi.mock('@/components/dealer/schemas/vehicleSchema', () => ({
  vehicleSchema: mockVehicleSchema,
}));

describe('AddDealerVehiclePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks
    mockNavigate.mockClear();
    mockVehicleSchema.parse.mockImplementation((data) => data);
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });
    
    const mockQueryBuilder = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { id: 'test-vehicle-id' },
        error: null,
      }),
    };
    
    mockSupabase.from.mockReturnValue(mockQueryBuilder);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    );
  };

  it('renders the form', () => {
    renderWithRouter(<AddDealerVehiclePage />);
    
    expect(screen.getByText('Add Vehicle to Inventory')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    renderWithRouter(<AddDealerVehiclePage />);
    
    // Try to submit empty form
    const submitButton = screen.getByRole('button', { name: /add vehicle/i });
    await user.click(submitButton);
    
    // Should see validation errors
    await waitFor(() => {
      expect(screen.getByText(/make is required/i)).toBeInTheDocument();
    });
  });

  it('submits valid form data', async () => {
    const user = userEvent.setup();
    mockVehicleSchema.parse.mockImplementation((data) => ({
      ...data,
      dealer_id: 'test-user-id',
    }));

    const mockQueryBuilder = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { id: 'test-vehicle-id' },
        error: null,
      }),
    };
    
    mockSupabase.from.mockReturnValue(mockQueryBuilder);

    renderWithRouter(<AddDealerVehiclePage />);
    
    // Fill in the form
    await user.type(screen.getByLabelText(/make/i), 'Toyota');
    await user.type(screen.getByLabelText(/model/i), 'Camry');
    await user.type(screen.getByLabelText(/year/i), '2020');
    await user.type(screen.getByLabelText(/mileage/i), '50000');
    await user.type(screen.getByLabelText(/price/i), '25000');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /add vehicle/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dealer');
    });
  });

  it('handles submission errors', async () => {
    const user = userEvent.setup();
    mockVehicleSchema.parse.mockImplementation((data) => data);
    
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });

    const mockQueryBuilder = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      }),
    };
    
    mockSupabase.from.mockReturnValue(mockQueryBuilder);

    renderWithRouter(<AddDealerVehiclePage />);
    
    // Fill in minimal required fields
    await user.type(screen.getByLabelText(/make/i), 'Toyota');
    await user.type(screen.getByLabelText(/model/i), 'Camry');
    await user.type(screen.getByLabelText(/year/i), '2020');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /add vehicle/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/error adding vehicle/i)).toBeInTheDocument();
    });
  });

  it('handles authentication errors', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Not authenticated' },
    });

    const mockQueryBuilder = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn(),
    };
    
    mockSupabase.from.mockReturnValue(mockQueryBuilder);

    renderWithRouter(<AddDealerVehiclePage />);
    
    expect(screen.getByText('Add Vehicle to Inventory')).toBeInTheDocument();
  });
});
