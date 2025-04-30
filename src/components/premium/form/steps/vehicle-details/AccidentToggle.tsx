
import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';

interface AccidentToggleProps {
  hasAccident: boolean | null;
  onToggle: (hasAccident: boolean) => void;
}

export function AccidentToggle({ hasAccident, onToggle }: AccidentToggleProps) {
  return (
    <div className="flex space-x-4">
      <button
        type="button"
        onClick={() => onToggle(false)}
        className={`flex items-center px-4 py-2 border rounded-md ${
          hasAccident === false 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Check className="w-4 h-4 mr-2" />
        No Accidents
      </button>
      
      <button
        type="button"
        onClick={() => onToggle(true)}
        className={`flex items-center px-4 py-2 border rounded-md ${
          hasAccident === true 
            ? 'bg-amber-50 border-amber-200 text-amber-700' 
            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <AlertTriangle className="w-4 h-4 mr-2" />
        Has Accident History
      </button>
    </div>
  );
}
