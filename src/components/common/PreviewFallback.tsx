import React, { useEffect, useState } from 'react';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPreviewStatus, type PreviewStatus } from '@/utils/preview-diagnostics';

interface PreviewFallbackProps {
  children: React.ReactNode;
}

export function PreviewFallback({ children }: PreviewFallbackProps) {
  const [previewStatus, setPreviewStatus] = useState<PreviewStatus | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [connectionIssue, setConnectionIssue] = useState(false);

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

  // Show connection issue banner only in preview environment
  if (previewStatus?.isLovablePreview && connectionIssue) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-4 bg-amber-50 border-b border-amber-200">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <WifiOff className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Preview Connection Issue
                </p>
                <p className="text-xs text-amber-700">
                  Live preview may not be working properly. Your app is still functional.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDiagnostics(!showDiagnostics)}
                className="text-amber-700 border-amber-300"
              >
                <AlertCircle className="h-4 w-4 mr-1" />
                Diagnostics
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="text-amber-700 border-amber-300"
              >
                <Wifi className="h-4 w-4 mr-1" />
                Reconnect
              </Button>
            </div>
          </div>
          
          {showDiagnostics && previewStatus && (
            <div className="mt-3 p-3 bg-amber-100 rounded-lg max-w-4xl mx-auto">
              <h4 className="text-sm font-medium text-amber-800 mb-2">Preview Environment Status</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex justify-between">
                  <span>Lovable Preview:</span>
                  <span className={previewStatus.isLovablePreview ? 'text-green-600' : 'text-red-600'}>
                    {previewStatus.isLovablePreview ? '✓' : '✗'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>WebSocket Support:</span>
                  <span className={previewStatus.hasWebSocket ? 'text-green-600' : 'text-red-600'}>
                    {previewStatus.hasWebSocket ? '✓' : '✗'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Parent Frame:</span>
                  <span className={previewStatus.hasParentFrame ? 'text-green-600' : 'text-red-600'}>
                    {previewStatus.hasParentFrame ? '✓' : '✗'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Can Communicate:</span>
                  <span className={previewStatus.canCommunicate ? 'text-green-600' : 'text-red-600'}>
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