
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/forms/LoginForm';
import { SignupForm } from '@/components/auth/forms/SignupForm';
import { AuthMode } from '@/types/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const IndividualAuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get the redirect path from location state, defaulting to dashboard
  const from = location.state?.from || '/dashboard';

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1.5 text-center">
          <CardTitle className="text-2xl font-bold">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <CardDescription>
            {mode === 'signin'
              ? 'Enter your credentials to access your account'
              : 'Create a new individual account'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <Tabs
            defaultValue={mode}
            value={mode}
            onValueChange={(value) => setMode(value as AuthMode)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="mt-0">
              <LoginForm
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                redirectPath={from}
              />
              
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Button variant="link" className="p-0" onClick={toggleMode}>
                  Sign up
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-0">
              <SignupForm
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                role="individual"
                redirectPath={from}
              />
              
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Button variant="link" className="p-0" onClick={toggleMode}>
                  Sign in
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>Need a dealer account?{' '}
              <Link to="/auth/dealer" className="text-primary hover:underline">
                Sign up as dealer
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IndividualAuthPage;
