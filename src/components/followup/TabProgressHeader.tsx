
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface TabProgressHeaderProps {
  completionPercentage: number;
  onShowQuickOverview: () => void;
  saveStatusIndicator: React.ReactNode;
}

export function TabProgressHeader({
  completionPercentage,
  onShowQuickOverview,
  saveStatusIndicator
}: TabProgressHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-900">Complete Your Valuation</h3>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onShowQuickOverview}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Quick Overview
          </Button>
          {saveStatusIndicator}
          <span className="text-sm font-medium text-gray-600">{completionPercentage}% Complete</span>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
    </div>
  );
}
