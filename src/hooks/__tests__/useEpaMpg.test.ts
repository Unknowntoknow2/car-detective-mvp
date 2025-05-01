
import { renderHook, waitFor } from '@testing-library/react';
import { useEpaMpg } from '../useEpaMpg';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import React from 'react';

// Mock the Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: jest.fn()
    }
  }
}));

// Mock the toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn()
  }
}));

const mockFunctionInvoke = supabase.functions.invoke as jest.Mock;

// Create a wrapper with React Query provider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useEpaMpg', () => {
  beforeEach(() => {
    mockFunctionInvoke.mockReset();
  });
  
  it('should fetch EPA MPG data successfully', async () => {
    // Mock the Supabase response
    const mockMpgData = {
      data: [
        { 
          menuItem: '1',
          value: '123', 
          text: 'Combined MPG: 25' 
        }
      ],
      source: 'api' as const
    };
    
    mockFunctionInvoke.mockResolvedValue({ 
      data: mockMpgData,
      error: null
    });
    
    // Render the hook
    const { result } = renderHook(() => useEpaMpg(2021, 'Toyota', 'Camry'), {
      wrapper: createWrapper()
    });
    
    // Initially it should be loading
    expect(result.current.isLoading).toBe(true);
    
    // Wait for the query to resolve
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // Check that the data is correct
    expect(result.current.data).toEqual(mockMpgData);
    expect(result.current.error).toBeNull();
    
    // Verify that Supabase was called with the correct parameters
    expect(mockFunctionInvoke).toHaveBeenCalledWith('fetch_epa_mpg', {
      body: { year: 2021, make: 'Toyota', model: 'Camry' }
    });
  });
  
  it('should handle errors correctly', async () => {
    // Mock an error response
    mockFunctionInvoke.mockResolvedValue({
      data: null,
      error: { message: 'API error' }
    });
    
    // Render the hook
    const { result } = renderHook(() => useEpaMpg(2021, 'Toyota', 'Camry'), {
      wrapper: createWrapper()
    });
    
    // Wait for the query to resolve (or fail)
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // Check that the error is captured
    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toBeUndefined();
  });
  
  it('should not run query if parameters are missing', async () => {
    // Render the hook with missing parameters
    const { result } = renderHook(() => useEpaMpg(0, '', ''), {
      wrapper: createWrapper()
    });
    
    // The query should be disabled
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    
    // Supabase should not have been called
    expect(mockFunctionInvoke).not.toHaveBeenCalled();
  });
});
