import { useState, useEffect } from 'react';
import { Mail, Phone, Eye, EyeOff } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthType } from '@/types/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface SignupFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const SignupForm = ({ isLoading, setIsLoading }: SignupFormProps) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [authType, setAuthType] = useState<AuthType>('email');
  
  // Form validation states
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [termsError, setTermsError] = useState('');
  
  // Account existence validation with debouncing
  const [emailCheckTimeout, setEmailCheckTimeout] = useState<NodeJS.Timeout | null>(null);
  const [phoneCheckTimeout, setPhoneCheckTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string) => {
    return /^\+?[1-9]\d{9,14}$/.test(phone);
  };

  const validateEmail = (value: string, skipExistenceCheck = false) => {
    if (!value) {
      setEmailError('Email is required');
      return false;
    }
    
    if (!isValidEmail(value)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    
    if (!skipExistenceCheck) {
      checkEmailExists(value);
    }
    
    return true;
  };

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError('Password is required');
      return false;
    }
    
    if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    
    // Check for at least one uppercase, one lowercase, and one number
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    
    if (!hasUppercase || !hasLowercase || !hasNumber) {
      setPasswordError('Password must include at least one uppercase letter, one lowercase letter, and one number');
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    }
    
    if (value !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    
    setConfirmPasswordError('');
    return true;
  };

  const validatePhone = (value: string, skipExistenceCheck = false) => {
    if (!value) {
      setPhoneError('Phone number is required');
      return false;
    }
    
    if (!isValidPhone(value)) {
      setPhoneError('Please enter a valid international phone number (e.g., +1234567890)');
      return false;
    }
    
    if (!skipExistenceCheck) {
      checkPhoneExists(value);
    }
    
    return true;
  };

  const validateTerms = () => {
    if (!agreeToTerms) {
      setTermsError('You must agree to the Terms and Privacy Policy');
      return false;
    }
    
    setTermsError('');
    return true;
  };

  const checkEmailExists = (email: string) => {
    if (!isValidEmail(email)) {
      setEmailError('');
      return;
    }
    
    // Clear any existing timeout
    if (emailCheckTimeout) {
      clearTimeout(emailCheckTimeout);
    }
    
    // Set a new timeout to check after typing stops
    const timeout = setTimeout(async () => {
      setIsCheckingEmail(true);
      
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: false,
          }
        });

        if (error && error.message.includes("User not found")) {
          setEmailError('');
        } else {
          // Updated color and styling for enterprise-level error
          setEmailError('An account with this email already exists. Try logging in instead.');
        }
      } catch (error) {
        console.error('Error checking email:', error);
      } finally {
        setIsCheckingEmail(false);
      }
    }, 600);
    
    setEmailCheckTimeout(timeout);
  };

  const checkPhoneExists = (phone: string) => {
    if (!isValidPhone(phone)) {
      setPhoneError('');
      return;
    }
    
    // Clear any existing timeout
    if (phoneCheckTimeout) {
      clearTimeout(phoneCheckTimeout);
    }
    
    // Set a new timeout to check after typing stops
    const timeout = setTimeout(async () => {
      setIsCheckingPhone(true);
      
      try {
        const { error } = await supabase.auth.signInWithOtp({
          phone,
          options: {
            shouldCreateUser: false,
          }
        });

        if (error && error.message.includes("Phone number not found")) {
          setPhoneError('');
        } else {
          setPhoneError('An account with this phone number already exists. Try logging in instead.');
        }
      } catch (error) {
        console.error('Error checking phone:', error);
      } finally {
        setIsCheckingPhone(false);
      }
    }, 600);
    
    setPhoneCheckTimeout(timeout);
  };

  const handleSignup = async () => {
    // Validate form based on active auth type
    let isValid = true;
    
    if (authType === 'email') {
      isValid = validateEmail(email, true) && 
                validatePassword(password) && 
                validateConfirmPassword(confirmPassword) && 
                validateTerms();
      
      // Check for duplicate account
      if (emailError.includes('already exists')) {
        return;
      }
    } else {
      isValid = validatePhone(phone, true) && validateTerms();
      
      // Check for duplicate account
      if (phoneError.includes('already exists')) {
        return;
      }
    }
    
    if (!isValid) {
      return;
    }

    setIsLoading(true);

    try {
      if (authType === 'email') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + '/auth/callback',
            data: {
              agreed_to_terms: agreeToTerms,
            }
          }
        });

        if (error) throw error;
        toast.success('Account created successfully', {
          description: 'Please check your email for a verification link to complete your registration.',
        });
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          phone,
          options: {
            shouldCreateUser: true,
          }
        });

        if (error) throw error;
        toast.success('Verification code sent', {
          description: 'Please check your phone for the verification code to complete your registration.',
        });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.message.includes('already registered')) {
        if (authType === 'email') {
          setEmailError('An account with this email already exists. Try logging in instead.');
          toast.error('Account already exists', {
            description: 'An account with this email already exists. Please log in instead.',
          });
        } else {
          setPhoneError('An account with this phone number already exists. Try logging in instead.');
          toast.error('Account already exists', {
            description: 'An account with this phone number already exists. Please log in instead.',
          });
        }
      } else if (error.message.includes('rate limit')) {
        toast.error('Too many attempts', {
          description: 'Please wait a moment before trying again.',
        });
      } else {
        toast.error('Sign up failed', {
          description: error.message || 'An unexpected error occurred. Please try again later.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Clear any timeouts on component unmount
  useEffect(() => {
    return () => {
      if (emailCheckTimeout) clearTimeout(emailCheckTimeout);
      if (phoneCheckTimeout) clearTimeout(phoneCheckTimeout);
    };
  }, [emailCheckTimeout, phoneCheckTimeout]);

  const navigate = useNavigate();

  return (
    <Tabs defaultValue="email" className="w-full" onValueChange={(value) => setAuthType(value as AuthType)}>
      <TabsList className="grid w-full grid-cols-2 rounded-xl overflow-hidden">
        <TabsTrigger value="email" className="flex items-center gap-2 transition-all duration-200">
          <Mail className="h-4 w-4" />
          Email
        </TabsTrigger>
        <TabsTrigger value="phone" className="flex items-center gap-2 transition-all duration-200">
          <Phone className="h-4 w-4" />
          Phone
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="email" className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (e.target.value) validateEmail(e.target.value);
              }}
              onBlur={() => validateEmail(email)}
              className={`rounded-xl transition-all duration-200 ${isCheckingEmail ? 'opacity-70' : ''}`}
              disabled={isCheckingEmail}
              required
            />
            {isCheckingEmail && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-opacity-50 border-t-primary rounded-full"></div>
              </div>
            )}
          </div>
          {emailError && (
            <div className={`text-sm ${emailError.includes('already exists') ? 'text-amber-500' : 'text-destructive'}`}>
              {emailError}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
                if (confirmPassword) validateConfirmPassword(confirmPassword);
              }}
              onBlur={() => validatePassword(password)}
              className="rounded-xl transition-all duration-200"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {passwordError && <div className="text-sm text-destructive">{passwordError}</div>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                validateConfirmPassword(e.target.value);
              }}
              onBlur={() => validateConfirmPassword(confirmPassword)}
              className="rounded-xl transition-all duration-200"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {confirmPasswordError && <div className="text-sm text-destructive">{confirmPasswordError}</div>}
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={agreeToTerms} 
            onCheckedChange={(checked) => {
              setAgreeToTerms(checked === true);
              if (checked) setTermsError('');
            }}
            className="rounded-md transition-all duration-200"
          />
          <Label htmlFor="terms" className="text-sm">
            I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </Label>
        </div>
        {termsError && <div className="text-sm text-destructive">{termsError}</div>}

        <Alert variant="default" className="bg-muted/50 text-sm">
          <Info className="h-4 w-4" />
          <AlertDescription>
            We prioritize your security. Your account will be protected with enterprise-grade encryption.
          </AlertDescription>
        </Alert>
      </TabsContent>
      
      <TabsContent value="phone" className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number (+1234567890)"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (e.target.value) validatePhone(e.target.value);
              }}
              onBlur={() => validatePhone(phone)}
              className={`rounded-xl transition-all duration-200 ${isCheckingPhone ? 'opacity-70' : ''}`}
              disabled={isCheckingPhone}
              required
            />
            {isCheckingPhone && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-opacity-50 border-t-primary rounded-full"></div>
              </div>
            )}
          </div>
          {phoneError && (
            <div className={`text-sm ${phoneError.includes('already exists') ? 'text-amber-500' : 'text-destructive'}`}>
              {phoneError}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms-phone" 
            checked={agreeToTerms} 
            onCheckedChange={(checked) => {
              setAgreeToTerms(checked === true);
              if (checked) setTermsError('');
            }}
            className="rounded-md transition-all duration-200"
          />
          <Label htmlFor="terms-phone" className="text-sm">
            I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </Label>
        </div>
        {termsError && <div className="text-sm text-destructive">{termsError}</div>}
        
        <Alert variant="default" className="bg-muted/50 text-sm">
          <Info className="h-4 w-4" />
          <AlertDescription>
            A verification code will be sent to your phone. Message and data rates may apply.
          </AlertDescription>
        </Alert>
      </TabsContent>

      <Button 
        type="button" 
        className="w-full mt-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200" 
        disabled={isLoading || (authType === 'email' && !!emailError) || (authType === 'phone' && !!phoneError)}
        onClick={handleSignup}
      >
        {isLoading ? 'Processing...' : 'Create Account'}
      </Button>
      
      <div className="mt-4 space-y-4">
        <Button
          type="button"
          variant="ghost"
          className="w-full rounded-xl transition-all duration-200 text-sm text-muted-foreground hover:bg-accent"
          onClick={() => navigate('/auth')}
        >
          Already have an account? Sign In
        </Button>
      </div>
    </Tabs>
  );
};
