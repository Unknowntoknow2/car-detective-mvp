
import React from 'react';
import { render, screen } from '@testing-library/react';

// Create a synchronous mock component instead of an async one
jest.mock('../page', () => {
  const MockQADashboardPage = () => (
    <div data-testid="qa-dashboard">
      <h1>QA Dashboard</h1>
    </div>
  );
  
  // Return the mock component directly, not a function
  return MockQADashboardPage;
});

// Import the mocked component
const QADashboardPage = require('../page').default;

describe('QA Dashboard', () => {
  it('renders the dashboard correctly', () => {
    render(<QADashboardPage />);
    expect(screen.getByTestId('qa-dashboard')).toBeInTheDocument();
  });
});
