import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import QADashboardPage from '../page';

// Import directly from @testing-library/dom
import { screen } from '@testing-library/dom';

const queryClient = new QueryClient();

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('QADashboardPage', () => {
  it('renders without crashing', () => {
    renderWithProviders(<QADashboardPage />);
    expect(screen.getByText('QA Dashboard')).toBeInTheDocument();
  });
});
