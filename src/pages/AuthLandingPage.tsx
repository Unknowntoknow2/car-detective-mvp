import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, User, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

// Define the type for the location state
interface LocationState {
  from?: string;
}

const AuthLandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // If user is already logged in, redirect to appropriate dashboard
  React.useEffect(() => {
    if (user) {
      // Extract and type the state properly
      const state = location.state as LocationState;
      const from = state?.from || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome to Car Detective</h1>
        <p className="text-muted-foreground mb-10 text-center">
          Choose how you want to access our vehicle valuation platform
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Individual User Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="h-full border-2 hover:border-primary/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Individual User</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <CardDescription>
                  For personal vehicle owners looking to get valuations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="h-5 w-5 mr-2 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm">Get instant vehicle valuations</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 mr-2 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm">Save valuation history</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 mr-2 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm">Access premium valuation reports</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/login-user')}
                >
                  Sign In as Individual
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/register')}
                >
                  Register as Individual
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
          
          {/* Dealer Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="h-full border-2 hover:border-blue-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Dealer</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <CardDescription>
                  For car dealerships looking to manage inventory and leads
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="h-5 w-5 mr-2 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="h-3 w-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm">Manage your inventory</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 mr-2 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="h-3 w-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm">Receive valuation leads</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 mr-2 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="h-3 w-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm">Access dealer analytics</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                  onClick={() => navigate('/login-dealer')}
                >
                  Sign In as Dealer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                  onClick={() => navigate('/dealer-signup')}
                >
                  Register as Dealer
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            By continuing, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLandingPage;
