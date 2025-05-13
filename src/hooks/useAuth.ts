
import { useContext } from 'react';
import { AuthContext } from '@/components/auth/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Provide a more detailed error message
    throw new Error('useAuth must be used within an AuthProvider. Please check that your component is wrapped within AuthProvider.');
  }
  return context;
}
