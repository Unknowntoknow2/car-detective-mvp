
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { dealerFormSchema } from './schemas/dealerSignupSchema';
import { supabase } from '@/integrations/supabase/client';

type FormData = {
  fullName: string;
  email: string;
  password: string;
  dealershipName: string;
  phone?: string;
  termsAccepted: boolean;
};

export function DealerSignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [dealershipError, setDealershipError] = useState('');
  const navigate = useNavigate();
  
  const form = useForm<FormData>({
    resolver: zodResolver(dealerFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      dealershipName: '',
      phone: '',
      termsAccepted: false,
    },
  });
  
  const checkDealershipName = async (name: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('dealership_name', name)
        .limit(1);
      
      if (error) throw error;
      
      return data && data.length > 0;
    } catch (err) {
      console.error('Error checking dealership name:', err);
      return false;
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!data.termsAccepted) {
      toast.error('You must accept the terms and conditions');
      return;
    }
    
    try {
      setIsLoading(true);
      setDealershipError('');
      
      // Check if dealership name already exists
      const dealershipExists = await checkDealershipName(data.dealershipName);
      if (dealershipExists) {
        setDealershipError('This dealership name is already registered');
        setIsLoading(false);
        return;
      }
      
      // Sign up the user
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: 'dealer',
            dealership_name: data.dealershipName,
            phone: data.phone || null,
          },
        },
      });

      if (signUpError) throw signUpError;
      
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/login-dealer');
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed';
      
      if (error.message?.includes('already registered')) {
        errorMessage = 'This email is already registered';
      }

      toast.error(errorMessage, {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="dealer@example.com" {...field} disabled={isLoading} />
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
                <Input type="password" placeholder="Create a secure password" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dealershipName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dealership Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Dealership LLC" {...field} disabled={isLoading} />
              </FormControl>
              {dealershipError && <p className="text-sm text-red-500 mt-1">{dealershipError}</p>}
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="(555) 123-4567" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            'Register Dealership'
          )}
        </Button>
      </form>
    </Form>
  );
}
