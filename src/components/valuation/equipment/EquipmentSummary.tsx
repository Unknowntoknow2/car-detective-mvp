
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface EquipmentSummaryProps {
  selectedEquipmentIds: number[];
  combinedMultiplier: number;
  totalValueAdd: number;
}

export function EquipmentSummary({
  selectedEquipmentIds,
  combinedMultiplier,
  totalValueAdd,
}: EquipmentSummaryProps) {
  const [equipmentNames, setEquipmentNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchEquipmentNames = async () => {
      if (selectedEquipmentIds.length === 0) return;

      const { data, error } = await supabase
        .from("equipment_options")
        .select("name")
        .in("id", selectedEquipmentIds);

      if (!error && data) {
        setEquipmentNames(data.map((item) => item.name));
      }
    };

    fetchEquipmentNames();
  }, [selectedEquipmentIds]);

  // Format percentage from multiplier
  const formatPercentage = (multiplier: number): string => {
    const percentage = (multiplier - 1) * 100;
    return percentage > 0
      ? `+${percentage.toFixed(1)}%`
      : `${percentage.toFixed(1)}%`;
  };

  if (selectedEquipmentIds.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg font-medium">
            <Settings className="mr-2 h-5 w-5" />
            Equipment & Packages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            No equipment or packages selected yet.
          </p>
          <Button asChild variant="outline" className="w-full" size="sm">
            <Link to="/equipment" className="flex items-center justify-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Equipment & Packages
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Selected Options</p>
            <p className="text-lg font-medium">{selectedEquipmentIds.length} items</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Value Multiplier</p>
            <p className="text-lg font-medium">{combinedMultiplier.toFixed(2)}x</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Added Value</p>
            <p className="text-lg font-medium text-primary">+${totalValueAdd.toLocaleString()}</p>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              These premium features and options are factored into your vehicle's valuation.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {equipmentNames.map((name, index) => (
            <Badge key={index} variant="secondary">
              {name}
            </Badge>
          ))}
        </div>

        <Button asChild variant="outline" className="w-full" size="sm">
          <Link to="/equipment">
            Edit Equipment Options
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
