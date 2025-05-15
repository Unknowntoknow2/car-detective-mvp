
import { useAuth as useAuthHook, AuthContextType, User } from './useAuth.ts';

export const useAuth = useAuthHook;

// Re-export types for convenience
export type { AuthContextType, User };
