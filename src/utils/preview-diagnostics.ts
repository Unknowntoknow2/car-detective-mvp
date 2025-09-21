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
  const isLovablePreview = window !== window.parent && 
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
  
  if (status.isLovablePreview) {
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