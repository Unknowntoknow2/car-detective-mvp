
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
