
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/useAuth';
import { AuthMode, UserRole } from '@/types/auth';
import { SignupForm } from './forms/SignupForm';
import { SigninForm } from './forms/SigninForm';

interface AuthFormProps {
  initialMode?: AuthMode;
  initialRole?: UserRole;
  redirectPath?: string;
}

const AuthForm = ({ 
  initialMode = AuthMode.SIGNIN,
  initialRole = 'individual' as UserRole,
  redirectPath = '/dashboard'
}: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { session, user } = useAuth();
  
  // Get the redirect path from location state if available
  const from = location.state?.from || redirectPath;

  // Initialize tab value based on role and mode
  const getTabValue = (role: string, mode: AuthMode) => {
    if (role === 'dealer') {
      return mode === AuthMode.SIGNIN ? 'dealer-signin' : 'dealer-signup';
    } else {
      return mode === AuthMode.SIGNIN ? 'individual-signin' : 'individual-signup';
    }
  };

  const [activeTab, setActiveTab] = useState(getTabValue(initialRole, initialMode));

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (session && user) {
      navigate(from, { replace: true });
    }
  }, [session, user, navigate, from]);

  // Update URL when tab changes, but without full page refresh
  useEffect(() => {
    const [role, mode] = activeTab.split('-');
    const newSearch = new URLSearchParams();
    
    if (mode === 'signup') {
      newSearch.set('mode', 'signup');
    }
    
    if (role === 'dealer') {
      newSearch.set('role', 'dealer');
    }
    
    const newPath = `/auth${newSearch.toString() ? `?${newSearch.toString()}` : ''}`;
    
    if (window.location.pathname + window.location.search !== newPath) {
      window.history.replaceState(null, '', newPath);
    }
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Get title and description based on active tab
  const getTitleAndDescription = () => {
    const [role, mode] = activeTab.split('-');
    
    let title = '';
    let description = '';
    
    if (mode === 'signin') {
      title = `${role === 'dealer' ? 'Dealer' : 'Individual'} Sign In`;
      description = `Sign in to your ${role === 'dealer' ? 'dealership' : 'personal'} account`;
    } else {
      title = `Create ${role === 'dealer' ? 'Dealer' : 'Individual'} Account`;
      description = `Register for a new ${role === 'dealer' ? 'dealership' : 'personal'} account`;
    }
    
    return { title, description };
  };

  const { title, description } = getTitleAndDescription();

  // Don't render if redirecting
  if (session && user) return null;

  return (
    <Card className="w-full shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="space-y-1 px-6 py-5 bg-muted/50">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-6 py-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="individual-signin">Individual</TabsTrigger>
            <TabsTrigger value="dealer-signin">Dealer</TabsTrigger>
          </TabsList>
          
          {/* Individual Sign In */}
          <TabsContent value="individual-signin">
            <SigninForm 
              isLoading={isLoading} 
              setIsLoading={setIsLoading} 
              redirectPath={from}
              userRole={'individual' as UserRole}
            />
            <div className="text-center pt-4 border-t mt-4">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => setActiveTab('individual-signup')}
              >
                Don't have an account? Sign Up
              </button>
            </div>
          </TabsContent>
          
          {/* Individual Sign Up */}
          <TabsContent value="individual-signup">
            <SignupForm 
              isLoading={isLoading} 
              setIsLoading={setIsLoading}
              redirectPath={from}
              userRole={'individual' as UserRole}
            />
            <div className="text-center pt-4 border-t mt-4">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => setActiveTab('individual-signin')}
              >
                Already have an account? Sign In
              </button>
            </div>
          </TabsContent>
          
          {/* Dealer Sign In */}
          <TabsContent value="dealer-signin">
            <SigninForm 
              isLoading={isLoading} 
              setIsLoading={setIsLoading} 
              redirectPath="/dealer/dashboard"
              userRole={'dealer' as UserRole}
            />
            <div className="text-center pt-4 border-t mt-4">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => setActiveTab('dealer-signup')}
              >
                Don't have a dealership account? Sign Up
              </button>
            </div>
          </TabsContent>
          
          {/* Dealer Sign Up */}
          <TabsContent value="dealer-signup">
            <SignupForm 
              isLoading={isLoading} 
              setIsLoading={setIsLoading}
              redirectPath="/dealer/dashboard"
              userRole={'dealer' as UserRole}
              showDealershipField={true}
            />
            <div className="text-center pt-4 border-t mt-4">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => setActiveTab('dealer-signin')}
              >
                Already have a dealership account? Sign In
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
