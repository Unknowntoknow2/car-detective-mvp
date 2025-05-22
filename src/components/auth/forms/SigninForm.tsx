
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Mail, KeyRound, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { UserRole } from '@/types/auth';

export interface SigninFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  redirectPath?: string;
  alternateLoginPath?: string;
  alternateLoginText?: string;
  role?: UserRole;
}

export const SigninForm = ({ 
  isLoading, 
  setIsLoading, 
  redirectPath = '/dashboard',
  alternateLoginPath,
  alternateLoginText,
  role = 'individual'
}: SigninFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();
  const { signIn, user, userRole, userDetails } = useAuth();

  // Check if we already have user details with a role
  useEffect(() => {
    if (user) {
      const detectedRole = userRole || userDetails?.role || 'individual';
      // Redirect to appropriate dashboard based on role
      if (detectedRole === 'dealer') {
        navigate('/dealer-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, userRole, userDetails, navigate]);

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Auto-focus first input on load
  useEffect(() => {
    const emailInput = document.getElementById('email');
    if (emailInput) {
      emailInput.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      const result = await signIn(email, password);
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      toast.success('Successfully signed in!');
      
      // Determine redirect path based on role
      // The redirect will happen in the useEffect when userRole is populated
      if (role === 'dealer') {
        // We'll redirect to dealer dashboard in the useEffect
      } else {
        // We'll redirect to user dashboard in the useEffect
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An unexpected error occurred');
      toast.error(err.message || 'Failed to sign in');
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
            name="email"
            type="email"
            placeholder="your@email.com"
            className="pl-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
        {formErrors.email && (
          <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
        )}
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
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="pl-10 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <Button 
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {formErrors.password && (
          <p className="text-sm text-red-500 mt-1">{formErrors.password}</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>
      
      {alternateLoginPath && (
        <div className="text-center mt-4">
          <Link to={alternateLoginPath} className="text-sm text-primary hover:underline">
            {alternateLoginText || "Try another login method"}
          </Link>
        </div>
      )}
      
      <div className="text-center mt-4 text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link to={`/signup/${role}`} className="text-primary hover:underline">
          Sign Up
        </Link>
      </div>
    </form>
  );
};
