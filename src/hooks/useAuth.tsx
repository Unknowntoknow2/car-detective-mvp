
// This file re-exports the useAuth hook from the AuthContext for backward compatibility
import { useAuth as useAuthFromContext, AuthContextType } from '@/contexts/AuthContext';
import type { User } from '@/contexts/AuthContext';

/**
 * Custom hook for accessing authentication context
 * This is a re-export of the useAuth hook from AuthContext for backward compatibility
 */
export const useAuth = useAuthFromContext;

// Re-export types for convenience
export type { AuthContextType, User };
