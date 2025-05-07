
import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { CDCard, CDCardBody, CDCardHeader, CDCardFooter } from './CDCard';
import { shouldReduceMotion } from '@/components/animations/utils';

interface CDMotionCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
  delay?: number;
  motionProps?: MotionProps;
  interactive?: boolean;
  onClick?: () => void;
}

export const CDMotionCard: React.FC<CDMotionCardProps> = ({
  children,
  className,
  variant = "default",
  padding = "md",
  delay = 0,
  motionProps,
  interactive = false,
  onClick,
}) => {
  const reduceMotion = shouldReduceMotion();
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: reduceMotion ? 0 : delay,
        ease: "easeOut"
      }
    }
  };

  if (interactive) {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={reduceMotion ? undefined : { y: -5 }}
        whileTap={reduceMotion ? undefined : { y: 0 }}
        {...motionProps}
      >
        <CDCard 
          className={className}
          variant={variant}
          padding={padding}
          interactive={interactive}
          onClick={onClick}
        >
          {children}
        </CDCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={reduceMotion ? undefined : { y: -5 }}
      {...motionProps}
    >
      <CDCard 
        className={className}
        variant={variant}
        padding={padding}
      >
        {children}
      </CDCard>
    </motion.div>
  );
};

// Re-export card subcomponents
export { CDCardBody, CDCardHeader, CDCardFooter };
