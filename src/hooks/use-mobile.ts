
import { useState, useEffect } from 'react';

// Custom hook to check if the screen is mobile-sized
export const useMobile = (breakpoint: number = 768) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [breakpoint]);

  return isMobile;
};

// Alias for backward compatibility
export const useIsMobile = useMobile;
