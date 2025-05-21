
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Info } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' })
});

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ 
  onSuccess, 
  isLoading: externalIsLoading,
  setIsLoading: setExternalLoading 
}) => {
  const { resetPassword } = useAuth();
  const [internalIsLoading, setInternalLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Use external loading state if provided, otherwise use internal
  const isLoading = externalIsLoading !== undefined ? externalIsLoading : internalIsLoading;
  const setIsLoading = setExternalLoading || setInternalLoading;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setFormError(null);
    setIsLoading(true);
    
    try {
      if (resetPassword) {
        await resetPassword(values.email);
        setSuccess(true);
        if (onSuccess) onSuccess();
      } else {
        throw new Error('Reset password function is not available');
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to send password reset email';
      setFormError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">Check Your Email</h3>
          <p className="text-sm text-green-700">
            We've sent password reset instructions to your email address.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {formError && (
          <Alert variant="destructive">
            <AlertDescription>
              {formError}
            </AlertDescription>
          </Alert>
        )}
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email address"
                  autoComplete="email"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Alert className="bg-blue-50 text-blue-800 border-blue-200">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Enter the email address associated with your account and we'll send you a link to reset your password.
          </AlertDescription>
        </Alert>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Sending reset instructions...
            </>
          ) : (
            'Send Reset Instructions'
          )}
        </Button>
      </form>
    </Form>
  );
};
