
import React from 'react';
import { CheckCircle, Wifi, WifiOff, Loader2 } from 'lucide-react';

interface SilentSaveIndicatorProps {
  isSaving: boolean;
  saveError: string | null;
  lastSaveTime: Date | null;
}

export function SilentSaveIndicator({ 
  isSaving, 
  saveError, 
  lastSaveTime 
}: SilentSaveIndicatorProps) {
  const getSaveStatus = () => {
    if (isSaving) {
      return {
        icon: <Loader2 className="w-3 h-3 animate-spin text-blue-500" />,
        text: "Saving...",
        color: "text-blue-600"
      };
    }
    
    if (saveError) {
      return {
        icon: <WifiOff className="w-3 h-3 text-orange-500" />,
        text: "Saved locally (sign in to sync)",
        color: "text-orange-600"
      };
    }
    
    if (lastSaveTime) {
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - lastSaveTime.getTime()) / 1000);
      
      if (diffInSeconds < 30) {
        return {
          icon: <CheckCircle className="w-3 h-3 text-green-500" />,
          text: "Saved",
          color: "text-green-600"
        };
      }
    }
    
    return {
      icon: <Wifi className="w-3 h-3 text-gray-400" />,
      text: "Auto-save enabled",
      color: "text-gray-500"
    };
  };

  const status = getSaveStatus();

  return (
    <div className="flex items-center gap-1 text-xs">
      {status.icon}
      <span className={status.color}>{status.text}</span>
    </div>
  );
}
