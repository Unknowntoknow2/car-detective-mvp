
// Re-export from the central auth context
import { useAuth as useAuthContext } from '@/contexts/AuthContext';
export { useAuthContext as useAuth };

// Export the auth context for backward compatibility
export default useAuthContext;
