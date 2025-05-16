import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Mail, KeyRound, Eye, EyeOff, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SignupFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const SignupForm = ({ isLoading, setIsLoading }: SignupFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { signUp } = useAuth();

  // Form validation
  const isEmailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = () => password.length >= 6;
  const doPasswordsMatch = () => password === confirmPassword;
  const isFormValid = isEmailValid() && isPasswordValid() && doPasswordsMatch() && fullName.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      setError('Please fill in all required fields correctly');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      const result = await signUp(email, password, fullName);
      
      if (result?.error) {
        setError(result.error.toString() || 'Failed to sign up');
        toast.error(result.error.toString() || 'Failed to sign up');
        setIsLoading(false);
        return;
      }
      
      toast.success('Account created! You can now sign in');
      navigate('/sign-in');
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError('An unexpected error occurred');
      toast.error(err.message || 'Failed to sign up');
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
        <Label htmlFor="fullName">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="John Doe"
            className="pl-10"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
      </div>
      
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
            required
            disabled={isLoading}
            aria-invalid={email ? !isEmailValid() : false}
          />
        </div>
        {email && !isEmailValid() && (
          <p className="text-xs text-red-500">Please enter a valid email address</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            className="pl-10 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
        {password && !isPasswordValid() && (
          <p className="text-xs text-red-500">Password must be at least 6 characters</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm your password"
            className="pl-10 pr-10"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        {confirmPassword && !doPasswordsMatch() && (
          <p className="text-xs text-red-500">Passwords do not match</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading || !isFormValid}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>
    </form>
  );
};
