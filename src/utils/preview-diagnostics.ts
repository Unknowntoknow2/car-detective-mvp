/**
 * Preview environment diagnostics and fallback handling
 */

export interface PreviewStatus {
  isLovablePreview: boolean;
  hasWebSocket: boolean;
  hasParentFrame: boolean;
  canCommunicate: boolean;
}

export const getPreviewStatus = (): PreviewStatus => {
  const params = new URLSearchParams(window.location.search);
  const disablePreview = params.has('staticPreview') || params.get('preview') === 'off';
  const isLovablePreview = !disablePreview && window !== window.parent && 
    (window.location.hostname.includes('lovable') || 
     window.location.hostname.includes('localhost'));
  
  const hasWebSocket = typeof WebSocket !== 'undefined';
  const hasParentFrame = window.parent !== window;
  
  let canCommunicate = false;
  try {
    // Test if we can communicate with parent frame
    if (hasParentFrame) {
      window.parent.postMessage({ type: 'PREVIEW_HEALTH_CHECK' }, '*');
      canCommunicate = true;
    }
  } catch (error) {
    console.warn('Preview communication test failed:', error);
  }

  return {
    isLovablePreview,
    hasWebSocket,
    hasParentFrame,
    canCommunicate
  };
};

export const setupPreviewErrorHandling = () => {
  const status = getPreviewStatus();
  
  // Respond to parent preview health checks
  try {
    const respondToHealthCheck = (event: MessageEvent) => {
      if (event.data?.type === 'PREVIEW_HEALTH_CHECK') {
        try {
          if (window.parent !== window) {
            window.parent.postMessage({ type: 'PREVIEW_CONNECTED', timestamp: Date.now() }, '*');
          }
        } catch (e) {
          // Silently handle healthcheck failures
        }
      }
    };
    window.addEventListener('message', respondToHealthCheck);
  } catch (e) {
    // Silently handle setup failures
  }
  
  if (status.isLovablePreview) {
    // Comprehensive preview console noise suppression
    const suppressedPatterns = [
      // WebSocket & Connection
      'WebSocket connection to',
      'WebSocket connection failed',
      'Max reconnect attempts',
      'lovableproject.com',
      'Failed to establish WebSocket',
      'connection retry',
      'reconnect failed',
      
      // Browser Features & Security
      'Tracking Prevention blocked access to storage',
      'Unrecognized feature:',
      'ambient-light-sensor',
      'battery',
      'vr',
      'accelerometer',
      'gyroscope',
      'magnetometer',
      'An iframe which has both allow-scripts and allow-same-origin',
      
      // Firebase & Authentication
      '@firebase/firestore',
      'Firestore (11.10.0)',
      'Uncaught Error in snapshot listener',
      'FirebaseError: [code=permission-denied]',
      'Missing or insufficient permissions',
      
      // Third-Party SDKs
      'RS SDK - Google Ads',
      'Email, Phone are mandatory fields',
      'RudderStack',
      'Google Analytics',
      
      // Development Artifacts
      'We\'re hiring!',
      'lovable.dev/careers',
      'DevTools'
    ];

    // Enhanced preview-specific error suppression
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalLog = console.log;
    
    console.warn = (...args: any[]) => {
      const msg = args.join(' ');
      if (suppressedPatterns.some(p => msg.includes(p))) return;
      originalWarn(...args);
    };
    
    console.error = (...args: any[]) => {
      const msg = args.join(' ');
      if (suppressedPatterns.some(p => msg.includes(p))) return;
      originalError(...args);
    };
    
    console.log = (...args: any[]) => {
      const msg = args.join(' ');
      if (msg.includes('We\'re hiring!') || 
          msg.includes('lovable.dev/careers') ||
          msg.includes('⠀⠀#######')) return;
      originalLog(...args);
    };

    // Handle preview-specific global errors
    window.addEventListener('error', (event) => {
      const message = event.error?.message || '';
      
      if (message.includes('WebSocket') || 
          message.includes('preview') ||
          message.includes('@firebase/firestore') ||
          message.includes('Missing or insufficient permissions') ||
          message.includes('RS SDK') ||
          message.includes('Google Ads')) {
        event.preventDefault();
        return false;
      }
    });

    // Handle preview-specific promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason?.message || event.reason || '';
      
      if (reason.includes('WebSocket') ||
          reason.includes('preview') ||
          reason.includes('Failed to fetch') ||
          reason.includes('@firebase/firestore') ||
          reason.includes('Missing or insufficient permissions') ||
          reason.includes('Max reconnect attempts') ||
          reason.includes('lovableproject.com')) {
        event.preventDefault();
      }
    });
    
    // Periodic health check (silent)
    setInterval(() => {
      try {
        if (window.parent !== window) {
          window.parent.postMessage({ 
            type: 'PREVIEW_HEARTBEAT',
            timestamp: Date.now() 
          }, '*');
        }
      } catch (error) {
        // Silent heartbeat failure
      }
    }, 30000);
  }
};

export const isPreviewEnvironment = (): boolean => {
  return getPreviewStatus().isLovablePreview;
};