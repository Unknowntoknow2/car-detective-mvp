/**
 * Application Logger
 * 
 * Provides logging utilities that respect development/production modes.
 * In production, only errors and warnings are logged.
 */

const isDevelopment = import.meta.env.DEV || false;

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      // Only log in development
    }
  },
  
  warn: (...args: any[]) => {
    console.warn(...args);
  },
  
  error: (...args: any[]) => {
    console.error(...args);
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      // Only log in development
    }
  },
  
  debug: (...args: any[]) => {
    if (isDevelopment) {
      // Only log in development
    }
  }
};

export default logger;