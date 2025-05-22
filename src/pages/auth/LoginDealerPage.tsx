
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { SigninForm } from '@/components/auth/forms/SigninForm';
import { Toaster } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function LoginDealerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4 bg-blue-50/30"
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
          <Card className="w-full shadow-sm border-2 border-blue-100">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Dealer Login</CardTitle>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Building className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <CardDescription>
                Sign in to your dealership account to access leads and dealer tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SigninForm 
                isLoading={isLoading} 
                setIsLoading={setIsLoading}
                role="dealer"
                redirectPath="/dealer/dashboard"
                alternateLoginPath="/signin/individual"
                alternateLoginText="Individual user? Click here to login"
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 border-t pt-4">
              <div className="text-center text-sm text-muted-foreground">
                <div>Need a dealer account?{' '}
                  <Link to="/signup/dealer" className="text-primary hover:underline">
                    Register your dealership
                  </Link>
                </div>
              </div>
              
              <div className="text-center text-xs text-muted-foreground">
                <p>By signing in, you agree to our{' '}
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
