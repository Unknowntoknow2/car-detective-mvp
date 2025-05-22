
// Re-export the hook from the context for easier imports
import { useAuth as useAuthFromContext, AuthContextType } from '@/contexts/AuthContext';

export const useAuth = useAuthFromContext;
export type { AuthContextType };
