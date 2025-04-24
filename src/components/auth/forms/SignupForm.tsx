
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

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

  const handleEmailSignup = async (email: string, password: string) => {
    if (!validateTerms()) return;
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

  const handlePhoneSignup = async (phone: string) => {
    if (!validateTerms()) return;
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

  const handleSignupClick = () => {
    if (authType === 'email') {
      if (email && password) {
        handleEmailSignup(email, password);
      }
    } else {
      if (phone) {
        handlePhoneSignup(phone);
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
          onSignup={(email, password) => {
            setEmail(email);
            setPassword(password);
            handleEmailSignup(email, password);
          }}
          emailError={emailError}
          setEmailError={setEmailError}
        />
      </TabsContent>
      
      <TabsContent value="phone" className="mt-4">
        <PhoneSignup
          isLoading={isLoading}
          onSignup={(phone) => {
            setPhone(phone);
            handlePhoneSignup(phone);
          }}
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
        disabled={isLoading || (authType === 'email' && !!emailError) || (authType === 'phone' && !!phoneError)}
        onClick={handleSignupClick}
      >
        {isLoading ? 'Processing...' : 'Create Account'}
      </Button>
    </Tabs>
  );
};
