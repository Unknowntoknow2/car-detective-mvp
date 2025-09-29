/**
 * Comprehensive console cleanup system
 * Centralizes all console noise suppression and error handling
 */

import { setupTrackingErrorHandler, setupGlobalErrorHandler } from './errorHandling';
import { setupPreviewErrorHandling } from './preview-diagnostics';

export class ConsoleCleanupManager {
  private static instance: ConsoleCleanupManager;
  private isInitialized = false;
  
  static getInstance(): ConsoleCleanupManager {
    if (!ConsoleCleanupManager.instance) {
      ConsoleCleanupManager.instance = new ConsoleCleanupManager();
    }
    return ConsoleCleanupManager.instance;
  }

  initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') return;
    
    // Temporarily disabled for debugging - allow all console messages through
    console.log('ℹ️ Console cleanup temporarily disabled for debugging');
    
    // Still initialize error handlers
    setupTrackingErrorHandler();
    setupGlobalErrorHandler();
    setupPreviewErrorHandling();
    
    this.isInitialized = true;
  }

  private setupComprehensiveConsoleOverrides(): void {
    const originalConsole = {
      log: console.log.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
      info: console.info.bind(console)
    };

    // Comprehensive noise patterns
    const noisePatterns = [
      // Browser & Extension
      'Tracking Prevention',
      'Failed to load resource',
      'chrome-extension://',
      'Unrecognized feature:',
      'ambient-light-sensor',
      'battery',
      'vr',
      'An iframe which has both allow-scripts and allow-same-origin',
      
      // Firebase & Database
      '@firebase/firestore',
      'Firestore (11.10.0)',
      'FirebaseError: [code=permission-denied]',
      'Missing or insufficient permissions',
      'snapshot listener',
      
      // Third-Party SDKs
      'RS SDK - Google Ads',
      'Email, Phone are mandatory fields',
      'RudderStack',
      'Google Analytics',
      'analytics.track',
      
      // WebSocket & Networking
      'WebSocket connection to',
      'WebSocket connection failed',
      'Max reconnect attempts',
      'lovableproject.com',
      'Failed to establish WebSocket',
      
      // Development Artifacts
      'We\'re hiring!',
      'lovable.dev/careers',
      'DevTools',
      '⠀⠀#######',
      
      // Component Debug Messages
      '🔄 App component rendering',
      '🏠 ProfessionalHomePage rendering',
      '✅ HomePage loaded',
      '🔄 MainLayout rendering',
      '✅ MainLayout mounted',
      '✅ HomePage mounted in DOM',
      'React Router Future Flag Warning',
      'v7_startTransition',
      'v7_relativeSplatPath'
    ];

    const shouldSuppress = (message: string): boolean => {
      return noisePatterns.some(pattern => 
        message.toLowerCase().includes(pattern.toLowerCase())
      );
    };

    // Override console methods
    console.log = (...args: any[]) => {
      const message = args.join(' ');
      if (!shouldSuppress(message)) {
        originalConsole.log(...args);
      }
    };

    console.warn = (...args: any[]) => {
      const message = args.join(' ');
      if (!shouldSuppress(message)) {
        originalConsole.warn(...args);
      }
    };

    console.error = (...args: any[]) => {
      const message = args.join(' ');
      if (!shouldSuppress(message)) {
        originalConsole.error(...args);
      }
    };

    console.info = (...args: any[]) => {
      const message = args.join(' ');
      if (!shouldSuppress(message)) {
        originalConsole.info(...args);
      }
    };
  }

  // Method to temporarily disable suppression for debugging
  enableDebugMode(): void {
    if (typeof window === 'undefined') return;
    
    // Store flag in sessionStorage so it persists during development
    sessionStorage.setItem('console-debug-mode', 'true');
    console.warn('Console debug mode enabled. Refresh to apply.');
  }

  disableDebugMode(): void {
    if (typeof window === 'undefined') return;
    
    sessionStorage.removeItem('console-debug-mode');
    console.warn('Console debug mode disabled. Refresh to apply.');
  }

  private isDebugMode(): boolean {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('console-debug-mode') === 'true';
  }
}

// Auto-initialize when module loads
export const consoleCleanup = ConsoleCleanupManager.getInstance();

// Initialize immediately
if (typeof window !== 'undefined') {
  // Small delay to ensure all other modules are loaded
  setTimeout(() => {
    consoleCleanup.initialize();
  }, 100);
}

// Expose debug methods globally for development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as any).consoleDebug = {
    enable: () => consoleCleanup.enableDebugMode(),
    disable: () => consoleCleanup.disableDebugMode()
  };
}