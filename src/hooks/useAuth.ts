
import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Provide a more detailed error message
    throw new Error('useAuth must be used within an AuthProvider. Please check that your component is wrapped within AuthProvider.');
  }
  return context;
}

// Re-export types for convenience
export type { AuthContextType } from '@/contexts/AuthContext';
export type { User } from '@/contexts/AuthContext';
