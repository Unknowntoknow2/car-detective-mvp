
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, InfoIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

const BODY_STYLES = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV / Crossover' },
  { value: 'truck', label: 'Truck / Pickup' },
  { value: 'convertible', label: 'Convertible' },
  { value: 'coupe', label: 'Coupe / Sports Car' },
  { value: 'wagon', label: 'Wagon' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'minivan', label: 'Minivan' },
];

interface SeasonalAdjustmentProps {
  onChange: (values: { saleDate: Date | undefined; bodyStyle: string | undefined }) => void;
  defaultDate?: Date;
  defaultBodyStyle?: string;
  disabled?: boolean;
}

export function SeasonalAdjustment({ 
  onChange, 
  defaultDate = new Date(),
  defaultBodyStyle,
  disabled = false
}: SeasonalAdjustmentProps) {
  const [date, setDate] = useState<Date | undefined>(defaultDate);
  const [bodyStyle, setBodyStyle] = useState<string | undefined>(defaultBodyStyle);
  const [seasonalTip, setSeasonalTip] = useState<string | null>(null);

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    onChange({ saleDate: newDate, bodyStyle });
    
    if (newDate && bodyStyle) {
      fetchSeasonalTip(newDate, bodyStyle);
    }
  };

  const handleBodyStyleChange = (newBodyStyle: string) => {
    setBodyStyle(newBodyStyle);
    onChange({ saleDate: date, bodyStyle: newBodyStyle });
    
    if (date && newBodyStyle) {
      fetchSeasonalTip(date, newBodyStyle);
    }
  };

  const fetchSeasonalTip = async (date: Date, bodyStyle: string) => {
    try {
      const month = date.getMonth() + 1; // 1-12
      
      // Determine vehicle type
      let vehicleType = 'generic';
      if (bodyStyle.includes('suv') || bodyStyle.includes('crossover')) {
        vehicleType = 'suv';
      } else if (bodyStyle.includes('convertible')) {
        vehicleType = 'convertible';
      } else if (bodyStyle.includes('coupe') || bodyStyle.includes('sport')) {
        vehicleType = 'sport';
      } else if (bodyStyle.includes('truck') || bodyStyle.includes('pickup')) {
        vehicleType = 'truck';
      }
      
      // Fetch the seasonal multiplier and description
      const { data, error } = await fetch(`/api/get-seasonal-factor?month=${month}&vehicleType=${vehicleType}`)
        .then(res => res.json());
        
      if (error) {
        console.error('Error fetching seasonal tip:', error);
        return;
      }
      
      if (data) {
        const factor = data[vehicleType];
        const percentChange = ((factor - 1) * 100).toFixed(1);
        const direction = factor > 1 ? 'increases' : 'decreases';
        
        setSeasonalTip(`Seasonal adjustment: ${percentChange}% (${direction} value)`);
      }
    } catch (error) {
      console.error('Error fetching seasonal tip:', error);
    }
  };

  // For demo purposes, simulate the API call with local data
  const handleRefreshSeasonalFactor = () => {
    if (!date || !bodyStyle) {
      toast.error("Please select both a date and body style to calculate seasonal factors");
      return;
    }
    
    const month = date.getMonth() + 1;
    let vehicleType = 'generic';
    
    if (bodyStyle.includes('suv') || bodyStyle.includes('crossover')) {
      vehicleType = 'suv';
    } else if (bodyStyle.includes('convertible')) {
      vehicleType = 'convertible';
    } else if (bodyStyle.includes('coupe') || bodyStyle.includes('sport')) {
      vehicleType = 'sport';
    } else if (bodyStyle.includes('truck') || bodyStyle.includes('pickup')) {
      vehicleType = 'truck';
    }
    
    // Sample seasonal factors (this would come from the API)
    const factors = {
      1: { generic: 0.97, suv: 1.03, sport: 0.93, convertible: 0.90, truck: 1.04 },
      2: { generic: 0.98, suv: 1.02, sport: 0.95, convertible: 0.92, truck: 1.03 },
      3: { generic: 1.00, suv: 1.00, sport: 1.02, convertible: 0.97, truck: 1.01 },
      4: { generic: 1.02, suv: 0.99, sport: 1.05, convertible: 1.04, truck: 1.00 },
      5: { generic: 1.03, suv: 0.98, sport: 1.07, convertible: 1.08, truck: 0.99 },
      6: { generic: 1.04, suv: 0.97, sport: 1.08, convertible: 1.10, truck: 0.98 },
      7: { generic: 1.05, suv: 0.96, sport: 1.07, convertible: 1.09, truck: 0.97 },
      8: { generic: 1.03, suv: 0.97, sport: 1.05, convertible: 1.07, truck: 0.98 },
      9: { generic: 1.01, suv: 0.99, sport: 1.02, convertible: 1.03, truck: 1.00 },
      10: { generic: 0.99, suv: 1.01, sport: 0.98, convertible: 0.96, truck: 1.02 },
      11: { generic: 0.98, suv: 1.02, sport: 0.95, convertible: 0.93, truck: 1.03 },
      12: { generic: 0.96, suv: 1.04, sport: 0.92, convertible: 0.91, truck: 1.05 },
    };
    
    const factor = factors[month as keyof typeof factors][vehicleType as keyof typeof factors[1]];
    const percentChange = ((factor - 1) * 100).toFixed(1);
    const direction = factor > 1 ? 'increases' : 'decreases';
    
    setSeasonalTip(`Seasonal adjustment: ${percentChange}% (${direction} value)`);
    toast.success(`Updated seasonal factors for ${format(date, 'MMMM')} and ${bodyStyle}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="space-y-2 flex-1">
          <Label htmlFor="body-style">Vehicle Body Style</Label>
          <Select
            value={bodyStyle}
            onValueChange={handleBodyStyleChange}
            disabled={disabled}
          >
            <SelectTrigger id="body-style" className={disabled ? "opacity-70" : ""}>
              <SelectValue placeholder="Select body style" />
            </SelectTrigger>
            <SelectContent>
              {BODY_STYLES.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2 flex-1">
          <Label htmlFor="sale-date">Expected Sale Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="sale-date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                  disabled && "opacity-70"
                )}
                disabled={disabled}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefreshSeasonalFactor}
          disabled={!date || !bodyStyle || disabled}
        >
          Calculate Seasonal Factor
        </Button>
        
        {seasonalTip && (
          <div className="text-sm flex items-center p-2 bg-primary/10 rounded text-primary">
            <InfoIcon className="h-4 w-4 mr-2" />
            {seasonalTip}
          </div>
        )}
      </div>
    </div>
  );
}
