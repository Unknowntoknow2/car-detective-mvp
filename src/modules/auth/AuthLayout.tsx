
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ui/theme-provider';
import { CDCard } from '@/components/ui-kit/CDCard';
import { CDButton } from '@/components/ui-kit/CDButton';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  quote?: string;
  quoteAuthor?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  quote = "Smart sellers always start with facts, not guesses.",
  quoteAuthor = "Car Detective",
}) => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background">
      {/* Left side - Brand and Quote */}
      <motion.div 
        className="hidden md:flex flex-col justify-center items-center p-8 bg-gradient-to-br from-primary/80 to-primary text-primary-foreground"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-md text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold mb-2">Car Detective</h1>
            <p className="text-xl opacity-90">Your trusted vehicle valuation partner</p>
          </motion.div>
          
          <motion.div
            className="bg-white/10 p-6 rounded-lg backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <blockquote className="text-xl italic font-medium leading-relaxed">
              "{quote}"
            </blockquote>
            <p className="mt-4 font-medium text-right">— {quoteAuthor}</p>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Right side - Auth Form */}
      <motion.div 
        className="flex flex-col justify-center items-center p-4 sm:p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Theme toggle and back button */}
        <div className="absolute top-4 right-4 flex items-center gap-3">
          <CDButton
            variant="ghost"
            size="sm"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            icon={theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          >
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </CDButton>
        </div>
        
        <motion.div 
          className="w-full max-w-md"
          variants={itemVariants}
        >
          <CDCard className="w-full border shadow-lg">
            <div className="p-6 space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
              </div>
              
              {children}
            </div>
          </CDCard>
          
          {/* Mobile-only quote */}
          <motion.div 
            className="md:hidden mt-8 text-center"
            variants={itemVariants}
          >
            <blockquote className="text-lg italic">
              "{quote}"
            </blockquote>
            <p className="mt-2 font-medium text-sm">— {quoteAuthor}</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
