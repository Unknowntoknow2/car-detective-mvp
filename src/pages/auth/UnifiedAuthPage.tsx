import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Building, User, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { AuthMode, UserRole } from '@/types/auth';
import { UnifiedAuthForm } from '@/components/auth/forms/UnifiedAuthForm';

const UnifiedAuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  
  // Extract mode and role from URL parameters or path
  const modeParam = searchParams.get('mode') as AuthMode || 'signin';
  const roleParam = searchParams.get('role') as UserRole;
  
  // Set default states based on URL params
  const [mode, setMode] = useState<AuthMode>(modeParam);
  const [role, setRole] = useState<UserRole | undefined>(roleParam);
  const [isLoading, setIsLoading] = useState(false);

  // Determine if we should show role selection
  const showRoleSelection = !role;

  // Redirect authenticated users
  useEffect(() => {
    if (user && !authLoading) {
      const from = location.state?.from || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, location.state]);

  // When role changes, update the URL
  useEffect(() => {
    if (role) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('role', role);
      newParams.set('mode', mode);
      navigate({ search: newParams.toString() }, { replace: true });
    }
  }, [role, mode, navigate, searchParams]);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    toast.info(`Selected ${selectedRole} role`);
  };

  const handleBack = () => {
    if (role) {
      // If role is selected, go back to role selection
      setRole(undefined);
    } else {
      // Otherwise go back to home
      navigate('/');
    }
  };

  // Show role selection if no role is selected
  if (showRoleSelection) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Car Detective</h1>
            <p className="text-gray-600 mt-2">
              {mode === 'signin' ? 'Please choose how you want to sign in' : 'Please choose how you want to register'}
            </p>
          </div>
          
          <div className="space-y-4">
            <Card 
              className="shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer border-2" 
              onClick={() => handleRoleSelect('individual')}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium">
                  {mode === 'signin' ? 'Individual Login' : 'Individual Registration'}
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">
                  Access your saved valuations and manage your personal account
                </p>
              </CardContent>
            </Card>
            
            <Card 
              className="shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer border-2 border-blue-100" 
              onClick={() => handleRoleSelect('dealer')}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium">
                  {mode === 'signin' ? 'Dealer Login' : 'Dealer Registration'}
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Building className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">
                  Access dealer tools, leads, and manage your dealership
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8 text-center">
            <Tabs value={mode} onValueChange={(value) => setMode(value as AuthMode)} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="outline" className="text-muted-foreground" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If role is selected, show the appropriate form
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-gray-50">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          className="mb-4 text-muted-foreground flex items-center"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {role ? 'Role Selection' : 'Home'}
        </Button>
        
        <Card className="w-full shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">
              {mode === 'signin' 
                ? `${role === 'dealer' ? 'Dealer' : 'Individual'} Sign In` 
                : `${role === 'dealer' ? 'Dealer' : 'Individual'} Registration`}
            </CardTitle>
            <CardDescription>
              {mode === 'signin' 
                ? 'Sign in to your account' 
                : 'Create a new account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UnifiedAuthForm 
              mode={mode} 
              role={role as UserRole}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t pt-4">
            <div className="text-center text-sm text-muted-foreground">
              <div>
                {mode === 'signin' ? (
                  <>
                    Don't have an account?{' '}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary"
                      onClick={() => setMode('signup')}
                    >
                      Sign Up
                    </Button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary"
                      onClick={() => setMode('signin')}
                    >
                      Sign In
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UnifiedAuthPage;
