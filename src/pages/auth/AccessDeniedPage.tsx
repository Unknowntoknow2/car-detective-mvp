
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function AccessDeniedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole, signOut } = useAuth();
  
  const state = location.state as { requiredRole?: string; message?: string } | null;
  const requiredRole = state?.requiredRole || 'appropriate access';
  const message = state?.message || `You don't have permission to access this page.`;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md border-red-200">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-red-600">Access Denied</CardTitle>
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This page requires {requiredRole} privileges.
            {userRole && (
              <span> You are currently logged in with <strong>{userRole}</strong> privileges.</span>
            )}
          </p>
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800 text-sm">
            <p>If you believe this is an error, please contact support.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button 
            className="w-full"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          
          {userRole === 'individual' && (
            <Button 
              className="w-full" 
              onClick={() => navigate('/dashboard')}
            >
              Go to Your Dashboard
            </Button>
          )}
          
          {userRole === 'dealer' && (
            <Button 
              className="w-full" 
              onClick={() => navigate('/dealer')}
            >
              Go to Dealer Dashboard
            </Button>
          )}
          
          <Button 
            className="w-full"
            variant="outline"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
          
          <div className="text-center text-xs text-muted-foreground pt-2">
            <p>Need help? <Link to="/support" className="text-primary hover:underline">Contact Support</Link></p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
