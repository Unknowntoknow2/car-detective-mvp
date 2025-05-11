
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { dealerFormSchema } from '../schemas/dealerSignupSchema';

// Define the form data type explicitly with no schema references
export type DealerSignupFormData = {
  fullName: string;
  email: string;
  password: string;
  dealershipName: string;
  phone?: string;
};

export function useDealerSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const [dealershipError, setDealershipError] = useState('');
  const navigate = useNavigate();

  // Define defaultValues separately to reduce type inference complexity
  const defaultValues: DealerSignupFormData = {
    fullName: '',
    email: '',
    password: '',
    dealershipName: '',
    phone: '',
  };

  // Use the explicit type instead of inferring from schema
  const form = useForm<DealerSignupFormData>({
    resolver: zodResolver(dealerFormSchema),
    defaultValues,
  });

  const checkDealershipName = async (name: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('dealership_name', name)
        .limit(1);
      
      if (error) {
        console.error('Error checking dealership name:', error);
        throw error;
      }
      
      return data && data.length > 0;
    } catch (err) {
      console.error('Error checking dealership name:', err);
      return false;
    }
  };

  const onSubmit = async (data: DealerSignupFormData) => {
    if (isLoading) return; // Prevent multiple submissions
    
    try {
      setIsLoading(true);
      setDealershipError('');
      console.log('Starting dealer signup process for:', data.email);

      // Check if dealership name already exists
      const dealershipExists = await checkDealershipName(data.dealershipName);
      if (dealershipExists) {
        setDealershipError('This dealership name is already registered');
        setIsLoading(false);
        return;
      }

      console.log('Dealership name check passed, proceeding with signup');
      
      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            user_role: 'dealer',
            dealership_name: data.dealershipName,
            phone: data.phone || null,
          },
        },
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        throw signUpError;
      }

      if (authData?.user) {
        console.log('User created successfully, updating profile');
        
        // Create or update the profile with dealer role and dealership name
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ 
            id: authData.user.id,
            full_name: data.fullName,
            user_role: 'dealer',
            dealership_name: data.dealershipName,
          });

        if (profileError) {
          console.error('Profile update error:', profileError);
          throw profileError;
        }

        toast.success('Registration successful', {
          description: 'Your dealer account has been created.',
        });

        // Check for email confirmation requirements
        if (authData.session) {
          // If we have a session, user was auto-confirmed
          console.log('User has active session, redirecting to dealer dashboard');
          navigate('/dealer-dashboard');
        } else {
          // If no session, they may need to confirm email
          console.log('Email confirmation may be required');
          toast.info('Please check your email to confirm your account before logging in');
          setTimeout(() => navigate('/login-dealer'), 2000);
        }
      } else {
        // Handle the case where user is undefined
        console.error('User object is undefined after signup');
        toast.error('Registration failed', {
          description: 'User creation was not completed. Please try again.',
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed';
      if (error.message?.includes('already registered')) {
        errorMessage = 'This email is already registered';
      }

      toast.error(errorMessage, {
        description: error.message || 'Please try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    dealershipError,
    setDealershipError,
    onSubmit,
  };
}
