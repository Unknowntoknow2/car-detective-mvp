
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface SigninFormProps {
  isLoading?: boolean;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  redirectPath?: string;
  role?: string;
  alternateLoginPath?: string;
  alternateLoginText?: string;
}

export const SigninForm: React.FC<SigninFormProps> = ({ 
  isLoading: externalIsLoading, 
  setIsLoading: externalSetIsLoading,
  redirectPath = '/dashboard',
  role,
  alternateLoginPath,
  alternateLoginText
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [internalIsLoading, setInternalIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  
  // Use external or internal loading state
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
        setIsLoading(false);
        return;
      }
      
      toast.success('Login successful!');
      navigate(redirectPath);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
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
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />
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
