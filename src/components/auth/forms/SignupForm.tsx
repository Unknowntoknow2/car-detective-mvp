
import { useState } from 'react';
import { Mail, Phone, Eye, EyeOff } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthType } from '@/types/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
  const [emailExistsError, setEmailExistsError] = useState('');
  const [phoneExistsError, setPhoneExistsError] = useState('');

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string) => {
    return /^\+?[1-9]\d{9,14}$/.test(phone);
  };

  const checkEmailExists = async (email: string) => {
    if (!isValidEmail(email)) {
      setEmailExistsError('');
      return;
    }
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        }
      });

      if (error && error.message.includes("User not found")) {
        setEmailExistsError('');
      } else {
        setEmailExistsError('An account with this email already exists. Please log in or reset your password.');
      }
    } catch (error) {
      console.error('Error checking email:', error);
    }
  };

  const checkPhoneExists = async (phone: string) => {
    if (!isValidPhone(phone)) {
      setPhoneExistsError('');
      return;
    }
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          shouldCreateUser: false,
        }
      });

      if (error && error.message.includes("Phone number not found")) {
        setPhoneExistsError('');
      } else {
        setPhoneExistsError('An account with this phone number already exists. Please log in using OTP.');
      }
    } catch (error) {
      console.error('Error checking phone:', error);
    }
  };

  const handleSignup = async () => {
    setIsLoading(true);

    try {
      if (authType === 'email') {
        if (!email) {
          toast.error('Email is required');
          return;
        }
        
        if (!isValidEmail(email)) {
          toast.error('Please enter a valid email');
          return;
        }
        
        if (!password) {
          toast.error('Password cannot be empty');
          return;
        }
        
        if (password.length < 6) {
          toast.error('Password must be at least 6 characters long');
          return;
        }
        
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
        
        if (!agreeToTerms) {
          toast.error('You must agree to the Terms and Privacy Policy');
          return;
        }

        if (emailExistsError) {
          toast.error(emailExistsError);
          return;
        }

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
        toast.success('Sign up successful! Please check your email for verification.');
      } else {
        if (!phone) {
          toast.error('Phone number is required');
          return;
        }
        
        if (!isValidPhone(phone)) {
          toast.error('Please enter a valid phone number');
          return;
        }
        
        if (!agreeToTerms) {
          toast.error('You must agree to the Terms and Privacy Policy');
          return;
        }

        if (phoneExistsError) {
          toast.error(phoneExistsError);
          return;
        }

        const { error } = await supabase.auth.signInWithOtp({
          phone,
          options: {
            shouldCreateUser: true,
          }
        });

        if (error) throw error;
        toast.success('Verification code sent to your phone');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="email" className="w-full" onValueChange={(value) => setAuthType(value as AuthType)}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email
        </TabsTrigger>
        <TabsTrigger value="phone" className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Phone
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="email" className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (e.target.value.length > 5) {
                checkEmailExists(e.target.value);
              }
            }}
            onBlur={() => checkEmailExists(email)}
            required
          />
          {emailExistsError && <p className="text-sm text-destructive">{emailExistsError}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={agreeToTerms} 
            onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
          />
          <Label htmlFor="terms" className="text-sm">
            I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </Label>
        </div>
      </TabsContent>
      
      <TabsContent value="phone" className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (e.target.value.length > 8) {
                checkPhoneExists(e.target.value);
              }
            }}
            onBlur={() => checkPhoneExists(phone)}
            required
          />
          {phoneExistsError && <p className="text-sm text-destructive">{phoneExistsError}</p>}
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms-phone" 
            checked={agreeToTerms} 
            onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
          />
          <Label htmlFor="terms-phone" className="text-sm">
            I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </Label>
        </div>
      </TabsContent>

      <Button 
        type="button" 
        className="w-full mt-4" 
        disabled={isLoading}
        onClick={handleSignup}
      >
        {isLoading ? 'Signing up...' : 'Sign Up'}
      </Button>
    </Tabs>
  );
};
