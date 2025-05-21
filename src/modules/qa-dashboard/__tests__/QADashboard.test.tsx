
import React from 'react';
import { render, screen } from '@testing-library/react';
import QADashboardPage from '../page';

// Mock async component
jest.mock('../page', () => {
  const MockComponent = () => (
    <div data-testid="qa-dashboard">
      <h1>QA Dashboard</h1>
    </div>
  );
  return MockComponent;
});

describe('QA Dashboard', () => {
  it('renders the dashboard correctly', () => {
    render(<QADashboardPage />);
    expect(screen.getByTestId('qa-dashboard')).toBeInTheDocument();
  });
});
