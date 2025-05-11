
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function AccessDeniedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message || "You don't have permission to access this page";
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">{message}</p>
        <div className="flex flex-col space-y-2">
          <Button onClick={() => navigate('/login-user')} variant="default">
            Go to User Login
          </Button>
          <Button onClick={() => navigate('/login-dealer')} variant="outline">
            Go to Dealer Login
          </Button>
          <Button onClick={() => navigate('/')} variant="ghost">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
