
import { useAuth as useAuthContext } from '@/contexts/AuthContext';

// Re-export the hook from the context for backward compatibility
export const useAuth = useAuthContext;

// For TypeScript compatibility, also export as default
export default useAuthContext;
