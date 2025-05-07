
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  formatter?: (value: number) => string;
  className?: string;
  animate?: boolean;
  prefix?: string;
  suffix?: string;
  delay?: number;
}

export function AnimatedCounter({ 
  value, 
  duration = 1500, 
  formatter = (val) => val.toLocaleString(), 
  className,
  animate = true,
  prefix = '',
  suffix = '',
  delay = 0
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!animate || !isInView) {
      setDisplayValue(value);
      return;
    }

    startValueRef.current = 0;
    startTimeRef.current = null;
    
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    // Delay the animation start if needed
    const timeoutId = setTimeout(() => {
      const animateValue = (timestamp: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        
        // Use easeOutExpo for a nice deceleration effect
        const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const newValue = Math.floor(startValueRef.current + (value - startValueRef.current) * easeOutExpo);
        
        setDisplayValue(newValue);

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animateValue);
        } else {
          // Ensure final value is exact
          setDisplayValue(value);
        }
      };

      frameRef.current = requestAnimationFrame(animateValue);
    }, delay);
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      clearTimeout(timeoutId);
    };
  }, [value, duration, animate, isInView, delay]);

  return (
    <motion.span 
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {prefix}{formatter(displayValue)}{suffix}
    </motion.span>
  );
}
