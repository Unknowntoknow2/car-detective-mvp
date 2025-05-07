
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface EmptyStateAnimationProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  ctaText?: string;
  onCtaClick?: () => void;
  illustration?: string;
  className?: string;
}

export function EmptyStateAnimation({
  title,
  description,
  icon,
  ctaText,
  onCtaClick,
  illustration,
  className = ''
}: EmptyStateAnimationProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className={`text-center p-8 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Illustration or Icon */}
      <motion.div 
        className="mx-auto mb-6"
        variants={itemVariants}
      >
        {illustration ? (
          <img 
            src={illustration} 
            alt={title} 
            className="h-40 mx-auto"
          />
        ) : icon ? (
          <div className="h-16 w-16 mx-auto text-primary opacity-80">
            {icon}
          </div>
        ) : null}
      </motion.div>
      
      {/* Title */}
      <motion.h3 
        className="text-xl font-semibold mb-2 text-gray-800"
        variants={itemVariants}
      >
        {title}
      </motion.h3>
      
      {/* Description */}
      <motion.p 
        className="text-gray-600 mb-6 max-w-md mx-auto"
        variants={itemVariants}
      >
        {description}
      </motion.p>
      
      {/* CTA Button */}
      {ctaText && (
        <motion.div variants={itemVariants}>
          <Button
            onClick={onCtaClick}
            className="px-6 py-2 animate-pulse"
          >
            {ctaText}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
