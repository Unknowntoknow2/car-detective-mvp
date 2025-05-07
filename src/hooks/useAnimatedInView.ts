
import { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';

interface AnimationOptions {
  once?: boolean;
  amount?: number;
  delay?: number;
}

export function useAnimatedInView({ once = true, amount = 0.3, delay = 0 }: AnimationOptions = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });
  const [shouldAnimate, setShouldAnimate] = useState(false);
  
  useEffect(() => {
    if (isInView) {
      const timeoutId = setTimeout(() => {
        setShouldAnimate(true);
      }, delay * 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isInView, delay]);
  
  return { ref, isInView: shouldAnimate };
}
