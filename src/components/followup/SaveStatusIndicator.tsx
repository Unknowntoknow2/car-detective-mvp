
import React from 'react';
import { WifiOff, Save, Clock, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SaveStatusIndicatorProps {
  isSaving: boolean;
  saveError: string | null;
  lastSaveTime: Date | null;
  onRetry?: () => void;
}

export function SaveStatusIndicator({ 
  isSaving, 
  saveError, 
  lastSaveTime,
  onRetry 
}: SaveStatusIndicatorProps) {
  const getSaveStatusIcon = () => {
    if (saveError) {
      return <WifiOff className="w-4 h-4 text-red-500" />;
    }
    if (isSaving) {
      return <Save className="w-4 h-4 text-blue-500 animate-pulse" />;
    }
    if (lastSaveTime) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <Clock className="w-4 h-4 text-gray-400" />;
  };

  const getSaveStatusText = () => {
    if (saveError) {
      return "Save Failed";
    }
    if (isSaving) {
      return "Saving...";
    }
    if (lastSaveTime) {
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - lastSaveTime.getTime()) / 1000);
      
      if (diffInSeconds < 60) {
        return "Saved just now";
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `Saved ${minutes}m ago`;
      } else {
        return `Saved at ${lastSaveTime.toLocaleTimeString()}`;
      }
    }
    return "Not saved";
  };

  const getStatusColor = () => {
    if (saveError) return "text-red-600";
    if (isSaving) return "text-blue-600";
    if (lastSaveTime) return "text-green-600";
    return "text-gray-500";
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      {getSaveStatusIcon()}
      <span className={getStatusColor()}>
        {getSaveStatusText()}
      </span>
      {saveError && onRetry && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRetry}
          disabled={isSaving}
          className="h-6 px-2 text-xs"
        >
          <RefreshCw className={`w-3 h-3 ${isSaving ? 'animate-spin' : ''}`} />
        </Button>
      )}
    </div>
  );
}
