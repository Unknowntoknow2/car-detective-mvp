
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Mail, KeyRound, User, Building } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { AuthMode, UserRole } from '@/types/auth';

// Base schema for both sign-in and sign-up
const baseSchema = {
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
};

// Additional fields for sign-up
const signupExtension = {
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  dealershipName: z.string().min(2, 'Dealership name must be at least 2 characters').optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
};

// Create separate schemas for signin and signup
const signinSchema = z.object(baseSchema);
const signupSchema = z.object({
  ...baseSchema,
  ...signupExtension
});

type SigninFormValues = z.infer<typeof signinSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

interface UnifiedAuthFormProps {
  mode: AuthMode;
  role: UserRole;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const UnifiedAuthForm: React.FC<UnifiedAuthFormProps> = ({
  mode,
  role,
  isLoading,
  setIsLoading
}) => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  // Determine which schema to use based on mode
  const schema = mode === 'signin' ? signinSchema : signupSchema;
  
  // Determine dashboard path based on role
  const dashboardPath = role === 'dealer' ? '/dealer/dashboard' : '/dashboard';

  // Initialize the form
  const form = useForm<SigninFormValues | SignupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      ...(mode === 'signup' ? {
        fullName: '',
        dealershipName: '',
        termsAccepted: false
      } : {})
    }
  });

  const onSubmit = async (values: SigninFormValues | SignupFormValues) => {
    setError(null);
    setIsLoading(true);
    
    try {
      if (mode === 'signin') {
        // Handle sign in
        const { email, password } = values as SigninFormValues;
        const result = await signIn(email, password);
        
        if (!result.success) {
          throw new Error(result.error || 'Authentication failed');
        }
        
        toast.success('Signed in successfully!');
        navigate(dashboardPath);
      } else {
        // Handle sign up
        const { email, password, fullName, dealershipName, termsAccepted } = values as SignupFormValues;
        
        if (!termsAccepted) {
          throw new Error('You must accept the terms and conditions');
        }
        
        // Prepare metadata based on role
        const metadata: Record<string, any> = {
          role,
          full_name: fullName,
        };
        
        // Add dealership name for dealer role
        if (role === 'dealer' && dealershipName) {
          metadata.dealership_name = dealershipName;
        }
        
        const result = await signUp(email, password, metadata);
        
        if (!result.success) {
          throw new Error(result.error || 'Registration failed');
        }
        
        toast.success('Account created successfully!', {
          description: 'Please check your email to verify your account.'
        });
        
        navigate(dashboardPath);
      }
    } catch (err: any) {
      console.error(`${mode === 'signin' ? 'Sign in' : 'Sign up'} error:`, err);
      setError(err.message || 'An unexpected error occurred');
      toast.error(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
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
                    placeholder="your@email.com"
                    type="email"
                    className="pl-10"
                    disabled={isLoading}
                    autoComplete={mode === 'signin' ? 'email' : 'new-email'}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    placeholder={mode === 'signin' ? "Enter your password" : "Create a password"}
                    type="password"
                    className="pl-10"
                    disabled={isLoading}
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Additional fields for signup mode */}
        {mode === 'signup' && (
          <>
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        placeholder="Your full name"
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Dealership name field for dealer role */}
            {role === 'dealer' && (
              <FormField
                control={form.control}
                name="dealershipName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dealership Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          placeholder="Your dealership name"
                          className="pl-10"
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal">
                      I accept the terms and conditions
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </>
        )}
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
            </>
          ) : (
            mode === 'signin' ? 'Sign In' : 'Create Account'
          )}
        </Button>
        
        {mode === 'signin' && (
          <div className="text-center">
            <Button variant="link" className="text-xs text-muted-foreground p-0 h-auto">
              Forgot password?
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};
