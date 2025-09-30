/**
 * Application Logger
 * 
 * Provides logging utilities that respect development/production modes.
 * In production, only errors and warnings are logged.
 * Integrates with console cleanup system to avoid noise.
 */

const isDevelopment = (typeof import.meta !== 'undefined' && import.meta.env && typeof import.meta.env.DEV !== 'undefined')
  ? import.meta.env.DEV
  : (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development');

// Check if debug mode is enabled
const isDebugMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem('console-debug-mode') === 'true';
};

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment || isDebugMode()) {
      console.log('[APP]', ...args);
    }
  },
  
  warn: (...args: any[]) => {
    console.warn('[APP]', ...args);
  },
  
  error: (...args: any[]) => {
    console.error('[APP]', ...args);
  },
  
  info: (...args: any[]) => {
    if (isDevelopment || isDebugMode()) {
      console.info('[APP]', ...args);
    }
  },
  
  debug: (...args: any[]) => {
    if (isDevelopment || isDebugMode()) {
      console.debug('[APP]', ...args);
    }
  },
  
  // Special method for important system messages that should always show
  system: (...args: any[]) => {
    console.log('[SYSTEM]', ...args);
  }
};

export default logger;