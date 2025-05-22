
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { SigninForm } from '@/components/auth/forms/SigninForm';
import { Toaster } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

export default function LoginUserPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

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
                <CardTitle className="text-2xl">Individual Login</CardTitle>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
              </div>
              <CardDescription>
                Sign in to your personal account to manage your vehicle valuations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SigninForm 
                isLoading={isLoading} 
                setIsLoading={setIsLoading}
                role="individual"
                redirectPath="/dashboard"
                alternateLoginPath="/signin/dealer"
                alternateLoginText="Are you a dealer? Click here to login"
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 border-t pt-4">
              <div className="text-center text-sm text-muted-foreground">
                <div>Need assistance?{' '}
                  <Link to="/support" className="text-primary hover:underline">
                    Contact Support
                  </Link>
                </div>
              </div>
              
              <div className="flex items-center justify-center text-xs text-muted-foreground gap-2">
                <Shield className="h-3 w-3" />
                <span>Secure login protected by 256-bit encryption</span>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
