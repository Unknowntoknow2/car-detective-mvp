
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/forms/LoginForm';
import { SignupForm } from '@/components/auth/forms/SignupForm';
import { AuthMode } from '@/types/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2 } from 'lucide-react';

const DealerAuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userRole } = useAuth();
  
  // Get the redirect path from location state, defaulting to dealer dashboard
  const from = location.state?.from || '/dealer';

  // Redirect if user is already authenticated as a dealer
  useEffect(() => {
    if (user) {
      if (userRole === 'dealer') {
        navigate('/dealer', { replace: true });
      } else {
        // If user is not a dealer, redirect to individual dashboard
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, userRole, navigate]);

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1.5 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {mode === 'signin' ? 'Dealer Portal' : 'Register Dealership'}
          </CardTitle>
          <CardDescription>
            {mode === 'signin'
              ? 'Access your dealer dashboard and inventory'
              : 'Create a new dealer account'}
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
                redirectPath="/dealer"
              />
              
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Don't have a dealer account?{' '}
                <Button variant="link" className="p-0" onClick={toggleMode}>
                  Register now
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-0">
              <SignupForm
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                role="dealer"
                redirectPath="/dealer"
                showDealershipField={true}
              />
              
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Already have a dealer account?{' '}
                <Button variant="link" className="p-0" onClick={toggleMode}>
                  Sign in
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>Need an individual account?{' '}
              <Link to="/auth/individual" className="text-primary hover:underline">
                Sign up as individual
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DealerAuthPage;
