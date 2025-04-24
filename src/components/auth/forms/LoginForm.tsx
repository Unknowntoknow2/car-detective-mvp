
import { useState } from 'react';
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

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      if (authType === 'email') {
        if (!email) {
          toast.error('Email is required');
          return;
        }
        
        if (!password) {
          toast.error('Password cannot be empty');
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        toast.success('Successfully logged in!');
        navigate('/');
      } else {
        if (!phone) {
          toast.error('Phone number is required');
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
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password. Please try again.');
      } else {
        toast.error(error.message || 'Failed to log in');
      }
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
          <a href="/auth/forgot-email" className="text-primary hover:underline">Forgot Username?</a>
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
            <a href="/auth/forgot-email" className="text-primary hover:underline">Forgot Username?</a>
          </div>
        )}
      </TabsContent>

      <Button 
        type="button" 
        className="w-full mt-4" 
        disabled={isLoading}
        onClick={handleLogin}
      >
        {isLoading ? 'Loading...' : (authType === 'phone' && !otp ? 'Send Code' : 'Sign In')}
      </Button>
    </Tabs>
  );
};
