
import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Define user and user details types
export type UserRole = 'admin' | 'dealer' | 'individual';

export interface UserDetails {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  avatar_url?: string;
  dealership_name?: string;
}

interface User {
  id: string;
  email: string;
  created_at?: string;
  user_metadata?: {
    role?: UserRole;
    name?: string;
    full_name?: string;
    dealership_name?: string;
  };
}

// Define auth context props
interface AuthContextProps {
  user: User | null;
  userDetails: UserDetails | null;
  session: any | null;
  userRole: UserRole | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

// Create context with a default value
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Mock authentication for development (replace with Supabase when connected)
const mockUsers = [
  { 
    id: '1', 
    email: 'user@example.com', 
    password: 'password',
    created_at: new Date().toISOString(),
    user_metadata: { 
      role: 'individual' as UserRole,
      full_name: 'Example User',
      name: 'Example User'
    }
  },
  { 
    id: '2', 
    email: 'dealer@example.com', 
    password: 'password',
    created_at: new Date().toISOString(),
    user_metadata: { 
      role: 'dealer' as UserRole,
      full_name: 'Example Dealer',
      name: 'Example Dealer',
      dealership_name: 'Example Dealership'
    }
  },
];

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    setIsLoading(true);
    
    try {
      const savedUser = localStorage.getItem('auth_user');
      const savedSession = localStorage.getItem('auth_session');
      
      if (savedUser && savedSession) {
        const parsedUser = JSON.parse(savedUser);
        const parsedSession = JSON.parse(savedSession);
        
        setUser(parsedUser);
        setSession(parsedSession);
        
        // Set userRole based on user metadata
        const role = parsedUser.user_metadata?.role || 'individual';
        setUserRole(role);
        
        // Set userDetails
        setUserDetails({
          id: parsedUser.id,
          email: parsedUser.email,
          role: role,
          full_name: parsedUser.user_metadata?.full_name || parsedUser.user_metadata?.name,
          dealership_name: parsedUser.user_metadata?.dealership_name
        });
      }
    } catch (err) {
      console.error('Error initializing auth state:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Mock authentication (replace with Supabase)
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        setError('Invalid email or password');
        return { success: false, error: 'Invalid email or password' };
      }
      
      // Create session object
      const session = {
        access_token: 'mock_token_' + Date.now(),
        expires_at: Date.now() + 3600 * 1000,
        user: user
      };
      
      // Save to state and localStorage
      setUser(user);
      setSession(session);
      setUserRole(user.user_metadata?.role || 'individual');
      
      setUserDetails({
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role || 'individual',
        full_name: user.user_metadata?.full_name || user.user_metadata?.name,
        dealership_name: user.user_metadata?.dealership_name
      });
      
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_session', JSON.stringify(session));
      
      toast.success('Signed in successfully!');
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign in';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setIsLoading(true);
      
      // Mock signup (replace with Supabase)
      const newId = `${Date.now()}`;
      const newUser = {
        id: newId,
        email,
        created_at: new Date().toISOString(),
        user_metadata: metadata || { 
          role: 'individual',
          full_name: email.split('@')[0],
          name: email.split('@')[0]
        }
      };
      
      // Create session object
      const session = {
        access_token: 'mock_token_' + Date.now(),
        expires_at: Date.now() + 3600 * 1000,
        user: newUser
      };
      
      // Save to state and localStorage
      setUser(newUser);
      setSession(session);
      setUserRole(newUser.user_metadata?.role || 'individual');
      
      setUserDetails({
        id: newUser.id,
        email: newUser.email,
        role: newUser.user_metadata?.role || 'individual',
        full_name: newUser.user_metadata?.full_name || newUser.user_metadata?.name,
        dealership_name: newUser.user_metadata?.dealership_name
      });
      
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      localStorage.setItem('auth_session', JSON.stringify(session));
      
      toast.success('Sign up successful!');
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign up';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      // Clear auth state
      setUser(null);
      setSession(null);
      setUserRole(null);
      setUserDetails(null);
      
      // Remove from localStorage
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_session');
      
      toast.success('You have been signed out');
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to sign out');
    }
  };

  const value = {
    user,
    userDetails,
    session,
    userRole,
    signIn,
    signUp,
    signOut,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
