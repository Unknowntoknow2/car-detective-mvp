<<<<<<< HEAD

import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface AccidentToggleProps {
  hasAccident: string;
  onToggle: (value: string) => void;
  disabled?: boolean;
}

export function AccidentToggle({ 
  hasAccident, 
  onToggle,
  disabled = false 
}: AccidentToggleProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Has this vehicle been in an accident?</span>
      </div>
      
      <RadioGroup 
        value={hasAccident} 
        onValueChange={onToggle}
        className="flex space-x-4 pt-1"
        disabled={disabled}
=======
import React from "react";
import { AlertTriangle, Check } from "lucide-react";

interface AccidentToggleProps {
  hasAccident: string | boolean;
  onToggle: (hasAccident: "yes" | "no") => void;
}

export function AccidentToggle({ hasAccident, onToggle }: AccidentToggleProps) {
  // Convert hasAccident to string for comparison
  const hasAccidentStr = typeof hasAccident === "boolean"
    ? hasAccident ? "yes" : "no"
    : hasAccident;

  return (
    <div className="flex space-x-4">
      <button
        type="button"
        onClick={() => onToggle("no")}
        className={`flex items-center px-4 py-2 border rounded-md ${
          hasAccidentStr === "no"
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
        }`}
      >
        <Check className="w-4 h-4 mr-2" />
        No Accidents
      </button>

      <button
        type="button"
        onClick={() => onToggle("yes")}
        className={`flex items-center px-4 py-2 border rounded-md ${
          hasAccidentStr === "yes"
            ? "bg-amber-50 border-amber-200 text-amber-700"
            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
        }`}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id="r-no-accident" />
          <Label htmlFor="r-no-accident" className="cursor-pointer">No</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id="r-yes-accident" />
          <Label htmlFor="r-yes-accident" className="cursor-pointer">Yes</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
