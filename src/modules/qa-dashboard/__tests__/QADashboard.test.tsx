
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QADashboardPage } from '../page';
import { useAdminRole } from '@/hooks/useAdminRole';
import { supabase } from '@/integrations/supabase/client';

// Mock the hooks and Supabase
jest.mock('@/hooks/useAdminRole');
jest.mock('@/integrations/supabase/client');

describe('QA Dashboard', () => {
  beforeEach(() => {
    // Mock the admin role hook
    (useAdminRole as jest.Mock).mockReturnValue({
      isAdmin: true,
      isCheckingRole: false
    });
    
    // Mock Supabase response
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      not: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      then: jest.fn().mockResolvedValue({
        data: [
          {
            id: '1',
            created_at: '2023-05-01T12:00:00Z',
            make: 'Toyota',
            model: 'Camry',
            year: 2020,
            vin: 'ABC123',
            estimated_value: 15000,
            confidence_score: 85,
            premium_unlocked: true,
            valuation_photos: { count: 2 },
            orders: { count: 1 }
          },
        ],
        error: null
      })
    });
  });

  it('renders the dashboard for admin users', async () => {
    render(
      <BrowserRouter>
        <QADashboardPage />
      </BrowserRouter>
    );
    
    // Check that the dashboard title is rendered
    expect(screen.getByText('QA Dashboard')).toBeInTheDocument();
    
    // Wait for the data to load
    await waitFor(() => {
      // Check that the health stats are rendered
      expect(screen.getByText('GPT Explanation Rate')).toBeInTheDocument();
      expect(screen.getByText('Photo Scoring Rate')).toBeInTheDocument();
    });
  });

  it('redirects non-admin users', async () => {
    // Mock as non-admin
    (useAdminRole as jest.Mock).mockReturnValue({
      isAdmin: false,
      isCheckingRole: false
    });
    
    const mockNavigate = jest.fn();
    
    // Mock useNavigate
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate
    }));
    
    render(
      <BrowserRouter>
        <QADashboardPage />
      </BrowserRouter>
    );
    
    // Wait for the redirect check
    await waitFor(() => {
      expect(screen.getByText('Checking access...')).toBeInTheDocument();
    });
  });
});
