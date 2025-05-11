
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Mail, ArrowLeft, RefreshCcw, Mail as MailIcon, HelpCircle } from 'lucide-react';
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

export const ForgotPasswordForm = ({ isLoading, setIsLoading }: ForgotPasswordFormProps) => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [lastEmail, setLastEmail] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState<number>(0);

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

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setFormError(null);
    setIsLoading(true);
    
    try {
      console.log(`[PasswordReset] Sending reset email to: ${values.email}`);
      console.log(`[PasswordReset] Redirect URL: ${window.location.origin}/auth/reset-password`);
      
      const result = await resetPassword(values.email);
      
      if (result?.error) {
        console.error('[PasswordReset] Error sending reset email:', {
          message: result.error.message,
          details: result.error,
          code: result.error.code,
          status: result.error.status
        });
        
        setFormError(result.error.message || 'Failed to send password reset email');
        toast.error('Failed to send password reset email', {
          description: result.error.message || 'Please try again or contact support if the issue persists.'
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
    setIsLoading(true);
    setResendCooldown(60); // Set cooldown to prevent spam
    
    try {
      console.log(`[PasswordReset] Resending reset email to: ${lastEmail}`);
      console.log(`[PasswordReset] Redirect URL: ${window.location.origin}/auth/reset-password`);
      
      const result = await resetPassword(lastEmail);
      
      if (result?.error) {
        console.error('[PasswordReset] Error resending reset email:', {
          message: result.error.message,
          details: result.error,
          code: result.error.code,
          status: result.error.status
        });
        
        toast.error('Failed to resend email', {
          description: result.error.message || 'Please try again or contact support.'
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
        <p className="text-sm text-gray-600 mb-6">
          If you don't see the email in your inbox, please check your spam folder or try these options:
        </p>
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={handleResendEmail}
            disabled={isLoading || resendCooldown > 0}
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
                    disabled={isLoading}
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
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending reset link...
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
      </form>
    </Form>
  );
};
