
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
  );
}
