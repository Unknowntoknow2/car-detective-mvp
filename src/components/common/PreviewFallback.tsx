import React, { useEffect, useState } from 'react';
import { AlertCircle, Wifi, WifiOff, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPreviewStatus, type PreviewStatus } from '@/utils/preview-diagnostics';

interface PreviewFallbackProps {
  children: React.ReactNode;
}

export function PreviewFallback({ children }: PreviewFallbackProps) {
  const [previewStatus, setPreviewStatus] = useState<PreviewStatus | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [connectionIssue, setConnectionIssue] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.has('noPreviewBanner') || params.has('staticPreview');
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const status = getPreviewStatus();
    setPreviewStatus(status);
    
    // Monitor for connection issues
    let connectionTimeout: NodeJS.Timeout;
    
    if (status.isLovablePreview) {
      connectionTimeout = setTimeout(() => {
        setConnectionIssue(true);
      }, 5000); // Show connection issue after 5 seconds
      
      // Listen for successful communication
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'PREVIEW_CONNECTED') {
          setConnectionIssue(false);
          clearTimeout(connectionTimeout);
        }
      };
      
      window.addEventListener('message', handleMessage);
      
      return () => {
        clearTimeout(connectionTimeout);
        window.removeEventListener('message', handleMessage);
      };
    }
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleOpenStandalone = () => {
    window.open(window.location.href, '_blank');
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  // Show connection issue banner only in preview environment (unless dismissed)
  if (previewStatus?.isLovablePreview && connectionIssue && !isDismissed) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-4 bg-card/90 border-b border-border/30 backdrop-blur-md">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <WifiOff className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Preview Connection Issue
                </p>
                <p className="text-xs text-muted-foreground">
                  Live preview may not be working properly. Your app is still functional.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenStandalone}
                className="glass-effect border-primary/20 hover:border-primary/40"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Open Standalone
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDiagnostics(!showDiagnostics)}
                className="glass-effect border-primary/20 hover:border-primary/40"
              >
                <AlertCircle className="h-4 w-4 mr-1" />
                Diagnostics
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="glass-effect border-primary/20 hover:border-primary/40"
              >
                <Wifi className="h-4 w-4 mr-1" />
                Reconnect
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="hover:bg-muted/50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {showDiagnostics && previewStatus && (
            <div className="mt-3 p-3 glass-effect rounded-lg max-w-4xl mx-auto">
              <h4 className="text-sm font-medium text-foreground mb-2">Preview Environment Status</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex justify-between">
                  <span>Lovable Preview:</span>
                  <span className={previewStatus.isLovablePreview ? 'text-accent' : 'text-destructive'}>
                    {previewStatus.isLovablePreview ? '✓' : '✗'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>WebSocket Support:</span>
                  <span className={previewStatus.hasWebSocket ? 'text-accent' : 'text-destructive'}>
                    {previewStatus.hasWebSocket ? '✓' : '✗'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Parent Frame:</span>
                  <span className={previewStatus.hasParentFrame ? 'text-accent' : 'text-destructive'}>
                    {previewStatus.hasParentFrame ? '✓' : '✗'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Can Communicate:</span>
                  <span className={previewStatus.canCommunicate ? 'text-accent' : 'text-destructive'}>
                    {previewStatus.canCommunicate ? '✓' : '✗'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        {children}
      </div>
    );
  }

  return <>{children}</>;
}