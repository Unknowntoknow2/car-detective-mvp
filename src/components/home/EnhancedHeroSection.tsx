
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

interface EnhancedHeroSectionProps {
  onFreeValuationClick?: () => void;
}

export const EnhancedHeroSection: React.FC<EnhancedHeroSectionProps> = ({ onFreeValuationClick }) => {
  const { user } = useAuth();

  const handleValuationClick = () => {
    if (onFreeValuationClick) {
      onFreeValuationClick();
    }
  };

  return (
    <div className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
          <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <motion.div 
              className="sm:text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <motion.span 
                  className="block xl:inline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Know Your Car's
                </motion.span>{' '}
                <motion.span 
                  className="block text-primary xl:inline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  True Value
                </motion.span>
              </h1>
              <motion.p 
                className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                Get accurate, market-based valuations in minutes. Make informed decisions when buying, selling, or trading in your vehicle with our advanced AI-powered valuation system.
              </motion.p>
              <motion.div 
                className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="rounded-md shadow">
                  {onFreeValuationClick ? (
                    <Button 
                      className="w-full px-8 py-3 text-base font-medium md:py-4 md:px-10 md:text-lg"
                      onClick={handleValuationClick}
                    >
                      Get Your Valuation
                    </Button>
                  ) : (
                    <Link to="/valuation">
                      <Button className="w-full px-8 py-3 text-base font-medium md:py-4 md:px-10 md:text-lg">
                        Get Your Valuation
                      </Button>
                    </Link>
                  )}
                </div>
                <div className="mt-3 sm:ml-3 sm:mt-0">
                  {user ? (
                    <Link to="/dashboard">
                      <Button variant="outline" className="w-full px-8 py-3 text-base font-medium md:py-4 md:px-10 md:text-lg">
                        Dashboard <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/auth/choose">
                      <Button variant="outline" className="w-full px-8 py-3 text-base font-medium md:py-4 md:px-10 md:text-lg">
                        Sign Up <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-full lg:w-full"
          src="https://images.unsplash.com/photo-1493238792000-8113da705763?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          alt="Car valuation"
        />
      </div>
    </div>
  );
};
