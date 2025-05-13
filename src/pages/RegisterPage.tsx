
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Loader2, User, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { toast, Toaster } from 'sonner';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Parse the user type from the URL query parameter
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [userType, setUserType] = useState<'individual' | 'dealer'>(
    searchParams.get('userType') === 'dealer' ? 'dealer' : 'individual'
  );
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!termsAccepted) {
      setError('You must accept the terms and conditions');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      console.log(`RegisterPage: Attempting signup with ${email} as ${userType}`);
      const result = await signUp(email, password);
      
      if (result?.error) {
        setError(result.error.message || 'Failed to create account');
        setIsLoading(false);
        return;
      }
      
      // Navigate to appropriate login page after successful signup
      toast.success("Account created successfully! Please sign in.");
      setTimeout(() => {
        if (userType === 'dealer') {
          navigate('/login-dealer');
        } else {
          navigate('/login-user');
        }
      }, 1000);
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Signup error:', err);
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4 bg-gray-50/50"
    >
      <Toaster richColors position="top-center" />
      
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          className="mb-4 text-muted-foreground flex items-center"
          onClick={() => navigate('/auth')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="m15 18-6-6 6-6"></path></svg>
          Back to Sign In Options
        </Button>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <Card className={`w-full shadow-sm border-2 ${userType === 'dealer' ? 'border-blue-100' : ''}`}>
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">
                  {userType === 'dealer' ? 'Dealer Registration' : 'Create Account'}
                </CardTitle>
                <div className={`h-10 w-10 rounded-full ${userType === 'dealer' ? 'bg-blue-100' : 'bg-primary/10'} flex items-center justify-center`}>
                  {userType === 'dealer' ? (
                    <Building className="h-5 w-5 text-blue-600" />
                  ) : (
                    <User className="h-5 w-5 text-primary" />
                  )}
                </div>
              </div>
              <CardDescription>
                {userType === 'dealer' 
                  ? 'Register your dealership to access leads and dealer tools' 
                  : 'Sign up for your personal account to manage your vehicle valuations'}
              </CardDescription>
              
              <div className="flex space-x-4 mt-2">
                <Button 
                  type="button"
                  variant={userType === 'individual' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setUserType('individual')}
                >
                  Individual
                </Button>
                <Button 
                  type="button"
                  variant={userType === 'dealer' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setUserType('dealer')}
                >
                  Dealer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="your@email.com"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"><circle cx="12" cy="16" r="1"></circle><rect x="3" y="10" width="18" height="12" rx="2"></rect><path d="M7 10V7a5 5 0 0 1 10 0v3"></path></svg>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"><circle cx="12" cy="16" r="1"></circle><rect x="3" y="10" width="18" height="12" rx="2"></rect><path d="M7 10V7a5 5 0 0 1 10 0v3"></path></svg>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Confirm your password"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="termsAccepted" 
                    checked={termsAccepted} 
                    onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="termsAccepted" className="text-sm text-muted-foreground">
                    I agree to the terms of service and privacy policy
                  </Label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                  onClick={handleSubmit}
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
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 border-t pt-4">
              <div className="text-center text-sm text-muted-foreground">
                <div>Already have an account?{' '}
                  <Link to={userType === 'dealer' ? '/login-dealer' : '/login-user'} className="text-primary hover:underline">
                    Sign in
                  </Link>
                </div>
              </div>
              
              <div className="text-center text-xs text-muted-foreground">
                <p>By signing up, you agree to our{' '}
                  <Link to="/terms" className="text-primary hover:underline">Terms</Link> and{' '}
                  <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </p>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
