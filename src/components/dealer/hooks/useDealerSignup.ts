
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { dealerFormSchema, DealerSignupData } from '../schemas/dealerSignupSchema';

export function useDealerSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const [dealershipError, setDealershipError] = useState('');
  const navigate = useNavigate();

  // Use the explicit DealerSignupData type instead of z.infer
  const form = useForm<DealerSignupData>({
    resolver: zodResolver(dealerFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      dealershipName: '',
      phone: '',
    },
  });

  // Check if dealership name already exists
  const checkDealershipName = async (name: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('dealership_name', name)
        .limit(1);
      
      if (error) throw error;
      
      // Return true if dealership exists (data has at least one item)
      return data && data.length > 0;
    } catch (err) {
      console.error('Error checking dealership name:', err);
      return false; // Default to allowing submit on error
    }
  };

  const onSubmit = async (data: DealerSignupData) => {
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

      // Register the user with Supabase Auth
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

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Update the profile with dealer role and dealership name
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ 
            id: authData.user.id,
            full_name: data.fullName,
            user_role: 'dealer',
            dealership_name: data.dealershipName,
          });

        if (profileError) {
          console.error('Error updating profile:', profileError);
          throw profileError;
        }

        toast.success('Registration successful', {
          description: 'Your dealer account has been created.',
        });
        
        // Redirect to the dealer dashboard
        navigate('/dealer-dashboard');
      }
    } catch (error: any) {
      let errorMessage = 'Registration failed';
      
      // Handle specific error cases
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
