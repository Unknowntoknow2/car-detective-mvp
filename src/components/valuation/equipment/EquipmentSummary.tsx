
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface EquipmentSummaryProps {
  selectedEquipmentIds: number[];
  combinedMultiplier: number;
  totalValueAdd: number;
}

export function EquipmentSummary({
  selectedEquipmentIds,
  combinedMultiplier,
  totalValueAdd
}: EquipmentSummaryProps) {
  const [equipmentNames, setEquipmentNames] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchEquipmentNames = async () => {
      if (selectedEquipmentIds.length === 0) return;
      
      const { data, error } = await supabase
        .from('equipment_options')
        .select('name')
        .in('id', selectedEquipmentIds);
        
      if (!error && data) {
        setEquipmentNames(data.map(item => item.name));
      }
    };
    
    fetchEquipmentNames();
  }, [selectedEquipmentIds]);

  // Format percentage from multiplier
  const formatPercentage = (multiplier: number): string => {
    const percentage = (multiplier - 1) * 100;
    return percentage > 0 ? `+${percentage.toFixed(1)}%` : `${percentage.toFixed(1)}%`;
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
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg font-medium">
          <div className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Equipment & Packages
          </div>
          <Badge variant="outline" className="ml-2 bg-primary/10">
            {formatPercentage(combinedMultiplier)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm font-medium text-primary">
            Value Added: +${totalValueAdd.toLocaleString()}
          </p>
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
