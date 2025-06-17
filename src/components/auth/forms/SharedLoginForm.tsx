
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface SharedLoginFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  expectedRole: 'individual' | 'dealer';
  redirectPath: string;
  alternateLoginPath: string;
  alternateLoginText: string;
}

export const SharedLoginForm: React.FC<SharedLoginFormProps> = ({
  isLoading,
  setIsLoading,
  expectedRole,
  redirectPath,
  alternateLoginPath,
  alternateLoginText,
}) => {
  const navigate = useNavigate();
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      console.log('Login attempt:', { ...data, role: expectedRole });
      // Handle login logic here
      toast.success('Login successful!');
      navigate(redirectPath);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email" {...field} />
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
                  <Input type="password" placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </Form>
      
      <div className="text-center text-sm text-muted-foreground">
        <button
          onClick={() => navigate(alternateLoginPath)}
          className="text-primary hover:underline"
        >
          {alternateLoginText}
        </button>
      </div>
    </div>
  );
};
