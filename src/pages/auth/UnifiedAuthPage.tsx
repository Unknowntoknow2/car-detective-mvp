
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Building, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { SigninForm } from '@/components/auth/forms/SigninForm';
import { SignupForm } from '@/components/auth/forms/SignupForm';

type AuthMode = 'choose' | 'individual-signin' | 'individual-signup' | 'dealer-signin' | 'dealer-signup';

export default function UnifiedAuthPage() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<AuthMode>('choose');
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');

  const renderChooseRoleScreen = () => (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer border-2" 
            onClick={() => setAuthMode(tab === 'signin' ? 'individual-signin' : 'individual-signup')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-medium">Individual {tab === 'signin' ? 'Login' : 'Registration'}</CardTitle>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-muted-foreground">
              {tab === 'signin' 
                ? 'Access your saved valuations and manage your personal account' 
                : 'Create a new account to save your valuations and access more features'}
            </p>
          </CardContent>
          <CardFooter className="pt-2 flex justify-end items-center">
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
            onClick={() => setAuthMode(tab === 'signin' ? 'dealer-signin' : 'dealer-signup')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-medium">Dealer {tab === 'signin' ? 'Login' : 'Registration'}</CardTitle>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Building className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-muted-foreground">
              {tab === 'signin'
                ? 'Access dealer tools, leads, and manage your dealership'
                : 'Register your dealership to access dealer-specific features'}
            </p>
          </CardContent>
          <CardFooter className="pt-2 flex justify-end items-center">
            <ArrowRight className="h-5 w-5 text-blue-600" />
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );

  const renderAuthForm = () => {
    if (authMode === 'individual-signin') {
      return (
        <div className="space-y-6">
          <Button variant="ghost" className="mb-4" onClick={() => setAuthMode('choose')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to options
          </Button>
          <SigninForm userType="individual" />
        </div>
      );
    } else if (authMode === 'individual-signup') {
      return (
        <div className="space-y-6">
          <Button variant="ghost" className="mb-4" onClick={() => setAuthMode('choose')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to options
          </Button>
          <SignupForm userType="individual" />
        </div>
      );
    } else if (authMode === 'dealer-signin') {
      return (
        <div className="space-y-6">
          <Button variant="ghost" className="mb-4" onClick={() => setAuthMode('choose')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to options
          </Button>
          <SigninForm userType="dealer" />
        </div>
      );
    } else if (authMode === 'dealer-signup') {
      return (
        <div className="space-y-6">
          <Button variant="ghost" className="mb-4" onClick={() => setAuthMode('choose')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to options
          </Button>
          <SignupForm userType="dealer" />
        </div>
      );
    }
    
    return null;
  };

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
          <p className="text-gray-600 mt-2">
            {authMode === 'choose' 
              ? 'Please choose how you want to proceed' 
              : authMode.includes('signin') 
                ? 'Sign in to your account' 
                : 'Create a new account'}
          </p>
        </div>
        
        {authMode === 'choose' && (
          <Tabs value={tab} onValueChange={(value) => setTab(value as 'signin' | 'signup')} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        
        {authMode === 'choose' ? renderChooseRoleScreen() : renderAuthForm()}
        
        <div className="mt-8 text-center">
          <Button variant="outline" className="text-muted-foreground" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
