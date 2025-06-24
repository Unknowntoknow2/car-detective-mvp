
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Circle, RefreshCw } from 'lucide-react';

interface TabValidationAlertsProps {
  saveError: string | null;
  currentTabValidation: any;
  isLastTab: boolean;
  activeTab: string;
  tabs: string[];
  onTabChange: (tab: string) => void;
  onRetryConnection: () => void;
  isSaving: boolean;
}

export function TabValidationAlerts({
  saveError,
  currentTabValidation,
  isLastTab,
  activeTab,
  tabs,
  onTabChange,
  onRetryConnection,
  isSaving
}: TabValidationAlertsProps) {
  return (
    <>
      {/* Enhanced Error Alert with Recovery Options */}
      {saveError && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="flex justify-between items-start">
              <div>
                <strong>Save Error:</strong> {saveError}
                <br />
                <span className="text-sm">Your changes are being saved locally and will sync when the connection is restored.</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onRetryConnection}
                disabled={isSaving}
                className="ml-4 flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isSaving ? 'animate-spin' : ''}`} />
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Enhanced Current Tab Validation Status with Skip Option */}
      {currentTabValidation && (currentTabValidation.errors.length > 0 || currentTabValidation.warnings.length > 0) && (
        <div className="mb-4 space-y-2">
          {currentTabValidation.errors.map((error: string, index: number) => (
            <div key={index} className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2">
                <Circle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          ))}
          {currentTabValidation.warnings.map((warning: string, index: number) => (
            <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-yellow-700">{warning}</span>
              </div>
              {!isLastTab && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex < tabs.length - 1) {
                      onTabChange(tabs[currentIndex + 1]);
                    }
                  }}
                  className="text-xs"
                >
                  Skip Section
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
