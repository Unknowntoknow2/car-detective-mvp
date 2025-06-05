
import { useAuth } from "@/hooks/useAuth";

export function WelcomeBanner() {
  const { user, userDetails } = useAuth();

  if (!user) return null;

  const name = userDetails?.full_name || 
               user.email?.split('@')[0] || 
               'there';

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
