<<<<<<< HEAD

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Building, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Toaster } from 'sonner';

export default function AuthLandingPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-slate-100"
    >
      <Toaster richColors position="top-center" />
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="w-full shadow-lg border-2">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">Welcome to Car Detective</CardTitle>
            <CardDescription className="text-base">
              Choose how you'd like to sign in
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link to="/signin/individual">
                <Card className="border-2 hover:border-primary transition-colors cursor-pointer">
                  <CardContent className="p-6 flex items-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Individual Sign In</h3>
                      <p className="text-muted-foreground text-sm">For personal vehicle valuations</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link to="/signin/dealer">
                <Card className="border-2 hover:border-blue-400 transition-colors cursor-pointer">
                  <CardContent className="p-6 flex items-center">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <Building className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Dealer Sign In</h3>
                      <p className="text-muted-foreground text-sm">For dealership access and tools</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
            
            <Separator className="my-4" />
            
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Don't have an account yet?
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" asChild>
                  <Link to="/signup/individual" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Register Individual</span>
                  </Link>
                </Button>
                
                <Button variant="outline" asChild>
                  <Link to="/signup/dealer" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span>Register Dealer</span>
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 border-t pt-4">
            <div className="text-center text-xs text-muted-foreground">
              <p>By signing in, you agree to our{' '}
                <Link to="/terms" className="text-primary hover:underline">Terms</Link> and{' '}
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
=======
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

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
      const from = state?.from || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Welcome to Car Detective
        </h1>
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
                      <svg
                        className="h-3 w-3 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-sm">
                      Get instant vehicle valuations
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 mr-2 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="h-3 w-3 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-sm">Save valuation history</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 mr-2 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="h-3 w-3 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-sm">
                      Access premium valuation reports
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <Button
                  className="w-full"
                  onClick={() => navigate("/login-user")}
                >
                  Sign In as Individual
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/register")}
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
                      <svg
                        className="h-3 w-3 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-sm">Manage your inventory</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 mr-2 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="h-3 w-3 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-sm">Receive valuation leads</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 mr-2 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="h-3 w-3 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-sm">Access dealer analytics</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => navigate("/login-dealer")}
                >
                  Sign In as Dealer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                  onClick={() => navigate("/dealer-signup")}
                >
                  Register as Dealer
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  );
}
