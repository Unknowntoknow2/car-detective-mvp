
// Re-export the hook from the context for easier imports
import { useAuth as useAuthFromContext } from '@/components/auth/AuthContext';

export const useAuth = useAuthFromContext;
