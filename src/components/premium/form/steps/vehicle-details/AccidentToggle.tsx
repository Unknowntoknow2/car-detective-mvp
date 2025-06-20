
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

interface AccidentToggleProps {
  hasAccidents: boolean;
  setHasAccidents: (value: boolean) => void;
  isDisabled?: boolean;
}

export function AccidentToggle({
  hasAccidents,
  setHasAccidents,
  isDisabled = false,
}: AccidentToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-3">
        <AlertTriangle 
          className={`h-5 w-5 ${hasAccidents ? 'text-orange-500' : 'text-gray-400'}`} 
        />
        <div>
          <Label className="text-sm font-medium">
            Accident History
          </Label>
          <p className="text-xs text-gray-500">
            Has this vehicle been in any accidents?
          </p>
        </div>
      </div>
      <Switch
        checked={hasAccidents}
        onCheckedChange={setHasAccidents}
        disabled={isDisabled}
      />
    </div>
  );
}
