
import React from 'react';
import { render, screen } from '@testing-library/react';
import { EpaMpgTip } from '../EpaMpgTip';
import { useEpaMpg } from '@/hooks/useEpaMpg';

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
    });

    render(<EpaMpgTip year={2021} make="Toyota" model="Camry" />);

    expect(screen.getByText(/Loading fuel economy data/i)).toBeInTheDocument();
  });

  it('renders high MPG data correctly', () => {
    mockUseEpaMpg.mockReturnValue({
      data: {
        data: [
          { menuItem: '1', value: '123', text: 'Combined MPG: 35' }
        ],
        source: 'api'
      },
      isLoading: false,
      error: undefined,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
      isLoadingError: false,
    });

    render(<EpaMpgTip year={2021} make="Toyota" model="Camry" />);

    expect(screen.getByText(/Combined MPG: 35/i)).toBeInTheDocument();
    expect(screen.getByText(/\+3% value adjustment/i)).toBeInTheDocument();
    expect(screen.getByText(/High fuel efficiency adds value/i)).toBeInTheDocument();
  });

  it('renders low MPG data correctly', () => {
    mockUseEpaMpg.mockReturnValue({
      data: {
        data: [
          { menuItem: '1', value: '123', text: 'Combined MPG: 18' }
        ],
        source: 'api'
      },
      isLoading: false,
      error: undefined,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
      isLoadingError: false,
    });

    render(<EpaMpgTip year={2021} make="Toyota" model="Camry" />);

    expect(screen.getByText(/Combined MPG: 18/i)).toBeInTheDocument();
    expect(screen.getByText(/-3% value adjustment/i)).toBeInTheDocument();
    expect(screen.getByText(/Low fuel efficiency reduces value/i)).toBeInTheDocument();
  });

  it('renders average MPG data correctly', () => {
    mockUseEpaMpg.mockReturnValue({
      data: {
        data: [
          { menuItem: '1', value: '123', text: 'Combined MPG: 25' }
        ],
        source: 'api'
      },
      isLoading: false,
      error: undefined,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
      isLoadingError: false,
    });

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
    });

    const { container } = render(<EpaMpgTip year={2021} make="Toyota" model="Camry" />);
    expect(container.firstChild).toBeNull();
  });
});
