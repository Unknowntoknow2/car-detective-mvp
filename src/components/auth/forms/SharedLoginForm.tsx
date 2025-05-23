
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, KeyRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { errorToString } from '@/utils/errorHandling';

interface SharedLoginFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  expectedRole: 'individual' | 'dealer' | undefined;
  redirectPath: string;
  alternateLoginPath: string;
  alternateLoginText: string;
}

export const SharedLoginForm: React.FC<SharedLoginFormProps> = ({
  isLoading,
  setIsLoading,
  expectedRole,
  redirectPath,
  alternateLoginPath,
  alternateLoginText
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // Sign in using the auth context
      const result = await signIn(email, password);
      
      if (!result.success) {
        const errorMessage = result.error ? errorToString(result.error) : 'Authentication failed';
        throw new Error(errorMessage);
      }
      
      // Redirect to the appropriate dashboard
      toast.success('Login successful!');
      navigate(redirectPath);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(errorToString(err));
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
            className="pl-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link to="/forgot-password" className="text-xs text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="pl-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>
      
      <div className="text-center text-sm mt-4">
        <Link to={alternateLoginPath} className="text-primary hover:underline">
          {alternateLoginText}
        </Link>
      </div>
    </form>
  );
};
