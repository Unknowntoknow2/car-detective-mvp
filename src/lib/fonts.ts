
/**
 * Font loading utility
 * Dynamically loads Inter font from a reliable CDN
 */

export const loadFonts = () => {
  if (typeof document !== 'undefined') {
    // Check if the font is already loaded to avoid duplicates
    if (!document.querySelector('link[href="https://rsms.me/inter/inter.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://rsms.me/inter/inter.css';
      document.head.appendChild(link);
    }
  }
};
