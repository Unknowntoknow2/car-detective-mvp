import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, KeyRound, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Define form schema
const formSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface ResetPasswordFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const ResetPasswordForm = ({ isLoading, setIsLoading }: ResetPasswordFormProps) => {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setFormError(null);
    setIsLoading(true);
    
    try {
      const result = await updatePassword(values.password);
      
      if (result.error) {
        setFormError(result.error || 'Failed to update password');
        return;
      }
      
      // Show success message
      setSuccess(true);
      
      // After brief delay, redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      setFormError('An unexpected error occurred');
      console.error('Password update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">Password Updated</h3>
        <p className="text-sm text-green-700 mb-4">
          Your password has been successfully updated. Redirecting to dashboard...
        </p>
        <div className="h-1 w-full bg-green-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 animate-pulse" style={{ width: '100%' }}></div>
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
          <h2 className="text-lg font-medium">Create New Password</h2>
          <p className="text-sm text-muted-foreground">
            Your new password must be at least 6 characters long.
          </p>
        </div>
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    placeholder="Create a new password" 
                    type="password"
                    className="pl-10"
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    placeholder="Confirm your new password" 
                    type="password"
                    className="pl-10"
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating password...
            </>
          ) : (
            'Reset Password'
          )}
        </Button>
      </form>
    </Form>
  );
};
