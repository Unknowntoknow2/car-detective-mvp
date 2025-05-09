
import React from 'react';
import { Button, ButtonProps } from './button';
import { motion, HTMLMotionProps } from 'framer-motion';
import { shouldReduceMotion } from '@/utils/animations';

interface AnimatedButtonProps extends ButtonProps {
  scaleOnHover?: boolean;
  pulseOnHover?: boolean;
  iconAnimation?: 'rotate' | 'bounce' | 'pulse' | 'shake' | 'none';
  children?: React.ReactNode;
}

// Create a motion component with proper typing
const MotionButton = motion(Button) as React.ForwardRefExoticComponent<
  HTMLMotionProps<"button"> & React.RefAttributes<HTMLButtonElement>
>;

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, scaleOnHover = true, pulseOnHover = false, iconAnimation = 'none', ...props }, ref) => {
    const reduceMotion = shouldReduceMotion();
    
    if (reduceMotion) {
      return <Button ref={ref} {...props}>{children}</Button>;
    }
    
    const iconChild = React.Children.toArray(children).find(
      child => React.isValidElement(child) && typeof child.type !== 'string'
    );
    
    const textChildren = React.Children.toArray(children).filter(
      child => !React.isValidElement(child) || typeof child.type === 'string'
    );
    
    let iconAnimationProps: any = {};
    
    if (iconChild && iconAnimation !== 'none') {
      switch (iconAnimation) {
        case 'rotate':
          iconAnimationProps = {
            animate: { rotate: [0, 360] },
            transition: { duration: 1, repeat: Infinity, ease: "linear" }
          };
          break;
        case 'bounce':
          iconAnimationProps = {
            animate: { y: [0, -5, 0] },
            transition: { duration: 0.6, repeat: Infinity, repeatType: "reverse" }
          };
          break;
        case 'pulse':
          iconAnimationProps = {
            animate: { scale: [1, 1.1, 1] },
            transition: { duration: 1, repeat: Infinity }
          };
          break;
        case 'shake':
          iconAnimationProps = {
            animate: { x: [0, -3, 3, -3, 0] },
            transition: { duration: 0.4, repeat: Infinity, repeatType: "reverse" }
          };
          break;
      }
    }
    
    const motionProps: any = {
      whileHover: scaleOnHover ? { scale: 1.05 } : undefined,
      whileTap: { scale: 0.98 },
      transition: { duration: 0.2 }
    };
    
    if (pulseOnHover && motionProps.whileHover) {
      motionProps.whileHover = { 
        ...(typeof motionProps.whileHover === 'object' ? motionProps.whileHover : {}),
        boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.3)"
      };
    }
    
    return (
      <MotionButton ref={ref} {...motionProps} {...props}>
        {iconChild && React.isValidElement(iconChild) ? (
          <motion.span {...iconAnimationProps} className="inline-flex items-center justify-center">
            {iconChild}
          </motion.span>
        ) : null}
        {textChildren}
      </MotionButton>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";
