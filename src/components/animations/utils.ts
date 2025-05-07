
import { Variants } from 'framer-motion';

// Common variants for staggered animations
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const itemVariants: Variants = {
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

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.5
    }
  }
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Utility function for a "press/tap" effect on buttons
export const createPressAnimation = (scale = 0.95) => ({
  whileTap: { scale }
});

// Utility to handle reduced motion preference
export const shouldReduceMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Get color for confidence score
export const getConfidenceColor = (score: number): string => {
  if (score >= 90) return 'rgb(34, 197, 94)'; // green-500
  if (score >= 80) return 'rgb(59, 130, 246)'; // blue-500
  if (score >= 70) return 'rgb(234, 179, 8)';  // yellow-500
  if (score >= 60) return 'rgb(249, 115, 22)'; // orange-500
  return 'rgb(239, 68, 68)'; // red-500
};

// Get label for confidence score
export const getConfidenceLabel = (score: number): string => {
  if (score >= 90) return 'Very High';
  if (score >= 80) return 'High';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Low';
};
