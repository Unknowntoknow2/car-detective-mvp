
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

// Add the error property to AuthContextType
export interface AuthContextType {
  session: any | null;
  user: any | null;
  userRole: string | null;
  isLoading: boolean;
  error: string | null; // Make sure error property is defined
  signIn: (email: string, password: string) => Promise<{ data: any; error: Error | null; } | undefined>;
  signUp: (email: string, password: string, role?: string) => Promise<{ data: any; error: Error | null; } | undefined>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ data: any; error: Error | null; } | undefined>;
  updatePassword: (password: string) => Promise<{ data: any; error: Error | null; } | undefined>;
  getUserRole: () => Promise<string | null>;
}

// This type defines what a User looks like
export type User = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    [key: string]: any;
  };
  app_metadata?: {
    [key: string]: any;
  };
  [key: string]: any;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Provide a more detailed error message
    throw new Error('useAuth must be used within an AuthProvider. Please check that your component is wrapped within AuthProvider.');
  }
  return context;
}
