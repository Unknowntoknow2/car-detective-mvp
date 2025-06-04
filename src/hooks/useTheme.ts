import { useEffect, useState } from "react";

<<<<<<< HEAD
import { useContext } from 'react';
import { ThemeContext } from '@/components/theme/ThemeProvider';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
=======
type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check for saved preference or use system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    // Check system preference
    const systemPreference =
      globalThis.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

    return systemPreference;
  });

  useEffect(() => {
    // Apply theme to document
    const root = globalThis.document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
