<<<<<<< HEAD

import { useAuth } from "@/hooks/useAuth";
=======
import { useAuth } from "@/components/auth/AuthContext";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export function WelcomeBanner() {
  const { user, userDetails } = useAuth();

  if (!user) return null;

<<<<<<< HEAD
  const name = userDetails?.full_name || 
               user.email?.split('@')[0] || 
               'there';
=======
  const name = user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "there";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

  return (
    <div className="bg-secondary/10 border border-border rounded-lg p-6 mb-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">
          Welcome back, {name}!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Ready to find your next valuation?
        </p>
      </div>
    </div>
  );
}
