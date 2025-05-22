
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

export function useMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}

export function useTablet(): boolean {
  return useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
}

export function useDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

// Alias for useMobile for components that import useIsMobile
export const useIsMobile = useMobile;
