
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface AccidentSectionProps {
  hasAccident: string;
  setHasAccident: (value: string) => void;
  accidentSeverity: string;
  setAccidentSeverity: (value: string) => void;
  isDisabled?: boolean;
}

export function AccidentSection({
  hasAccident,
  setHasAccident,
  accidentSeverity,
  setAccidentSeverity,
  isDisabled = false,
}: AccidentSectionProps) {
  const handleToggle = (value: boolean) => {
    setHasAccident(value ? "yes" : "no");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accident History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={hasAccident === "yes"}
            onCheckedChange={handleToggle}
            disabled={isDisabled}
          />
          <Label>Vehicle has been in accidents</Label>
        </div>
        
        {hasAccident === "yes" && (
          <div className="space-y-2">
            <Label htmlFor="accident-severity">Accident Severity</Label>
            <Select 
              value={accidentSeverity} 
              onValueChange={setAccidentSeverity}
              disabled={isDisabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minor">Minor</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="severe">Severe</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
