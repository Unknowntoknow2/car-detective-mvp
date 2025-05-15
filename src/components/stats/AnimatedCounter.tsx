
import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  formatter?: (value: number) => string;
  duration?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  value, 
  formatter = (val) => val.toString(),
  duration = 1000
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const startTime = useRef<number | null>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (!isInView) return;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = timestamp - startTime.current;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function: ease out cubic
      const eased = 1 - Math.pow(1 - percentage, 3);
      
      // Update the displayed value
      setDisplayValue(Math.floor(eased * value));
      
      // Continue animation until duration is complete
      if (percentage < 1) {
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value); // Ensure final value is exact
      }
    };

    // Start the animation
    animationFrameId.current = requestAnimationFrame(animate);
    
    // Cleanup on component unmount or when value changes
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      startTime.current = null;
    };
  }, [value, isInView, duration]);

  return <span ref={ref}>{formatter(displayValue)}</span>;
};

export default AnimatedCounter;
