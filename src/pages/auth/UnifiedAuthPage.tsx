import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SigninForm from '@/components/auth/forms/SigninForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, KeyRound, User, Building2 } from 'lucide-react';

// Define signup form schema
const signupSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
  fullName: z.string().min(2, { message: 'Please enter your name' }).optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Define dealer signup form schema
const dealerSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
  fullName: z.string().min(2, { message: 'Please enter your name' }),
  dealershipName: z.string().min(2, { message: 'Please enter your dealership name' }),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function UnifiedAuthPage() {
  const [activeTab, setActiveTab] = useState<string>('signin');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signUp } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  
  // If user is already logged in, redirect to appropriate page
  useEffect(() => {
    if (user) {
      const redirectTo = location.state?.from || '/dashboard';
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, location.state]);

  // Determine initial tab based on the path
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('signup') || path.includes('register')) {
      setActiveTab('signup');
    } else if (path.includes('dealer')) {
      setActiveTab('dealer');
    } else {
      setActiveTab('signin');
    }
  }, [location.pathname]);

  // Initialize signup form
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      acceptTerms: false,
    },
  });

  // Initialize dealer signup form
  const dealerForm = useForm<z.infer<typeof dealerSchema>>({
    resolver: zodResolver(dealerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      dealershipName: '',
      acceptTerms: false,
    },
  });

  // Handle individual signup
  const handleSignupSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    setFormError(null);
    
    try {
      const result = await signUp(values.email, values.password, {
        full_name: values.fullName,
        role: 'individual',
      });
      
      if (!result.success) {
        setFormError(result.error || 'Signup failed');
        setIsLoading(false);
        return;
      }
      
      toast.success('Account created! Please check your email to verify your account.');
      setActiveTab('signin');
    } catch (err: any) {
      console.error('Signup error:', err);
      setFormError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dealer signup
  const handleDealerSignupSubmit = async (values: z.infer<typeof dealerSchema>) => {
    setIsLoading(true);
    setFormError(null);
    
    try {
      const result = await signUp(values.email, values.password, {
        full_name: values.fullName,
        dealership_name: values.dealershipName,
        role: 'dealer',
      });
      
      if (!result.success) {
        setFormError(result.error || 'Signup failed');
        setIsLoading(false);
        return;
      }
      
      toast.success('Dealership account created! Please check your email to verify your account.');
      setActiveTab('signin');
    } catch (err: any) {
      console.error('Dealer signup error:', err);
      setFormError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-md">
      <Button 
        variant="ghost" 
        className="mb-4 text-muted-foreground flex items-center"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>
      
      <Card className="w-full shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Car Detective</CardTitle>
          <CardDescription>
            {activeTab === 'signin' ? 'Sign in to your account' : 
             activeTab === 'signup' ? 'Create your personal account' : 
             'Register your dealership'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="dealer">Dealer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <SigninForm 
                isLoading={isLoading} 
                setIsLoading={setIsLoading}
                redirectPath={location.state?.from || '/dashboard'}
                alternateLoginPath="/auth?tab=signup"
                alternateLoginText="Don't have an account? Sign up"
              />
            </TabsContent>
            
            <TabsContent value="signup">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm mb-4">
                  {formError}
                </div>
              )}
              
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(handleSignupSubmit)} className="space-y-4">
                  <FormField
                    control={signupForm.control}
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
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signupForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              placeholder="Enter your full name"
                              className="pl-10"
                              disabled={isLoading}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signupForm.control}
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
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signupForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              placeholder="Confirm your password" 
                              type="password"
                              className="pl-10"
                              disabled={isLoading}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signupForm.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I accept the <a href="/terms" className="text-primary hover:underline">terms and conditions</a>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                  
                  <div className="text-center text-sm">
                    <span>Already have an account? </span>
                    <Button 
                      variant="link" 
                      className="p-0" 
                      onClick={() => setActiveTab('signin')}
                    >
                      Sign in
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="dealer">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm mb-4">
                  {formError}
                </div>
              )}
              
              <Form {...dealerForm}>
                <form onSubmit={dealerForm.handleSubmit(handleDealerSignupSubmit)} className="space-y-4">
                  <FormField
                    control={dealerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              placeholder="Enter your business email"
                              type="email"
                              className="pl-10"
                              disabled={isLoading}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={dealerForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              placeholder="Enter your full name"
                              className="pl-10"
                              disabled={isLoading}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={dealerForm.control}
                    name="dealershipName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dealership Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                  
                  <FormField
                    control={dealerForm.control}
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
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={dealerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              placeholder="Confirm your password" 
                              type="password"
                              className="pl-10"
                              disabled={isLoading}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={dealerForm.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I accept the <a href="/terms" className="text-primary hover:underline">terms and conditions</a>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Registering Dealership...' : 'Register Dealership'}
                  </Button>
                  
                  <div className="text-center text-sm">
                    <span>Already have a dealer account? </span>
                    <Button 
                      variant="link" 
                      className="p-0" 
                      onClick={() => setActiveTab('signin')}
                    >
                      Sign in
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 border-t pt-4">
          <div className="text-center text-sm text-muted-foreground">
            <span>Need help? </span>
            <a href="/contact" className="text-primary hover:underline">
              Contact support
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
