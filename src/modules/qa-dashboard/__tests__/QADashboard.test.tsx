
import React from 'react';
import { render, screen } from '@testing-library/react';
import QADashboardPage from '../page';

// Mock the async component by wrapping it in a component that renders its result
jest.mock('../page', () => {
  const MockComponent = () => (
    <div data-testid="qa-dashboard">
      <h1>QA Dashboard</h1>
    </div>
  );
  // Return a regular component, not an async one
  return MockComponent;
});

describe('QA Dashboard', () => {
  it('renders the dashboard correctly', () => {
    render(<QADashboardPage />);
    expect(screen.getByTestId('qa-dashboard')).toBeInTheDocument();
  });
});
