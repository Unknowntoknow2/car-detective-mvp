/**
 * Application Logger
 * 
 * Provides logging utilities that respect development/production modes.
 * In production, only errors and warnings are logged.
 */

import { appConfig } from '@/config';

export const logger = {
  log: (...args: any[]) => {
    if (appConfig.ENABLE_DIAGNOSTICS) {
    }
  },
  
  warn: (...args: any[]) => {
    console.warn(...args);
  },
  
  error: (...args: any[]) => {
    console.error(...args);
  },
  
  info: (...args: any[]) => {
    if (appConfig.ENABLE_DIAGNOSTICS) {
      console.info(...args);
    }
  },
  
  debug: (...args: any[]) => {
    if (appConfig.ENABLE_DIAGNOSTICS) {
      console.debug(...args);
    }
  }
};

export default logger;