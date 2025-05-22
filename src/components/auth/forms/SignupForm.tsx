
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Mail, KeyRound, Eye, EyeOff, User, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserRole } from '@/types/auth';

export interface SignupFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  redirectPath?: string;
  redirectToLogin?: boolean;
  userRole?: UserRole;
}

export const SignupForm = ({ 
  isLoading, 
  setIsLoading,
  redirectPath = '/dashboard',
  redirectToLogin = false,
  userRole = 'user'
}: SignupFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [dealershipName, setDealershipName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const isDealer = userRole === 'dealer';

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!fullName.trim()) {
      errors.fullName = 'Full name is required';
      isValid = false;
    }

    if (isDealer && !dealershipName.trim()) {
      errors.dealershipName = 'Dealership name is required';
      isValid = false;
    }

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

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (!termsAccepted) {
      errors.terms = 'You must accept the terms and conditions';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Auto-focus first input on load
  useEffect(() => {
    const fullNameInput = document.getElementById('fullName');
    if (fullNameInput) {
      fullNameInput.focus();
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
      // Create additional metadata based on user role
      const metadata: Record<string, any> = {
        full_name: fullName,
        role: userRole
      };

      // Add dealership name for dealer accounts
      if (isDealer && dealershipName) {
        metadata.dealership_name = dealershipName;
      }

      // Sign up with email, password and metadata
      await signUp(email, password, metadata);
      
      toast.success('Account created successfully! Please check your email for confirmation.');
      
      if (redirectToLogin) {
        navigate('/auth/signin');
      } else {
        const redirectTo = userRole === 'dealer' ? '/dealer/dashboard' : redirectPath;
        navigate(redirectTo);
      }
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'An unexpected error occurred');
      toast.error(err.message || 'Failed to create account');
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
            disabled={isLoading}
          />
        </div>
        {formErrors.fullName && (
          <p className="text-sm text-red-500 mt-1">{formErrors.fullName}</p>
        )}
      </div>
      
      {isDealer && (
        <div className="space-y-2">
          <Label htmlFor="dealershipName">Dealership Name</Label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="dealershipName"
              name="dealershipName"
              type="text"
              placeholder="ABC Motors"
              className="pl-10"
              value={dealershipName}
              onChange={(e) => setDealershipName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {formErrors.dealershipName && (
            <p className="text-sm text-red-500 mt-1">{formErrors.dealershipName}</p>
          )}
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
            disabled={isLoading}
          />
        </div>
        {formErrors.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">{formErrors.confirmPassword}</p>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="terms" 
          checked={termsAccepted}
          onCheckedChange={(checked) => setTermsAccepted(checked === true)}
          disabled={isLoading}
        />
        <Label htmlFor="terms" className="text-sm font-normal">
          I accept the terms and conditions
        </Label>
      </div>
      {formErrors.terms && (
        <p className="text-sm text-red-500 -mt-2">{formErrors.terms}</p>
      )}
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
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
