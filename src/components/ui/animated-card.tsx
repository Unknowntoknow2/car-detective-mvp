
import React from 'react';
import { Card } from './card';
import { motion, HTMLMotionProps } from 'framer-motion';
import { shouldReduceMotion } from '@/utils/animations';

interface AnimatedCardProps extends React.ComponentPropsWithRef<typeof Card> {
  animate?: boolean;
  hoverEffect?: 'lift' | 'scale' | 'glow' | 'none';
  delay?: number;
  children?: React.ReactNode;
}

// Create a motion component with proper typing
const MotionCard = motion(Card) as React.ForwardRefExoticComponent<
  HTMLMotionProps<"div"> & React.RefAttributes<HTMLDivElement>
>;

export const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, animate = true, hoverEffect = 'lift', delay = 0, ...props }, ref) => {
    const reduceMotion = shouldReduceMotion();
    
    if (reduceMotion || !animate) {
      return <Card ref={ref} {...props}>{children}</Card>;
    }
    
    let hoverAnimation: any = {};
    
    switch (hoverEffect) {
      case 'lift':
        hoverAnimation = {
          whileHover: { y: -5, transition: { duration: 0.2 } },
          whileTap: { y: 0 }
        };
        break;
      case 'scale':
        hoverAnimation = {
          whileHover: { scale: 1.02, transition: { duration: 0.2 } },
          whileTap: { scale: 0.98 }
        };
        break;
      case 'glow':
        hoverAnimation = {
          whileHover: { 
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
            transition: { duration: 0.2 }
          }
        };
        break;
      case 'none':
      default:
        hoverAnimation = {};
    }
    
    const initialAnimation: any = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { 
        duration: 0.5,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    };
    
    return (
      <MotionCard
        ref={ref}
        {...initialAnimation}
        {...hoverAnimation}
        {...props}
      >
        {children}
      </MotionCard>
    );
  }
);

AnimatedCard.displayName = "AnimatedCard";
