
import React from "react";
import { Button } from "@/components/ui/button";

export interface AccidentToggleProps {
  hasAccident: string;
  onToggle: (value: string) => void;
}

export function AccidentToggle({ hasAccident, onToggle }: AccidentToggleProps) {
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant={hasAccident === "no" ? "default" : "outline"}
        onClick={() => onToggle("no")}
        size="sm"
      >
        No Accidents
      </Button>
      <Button
        type="button"
        variant={hasAccident === "yes" ? "default" : "outline"}
        onClick={() => onToggle("yes")}
        size="sm"
      >
        Has Accidents
      </Button>
    </div>
  );
}
