import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CDButton } from '@/components/ui-kit/CDButton';
import { toast } from 'sonner';
import { ArrowRight, Mail, KeyRound } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' })
});

const resetFormSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword']
  });

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if we're in reset mode (with token)
    const token = searchParams.get('token');
    if (token) {
      setIsResetMode(true);
    }
  }, [searchParams]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  });
  
  const resetForm = useForm<z.infer<typeof resetFormSchema>>({
    resolver: zodResolver(resetFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      
      if (error) {
        throw error;
      }
      
      setIsSuccess(true);
      toast.success('Password reset link sent! Please check your email');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  }
  
  async function onResetSubmit(values: z.infer<typeof resetFormSchema>) {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Password updated successfully!');
      navigate('/auth/login');
    } catch (error: any) {
      console.error('Password update error:', error);
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleGoBack = () => {
    navigate('/auth/login');
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">
            {isResetMode ? 'Create New Password' : 'Reset Password'}
          </CardTitle>
          <CardDescription>
            {isResetMode
              ? 'Enter your new password below'
              : 'Enter your email to receive a password reset link'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isResetMode ? (
            <Form {...resetForm}>
              <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                <FormField
                  control={resetForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your new password"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={resetForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm your new password"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <CDButton
                  block={true}
                  type="submit"
                  loading={isLoading}
                  icon={<ArrowRight className="h-4 w-4" />}
                  iconPosition="right"
                >
                  Update Password
                </CDButton>
              </form>
            </Form>
          ) : !isSuccess ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your.email@example.com"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-center">
                  <CDButton 
                    variant="outline" 
                    block={true}
                    onClick={handleGoBack}
                  >
                    Back to Login
                  </CDButton>
                </div>
                
                <CDButton
                  block={true}
                  type="submit"
                  loading={isLoading}
                  icon={<ArrowRight className="h-4 w-4" />}
                  iconPosition="right"
                >
                  Send Reset Link
                </CDButton>
              </form>
            </Form>
          ) : (
            <div className="text-center py-6 space-y-4">
              <Mail className="h-12 w-12 text-primary mx-auto" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Check Your Email</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent a password reset link to
                  <span className="font-medium"> {form.getValues().email}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Click the link in the email to reset your password
                </p>
              </div>
              <div className="pt-4">
                <CDButton
                  variant="outline"
                  block={true}
                  onClick={() => setIsSuccess(false)}
                >
                  Try Again
                </CDButton>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ResetPasswordPage;
