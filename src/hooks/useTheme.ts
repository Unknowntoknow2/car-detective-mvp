
import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light' | 'system';

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme) || 'system'
  );

  const setTheme = (theme: Theme) => {
    localStorage.setItem('theme', theme);
    setThemeState(theme);
    updateDOM(theme);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    function onMediaChange() {
      if (theme === 'system') {
        updateDOM(theme);
      }
    }
    
    mediaQuery.addEventListener('change', onMediaChange);
    updateDOM(theme);
    
    return () => mediaQuery.removeEventListener('change', onMediaChange);
  }, [theme]);

  function updateDOM(newTheme: Theme) {
    const isDark = 
      newTheme === 'dark' || 
      (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    document.documentElement.classList.toggle('dark', isDark);
  }

  return { theme, setTheme };
};
