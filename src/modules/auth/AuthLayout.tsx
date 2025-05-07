import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// Fix the import for useTheme
import { useTheme } from '@/hooks/useTheme';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { CDCard } from '@/components/ui-kit/CDCard';
import { fadeIn } from './animations';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  quote?: string;
  showLogo?: boolean;
  showThemeToggle?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  quote,
  showLogo = true,
  showThemeToggle = true,
}) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Brand section */}
      <motion.div 
        className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground md:w-1/2 p-8 flex flex-col justify-between"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          {showLogo && (
            <Link to="/" className="inline-block">
              <h1 className="text-2xl font-bold text-white">Car Detective</h1>
            </Link>
          )}
        </div>
        
        <div className="py-12 md:py-0">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Accurate valuations. <br />
            Trusted insights.
          </h2>
          <p className="text-xl opacity-90 mb-8">
            {quote || "Get the most accurate vehicle valuation with our AI-powered platform."}
          </p>
          
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <p className="italic text-white/90">
                "Car Detective provided me with the most accurate valuation for my vehicle. 
                The process was simple and the insights were invaluable when negotiating with dealers."
              </p>
              <div className="mt-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/20"></div>
                <div className="ml-3">
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm opacity-75">Toyota Camry Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hidden md:block">
          <p className="text-sm opacity-75">
            © {new Date().getFullYear()} Car Detective. All rights reserved.
          </p>
        </div>
      </motion.div>
      
      {/* Right side - Auth form */}
      <motion.div 
        className={`flex-1 p-8 flex items-center justify-center ${
          isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'
        }`}
        variants={fadeIn}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-md">
          {showThemeToggle && (
            <div className="flex justify-end mb-6">
              <ThemeToggle />
            </div>
          )}
          
          <CDCard 
            className={`w-full ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}`}
            padding="lg"
          >
            <div className="text-center mb-6">
              <h1 className={`text-2xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                {title}
              </h1>
              {subtitle && (
                <p className={`mt-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                  {subtitle}
                </p>
              )}
            </div>
            
            {children}
          </CDCard>
          
          <div className="mt-8 text-center">
            <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
              © {new Date().getFullYear()} Car Detective. All rights reserved.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
