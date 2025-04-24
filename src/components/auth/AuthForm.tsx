import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import { Mail, Phone, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AuthMode, AuthType } from '@/types/auth';

const AuthForm = ({ mode }: { mode: AuthMode }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [authType, setAuthType] = useState<AuthType>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [emailExistsError, setEmailExistsError] = useState('');
  const [phoneExistsError, setPhoneExistsError] = useState('');

  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        if (authType === 'email' && emailExistsError) {
          toast.error(emailExistsError);
          setIsLoading(false);
          return;
        }
        
        if (authType === 'phone' && phoneExistsError) {
          toast.error(phoneExistsError);
          setIsLoading(false);
          return;
        }

        if (authType === 'email') {
          if (!isValidEmail(email)) {
            toast.error('Please enter a valid email address');
            setIsLoading(false);
            return;
          }
          
          if (password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
          }
          
          if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            setIsLoading(false);
            return;
          }
          
          if (!agreeToTerms) {
            toast.error('You must agree to the Terms and Privacy Policy');
            setIsLoading(false);
            return;
          }

          if (emailExistsError) {
            toast.error(emailExistsError);
            setIsLoading(false);
            return;
          }

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

            if (error) {
              if (error.status === 400 && error.message.toLowerCase().includes('email')) {
                toast.error('An account with this email already exists. Please log in or reset your password.');
                setEmailExistsError('An account with this email already exists. Please log in or reset your password.');
              } else {
                throw error;
              }
              setIsLoading(false);
              return;
            }

            toast.success('Sign up successful! Please check your email for verification.');
          } catch (error: any) {
            console.error('Signup error:', error);
            toast.error(error.message || 'Failed to sign up');
          }
        } else if (authType === 'phone') {
          if (!isValidPhone(phone)) {
            toast.error('Please enter a valid phone number');
            setIsLoading(false);
            return;
          }
          
          if (!agreeToTerms) {
            toast.error('You must agree to the Terms and Privacy Policy');
            setIsLoading(false);
            return;
          }

          if (phoneExistsError) {
            toast.error(phoneExistsError);
            setIsLoading(false);
            return;
          }

          try {
            const { error } = await supabase.auth.signInWithOtp({
              phone,
              options: {
                shouldCreateUser: true,
              }
            });

            if (error) {
              if (error.status === 409 || (error.status === 400 && error.message.toLowerCase().includes('phone'))) {
                toast.error('An account with this phone number already exists. Please log in using OTP.');
                setPhoneExistsError('An account with this phone number already exists. Please log in using OTP.');
              } else {
                throw error;
              }
              setIsLoading(false);
              return;
            }

            toast.success('Verification code sent to your phone');
          } catch (error: any) {
            console.error('Phone signup error:', error);
            toast.error(error.message || 'Failed to sign up');
          }
        }
      } else if (mode === 'login') {
        if (authType === 'email') {
          if (!isValidEmail(email) || !password) {
            toast.error('Please enter a valid email and password');
            setIsLoading(false);
            return;
          }

          try {
            const { error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (error) throw error;
            toast.success('Successfully logged in!');
            navigate('/');
          } catch (error: any) {
            console.error('Login error:', error);
            toast.error(error.message || 'Failed to log in');
          }
        } else if (authType === 'phone') {
          if (!isValidPhone(phone)) {
            toast.error('Please enter a valid phone number');
            setIsLoading(false);
            return;
          }

          if (!otp) {
            const { error } = await supabase.auth.signInWithOtp({
              phone,
            });

            if (error) throw error;
            toast.success('Verification code sent to your phone');
          } else {
            const { error } = await supabase.auth.verifyOtp({
              phone,
              token: otp,
              type: 'sms',
            });

            if (error) throw error;
            toast.success('Successfully logged in!');
            navigate('/');
          }
        }
      } else if (mode === 'forgot-password') {
        if (!isValidEmail(email)) {
          toast.error('Please enter a valid email address');
          setIsLoading(false);
          return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/reset-password',
        });

        if (error) throw error;
        toast.success('Password reset instructions sent to your email');
      } else if (mode === 'reset-password') {
        if (password.length < 6) {
          toast.error('Password must be at least 6 characters long');
          setIsLoading(false);
          return;
        }
        
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          setIsLoading(false);
          return;
        }

        const { error } = await supabase.auth.updateUser({
          password,
        });

        if (error) throw error;
        toast.success('Password reset successful');
        navigate('/auth');
      } else if (mode === 'forgot-email') {
        if (!isValidPhone(phone)) {
          toast.error('Please enter a valid phone number');
          setIsLoading(false);
          return;
        }

        setTimeout(() => {
          toast.success('If this phone number matches an account, we will show the associated email.');
          toast.info('Associated email: m****@gmail.com');
        }, 1500);
      }
    } catch (error: any) {
      if (error.message.includes('already registered')) {
        toast.error('An account with this email already exists.');
      } else if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password. Please try again.');
      } else if (error.message.toLowerCase().includes('phone') && error.message.toLowerCase().includes('exists')) {
        toast.error('An account with this phone number already exists.');
      } else {
        toast.error(error.message || 'Authentication failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    if (mode === 'signup') {
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
                placeholder="you@example.com"
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
                  placeholder="••••••••"
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
                  placeholder="••••••••"
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
                placeholder="+1234567890"
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
        </Tabs>
      );
    } else if (mode === 'login') {
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
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
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
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe} 
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <Label htmlFor="remember" className="text-sm">Remember me</Label>
            </div>
            
            <div className="text-sm space-x-1 text-right">
              <a href="/auth/forgot-password" className="text-primary hover:underline">Forgot Password?</a>
              <span>•</span>
              <a href="/auth/forgot-email" className="text-primary hover:underline">Forgot Email?</a>
            </div>
          </TabsContent>
          
          <TabsContent value="phone" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            
            {otp ? (
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember-phone" 
                  checked={rememberMe} 
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label htmlFor="remember-phone" className="text-sm">Remember me</Label>
              </div>
            )}
            
            {!otp && (
              <div className="text-sm space-x-1 text-right">
                <a href="/auth/forgot-email" className="text-primary hover:underline">Forgot Phone Number?</a>
              </div>
            )}
          </TabsContent>
        </Tabs>
      );
    } else if (mode === 'forgot-password') {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="text-sm">
            Enter your email address and we'll send you a link to reset your password.
          </div>
        </div>
      );
    } else if (mode === 'reset-password') {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
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
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
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
        </div>
      );
    } else if (mode === 'forgot-email') {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="text-sm">
            Enter your phone number and we'll look up your associated email address.
          </div>
        </div>
      );
    }
    
    return null;
  };

  const getTitle = () => {
    switch (mode) {
      case 'signup': return 'Create Account';
      case 'login': return 'Sign In';
      case 'forgot-password': return 'Forgot Password';
      case 'reset-password': return 'Reset Password';
      case 'forgot-email': return 'Recover Email';
      default: return 'Authentication';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'signup': return 'Create a new account to save your valuations';
      case 'login': return 'Sign in to access your saved valuations';
      case 'forgot-password': return 'Receive a password reset link via email';
      case 'reset-password': return 'Create a new password for your account';
      case 'forgot-email': return 'Find your account email using your phone number';
      default: return '';
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Loading...';
    
    switch (mode) {
      case 'signup': return 'Sign Up';
      case 'login': 
        if (authType === 'phone' && !otp) return 'Send Code';
        if (authType === 'phone' && otp) return 'Verify Code';
        return 'Sign In';
      case 'forgot-password': return 'Send Reset Link';
      case 'reset-password': return 'Reset Password';
      case 'forgot-email': return 'Recover Email';
      default: return 'Submit';
    }
  };

  const getToggleLink = () => {
    if (mode === 'signup') {
      return (
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => navigate('/auth')}
        >
          Already have an account? Sign In
        </Button>
      );
    } else if (mode === 'login') {
      return (
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => navigate('/auth/signup')}
        >
          Don't have an account? Sign Up
        </Button>
      );
    } else if (mode === 'forgot-password' || mode === 'forgot-email' || mode === 'reset-password') {
      return (
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => navigate('/auth')}
        >
          Back to Sign In
        </Button>
      );
    }
    
    return null;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{getTitle()}</CardTitle>
        <CardDescription>{getDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderForm()}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {getButtonText()}
          </Button>
          
          {getToggleLink()}
        </form>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
