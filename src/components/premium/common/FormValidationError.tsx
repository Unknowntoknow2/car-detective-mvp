
import React from 'react';
import { AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface FormValidationErrorProps {
  error?: string;
  details?: string;
  className?: string;
  showIcon?: boolean;
  variant?: 'error' | 'warning' | 'info';
}

export function FormValidationError({
  error,
  details,
  className,
  showIcon = true,
  variant = 'error'
}: FormValidationErrorProps) {
  if (!error && !details) return null;
  
  const variantClasses = {
    'error': 'text-red-600 bg-red-50 border-red-100 shadow-[0_0_0_1px_rgba(244,63,94,0.15)]',
    'warning': 'text-amber-600 bg-amber-50 border-amber-100 shadow-[0_0_0_1px_rgba(245,158,11,0.15)]',
    'info': 'text-blue-600 bg-blue-50 border-blue-100 shadow-[0_0_0_1px_rgba(59,130,246,0.15)]'
  };
  
  const IconComponent = variant === 'error' ? AlertCircle : Info;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 5, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={cn(
        'text-sm rounded-md p-3 border transition-all',
        variantClasses[variant],
        className
      )}
    >
      <div className="flex gap-2.5">
        {showIcon && (
          <IconComponent className="h-4 w-4 flex-shrink-0 mt-0.5" />
        )}
        <div className="space-y-1.5">
          {error && <p className="font-medium leading-tight">{error}</p>}
          {details && <p className="opacity-90 text-xs leading-relaxed">{details}</p>}
        </div>
      </div>
    </motion.div>
  );
}
