
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
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';

// Define the form schema with validation
const dealerFormSchema = z.object({
  dealershipName: z.string().min(2, "Dealership name must be at least 2 characters"),
  fullName: z.string().min(2, "Contact name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  phone: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type FormData = z.infer<typeof dealerFormSchema>;

export function DealerSignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
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
  
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      // Sign up the user with dealer role and metadata
      const metadata = {
        full_name: data.fullName,
        role: 'dealer',
        dealership_name: data.dealershipName,
        phone: data.phone || null,
      };
      
      const result = await signUp(data.email, data.password, metadata);
      
      if (!result.success) {
        throw new Error(result.error || 'Registration failed');
      }
      
      toast.success('Dealership registration successful!', {
        description: 'Please check your email to verify your account.'
      });
      
      navigate('/dealer/dashboard');
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
          name="dealershipName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dealership Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Dealership LLC" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Name</FormLabel>
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
