
import { useState, useEffect } from 'react';
import { Mail, Briefcase } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isValidEmail, validatePassword } from './validation';
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
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [emailCheckTimeout, setEmailCheckTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [referralToken, setReferralToken] = useState<string | null>(null);

  // Check for referral token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('referralToken');
    if (token) {
      setReferralToken(token);
      console.log('Found referral token:', token);
    }
  }, []);

  // Process referral after successful signup
  useEffect(() => {
    return () => {
      // Clean up email check timeout
      if (emailCheckTimeout) {
        clearTimeout(emailCheckTimeout);
      }
    }
  }, [emailCheckTimeout]);

  const checkEmailExists = (email: string) => {
    if (!isValidEmail(email)) {
      setEmailError('');
      return;
    }
    
    if (emailCheckTimeout) {
      clearTimeout(emailCheckTimeout);
    }
    
    const timeout = setTimeout(async () => {
      setIsCheckingEmail(true);
      
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: 'dummy-password-for-checking', // Will fail, but tells us if email exists
        });

        if (error && error.message.includes('Invalid login')) {
          // Email exists
          setEmailError('An account with this email already exists. Try logging in instead.');
        } else if (error && error.message.includes('record not found')) {
          // Email doesn't exist
          setEmailError('');
        } else {
          // Some other error
          setEmailError('');
        }
      } catch (error) {
        console.error('Error checking email:', error);
      } finally {
        setIsCheckingEmail(false);
      }
    }, 600);
    
    setEmailCheckTimeout(timeout);
  };

  const validateForm = () => {
    let isValid = true;
    
    // Validate email
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }
    
    // Validate password
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmError('');
    }
    
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      await onSignup(email, password);
      
      // Process referral if token exists
      if (referralToken) {
        try {
          // Get current user
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            // Process the referral
            await supabase.functions.invoke('process-referral', {
              body: {
                action: 'process',
                referralToken,
                userId: user.id
              }
            });
            
            // Clean up localStorage
            localStorage.removeItem('referralToken');
          }
        } catch (error) {
          console.error('Error processing referral:', error);
          // Don't fail signup if referral processing fails
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      {referralToken && (
        <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">
          You were referred by a friend! Complete your sign up to get started.
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              checkEmailExists(e.target.value);
            }}
            className={`rounded-xl transition-all duration-200 ${isCheckingEmail ? 'opacity-70' : ''}`}
            disabled={isLoading || isCheckingEmail}
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
        <Input
          id="password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl transition-all duration-200"
          disabled={isLoading}
          required
        />
        {passwordError && (
          <div className="text-sm text-destructive">{passwordError}</div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="rounded-xl transition-all duration-200"
          disabled={isLoading}
          required
        />
        {confirmError && (
          <div className="text-sm text-destructive">{confirmError}</div>
        )}
      </div>
    </div>
  );
}
