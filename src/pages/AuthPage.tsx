
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SigninForm } from '@/components/auth/forms/SigninForm';
import { SignupForm } from '@/components/auth/forms/SignupForm';
import { Building, User, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

const AuthPage: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("sign-in");
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[80vh]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-md w-full">
        <motion.div variants={itemVariants}>
          <Button 
            variant="ghost" 
            size="sm"
            className="mb-6 text-muted-foreground"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </motion.div>
        
        <motion.h1 
          className="text-3xl font-bold mb-2 text-center"
          variants={itemVariants}
        >
          Welcome to Car Detective
        </motion.h1>
        
        <motion.p 
          className="text-muted-foreground text-center mb-8"
          variants={itemVariants}
        >
          Your trusted platform for accurate vehicle valuations
        </motion.p>
        
        <motion.div variants={itemVariants}>
          <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="sign-in">Sign In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sign-in">
              <Card className="border-2 shadow-sm">
                <CardHeader>
                  <CardTitle>Sign In</CardTitle>
                  <CardDescription>
                    Access your account to view your valuations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SigninForm isLoading={isLoading} setIsLoading={setIsLoading} />
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 border-t pt-4">
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Don't have an account?{' '}
                      <Button variant="link" className="p-0" onClick={() => setActiveTab("register")}>
                        Register now
                      </Button>
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 w-full">
                    <Button 
                      variant="outline" 
                      className="flex items-center justify-between"
                      onClick={() => navigate('/signin/individual')}
                    >
                      <span>Sign in as Individual</span>
                      <User className="h-4 w-4 ml-2" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex items-center justify-between"
                      onClick={() => navigate('/signin/dealer')}
                    >
                      <span>Sign in as Dealer</span>
                      <Building className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card className="border-2 shadow-sm">
                <CardHeader>
                  <CardTitle>Create an Account</CardTitle>
                  <CardDescription>
                    Register to get started with Car Detective
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SignupForm isLoading={isLoading} setIsLoading={setIsLoading} />
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 border-t pt-4">
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Already have an account?{' '}
                      <Button variant="link" className="p-0" onClick={() => setActiveTab("sign-in")}>
                        Sign in
                      </Button>
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">
                        Or register as
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 w-full">
                    <Button 
                      variant="outline" 
                      className="flex items-center justify-between"
                      onClick={() => navigate('/signup/individual')}
                    >
                      <span>Register as Individual</span>
                      <User className="h-4 w-4 ml-2" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex items-center justify-between"
                      onClick={() => navigate('/signup/dealer')}
                    >
                      <span>Register as Dealer</span>
                      <Building className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AuthPage;
