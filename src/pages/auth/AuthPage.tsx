
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Building, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-gray-50">
      <Toaster richColors position="top-center" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Car Detective</h1>
          <p className="text-gray-600 mt-2">Please choose how you want to sign in</p>
        </div>
        
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer border-2" 
                onClick={() => navigate('/login-user')}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium">Individual Login</CardTitle>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">
                  Access your saved valuations and manage your personal account
                </p>
              </CardContent>
              <CardFooter className="pt-2 flex justify-between items-center">
                <Button variant="ghost" className="text-primary" onClick={() => navigate('/register')}>
                  Create Account
                </Button>
                <ArrowRight className="h-5 w-5 text-primary" />
              </CardFooter>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer border-2 border-blue-100" 
                onClick={() => navigate('/login-dealer')}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium">Dealer Login</CardTitle>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Building className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">
                  Access dealer tools, leads, and manage your dealership
                </p>
              </CardContent>
              <CardFooter className="pt-2 flex justify-between items-center">
                <Button variant="ghost" className="text-blue-600" onClick={() => navigate('/dealer-signup')}>
                  Register Dealership
                </Button>
                <ArrowRight className="h-5 w-5 text-blue-600" />
              </CardFooter>
            </Card>
          </motion.div>
        </div>
        
        <div className="mt-8 text-center">
          <Button variant="outline" className="text-muted-foreground" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
