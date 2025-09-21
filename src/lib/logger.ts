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
  },
  
  error: (...args: any[]) => {
  },
  
  info: (...args: any[]) => {
    if (appConfig.ENABLE_DIAGNOSTICS) {
    }
  },
  
  debug: (...args: any[]) => {
    if (appConfig.ENABLE_DIAGNOSTICS) {
    }
  }
};

export default logger;