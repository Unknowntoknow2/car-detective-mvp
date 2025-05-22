
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SignupForm } from '@/components/auth/forms/SignupForm';
import { Toaster } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
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
          <Card className="w-full shadow-sm border-2">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Individual Registration</CardTitle>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
              </div>
              <CardDescription>
                Create a personal account to manage your vehicle valuations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignupForm 
                isLoading={isLoading} 
                setIsLoading={setIsLoading}
                role="individual"
                redirectPath="/dashboard"
                showDealershipField={false}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 border-t pt-4">
              <div className="text-center text-sm text-muted-foreground">
                <div>Already have an account?{' '}
                  <Link to="/signin/individual" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </div>
                <div className="mt-2">
                  <Link to="/signup/dealer" className="text-primary hover:underline">
                    Need to register as a dealer?
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
}
