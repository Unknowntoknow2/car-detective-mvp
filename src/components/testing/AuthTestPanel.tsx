
import React from 'react';
import { useAuthTests } from '@/hooks/useAuthTests';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Define an interface for user roles
interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

export function AuthTestPanel() {
  const { results, isRunning, runTests } = useAuthTests();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
  const [isCheckingAdmin, setIsCheckingAdmin] = React.useState(false);
  
  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    
    setIsCheckingAdmin(true);
    try {
      // Check if user has admin role in the database
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle() as { data: UserRole | null, error: Error | null };
        
      if (error) throw error;
      setIsAdmin(!!data);
    } catch (err) {
      console.error('Error checking admin status:', err);
      setIsAdmin(false);
    } finally {
      setIsCheckingAdmin(false);
    }
  };
  
  React.useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else {
      setIsAdmin(null);
    }
  }, [user]);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Auth & RLS Test Panel</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={runTests} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Running Tests...' : 'Run Tests'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {user && (
            <div className={`p-3 rounded-md flex items-start gap-2 ${
              isAdmin === true ? 'bg-green-50' : 
              isAdmin === false ? 'bg-yellow-50' : 'bg-gray-50'
            }`}>
              <ShieldCheck className={`h-5 w-5 ${
                isAdmin === true ? 'text-green-500' : 
                isAdmin === false ? 'text-yellow-500' : 'text-gray-500'
              } mt-0.5`} />
              <div>
                <h3 className="font-medium">Admin Status</h3>
                <p className="text-sm">
                  {isCheckingAdmin ? 'Checking admin status...' : 
                   isAdmin === true ? 'User has admin privileges' : 
                   isAdmin === false ? 'User does not have admin privileges' : 
                   'Status unknown'}
                </p>
                <p className="text-xs text-muted-foreground">
                  User ID: {user.id}
                </p>
              </div>
            </div>
          )}
          
          {Object.keys(results).length === 0 ? (
            <p className="text-sm text-muted-foreground">No tests have been run yet.</p>
          ) : (
            Object.entries(results).map(([testName, result]) => (
              <div 
                key={testName} 
                className={`p-3 rounded-md flex items-start gap-2 ${
                  result.success ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                )}
                <div>
                  <h3 className="font-medium">{testName}</h3>
                  <p className="text-sm">{result.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {result.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
