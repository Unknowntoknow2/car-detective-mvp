
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
import { MainLayout } from '@/components/layout';

// Define form schema
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

interface SignInResult {
  success: boolean;
  error?: string;
}

export default function DealerAuthPage() {
  const { signIn, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state, defaulting to dealer dashboard
  const from = location.state?.from || '/dealer-dashboard';

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Form submission handler
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null);
    setIsLoading(true);
    
    try {
      console.log("Attempting to sign in with:", values.email);
      const signInResponse = await signIn(values.email, values.password);
      const result = typeof signInResponse === 'boolean' 
        ? { success: signInResponse, error: signInResponse ? undefined : 'Authentication failed' }
        : signInResponse as SignInResult;
      
      if (!result.success) {
        const errorMessage = result.error ? result.error : 'Authentication failed';
        setError(errorMessage);
        setIsLoading(false);
        return;
      }
      
      // If sign-in was successful but no immediate user state update
      toast.success("Login successful!");
      
      // Redirect to the dealer dashboard
      navigate('/dealer-dashboard', { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
      toast.error('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-md">
          <h1 className="text-3xl font-semibold text-center text-foreground mb-6">Dealer Sign In</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  {error}
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
            </form>
          </Form>
          
          <div className="text-center text-sm mt-4">
            <Link to="/signup/dealer" className="text-primary hover:underline">
              Don't have a dealer account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
