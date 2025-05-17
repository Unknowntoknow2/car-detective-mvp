import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { 
  Loader2, 
  Mail, 
  ArrowLeft, 
  RefreshCcw, 
  Mail as MailIcon, 
  HelpCircle, 
  AlertTriangle 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Define form schema
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

interface ForgotPasswordFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

// Maximum number of email sends allowed within the rate limit window
const MAX_EMAIL_SENDS = 3;
// Rate limit window in milliseconds (30 minutes)
const RATE_LIMIT_WINDOW = 30 * 60 * 1000;

export const ForgotPasswordForm = ({ isLoading, setIsLoading }: ForgotPasswordFormProps) => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [lastEmail, setLastEmail] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  
  // Rate limiting state
  const [emailSendCount, setEmailSendCount] = useState<number>(0);
  const [rateLimit, setRateLimit] = useState<boolean>(false);
  const [rateLimitReset, setRateLimitReset] = useState<number>(0);
  
  // Reference to store when the rate limit window started
  const rateLimitStartRef = useRef<number>(0);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  // Handle resend cooldown timer
  useEffect(() => {
    let timer: number | undefined;
    if (resendCooldown > 0) {
      timer = window.setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendCooldown]);

  // Handle rate limit countdown timer
  useEffect(() => {
    let timer: number | undefined;
    if (rateLimit && rateLimitReset > 0) {
      timer = window.setTimeout(() => {
        setRateLimitReset(prev => {
          const newValue = prev - 1;
          if (newValue <= 0) {
            // Reset rate limit when timer reaches zero
            setRateLimit(false);
            setEmailSendCount(0);
            return 0;
          }
          return newValue;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [rateLimit, rateLimitReset]);

  // Check and update rate limit status
  const checkRateLimit = (): boolean => {
    const now = Date.now();
    
    // Initialize rate limit window if this is the first email
    if (emailSendCount === 0) {
      rateLimitStartRef.current = now;
    }
    
    // Check if we're still within the rate limit window
    const timeElapsed = now - rateLimitStartRef.current;
    if (timeElapsed > RATE_LIMIT_WINDOW) {
      // Reset the counter if the window has elapsed
      setEmailSendCount(1);
      rateLimitStartRef.current = now;
      return false;
    }
    
    // Increment and check if we've hit the limit
    const newCount = emailSendCount + 1;
    setEmailSendCount(newCount);
    
    if (newCount >= MAX_EMAIL_SENDS) {
      const resetTimeInSeconds = Math.ceil((RATE_LIMIT_WINDOW - timeElapsed) / 1000);
      setRateLimit(true);
      setRateLimitReset(resetTimeInSeconds);
      return true;
    }
    
    return false;
  };

  // Format time remaining for display
  const formatTimeRemaining = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setFormError(null);
    
    // Check if we've hit the rate limit
    if (rateLimit) {
      toast.error('Rate limit exceeded', {
        description: `Please wait ${formatTimeRemaining(rateLimitReset)} before requesting another password reset email.`
      });
      return;
    }
    
    // Check if this would exceed the rate limit
    if (checkRateLimit()) {
      toast.error('Rate limit reached', {
        description: `You've reached the maximum number of password reset requests. Please try again in ${formatTimeRemaining(rateLimitReset)}.`
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log(`[PasswordReset] Sending reset email to: ${values.email}`);
      console.log(`[PasswordReset] Redirect URL: ${window.location.origin}/auth/reset-password`);
      
      const result = await resetPassword(values.email);
      
      if (result?.error) {
        console.error('[PasswordReset] Error sending reset email:', {
          message: result.error,
          details: result.error,
          // Use optional chaining and type assertion for potentially missing properties
          code: (result.error as any)?.code,
          status: (result.error as any)?.status
        });
        
        setFormError(result.error || 'Failed to send password reset email');
        toast.error('Failed to send password reset email', {
          description: result.error || 'Please try again or contact support if the issue persists.'
        });
        return;
      }
      
      // Show success message
      console.log('[PasswordReset] Reset email sent successfully');
      setSuccess(true);
      setLastEmail(values.email);
      toast.success('Reset link sent!', {
        description: 'Please check your email inbox and spam folder.'
      });
      form.reset();

      // Set cooldown for resend button
      setResendCooldown(60); // 60 seconds cooldown
    } catch (err: any) {
      console.error('[PasswordReset] Unexpected error sending reset email:', err);
      setFormError('An unexpected error occurred');
      toast.error('An unexpected error occurred', {
        description: 'Our team has been notified. Please try again later.'
      });
      console.error('Password reset error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!lastEmail || resendCooldown > 0) return;
    
    // Check if we've hit the rate limit
    if (rateLimit) {
      toast.error('Rate limit exceeded', {
        description: `Please wait ${formatTimeRemaining(rateLimitReset)} before requesting another password reset email.`
      });
      return;
    }
    
    // Check if this would exceed the rate limit
    if (checkRateLimit()) {
      toast.error('Rate limit reached', {
        description: `You've reached the maximum number of password reset requests. Please try again in ${formatTimeRemaining(rateLimitReset)}.`
      });
      return;
    }
    
    setIsLoading(true);
    setResendCooldown(60); // Set cooldown to prevent spam
    
    try {
      console.log(`[PasswordReset] Resending reset email to: ${lastEmail}`);
      console.log(`[PasswordReset] Redirect URL: ${window.location.origin}/auth/reset-password`);
      
      const result = await resetPassword(lastEmail);
      
      if (result?.error) {
        console.error('[PasswordReset] Error resending reset email:', {
          message: result.error,
          details: result.error,
          // Use optional chaining and type assertion for potentially missing properties
          code: (result.error as any)?.code,
          status: (result.error as any)?.status
        });
        
        toast.error('Failed to resend email', {
          description: result.error || 'Please try again or contact support.'
        });
        return;
      }
      
      console.log('[PasswordReset] Reset email resent successfully');
      toast.success('Email sent again!', {
        description: 'Please check your inbox and spam folder.'
      });
    } catch (err) {
      console.error('[PasswordReset] Unexpected error resending reset email:', err);
      toast.error('Failed to resend email', {
        description: 'Please try again later or contact support.'
      });
      console.error('Email resend error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Mail className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">Reset Link Sent</h3>
        <p className="text-sm text-green-700 mb-4">
          We've sent a password reset link to <strong>{lastEmail}</strong>. The link will expire in 24 hours.
        </p>
        
        {rateLimit && (
          <div className="p-3 mb-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-amber-500 flex-shrink-0" />
              <span>
                Rate limit reached. Please wait {formatTimeRemaining(rateLimitReset)} before requesting another reset email.
              </span>
            </div>
          </div>
        )}
        
        <p className="text-sm text-gray-600 mb-6">
          If you don't see the email in your inbox, please check your spam folder or try these options:
        </p>
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={handleResendEmail}
            disabled={isLoading || resendCooldown > 0 || rateLimit}
            className="w-full flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : resendCooldown > 0 ? (
              <>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Resend Email ({resendCooldown}s)
              </>
            ) : rateLimit ? (
              <>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Resend Limit Reached
              </>
            ) : (
              <>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Resend Email
              </>
            )}
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => navigate('/auth')}
            className="inline-flex items-center w-full justify-center"
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
          
          <div className="pt-3 border-t border-gray-200 mt-3 space-y-3">
            <p className="text-sm text-amber-700 mb-2 flex items-center justify-center">
              <MailIcon className="h-4 w-4 mr-2 text-amber-500" />
              Check your spam/junk folder for the reset email
            </p>
            
            <a
              href="mailto:support@cardetective.com?subject=Password%20Reset%20Help"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center"
            >
              <HelpCircle className="h-4 w-4 mr-2 text-blue-500" />
              Contact Support for Help
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {formError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {formError}
          </div>
        )}
        
        {rateLimit && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm flex items-start">
            <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-amber-500 flex-shrink-0" />
            <div>
              <p className="font-medium">Rate limit reached</p>
              <p>Please wait {formatTimeRemaining(rateLimitReset)} before requesting another reset email.</p>
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <h2 className="text-lg font-medium">Reset Your Password</h2>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    placeholder="Enter your email"
                    type="email"
                    className="pl-10"
                    disabled={isLoading || rateLimit}
                    autoComplete="email"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex flex-col space-y-2">
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || rateLimit}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending reset link...
              </>
            ) : rateLimit ? (
              <>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Rate Limit Reached
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/auth')}
            disabled={isLoading}
            className="inline-flex items-center justify-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </div>
        
        {emailSendCount > 0 && !rateLimit && (
          <div className="pt-2 text-xs text-muted-foreground">
            <p className="text-center">
              You've used {emailSendCount} of {MAX_EMAIL_SENDS} reset email requests
            </p>
          </div>
        )}
      </form>
    </Form>
  );
};
