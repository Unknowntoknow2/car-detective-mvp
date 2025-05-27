
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Mail, KeyRound, User, Building } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  dealershipName: z.string().optional(),
});

export interface SignupFormProps {
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
  role?: 'individual' | 'dealer';
  redirectPath?: string;
  showDealershipField?: boolean;
  userType?: string;
}

export const SignupForm = ({ 
  isLoading: externalIsLoading = false, 
  setIsLoading: externalSetIsLoading, 
  role = 'individual', 
  redirectPath, 
  showDealershipField = false,
  userType
}: SignupFormProps) => {
  const { signUp } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [internalIsLoading, setInternalIsLoading] = useState(false);
  const navigate = useNavigate();

  const isLoading = externalIsLoading || internalIsLoading;
  const setIsLoading = externalSetIsLoading || setInternalIsLoading;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      dealershipName: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setFormError(null);
    setIsLoading(true);
    
    try {
      const { email, password, dealershipName } = values;
      
      const options = {
        data: {
          role: userType || role,
          ...(dealershipName ? { dealership_name: dealershipName } : {})
        }
      };
      
      const result = await signUp(email, password, options);
      
      if (!result.success) {
        const errorMessage = result.error || 'Error creating account';
        setFormError(errorMessage);
        toast.error('Sign up failed', {
          description: errorMessage
        });
        return;
      }
      
      toast.success('Account created successfully!', {
        description: 'Welcome to Car Detective!'
      });
      
      let targetPath = redirectPath || '/';
      
      if (userType === 'dealer') {
        targetPath = '/dealer/dashboard';
      }
      
      navigate(targetPath);
    } catch (err: any) {
      setFormError('An unexpected error occurred');
      toast.error('Sign up failed', {
        description: 'Please try again'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const shouldShowDealershipField = showDealershipField || userType === 'dealer';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {formError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {formError}
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
                    placeholder="Enter your email"
                    type="email"
                    className="pl-10"
                    disabled={isLoading}
                    autoComplete="email"
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
                    placeholder="Create a password" 
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
        
        {shouldShowDealershipField && (
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
                      placeholder="Enter your dealership name"
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
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
