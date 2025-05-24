
import React from 'react';
import { render } from '@testing-library/react';
import { ZipValidation } from './ZipValidation';
import { useZipValidation } from '@/hooks/useZipValidation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import directly from @testing-library/dom
import { screen, waitFor } from '@testing-library/dom';

// Mock the hook
jest.mock('@/hooks/useZipValidation');

const mockUseZipValidation = useZipValidation as jest.MockedFunction<typeof useZipValidation>;

describe('ZipValidation', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    mockUseZipValidation.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ZipValidation zip="90210" />
      </QueryClientProvider>
    );

    expect(screen.getByText(/Validating/i)).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    mockUseZipValidation.mockReturnValue({
      data: undefined,
      loading: false,
      error: 'Invalid ZIP code',
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ZipValidation zip="00000" />
      </QueryClientProvider>
    );

    expect(screen.getByText(/Invalid ZIP/i)).toBeInTheDocument();
  });

  it('renders valid ZIP data correctly', () => {
    mockUseZipValidation.mockReturnValue({
      data: {
        'post code': '90210',
        country: 'United States',
        places: [
          {
            'place name': 'Beverly Hills',
            state: 'California',
            'state abbreviation': 'CA',
            latitude: '34.0901',
            longitude: '-118.4065',
          },
        ],
      },
      loading: false,
      error: undefined,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ZipValidation zip="90210" />
      </QueryClientProvider>
    );

    expect(screen.getByText(/Beverly Hills, CA/i)).toBeInTheDocument();
  });

  it('does not render when zip is invalid', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ZipValidation zip="123" />
      </QueryClientProvider>
    );

    expect(screen.queryByText(/Validating/i)).not.toBeInTheDocument();
  });

  it('renders compact version correctly', () => {
    mockUseZipValidation.mockReturnValue({
      data: {
        'post code': '90210',
        country: 'United States',
        places: [
          {
            'place name': 'Beverly Hills',
            state: 'California',
            'state abbreviation': 'CA',
            latitude: '34.0901',
            longitude: '-118.4065',
          },
        ],
      },
      loading: false,
      error: undefined,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ZipValidation zip="90210" compact={true} />
      </QueryClientProvider>
    );

    expect(screen.getByText(/Beverly Hills, CA/i)).toBeInTheDocument();
    // We should not see the latitude and longitude in compact mode
    expect(screen.queryByText(/Latitude/i)).not.toBeInTheDocument();
  });
});
