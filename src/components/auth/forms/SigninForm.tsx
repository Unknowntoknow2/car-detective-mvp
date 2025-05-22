
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Mail, KeyRound, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { UserRole } from '@/types/auth';
import { motion, AnimatePresence } from 'framer-motion';

// Define form schema
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  rememberMe: z.boolean().optional().default(false),
});

export interface SigninFormProps {
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
  redirectPath?: string;
  alternateLoginPath?: string;
  alternateLoginText?: string;
  role?: UserRole;
}

export const SigninForm = ({ 
  isLoading: externalLoading, 
  setIsLoading: setExternalLoading, 
  redirectPath = '/dashboard',
  alternateLoginPath,
  alternateLoginText,
  role = 'individual'
}: SigninFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user, userDetails, isLoading: authLoading } = useAuth();

  // Use either provided loading state or local
  const loading = externalLoading !== undefined ? externalLoading : localLoading;
  const setLoading = setExternalLoading || setLocalLoading;
  
  // Get the redirect path from location state, defaulting to dashboard
  const from = location.state?.from || redirectPath;

  // Clear any redirect timer when component unmounts
  useEffect(() => {
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [redirectTimer]);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      // Add a small delay to ensure navigation happens after render
      const timer = setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [user, navigate, from]);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setFormError(null);
    setLoading(true);
    
    try {
      console.log("Attempting to sign in with:", values.email);
      const result = await signIn(values.email, values.password);
      
      if (result?.error) {
        setFormError(result.error || 'Invalid email or password');
        setLoading(false);
        return;
      }
      
      // If sign-in was successful but no immediate user state update
      toast.success("Login successful!");
      
      // Set a fallback timeout to redirect if authStateChange doesn't trigger
      const timer = setTimeout(() => {
        console.log("Fallback redirect timer triggered");
        navigate(from, { replace: true });
        setLoading(false);
      }, 2000); // 2 seconds should be enough for auth state to update
      
      setRedirectTimer(timer);
      
    } catch (err: any) {
      console.error('Login error:', err);
      setFormError('An unexpected error occurred');
      toast.error('Login failed. Please try again.');
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <AnimatePresence>
          {formError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm"
            >
              {formError}
            </motion.div>
          )}
        </AnimatePresence>
        
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
                    disabled={loading}
                    autoComplete="email"
                    name="email"
                    autoFocus
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
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link
                  to="/auth/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    placeholder="Enter your password" 
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    disabled={loading}
                    autoComplete="current-password"
                    name="password"
                  />
                  <Button 
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
              <FormControl>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="rememberMe" className="text-sm text-gray-700">
                    Remember me for 30 days
                  </label>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
    </Form>
  );
};
