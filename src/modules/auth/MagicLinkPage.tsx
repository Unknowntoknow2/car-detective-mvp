import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CDButton } from '@/components/ui-kit/CDButton';
import { toast } from 'sonner';
import { ArrowRight, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' })
});

export function MagicLinkPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  });
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: values.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`
        }
      });
      
      if (error) {
        throw error;
      }
      
      setIsSuccess(true);
      toast.success('Magic link sent! Please check your email');
    } catch (error: any) {
      console.error('Magic link error:', error);
      toast.error(error.message || 'Failed to send magic link');
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
          <CardTitle className="text-2xl">Sign in with Magic Link</CardTitle>
          <CardDescription>
            Enter your email to receive a magic link for passwordless sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSuccess ? (
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
                          {...field} 
                          autoComplete="email"
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
                  Send Magic Link
                </CDButton>
              </form>
            </Form>
          ) : (
            <div className="text-center py-6 space-y-4">
              <Mail className="h-12 w-12 text-primary mx-auto" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Check Your Email</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent a magic link to 
                  <span className="font-medium"> {form.getValues().email}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Click the link in the email to sign in automatically
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

export default MagicLinkPage;
