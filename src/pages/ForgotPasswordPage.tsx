
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string }>();

  const onSubmit = async (data: { email: string }) => {
    try {
      await resetPassword(data.email);
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      toast.error('Failed to send password reset email');
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Remember your password? <a href="/login" className="text-primary hover:underline">Log in</a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
