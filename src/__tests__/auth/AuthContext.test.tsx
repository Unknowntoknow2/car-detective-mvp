
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'sonner';

// Mock Supabase
vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn()
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null })
    })
  }
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

// Test component using the auth context
const TestComponent = () => {
  const { user, signIn, signUp, signOut, isLoading, error, session } = useAuth();
  
  return (
    <div>
      <div data-testid="loading-state">{isLoading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="user-state">{user ? user.email : 'No User'}</div>
      <div data-testid="error-state">{error || 'No Error'}</div>
      <div data-testid="session-state">{session ? 'Session Active' : 'No Session'}</div>
      <button onClick={() => signIn('test@example.com', 'password')}>Sign In</button>
      <button onClick={() => signUp('test@example.com', 'password')}>Sign Up</button>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};

describe('AuthContext', () => {
  const renderWithAuth = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('initializes with loading state and no user', async () => {
    renderWithAuth();
    
    expect(screen.getByTestId('loading-state').textContent).toBe('Loading');
    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe('Not Loading');
    });
    expect(screen.getByTestId('user-state').textContent).toBe('No User');
  });
  
  it('handles sign in success', async () => {
    const mockSignInWithPassword = vi.fn().mockResolvedValue({ 
      error: null,
      data: { user: { id: '123', email: 'test@example.com' } }
    });
    
    const { supabase } = await import('@/lib/supabaseClient');
    supabase.auth.signInWithPassword = mockSignInWithPassword;
    
    renderWithAuth();
    
    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe('Not Loading');
    });
    
    const user = userEvent.setup();
    await user.click(screen.getByText('Sign In'));
    
    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password'
    });
    
    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('sign'));
  });
  
  it('handles sign in error', async () => {
    const mockSignInWithPassword = vi.fn().mockResolvedValue({ 
      error: { message: 'Invalid credentials' },
      data: { user: null }
    });
    
    const { supabase } = await import('@/lib/supabaseClient');
    supabase.auth.signInWithPassword = mockSignInWithPassword;
    
    renderWithAuth();
    
    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe('Not Loading');
    });
    
    const user = userEvent.setup();
    await user.click(screen.getByText('Sign In'));
    
    await waitFor(() => {
      expect(screen.getByTestId('error-state').textContent).toBe('Invalid credentials');
    });
    
    expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Invalid credentials'));
  });
  
  it('handles sign up success', async () => {
    const mockSignUp = vi.fn().mockResolvedValue({ 
      error: null,
      data: { user: { id: '123', email: 'test@example.com' } }
    });
    
    const { supabase } = await import('@/lib/supabaseClient');
    supabase.auth.signUp = mockSignUp;
    
    renderWithAuth();
    
    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe('Not Loading');
    });
    
    const user = userEvent.setup();
    await user.click(screen.getByText('Sign Up'));
    
    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
      options: undefined
    });
    
    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Sign up successful'));
  });
  
  it('handles sign out', async () => {
    const mockSignOut = vi.fn().mockResolvedValue({ error: null });
    
    const { supabase } = await import('@/lib/supabaseClient');
    supabase.auth.signOut = mockSignOut;
    
    renderWithAuth();
    
    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe('Not Loading');
    });
    
    const user = userEvent.setup();
    await user.click(screen.getByText('Sign Out'));
    
    expect(mockSignOut).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('signed out'));
  });
});
