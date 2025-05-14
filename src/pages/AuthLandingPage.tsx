
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Building2, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome to Car Detective</h1>
          <p className="text-muted-foreground mt-2">Choose how you want to sign in</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="h-full cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => navigate('/login-user')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Individual User</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <CardDescription>
                  For personal vehicle valuations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">Sign in or create an account to manage your vehicle valuations and reports.</p>
                <Button className="w-full" onClick={(e) => {
                  e.stopPropagation();
                  navigate('/login-user');
                }}>
                  Continue as Individual
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="h-full cursor-pointer hover:border-blue-300 transition-colors"
                onClick={() => navigate('/login-dealer')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Dealer</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <CardDescription>
                  For auto dealerships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">Sign in or create a dealer account to access leads and dealership tools.</p>
                <Button className="w-full" variant="outline" onClick={(e) => {
                  e.stopPropagation();
                  navigate('/login-dealer');
                }}>
                  Continue as Dealer
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <div className="mt-8 text-center">
          <Button variant="ghost" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
