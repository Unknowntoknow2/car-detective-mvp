
import { useState, useEffect } from 'react';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { validateEmail, validatePassword, validateConfirmPassword } from './validation';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface EmailSignupProps {
  isLoading: boolean;
  onSignup: (email: string, password: string) => Promise<void>;
  emailError: string;
  setEmailError: (error: string) => void;
}

export const EmailSignup = ({ isLoading, onSignup, emailError, setEmailError }: EmailSignupProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [emailCheckTimeout, setEmailCheckTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const checkEmailExists = async (email: string) => {
    if (!validateEmail(email)) {
      setEmailError('');
      return;
    }
    
    if (emailCheckTimeout) {
      clearTimeout(emailCheckTimeout);
    }
    
    const timeout = setTimeout(async () => {
      setIsCheckingEmail(true);
      
      try {
        // First attempt to get user by email to check if it exists
        const { data: { user }, error: getUserError } = await supabase.auth.admin.getUserByEmail(email)
          .catch(() => ({ data: { user: null }, error: null }));
        
        if (user) {
          // If the user exists, set the error
          setEmailError('An account with this email already exists. Try logging in instead.');
        } else {
          // If no user is found, the email is available
          setEmailError('');
        }
      } catch (error) {
        // Fallback method if admin API fails
        try {
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
              shouldCreateUser: false,
            }
          });
          
          // If there's an error about user not found, email is available
          if (error && error.message.includes("User not found")) {
            setEmailError('');
          } else {
            // No error or different error means user likely exists
            setEmailError('An account with this email already exists. Try logging in instead.');
          }
        } catch (fallbackError) {
          console.error('Error checking email:', fallbackError);
        }
      } finally {
        setIsCheckingEmail(false);
      }
    }, 600);
    
    setEmailCheckTimeout(timeout);
  };

  const handleSubmit = async () => {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validateConfirmPassword(password, confirmPassword);

    setPasswordError(passwordValidation);
    setConfirmPasswordError(confirmPasswordValidation);

    if (!emailValidation && !passwordValidation && !confirmPasswordValidation && !emailError) {
      await onSignup(email, password);
    }
  };

  useEffect(() => {
    return () => {
      if (emailCheckTimeout) clearTimeout(emailCheckTimeout);
    };
  }, [emailCheckTimeout]);

  return (
    <div className="space-y-4">
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
              checkEmailExists(e.target.value);
            }}
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
              setPasswordError(validatePassword(e.target.value));
              if (confirmPassword) {
                setConfirmPasswordError(validateConfirmPassword(e.target.value, confirmPassword));
              }
            }}
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
              setConfirmPasswordError(validateConfirmPassword(password, e.target.value));
            }}
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

      <Alert variant="default" className="bg-muted/50 text-sm">
        <Info className="h-4 w-4" />
        <AlertDescription>
          We prioritize your security. Your account will be protected with enterprise-grade encryption.
        </AlertDescription>
      </Alert>
    </div>
  );
};
