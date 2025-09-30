
import { useAuth } from "@/hooks/useAuth";

interface User {
  id: string;
  email?: string;
  userMetadata?: any;
}

export function useUser() {
  const { user, loading } = useAuth();
  
  const userData: User | null = user ? {
    id: user.id,
    email: user.email,
    userMetadata: user.user_metadata,
  } : null;

  return { 
    user: userData, 
    isLoading: loading, 
    error: null 
  };
}
