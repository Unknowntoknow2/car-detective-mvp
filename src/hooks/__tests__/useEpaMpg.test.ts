
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEpaMpg } from '../useEpaMpg';
import { supabase } from '@/integrations/supabase/client';
import React from 'react';

// Mock the Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('useEpaMpg', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    jest.clearAllMocks();
  });

  it('should return null when required parameters are missing', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useEpaMpg(0, '', ''), { wrapper });
    
    await waitFor(() => {
      expect(result.current.data).toBeNull();
    });
  });

  it('should fetch EPA MPG data successfully', async () => {
    const mockData = {
      data: {
        menuItem: 'Sample',
        value: '25',
        text: 'Test'
      },
      source: 'api'
    };

    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: mockData,
      error: null,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useEpaMpg(2020, 'Honda', 'Civic'), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
    });

    expect(supabase.functions.invoke).toHaveBeenCalledWith('fetch_epa_mpg', {
      body: { year: 2020, make: 'Honda', model: 'Civic' },
    });
  });

  it('should handle errors', async () => {
    const mockError = new Error('Failed to fetch EPA MPG data');
    
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: mockError.message },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useEpaMpg(2020, 'Honda', 'Civic'), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
