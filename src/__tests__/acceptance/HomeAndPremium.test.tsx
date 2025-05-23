
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { expect, describe, it, beforeEach } from 'vitest';
import { EnhancedHomePage } from '@/components/home/EnhancedHomePage';
import PremiumPage from '@/pages/PremiumPage';
import { AppProviders } from '@/providers/AppProviders';
import ToastProvider from '@/providers/ToastProvider';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <AppProviders>
      <ToastProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </ToastProvider>
    </AppProviders>
  );
};

describe('Home Page', () => {
  beforeEach(() => {
    renderWithProviders(<EnhancedHomePage />);
  });

  it('renders hero section', async () => {
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });

  it('renders lookup tabs', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Get Started With Your Valuation/i)).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /vin/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /plate/i })).toBeInTheDocument();
    });
  });

  it('displays VIN lookup form', async () => {
    await waitFor(() => {
      const vinTab = screen.getByRole('tab', { name: /vin/i });
      vinTab.click();
      expect(screen.getByPlaceholderText(/Enter 17-character VIN/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /lookup vin/i })).toBeInTheDocument();
    });
  });

  it('displays premium services section', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Experience Premium Valuation/i)).toBeInTheDocument();
    });
  });

  it('displays key features section', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Key Features/i)).toBeInTheDocument();
    });
  });

  it('displays AI assistant preview', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Ask Our AI Assistant/i)).toBeInTheDocument();
    });
  });
});

describe('Premium Page', () => {
  beforeEach(() => {
    renderWithProviders(<PremiumPage />);
  });

  it('renders premium hero section', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Advanced Vehicle Valuation & Analytics/i)).toBeInTheDocument();
    });
  });

  it('renders valuation lookup tabs', async () => {
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /vin/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /plate/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /manual/i })).toBeInTheDocument();
    });
  });

  it('displays VIN lookup form in premium page', async () => {
    await waitFor(() => {
      const vinTab = screen.getByRole('tab', { name: /vin/i });
      vinTab.click();
      expect(screen.getByPlaceholderText(/Enter 17-character VIN/i)).toBeInTheDocument();
    });
  });

  it('displays key features section in premium page', async () => {
    await waitFor(() => {
      expect(screen.getAllByText(/Key Features/i)[0]).toBeInTheDocument();
    });
  });

  it('renders comparison section', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Choose Your Valuation Package/i)).toBeInTheDocument();
    });
  });
});
