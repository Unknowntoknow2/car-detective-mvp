
/**
 * Helper function to determine if the user has requested reduced motion
 * This respects the user's OS/browser preference for reduced motion
 */
export function shouldReduceMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if the browser supports matchMedia and prefers-reduced-motion
  const prefersReducedMotion = 
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  return prefersReducedMotion;
}

// Add the missing animation variants that PremiumHero.tsx is trying to import
export const fadeInAnimation = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

export const slideInAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};
