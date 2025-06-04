// This is a proxy file to re-export the main useAuth hook from the AuthContext
import { useAuth as useAuthFromContext } from "@/components/auth/AuthContext";

// ✅ File: src/hooks/useAuth.tsx
export { useAuth } from "@/components/auth/AuthContext";
