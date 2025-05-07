
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';

interface ProgressRingProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
}

export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 8,
  color = 'currentColor',
  backgroundColor = '#e5e7eb',
  children,
  className,
  duration = 1.5,
  delay = 0.2
}: ProgressRingProps) {
  const [progress, setProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  // Calculate the stroke-dashoffset based on the progress
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (isInView) {
      // Small delay before starting animation
      const timeoutId = setTimeout(() => {
        setProgress(value);
      }, delay * 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isInView, value, delay]);

  return (
    <div 
      ref={ref} 
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background circle */}
      <svg width={size} height={size} className="absolute">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
      </svg>
      
      {/* Progress circle */}
      <motion.svg
        width={size}
        height={size}
        className="absolute"
        initial={{ rotate: -90 }}
        style={{ originX: '50%', originY: '50%' }}
      >
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ 
            duration, 
            delay: delay + 0.1,
            ease: "easeOut" 
          }}
          strokeLinecap="round"
        />
      </motion.svg>
      
      {/* Content in the center */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
