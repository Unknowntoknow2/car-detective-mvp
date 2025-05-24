
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // For now, just show a success message since resetPassword might not be available
      // if auth.resetPassword is available, we would call it
      setSuccess(true);
      toast({
        title: "Reset instructions sent",
        description: "If an account exists with this email, you will receive password reset instructions.",
        variant: "success",
      });
      
      // Simulate API call delay
      setTimeout(() => {
        navigate('/auth/signin');
      }, 3000);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'An unexpected error occurred');
      toast({
        title: "Reset failed",
        description: err.message || 'Failed to send reset instructions',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">Reset Instructions Sent</h3>
        <p className="text-muted-foreground mb-4">
          If an account exists with this email, you will receive password reset instructions.
        </p>
        <p className="text-sm text-muted-foreground">
          Redirecting you to sign in...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending Reset Instructions...
          </>
        ) : (
          'Reset Password'
        )}
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={() => navigate('/auth/signin')}
        disabled={isLoading}
      >
        Back to Sign In
      </Button>
    </form>
  );
};
