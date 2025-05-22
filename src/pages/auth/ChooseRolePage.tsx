
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Building, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ChooseRolePage: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-gray-50">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-3xl"
      >
        <motion.div variants={itemVariants} className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Car Detective</h1>
          <p className="text-gray-600 mt-2">Choose your role to continue</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <Card 
              className="hover:shadow-md transition-shadow cursor-pointer border-2 h-full"
              onClick={() => navigate('/auth/individual')}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Individual</CardTitle>
                  <div className="p-3 rounded-full bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardDescription>
                  For car owners looking to value their vehicles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-green-100 p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span>Get accurate valuations for your vehicle</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-green-100 p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span>Access your valuation history anytime</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-green-100 p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span>Receive offers from trusted dealers</span>
                  </li>
                </ul>

                <Button className="w-full group">
                  Continue as Individual
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card 
              className="hover:shadow-md transition-shadow cursor-pointer border-2 h-full"
              onClick={() => navigate('/auth/dealer')}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Dealer</CardTitle>
                  <div className="p-3 rounded-full bg-blue-100">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <CardDescription>
                  For dealerships looking to expand their inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-blue-100 p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span>Access potential sellers in your area</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-blue-100 p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span>Manage your inventory efficiently</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-blue-100 p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span>Make offers on quality vehicles</span>
                  </li>
                </ul>

                <Button variant="outline" className="w-full border-blue-300 text-blue-700 group hover:bg-blue-50">
                  Continue as Dealer
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="text-center mt-8">
          <Button variant="ghost" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ChooseRolePage;
