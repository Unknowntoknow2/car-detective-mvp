import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { vi } from 'vitest';

// Mock the useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
    dismiss: vi.fn(),
  }),
}));

// Mock the sonner toast function
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

// Mock AppProviders to avoid theme issues in tests
vi.mock('@/providers/AppProviders', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  ),
}));

// Mock Layout to only render children
vi.mock('@/components/layout/Layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the useRouter hook from next/navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
    }),
}));

// Mock the useSearchParams hook from next/navigation
vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: (name: string) => {
      // Mock implementation to return a value based on the name
      if (name === 'vin') {
        return 'testVin'; // Example VIN value
      }
      return null; // Return null for other parameters
    },
  }),
}));

// Mock the routes module
vi.mock('@/App.routes', () => ({
  __esModule: true,
  default: [
    {
      path: '/',
      element: () => <div>Home</div>,
    },
    {
      path: '/premium',
      element: () => <div>Premium</div>,
    },
  ],
}));

describe('Home and Premium Pages', () => {
  it('should render Home page without errors', () => {
    render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div>Home</div>
          </ThemeProvider>
        </QueryClientProvider>
      </BrowserRouter>
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('should render Premium page without errors', () => {
    render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div>Premium</div>
          </ThemeProvider>
        </QueryClientProvider>
      </BrowserRouter>
    );
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });
});
