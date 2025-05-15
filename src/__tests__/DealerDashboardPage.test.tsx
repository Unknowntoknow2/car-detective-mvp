
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import DealerDashboardPage from '@/pages/dealer/DealerDashboardPage';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

// Mock both useAuth hook and Supabase
jest.mock('@/hooks/useAuth');
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    data: null,
    error: null
  }
}));

// Sample mock data for inventory
const mockVehicles = [
  {
    id: '1',
    dealer_id: 'dealer-123',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    mileage: 35000,
    price: 22500,
    status: 'available',
    photos: ['https://example.com/camry.jpg'],
    condition: 'Excellent',
    created_at: '2025-05-01T10:00:00Z',
    updated_at: '2025-05-01T10:00:00Z'
  },
  {
    id: '2',
    dealer_id: 'dealer-123',
    make: 'BMW',
    model: 'X5',
    year: 2019,
    mileage: 45000,
    price: 42000,
    status: 'available',
    photos: ['https://example.com/bmw.jpg'],
    condition: 'Good',
    created_at: '2025-05-02T10:00:00Z',
    updated_at: '2025-05-02T10:00:00Z'
  },
  {
    id: '3',
    dealer_id: 'dealer-123',
    make: 'Honda',
    model: 'Accord',
    year: 2021,
    mileage: 15000,
    price: 28000,
    status: 'pending',
    photos: [],
    condition: 'Excellent',
    created_at: '2025-05-03T10:00:00Z',
    updated_at: '2025-05-03T10:00:00Z'
  }
];

// Use this function to mock the Supabase response
const mockSupabaseResponse = (data = mockVehicles, error = null) => {
  // Reset the mock
  jest.spyOn(supabase, 'from').mockReturnValue({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        order: jest.fn().mockReturnValue({
          data,
          error
        })
      })
    })
  } as any);
};

// Setup mock for auth
const mockAuthUser = (isDealer = true) => {
  (useAuth as jest.Mock).mockReturnValue({
    user: {
      id: 'dealer-123',
      email: 'dealer@example.com',
      user_metadata: {
        role: isDealer ? 'dealer' : 'individual'
      }
    },
    isAuthenticated: true,
    isLoading: false
  });
};

describe('DealerDashboardPage', () => {
  // Helper to render the component inside a router
  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={['/dealer-dashboard']}>
        <Routes>
          <Route path="/dealer-dashboard" element={<DealerDashboardPage />} />
          <Route path="/dealer/inventory/add" element={<div>Add Vehicle Page</div>} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders dealer dashboard with vehicle inventory', async () => {
    // Set up mocks
    mockAuthUser();
    mockSupabaseResponse();

    // Render the component
    renderComponent();

    // Check dashboard title is rendered
    expect(screen.getByText(/Dealer Dashboard/i)).toBeInTheDocument();

    // Check that inventory is loaded
    await waitFor(() => {
      expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
      expect(screen.getByText('BMW X5')).toBeInTheDocument();
      expect(screen.getByText('Honda Accord')).toBeInTheDocument();
    });

    // Check price and year displayed
    expect(screen.getByText('$22,500')).toBeInTheDocument();
    expect(screen.getByText('$42,000')).toBeInTheDocument();
    expect(screen.getByText('$28,000')).toBeInTheDocument();

    // Check status badges
    expect(screen.getAllByText('Available').length).toBe(2);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  test('renders empty state when no vehicles are found', async () => {
    // Set up mocks
    mockAuthUser();
    mockSupabaseResponse([], null);

    // Render the component
    renderComponent();

    // Check for empty state message
    await waitFor(() => {
      expect(screen.getByText('No vehicles found in your inventory yet.')).toBeInTheDocument();
    });
  });

  test('renders "Add Vehicle" button and navigates correctly', async () => {
    // Set up mocks
    mockAuthUser();
    mockSupabaseResponse();

    // Render the component
    renderComponent();

    // Find Add Vehicle button
    const addVehicleButton = await screen.findByText('Add Vehicle');
    expect(addVehicleButton).toBeInTheDocument();

    // Click the button
    await userEvent.click(addVehicleButton);

    // Check navigation
    await waitFor(() => {
      expect(screen.getByText('Add Vehicle Page')).toBeInTheDocument();
    });
  });

  test('redirects if user is not a dealer', async () => {
    // Set up mocks for non-dealer user
    mockAuthUser(false);
    mockSupabaseResponse();

    // Render the component
    renderComponent();

    // Should redirect to home page
    await waitFor(() => {
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });
  });

  test('handles fetch error correctly', async () => {
    // Set up mocks
    mockAuthUser();
    mockSupabaseResponse(null, { message: 'Failed to fetch inventory' });

    // Render the component
    renderComponent();

    // Check error message
    await waitFor(() => {
      expect(screen.getByText(/error loading inventory/i)).toBeInTheDocument();
    });
  });
});
