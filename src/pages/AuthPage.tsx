
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LoginForm } from '@/components/auth/forms/LoginForm';
import { SignupForm } from '@/components/auth/forms/SignupForm';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect already logged in users
  useEffect(() => {
    console.log("AuthPage: Current user state:", user);
    if (user) {
      console.log("AuthPage: User is authenticated, redirecting to dashboard");
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Show loading spinner while checking authentication status
  if (authLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md">
        <Card className="border-2">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
            <CardDescription>
              Choose how you want to sign in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Button 
                variant="outline" 
                className="p-6 flex flex-col items-center space-y-2 h-auto" 
                onClick={() => navigate('/login-user')}
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="font-medium">Individual User</h3>
                  <p className="text-sm text-muted-foreground">Sign in to your personal account</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="p-6 flex flex-col items-center space-y-2 h-auto border-blue-200 hover:bg-blue-50/50" 
                onClick={() => navigate('/login-dealer')}
              >
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="M3 9h18v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                    <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path>
                    <path d="M12 3v6"></path>
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="font-medium">Car Dealership</h3>
                  <p className="text-sm text-muted-foreground">Sign in to your dealership account</p>
                </div>
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Don't have an account?</p>
              <Button variant="default" className="w-full" onClick={() => navigate('/auth/signup')}>
                Create an Account
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t pt-4">
            <div className="text-sm text-center text-muted-foreground">
              Interested in our premium features?
            </div>
            <Button variant="outline" asChild className="w-full">
              <Link to="/premium">View Premium Features</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default AuthPage;
