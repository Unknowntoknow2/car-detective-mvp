
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';
import { AuthMode, UserRole } from '@/types/auth';

interface AuthFormProps {
  initialMode?: AuthMode;
  initialRole?: UserRole | string;
}

// This is now a redirector component that helps users navigate to the correct auth page
const AuthForm = ({ initialMode, initialRole }: AuthFormProps) => {
  const navigate = useNavigate();
  const { session, user } = useAuth();
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (session && user) {
      // Check user role and redirect accordingly
      const userRole = user.user_metadata?.role || 'individual';
      if (userRole === 'dealer') {
        navigate('/dealer-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [session, user, navigate]);

  const handleIndividualClick = () => {
    navigate('/signin/individual');
  };

  const handleDealerClick = () => {
    navigate('/signin/dealer');
  };

  // Don't render if redirecting
  if (session && user) return null;

  return (
    <Card className="w-full shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="space-y-1 px-6 py-5 bg-muted/50">
        <CardTitle className="text-2xl font-bold">Sign In or Register</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">Choose your account type to continue</CardDescription>
      </CardHeader>
      <CardContent className="px-6 py-6 space-y-4">
        <Button 
          onClick={handleIndividualClick} 
          className="w-full py-6 flex justify-center items-center"
          variant="outline"
        >
          Individual Account
        </Button>
        <Button 
          onClick={handleDealerClick} 
          className="w-full py-6 flex justify-center items-center"
          variant="outline"
        >
          Dealer Account
        </Button>
      </CardContent>
      <CardFooter className="border-t py-4 px-6">
        <div className="text-center w-full text-sm text-muted-foreground">
          <p>Not sure which one to choose? Visit our <Link to="/help" className="text-primary hover:underline">Help Center</Link></p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
