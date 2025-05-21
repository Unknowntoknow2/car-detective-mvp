
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SignupForm } from '@/components/auth/forms/SignupForm';
import { Toaster } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sign In Options
        </Button>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <Card className="w-full shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Create an Account</CardTitle>
              <CardDescription>Sign up as an individual user to access car valuations</CardDescription>
            </CardHeader>
            <CardContent>
              <SignupForm 
                isLoading={isLoading} 
                setIsLoading={setIsLoading}
                redirectPath="/dashboard"
                redirectToLogin={true}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 border-t pt-4">
              <div className="text-center text-sm text-muted-foreground">
                <div>Already have an account?{' '}
                  <Link to="/login-user" className="text-primary hover:underline">
                    Sign In
                  </Link>
                </div>
              </div>
              
              <div className="text-center text-xs text-muted-foreground">
                <p>Looking to register as a dealer instead?{' '}
                  <Link to="/dealer-signup" className="text-primary hover:underline">
                    Dealer Signup
                  </Link>
                </p>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
