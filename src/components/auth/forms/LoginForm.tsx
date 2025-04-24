
import { useState, useEffect } from 'react';
import { Mail, Phone, Eye, EyeOff } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { AuthType } from '@/types/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const LoginForm = ({ isLoading, setIsLoading }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [authType, setAuthType] = useState<AuthType>('email');
  const navigate = useNavigate();
  
  // Form validation states
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [otpError, setOtpError] = useState('');

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('Username or email is required');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError('Password is required');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validatePhone = (value: string) => {
    if (!value) {
      setPhoneError('Phone number is required');
      return false;
    }
    
    // Basic international phone validation
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    if (!phoneRegex.test(value)) {
      setPhoneError('Please enter a valid international phone number');
      return false;
    }
    
    setPhoneError('');
    return true;
  };

  const validateOtp = (value: string) => {
    if (!value || value.length < 6) {
      setOtpError('Please enter the complete verification code');
      return false;
    }
    setOtpError('');
    return true;
  };

  const handleLogin = async () => {
    // Validate form based on active auth type
    if (authType === 'email') {
      if (!validateEmail(email) || !validatePassword(password)) {
        return;
      }
    } else {
      if (!otp) {
        if (!validatePhone(phone)) {
          return;
        }
      } else {
        if (!validatePhone(phone) || !validateOtp(otp)) {
          return;
        }
      }
    }

    setIsLoading(true);

    try {
      if (authType === 'email') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        toast.success('Successfully signed in', {
          description: 'Welcome back to your account.',
        });
        navigate('/');
      } else {
        if (!otp) {
          const { error } = await supabase.auth.signInWithOtp({
            phone,
          });

          if (error) throw error;
          toast.success('Verification code sent', {
            description: 'Please check your phone for the verification code.',
          });
        } else {
          const { error } = await supabase.auth.verifyOtp({
            phone,
            token: otp,
            type: 'sms',
          });

          if (error) throw error;
          toast.success('Successfully signed in', {
            description: 'Welcome back to your account.',
          });
          navigate('/');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid credentials', {
          description: 'The username/email or password you entered is incorrect. Please try again.',
        });
      } else if (error.message.includes('rate limit')) {
        toast.error('Too many attempts', {
          description: 'Please wait a moment before trying again.',
        });
      } else {
        toast.error('Sign in failed', {
          description: error.message || 'An unexpected error occurred. Please try again later.',
        });
      }
    } finally {
      setIsLoading(false);
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
      
      <TabsContent value="email" className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Username or Email</Label>
          <Input
            id="email"
            type="text"
            placeholder="Enter your username or email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (e.target.value) validateEmail(e.target.value);
            }}
            onBlur={() => validateEmail(email)}
            className="rounded-xl transition-all duration-200"
            required
          />
          {emailError && <div className="text-sm text-destructive">{emailError}</div>}
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
                if (e.target.value) validatePassword(e.target.value);
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
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember" 
            checked={rememberMe} 
            onCheckedChange={(checked) => setRememberMe(checked === true)}
            className="rounded-md transition-all duration-200"
          />
          <Label htmlFor="remember" className="text-sm">Remember me</Label>
        </div>
        
        <div className="text-sm space-x-1 text-right">
          <a href="/auth/forgot-password" className="text-primary hover:underline">Forgot Password?</a>
          <span>•</span>
          <a href="/auth/forgot-email" className="text-primary hover:underline">Forgot Username?</a>
        </div>
      </TabsContent>
      
      <TabsContent value="phone" className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number (+1234567890)"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (e.target.value && otp) validatePhone(e.target.value);
            }}
            onBlur={() => validatePhone(phone)}
            className="rounded-xl transition-all duration-200"
            required
          />
          {phoneError && <div className="text-sm text-destructive">{phoneError}</div>}
        </div>
        
        {otp ? (
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <InputOTP maxLength={6} value={otp} onChange={(value) => {
              setOtp(value);
              if (value.length === 6) validateOtp(value);
            }}>
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={0} className="rounded-lg transition-all duration-200" />
                <InputOTPSlot index={1} className="rounded-lg transition-all duration-200" />
                <InputOTPSlot index={2} className="rounded-lg transition-all duration-200" />
                <InputOTPSlot index={3} className="rounded-lg transition-all duration-200" />
                <InputOTPSlot index={4} className="rounded-lg transition-all duration-200" />
                <InputOTPSlot index={5} className="rounded-lg transition-all duration-200" />
              </InputOTPGroup>
            </InputOTP>
            {otpError && <div className="text-sm text-destructive">{otpError}</div>}
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember-phone" 
              checked={rememberMe} 
              onCheckedChange={(checked) => setRememberMe(checked === true)}
              className="rounded-md transition-all duration-200"
            />
            <Label htmlFor="remember-phone" className="text-sm">Remember me</Label>
          </div>
        )}
        
        {!otp && (
          <div className="text-sm space-x-1 text-right">
            <a href="/auth/forgot-email" className="text-primary hover:underline">Forgot Username?</a>
          </div>
        )}
      </TabsContent>

      <Button 
        type="button" 
        className="w-full mt-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200" 
        disabled={isLoading}
        onClick={handleLogin}
      >
        {isLoading ? 'Loading...' : (authType === 'phone' && !otp ? 'Send Code' : 'Sign In')}
      </Button>
    </Tabs>
  );
};
