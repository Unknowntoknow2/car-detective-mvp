
// This is a proxy file to re-export the main useAuth hook from the AuthContext
import { useAuth as useAuthFromContext } from '@/contexts/AuthContext';

export const useAuth = useAuthFromContext;
