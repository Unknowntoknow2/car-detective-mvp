
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

export interface SigninFormProps {
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
  redirectPath?: string;
  role?: string;
  alternateLoginPath?: string;
  alternateLoginText?: string;
  userType?: 'individual' | 'dealer';
}

export const SigninForm: React.FC<SigninFormProps> = ({ 
  isLoading: externalIsLoading, 
  setIsLoading: externalSetIsLoading,
  redirectPath,
  role,
  alternateLoginPath,
  alternateLoginText,
  userType = 'individual'
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [internalIsLoading, setInternalIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isLoading = externalIsLoading !== undefined ? externalIsLoading : internalIsLoading;
  const setIsLoading = externalSetIsLoading || setInternalIsLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signIn(email, password);
      
      if (!result.success) {
        const errorMessage = result.error || 'Authentication failed';
        setError(errorMessage);
        toast.error('Sign in failed', {
          description: errorMessage
        });
        return;
      }
      
      toast.success('Signed in successfully!');
      
      let targetPath = redirectPath || '/';
      
      if (userType === 'dealer') {
        targetPath = '/dealer/dashboard';
      }
      
      const from = location.state?.from?.pathname;
      if (from && from !== '/auth') {
        targetPath = from;
      }
      
      navigate(targetPath, { replace: true });
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      toast.error('Sign in failed', {
        description: err.message || 'An unexpected error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>

      {alternateLoginPath && alternateLoginText && (
        <div className="text-center mt-4 text-sm text-muted-foreground">
          <a href={alternateLoginPath} className="hover:underline">
            {alternateLoginText}
          </a>
        </div>
      )}
    </form>
  );
};

export default SigninForm;
