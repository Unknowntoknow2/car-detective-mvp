
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

  // Use explicit DealerSignupData type to avoid type inference recursion
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

  // Use explicit parameter type to avoid inference issues
  const onSubmit = async (data: DealerSignupData) => {
    try {
      setIsLoading(true);
      setDealershipError('');

      const dealershipExists = await checkDealershipName(data.dealershipName);
      if (dealershipExists) {
        setDealershipError('This dealership name is already registered');
        setIsLoading(false);
        return;
      }

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
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ 
            id: authData.user.id,
            full_name: data.fullName,
            user_role: 'dealer',
            dealership_name: data.dealershipName,
          });

        if (profileError) throw profileError;

        toast.success('Registration successful', {
          description: 'Your dealer account has been created.',
        });

        navigate('/dealer-dashboard');
      }
    } catch (error: any) {
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
