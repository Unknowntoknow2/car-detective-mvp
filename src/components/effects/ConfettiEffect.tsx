
import React, { useCallback, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { shouldReduceMotion } from '@/utils/animations';

interface ConfettiEffectProps {
  active?: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  onComplete?: () => void;
}

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({
  active = false,
  duration = 3000,
  particleCount = 100,
  colors = ['#0062FF', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'],
  onComplete
}) => {
  const [hasPlayed, setHasPlayed] = useState(false);
  const reduceMotion = shouldReduceMotion();
  
  const fireConfetti = useCallback(() => {
    if (reduceMotion) return;
    
    const end = Date.now() + duration;
    
    const run = () => {
      if (Date.now() > end) {
        onComplete?.();
        return;
      }
      
      confetti({
        particleCount: particleCount / 5,
        angle: Math.random() * 90 + 45,
        spread: 50,
        origin: { y: 0.6, x: Math.random() },
        colors: colors,
        zIndex: 1000,
        disableForReducedMotion: true
      });
      
      requestAnimationFrame(run);
    };
    
    run();
  }, [duration, particleCount, colors, onComplete, reduceMotion]);
  
  useEffect(() => {
    if (active && !hasPlayed) {
      fireConfetti();
      setHasPlayed(true);
    }
    
    if (!active && hasPlayed) {
      setHasPlayed(false);
    }
  }, [active, hasPlayed, fireConfetti]);
  
  return null;
};

export default ConfettiEffect;
