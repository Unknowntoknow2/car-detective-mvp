
import { useAuth as useAuthContext } from '../contexts/AuthContext';

// Re-export the hook with all its properties
export const useAuth = useAuthContext;

// Export the type for consumers that need it
export type { User } from '../contexts/AuthContext';
