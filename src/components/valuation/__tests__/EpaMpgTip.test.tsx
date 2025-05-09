import React from 'react';
import { render } from '@testing-library/react';
import { EpaMpgTip } from '../EpaMpgTip';
import { useEpaMpg } from '@/hooks/useEpaMpg';
import { UseQueryResult } from '@tanstack/react-query';
import { EpaMpgResult } from '@/hooks/useEpaMpg';

// Import directly from @testing-library/dom
import { screen } from '@testing-library/dom';

// Mock the hook
jest.mock('@/hooks/useEpaMpg');

const mockUseEpaMpg = useEpaMpg as jest.MockedFunction<typeof useEpaMpg>;

describe('EpaMpgTip', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    mockUseEpaMpg.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
      isLoadingError: false,
      isPending: true,
      isSuccess: false,
      status: 'loading',
      fetchStatus: 'fetching',
      isRefetchError: false
    } as unknown as UseQueryResult<EpaMpgResult, Error>);

    render(<EpaMpgTip year={2021} make="Toyota" model="Camry" />);

    expect(screen.getByText(/Loading fuel economy data/i)).toBeInTheDocument();
  });

  it('renders high MPG data correctly', () => {
    mockUseEpaMpg.mockReturnValue({
      data: {
        data: {
          menuItem: 'Combined MPG',
          value: '35',
          text: '35 MPG combined (32 city / 40 hwy)'
        },
        source: 'api'
      },
      isLoading: false,
      error: undefined,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
      isLoadingError: false,
      isPending: false,
      isSuccess: true,
      status: 'success',
      fetchStatus: 'idle',
      isRefetchError: false
    } as unknown as UseQueryResult<EpaMpgResult, Error>);

    render(<EpaMpgTip year={2021} make="Toyota" model="Camry" />);

    expect(screen.getByText(/Combined MPG: 35/i)).toBeInTheDocument();
    expect(screen.getByText(/\+3% value adjustment/i)).toBeInTheDocument();
    expect(screen.getByText(/High fuel efficiency adds value/i)).toBeInTheDocument();
  });

  it('renders low MPG data correctly', () => {
    mockUseEpaMpg.mockReturnValue({
      data: {
        data: {
          menuItem: 'Combined MPG',
          value: '18',
          text: '18 MPG combined (16 city / 20 hwy)'
        },
        source: 'api'
      },
      isLoading: false,
      error: undefined,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
      isLoadingError: false,
      isPending: false,
      isSuccess: true,
      status: 'success',
      fetchStatus: 'idle',
      isRefetchError: false
    } as unknown as UseQueryResult<EpaMpgResult, Error>);

    render(<EpaMpgTip year={2021} make="Toyota" model="Camry" />);

    expect(screen.getByText(/Combined MPG: 18/i)).toBeInTheDocument();
    expect(screen.getByText(/-3% value adjustment/i)).toBeInTheDocument();
    expect(screen.getByText(/Low fuel efficiency reduces value/i)).toBeInTheDocument();
  });

  it('renders average MPG data correctly', () => {
    mockUseEpaMpg.mockReturnValue({
      data: {
        data: {
          menuItem: 'Combined MPG',
          value: '25',
          text: '25 MPG combined (22 city / 29 hwy)'
        },
        source: 'api'
      },
      isLoading: false,
      error: undefined,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
      isLoadingError: false,
      isPending: false,
      isSuccess: true,
      status: 'success',
      fetchStatus: 'idle',
      isRefetchError: false
    } as unknown as UseQueryResult<EpaMpgResult, Error>);

    render(<EpaMpgTip year={2021} make="Toyota" model="Camry" />);

    expect(screen.getByText(/Combined MPG: 25/i)).toBeInTheDocument();
    expect(screen.getByText(/No value adjustment/i)).toBeInTheDocument();
    expect(screen.getByText(/Average fuel efficiency/i)).toBeInTheDocument();
  });

  it('renders nothing when there is an error', () => {
    mockUseEpaMpg.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch'),
      isError: true,
      refetch: jest.fn(),
      isRefetching: false,
      isLoadingError: true,
      isPending: false,
      isSuccess: false,
      status: 'error',
      fetchStatus: 'idle',
      isRefetchError: false
    } as unknown as UseQueryResult<EpaMpgResult, Error>);

    const { container } = render(<EpaMpgTip year={2021} make="Toyota" model="Camry" />);
    expect(container.firstChild).toBeNull();
  });
});
