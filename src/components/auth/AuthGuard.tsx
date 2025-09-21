import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface AuthGuardProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
  requireAuth?: boolean;
}

export function AuthGuard({ 
  children, 
  fallbackTitle = "Sign in to continue",
  fallbackDescription = "Access your saved valuations and premium features",
  requireAuth = true 
}: AuthGuardProps) {
  const { user, loading, signOut } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If auth is not required, always show children
  if (!requireAuth) {
    return <>{children}</>;
  }

  // If user is authenticated, show children
  if (user) {
    return <>{children}</>;
  }

  // Show sign-in form
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{fallbackTitle}</CardTitle>
          <CardDescription>{fallbackDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <GoogleAuthButton 
            onSuccess={() => {
              toast.success("Redirecting to Google...");
            }}
            onError={(error) => {
              toast.error("Failed to sign in with Google");
            }}
          />
          
          <div className="text-center text-sm text-muted-foreground">
            <p>
              By signing in, you agree to our{' '}
              <a href="/terms" className="underline hover:text-primary">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="underline hover:text-primary">
                Privacy Policy
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// User profile component for when authenticated
export function UserProfile() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {user.user_metadata?.avatar_url && (
          <img 
            src={user.user_metadata.avatar_url} 
            alt="Profile" 
            className="w-8 h-8 rounded-full"
          />
        )}
        <span className="text-sm font-medium">
          {user.user_metadata?.full_name || user.email}
        </span>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </div>
  );
}