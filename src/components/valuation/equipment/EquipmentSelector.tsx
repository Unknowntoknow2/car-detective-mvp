
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, PlusCircle, Settings } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';

interface EquipmentOption {
  id: number;
  name: string;
  multiplier: number;
  description: string;
  value_add: number;
}

interface EquipmentSelectorProps {
  selectedEquipment: number[];
  onChange: (selectedIds: number[]) => void;
}

export function EquipmentSelector({ selectedEquipment, onChange }: EquipmentSelectorProps) {
  const [options, setOptions] = useState<EquipmentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch equipment options from the database
  useEffect(() => {
    const fetchEquipmentOptions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('equipment_options')
          .select('*')
          .order('name');
        
        if (error) {
          throw new Error(error.message);
        }
        
        setOptions(data || []);
      } catch (err) {
        console.error('Error fetching equipment options:', err);
        setError(err instanceof Error ? err.message : 'Failed to load equipment options');
      } finally {
        setLoading(false);
      }
    };

    fetchEquipmentOptions();
  }, []);

  // Toggle equipment selection
  const toggleEquipment = (id: number) => {
    if (selectedEquipment.includes(id)) {
      onChange(selectedEquipment.filter(item => item !== id));
    } else {
      onChange([...selectedEquipment, id]);
    }
  };

  // Calculate total value add
  const calculateTotalValueAdd = (): number => {
    return selectedEquipment.reduce((total, id) => {
      const option = options.find(opt => opt.id === id);
      return total + (option?.value_add || 0);
    }, 0);
  };

  // Format percentage from multiplier
  const formatPercentage = (multiplier: number): string => {
    const percentage = (multiplier - 1) * 100;
    return `+${percentage.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Loading equipment options...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-medium">
          <Settings className="mr-2 h-5 w-5" />
          Equipment & Packages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Select the equipment and packages included with your vehicle.
          </p>
          {selectedEquipment.length > 0 && (
            <p className="text-sm font-medium text-primary mt-2">
              Value Added: +${calculateTotalValueAdd().toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            {options.map((option) => (
              <Tooltip key={option.id}>
                <TooltipTrigger asChild>
                  <Badge
                    variant={selectedEquipment.includes(option.id) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      selectedEquipment.includes(option.id) 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-primary/10"
                    }`}
                    onClick={() => toggleEquipment(option.id)}
                  >
                    {option.name} 
                    {selectedEquipment.includes(option.id) && (
                      <span className="ml-1 text-xs">
                        ({formatPercentage(option.multiplier)})
                      </span>
                    )}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{option.description}</p>
                  <p className="text-xs font-medium mt-1">
                    Value: +${option.value_add.toLocaleString()} ({formatPercentage(option.multiplier)})
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
