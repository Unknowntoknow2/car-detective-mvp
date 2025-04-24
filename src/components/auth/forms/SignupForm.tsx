
import { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthType } from '@/types/auth';
import { toast } from 'sonner';
import { EmailSignup } from './signup/EmailSignup';
import { PhoneSignup } from './signup/PhoneSignup';
import { supabase } from '@/integrations/supabase/client';

interface SignupFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const SignupForm = ({ isLoading, setIsLoading }: SignupFormProps) => {
  const [authType, setAuthType] = useState<AuthType>('email');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [termsError, setTermsError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validateTerms = () => {
    if (!agreeToTerms) {
      setTermsError('You must agree to the Terms and Privacy Policy');
      return false;
    }
    setTermsError('');
    return true;
  };

  const handleSignupError = (error: any) => {
    console.error('Signup error:', error);
    if (error.message.includes('rate limit')) {
      toast.error('Too many attempts', {
        description: 'Please wait a moment before trying again.',
      });
    } else {
      toast.error('Sign up failed', {
        description: error.message || 'An unexpected error occurred. Please try again later.',
      });
    }
  };

  const handleEmailSignup = async (email: string, password: string): Promise<void> => {
    if (!validateTerms()) return Promise.resolve();
    
    // Double check for existing email before proceeding
    if (emailError.includes('already exists')) {
      toast.error('Email already in use', {
        description: 'This email is already registered. Please try logging in instead.',
      });
      return Promise.resolve();
    }
    
    setIsLoading(true);

    try {
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
    } catch (error: any) {
      handleSignupError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSignup = async (phone: string): Promise<void> => {
    if (!validateTerms()) return Promise.resolve();
    
    // Double check for existing phone before proceeding
    if (phoneError.includes('already exists')) {
      toast.error('Phone already in use', {
        description: 'This phone number is already registered. Please try logging in instead.',
      });
      return Promise.resolve();
    }
    
    setIsLoading(true);

    try {
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
    } catch (error: any) {
      handleSignupError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (authType === 'email') {
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      if (emailInput && passwordInput) {
        handleEmailSignup(emailInput.value, passwordInput.value);
      }
    } else {
      const phoneInput = document.getElementById('phone-number') as HTMLInputElement;
      if (phoneInput) {
        handlePhoneSignup(phoneInput.value);
      }
    }
  };

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
      
      <TabsContent value="email" className="mt-4">
        <EmailSignup
          isLoading={isLoading}
          onSignup={handleEmailSignup}
          emailError={emailError}
          setEmailError={setEmailError}
        />
      </TabsContent>
      
      <TabsContent value="phone" className="mt-4">
        <PhoneSignup
          isLoading={isLoading}
          onSignup={handlePhoneSignup}
          phoneError={phoneError}
          setPhoneError={setPhoneError}
        />
      </TabsContent>

      <div className="mt-4">
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
        {termsError && <div className="text-sm text-destructive mt-1">{termsError}</div>}
      </div>

      <Button 
        type="button" 
        className="w-full mt-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200" 
        disabled={isLoading || (authType === 'email' && !!emailError) || (authType === 'phone' && !!phoneError) || !agreeToTerms}
        onClick={handleSubmit}
      >
        {isLoading ? 'Processing...' : 'Create Account'}
      </Button>
    </Tabs>
  );
};
