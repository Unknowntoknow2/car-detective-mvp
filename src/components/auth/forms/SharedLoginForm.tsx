
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Mail, KeyRound } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Define form schema
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export type UserRole = 'user' | 'dealer' | 'admin';

interface SharedLoginFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  expectedRole: UserRole;
  redirectPath: string;
  alternateLoginPath: string;
  alternateLoginText: string;
}

export const SharedLoginForm = ({ 
  isLoading, 
  setIsLoading, 
  expectedRole,
  redirectPath,
  alternateLoginPath,
  alternateLoginText
}: SharedLoginFormProps) => {
  const { signIn, user } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout | null>(null);
  const [safetyTimer, setSafetyTimer] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or use the provided default
  const from = location.state?.from || redirectPath;

  // Clear any timers when component unmounts
  useEffect(() => {
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
      if (safetyTimer) clearTimeout(safetyTimer);
    };
  }, [redirectTimer, safetyTimer]);

  // Redirect if user is already authenticated
  useEffect(() => {
    console.log(`Auth state changed. User:`, user);
    if (user) {
      // Add a small delay to ensure navigation happens after render
      const timer = setTimeout(() => {
        checkUserRoleAndRedirect(user.id);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [user, navigate, from]);

  // Check user role and redirect accordingly
  const checkUserRoleAndRedirect = async (userId: string) => {
    try {
      console.log(`Checking role for user: ${userId}`);
      setIsLoading(true);
      
      // Set a safety timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.warn('Profile check timeout exceeded - proceeding with default redirection');
        setIsLoading(false);
        toast.error('Could not verify your account type', {
          description: 'Redirecting to default dashboard'
        });
        navigate(redirectPath, { replace: true });
      }, 8000); // 8 second safety timeout
      
      setSafetyTimer(timeoutId);
      
      // Query the profiles table to check if the user has the expected role
      const { data, error } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle instead of single to prevent errors if no data

      // Clear the safety timeout since we got a response
      if (safetyTimer) {
        clearTimeout(safetyTimer);
        setSafetyTimer(null);
      }

      if (error) {
        console.error('Error checking user role:', error);
        toast.error('Could not verify your account role', { 
          description: 'Redirecting to default dashboard' 
        });
        navigate(redirectPath, { replace: true });
        setIsLoading(false);
        return;
      }

      console.log('User role data:', data);
      
      // If no profile data found, create a basic one with default role
      if (!data) {
        console.warn('No profile found for user, creating with default role');
        try {
          await supabase.from('profiles').insert({
            id: userId,
            user_role: 'user',
            created_at: new Date().toISOString()
          });
          
          // Default to user dashboard for new profiles
          navigate('/dashboard', { replace: true });
          setIsLoading(false);
          return;
        } catch (insertError) {
          console.error('Error creating default profile:', insertError);
          // Continue with default routing
        }
      }
      
      const userRole = data?.user_role as UserRole;
      
      if (userRole === expectedRole) {
        console.log(`Verified role ${userRole}, redirecting to ${from}`);
        navigate(from, { replace: true });
      } else {
        console.warn(`User has incorrect role: ${userRole}, expected: ${expectedRole}`);
        toast.error(`This account is not registered as a ${expectedRole}. Please use the appropriate login page.`);
        
        // Sign out since the user logged into the wrong portal
        await supabase.auth.signOut();
        
        // Redirect to the appropriate login page
        if (userRole === 'dealer') {
          navigate('/login-dealer');
        } else {
          navigate('/login-user');
        }
      }
    } catch (err) {
      console.error('Error in role verification:', err);
      toast.error('An error occurred during role verification');
      navigate(redirectPath, { replace: true }); // Fallback navigation
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setFormError(null);
    setIsLoading(true);
    
    try {
      console.log(`Attempting to sign in with: ${values.email}`);
      const result = await signIn(values.email, values.password);
      
      if (result?.error) {
        setFormError(result.error.message || 'Invalid email or password');
        setIsLoading(false);
        return;
      }
      
      // If sign-in was successful but no immediate user state update
      toast.success("Login successful! Verifying account type...");
      
      // Set a fallback timeout to redirect if auth state doesn't change
      const fallbackTimer = setTimeout(() => {
        console.log("Fallback redirect timer triggered");
        setIsLoading(false);
        navigate(redirectPath, { replace: true });
      }, 5000); // 5 second fallback
      
      setRedirectTimer(fallbackTimer);
      
    } catch (err: any) {
      console.error('Login error:', err);
      setFormError('An unexpected error occurred');
      toast.error('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

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
                    name="email"
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
                    type="password"
                    className="pl-10"
                    disabled={isLoading}
                    autoComplete="current-password"
                    name="password"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
        
        <div className="text-center text-sm mt-4">
          <Link 
            to={alternateLoginPath} 
            className="text-primary hover:underline"
          >
            {alternateLoginText}
          </Link>
        </div>
      </form>
    </Form>
  );
};
