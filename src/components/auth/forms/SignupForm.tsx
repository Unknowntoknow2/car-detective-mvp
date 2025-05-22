
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Eye, EyeOff, Check, Mail, User } from 'lucide-react';
import { UserRole } from '@/types/auth';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

// Password strength regex patterns
const containsUppercase = /[A-Z]/;
const containsLowercase = /[a-z]/;
const containsNumber = /[0-9]/;
const containsSpecial = /[^A-Za-z0-9]/;

// Define the form schema with advanced validation
const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine(val => containsUppercase.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine(val => containsLowercase.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine(val => containsNumber.test(val), {
      message: "Password must contain at least one number",
    }),
  confirmPassword: z.string(),
  dealershipName: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export interface SignupFormProps {
  role?: UserRole;
  redirectPath?: string;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
  redirectToLogin?: boolean;
  showDealershipField?: boolean;
}

export function SignupForm({
  role = 'individual',
  redirectPath = '/dashboard',
  isLoading: externalLoading,
  setIsLoading: setExternalLoading,
  redirectToLogin = false,
  showDealershipField = false,
}: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  // Use local or external loading state based on props
  const loading = externalLoading !== undefined ? externalLoading : isLoading;
  const setLoading = setExternalLoading || setIsLoading;
  
  // Create form with or without dealership field based on role
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      dealershipName: '',
      termsAccepted: false,
    },
    mode: "onChange",
  });

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (containsUppercase.test(password)) strength += 1;
    if (containsLowercase.test(password)) strength += 1;
    if (containsNumber.test(password)) strength += 1;
    if (containsSpecial.test(password)) strength += 1;
    
    return Math.min(strength, 5);
  };

  // Update password strength when password changes
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'password') {
        setPasswordStrength(calculatePasswordStrength(value.password as string));
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  async function onSubmit(data: SignupFormValues) {
    setLoading(true);
    
    try {
      // Prepare user metadata
      const userData = {
        full_name: data.fullName,
        role: role,
      };
      
      // Add dealership name to metadata if provided
      if (role === 'dealer' && data.dealershipName) {
        Object.assign(userData, { dealership_name: data.dealershipName });
      }
      
      const result = await signUp(data.email, data.password, userData);
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      toast.success('Account created successfully!', {
        description: 'Please check your email to verify your account.'
      });
      
      // Determine redirect path based on role
      let targetPath = redirectPath;
      if (role === 'dealer') {
        targetPath = '/dealer/dashboard';
      }
      
      if (redirectToLogin) {
        navigate('/signin/' + role);
      } else {
        navigate(targetPath);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error('Failed to create account', {
        description: error.message || 'An unexpected error occurred',
      });
    } finally {
      setLoading(false);
    }
  }

  // Determine if dealership field should be shown
  const shouldShowDealershipField = showDealershipField || role === 'dealer';

  // Password strength indicator component
  const PasswordStrengthIndicator = ({ strength }: { strength: number }) => {
    const getStrengthText = () => {
      if (strength === 0) return "Very weak";
      if (strength === 1) return "Weak";
      if (strength === 2) return "Fair";
      if (strength === 3) return "Good";
      if (strength === 4) return "Strong";
      return "Very strong";
    };
    
    const getStrengthColor = () => {
      if (strength <= 1) return "bg-red-500";
      if (strength === 2) return "bg-orange-500";
      if (strength === 3) return "bg-yellow-500";
      if (strength >= 4) return "bg-green-500";
      return "bg-gray-200";
    };
    
    return (
      <div className="mt-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-600">{getStrengthText()}</span>
        </div>
        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getStrengthColor()} transition-all duration-300`} 
            style={{ width: `${(strength / 5) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <Form {...form}>
      <div className="mb-4">
        <Badge className={`${role === 'dealer' ? 'bg-blue-600' : 'bg-primary'} text-white px-3 py-1 text-sm`}>
          {role === 'dealer' ? 'Dealer Registration' : 'Individual Registration'}
        </Badge>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="John Doe" {...field} className="pl-10" disabled={loading} />
                </div>
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
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="email" placeholder="you@example.com" {...field} className="pl-10" disabled={loading} />
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
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="********" 
                    {...field} 
                    className="pr-10"
                    disabled={loading} 
                  />
                  <Button 
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </FormControl>
              <PasswordStrengthIndicator strength={passwordStrength} />
              <FormDescription className="text-xs">
                Password must be at least 8 characters and include uppercase, lowercase, and numbers.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="********" 
                    {...field} 
                    className="pr-10"
                    disabled={loading} 
                  />
                  <Button 
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">
                      {showConfirmPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
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
                <FormLabel>Dealership Name {role === 'dealer' ? '' : '(Optional)'}</FormLabel>
                <FormControl>
                  <Input placeholder="Your Dealership Name" {...field} disabled={loading} />
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
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
              <FormControl>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    id="terms"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I accept the <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}
