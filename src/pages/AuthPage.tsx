
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Car, Building, User } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [userType, setUserType] = useState<'individual' | 'dealer' | null>(null);
  const [authType, setAuthType] = useState<'signin' | 'signup'>('signin');
  
  // Redirect already logged in users
  useEffect(() => {
    if (user) {
      console.log("AuthPage: User is authenticated, redirecting to dashboard");
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Show loading spinner while checking authentication status
  if (authLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  const handleUserTypeSelect = (type: 'individual' | 'dealer') => {
    setUserType(type);
    
    // Navigate to the appropriate page based on user type and auth type
    if (authType === 'signin') {
      navigate(type === 'individual' ? '/login-user' : '/login-dealer');
    } else {
      // For signup, we'll redirect to a general registration page first
      // with a query parameter indicating the user type
      navigate(`/register?userType=${type}`);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-8"
        >
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold mb-4">Vehicle Valuation Made Simple</h1>
              <p className="text-gray-600 mb-6">
                Get accurate vehicle valuations and connect with trusted dealers.
                {authType === 'signin' ? 'Sign in to access your account.' : 'Create an account to save your valuations and receive offers.'}
              </p>
              <div className="bg-primary/10 rounded-lg p-4 mb-4 border border-primary/20">
                <h3 className="font-semibold mb-2">Why create an account?</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    Save your valuation history
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    Receive dealer offers on your vehicles
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    Track market value changes over time
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="border-2 shadow-md">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
                <CardDescription>
                  {authType === 'signin' ? 'Choose how you want to sign in' : 'Choose your account type'}
                </CardDescription>
                <div className="flex justify-center space-x-4 pt-2">
                  <Button 
                    variant={authType === 'signin' ? 'default' : 'outline'} 
                    className="w-1/2"
                    onClick={() => setAuthType('signin')}
                  >
                    Sign In
                  </Button>
                  <Button 
                    variant={authType === 'signup' ? 'default' : 'outline'} 
                    className="w-1/2"
                    onClick={() => setAuthType('signup')}
                  >
                    Sign Up
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button 
                      variant="outline" 
                      className="w-full p-6 flex flex-col items-center space-y-3 h-auto border-gray-200 hover:border-primary/60 hover:bg-primary/5 transition-all duration-300" 
                      onClick={() => handleUserTypeSelect('individual')}
                    >
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-center">
                        <h3 className="font-medium">Individual</h3>
                        <p className="text-sm text-muted-foreground">Personal account</p>
                      </div>
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button 
                      variant="outline" 
                      className="w-full p-6 flex flex-col items-center space-y-3 h-auto border-blue-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300" 
                      onClick={() => handleUserTypeSelect('dealer')}
                    >
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Building className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-center">
                        <h3 className="font-medium">Car Dealership</h3>
                        <p className="text-sm text-muted-foreground">Business account</p>
                      </div>
                    </Button>
                  </motion.div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">Or</span>
                  </div>
                </div>
                
                <div className="text-center text-sm text-muted-foreground">
                  <p>By signing {authType === 'signin' ? 'in' : 'up'}, you agree to our <Link to="/terms" className="text-primary hover:underline">Terms</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link></p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 border-t pt-4">
                <div className="text-sm text-center text-muted-foreground">
                  Just looking around?
                </div>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/free">Try Free Valuation</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
