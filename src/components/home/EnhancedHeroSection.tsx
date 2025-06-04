<<<<<<< HEAD

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
=======
// ✅ TS check passed
import { ChartBar, Shield, TrendingUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ButtonEnhanced } from "@/components/ui/button-enhanced";
import { BadgeEnhanced } from "@/components/ui/badge-enhanced";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface EnhancedHeroSectionProps {
  onFreeValuationClick?: () => void;
}

<<<<<<< HEAD
export const EnhancedHeroSection: React.FC<EnhancedHeroSectionProps> = ({ onFreeValuationClick }) => {
  const { user } = useAuth();
=======
export function EnhancedHeroSection(
  { onFreeValuationClick }: EnhancedHeroSectionProps,
) {
  const isMobile = useIsMobile();

  return (
    <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-5 md:space-y-6">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              Ready to Discover Your Car's{" "}
              <span className="text-primary">True Worth?</span>
            </h1>

            <BadgeEnhanced variant="warning" size="lg" className="inline-block">
              No more guesswork
            </BadgeEnhanced>

            <p className="text-lg md:text-xl text-gray-700 max-w-xl">
              Get the accurate valuation you need today! Our AI-powered platform
              delivers precise, market-driven price estimates instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2 md:pt-4">
              <ButtonEnhanced
                size={isMobile ? "default" : "lg"}
                variant="default"
                className="mobile-full-width"
                onClick={onFreeValuationClick}
              >
                Start Free Valuation
              </ButtonEnhanced>

              <ButtonEnhanced
                variant="outline"
                size={isMobile ? "default" : "lg"}
                className="border-primary/30 text-primary hover:bg-primary-light/20 mobile-full-width"
              >
                Premium Valuation ($29.99)
              </ButtonEnhanced>
            </div>

            <div className="pt-4 md:pt-6 flex items-center text-sm text-primary-accent">
              <Shield className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>
                Premium includes full CARFAX report ($44 value) and dealer
                offers
              </span>
            </div>
          </div>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

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
<<<<<<< HEAD
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
=======
                <h3 className="font-medium text-lg">CARFAX Integration</h3>
              </div>
              <p className="text-gray-600">
                Get a complete vehicle history report as part of your premium
                valuation.
              </p>
            </div>

            <div className="card-interactive p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-100 p-2.5 rounded-full">
                  <ChartBar className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-medium text-lg">Market Analysis</h3>
              </div>
              <p className="text-gray-600">
                View current trends and price predictions based on real-time
                market data.
              </p>
            </div>

            <div className="card-interactive p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-100 p-2.5 rounded-full">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-medium text-lg">Price Confidence Score</h3>
              </div>
              <p className="text-gray-600">
                Understand how confident we are in your valuation with our
                proprietary algorithm.
              </p>
            </div>
          </div>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
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
