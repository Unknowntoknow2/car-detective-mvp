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
  
  console.log('🔍 Preview Environment Status:', status);
  
  // Respond to parent preview health checks
  try {
    const respondToHealthCheck = (event: MessageEvent) => {
      if (event.data?.type === 'PREVIEW_HEALTH_CHECK') {
        try {
          if (window.parent !== window) {
            window.parent.postMessage({ type: 'PREVIEW_CONNECTED', timestamp: Date.now() }, '*');
          }
        } catch (e) {
          console.warn('Preview healthcheck response failed:', e);
        }
      }
    };
    window.addEventListener('message', respondToHealthCheck);
  } catch (e) {
    console.warn('Unable to setup preview healthcheck responder:', e);
  }
  
  if (status.isLovablePreview) {
    // Preview console noise suppression and error handling
    try {
      const patterns = [
        'WebSocket connection to',
        'Max reconnect attempts',
        'lovableproject.com',
        'Tracking Prevention blocked access to storage',
        'Unrecognized feature:'
      ];
      const originalWarn = console.warn.bind(console);
      const originalError = console.error.bind(console);
      console.warn = (...args: any[]) => {
        const msg = args.join(' ');
        if (patterns.some(p => msg.includes(p))) return;
        originalWarn(...args);
      };
      console.error = (...args: any[]) => {
        const msg = args.join(' ');
        if (patterns.some(p => msg.includes(p))) return;
        originalError(...args);
      };
    } catch (_e) {
      // noop
    }

    // Handle preview-specific errors
    window.addEventListener('error', (event) => {
      if (event.error?.message?.includes('WebSocket') || 
          event.error?.message?.includes('preview')) {
        console.warn('Preview WebSocket error suppressed:', event.error);
        event.preventDefault();
        return false;
      }
    });

    // Handle unhandled promise rejections from preview environment
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.message?.includes('WebSocket') ||
          event.reason?.message?.includes('preview') ||
          event.reason?.message?.includes('Failed to fetch')) {
        console.warn('Preview promise rejection suppressed:', event.reason);
        event.preventDefault();
      }
    });
    
    // Periodic health check
    setInterval(() => {
      try {
        if (window.parent !== window) {
          window.parent.postMessage({ 
            type: 'PREVIEW_HEARTBEAT',
            timestamp: Date.now() 
          }, '*');
        }
      } catch (error) {
        console.warn('Preview heartbeat failed:', error);
      }
    }, 30000); // Every 30 seconds
  }
};

export const isPreviewEnvironment = (): boolean => {
  return getPreviewStatus().isLovablePreview;
};