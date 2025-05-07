
import { Variants } from 'framer-motion';

// Fade in animation
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

// Fade in from direction
export const fadeInFrom = (direction: 'top' | 'right' | 'bottom' | 'left', distance = 20): Variants => {
  const directionMap = {
    top: { y: -distance },
    right: { x: distance },
    bottom: { y: distance },
    left: { x: -distance }
  };

  return {
    hidden: { opacity: 0, ...directionMap[direction] },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
        duration: 0.3
      }
    }
  };
};

// Scale animation
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  }
};

// Staggered container animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Form field animation
export const formField: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  }
};

// Success animation
export const success: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 10
    }
  }
};

// Content switch animation
export const contentSwitch: Variants = {
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  enter: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.3,
      type: 'spring',
      stiffness: 500,
      damping: 30
    }
  }
};

// Button animations
export const buttonHover = {
  scale: 1.02,
  transition: { duration: 0.2 }
};

export const buttonTap = {
  scale: 0.98,
  transition: { duration: 0.1 }
};
