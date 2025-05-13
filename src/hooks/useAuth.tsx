
// This file re-exports the useAuth hook from useAuth.ts for backward compatibility
import { useAuth as useAuthHook, AuthContextType, User } from './useAuth';

export const useAuth = useAuthHook;

// Re-export types for convenience
export type { AuthContextType, User };
