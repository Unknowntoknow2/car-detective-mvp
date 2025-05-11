
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

// Export the useAuth hook from the main context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
