
import React from 'react';
// import confetti from 'canvas-confetti';

interface ConfettiEffectProps {
  trigger?: boolean;
  onComplete?: () => void;
}

export const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ 
  trigger = false, 
  onComplete 
}) => {
  // Disabled for MVP launch - uncomment after adding canvas-confetti dependency
  /*
  React.useEffect(() => {
    if (trigger) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      onComplete?.();
    }
  }, [trigger, onComplete]);
  */

  return null;
};

export default ConfettiEffect;
