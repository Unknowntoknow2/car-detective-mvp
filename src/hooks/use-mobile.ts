<<<<<<< HEAD

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => {
      setMatches(media.matches);
    };
    
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
=======
import { useEffect, useState } from "react";

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? globalThis.innerWidth < 768 : false,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(globalThis.innerWidth < 768);
    };

    globalThis.addEventListener("resize", handleResize);
    return () => globalThis.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(
    typeof window !== "undefined" ? globalThis.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const media = globalThis.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    // Add event listener
    media.addEventListener("change", handler);
    // Initial check
    setMatches(media.matches);

    // Cleanup
    return () => media.removeEventListener("change", handler);
  }, [query]);
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

  return matches;
}

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}

// Export an alias for backward compatibility
export const useMobile = useIsMobile;
