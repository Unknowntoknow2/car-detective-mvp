
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResetPasswordForm } from '@/components/auth/forms/ResetPasswordForm';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const [isValidToken, setIsValidToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkResetToken = async () => {
      try {
        // Check if this is a valid password reset attempt
        const { data, error } = await supabase.auth.getSession();
        
        if (error || !data.session) {
          setIsValidToken(false);
          toast.error('Invalid or expired password reset link');
          setTimeout(() => navigate('/auth/forgot-password'), 3000);
        } else {
          setIsValidToken(true);
        }
      } catch (err) {
        console.error('Reset token validation error:', err);
        setIsValidToken(false);
        toast.error('Failed to validate password reset request');
        setTimeout(() => navigate('/auth/forgot-password'), 3000);
      } finally {
        setIsCheckingToken(false);
      }
    };

    checkResetToken();
  }, [navigate]);

  if (isCheckingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Validating your request</h2>
          <p className="text-muted-foreground">Please wait...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Invalid or expired link</h2>
          <p className="text-muted-foreground">Redirecting to forgot password page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50/50">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm isLoading={isLoading} setIsLoading={setIsLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
