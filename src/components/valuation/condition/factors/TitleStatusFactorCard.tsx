
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TitleStatusFactorCardProps {
  value: string;
  onChange: (value: string) => void;
}

export function TitleStatusFactorCard({ value, onChange }: TitleStatusFactorCardProps) {
  const getTitleStatusInfo = (status: string) => {
    switch (status) {
      case 'Clean':
        return {
          description: 'Vehicle has no title issues, accidents, or major damage',
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          impact: 'No negative impact on value'
        };
      case 'Rebuilt':
        return {
          description: 'Vehicle was previously damaged and has been rebuilt',
          icon: <AlertCircle className="h-4 w-4 text-amber-500" />,
          impact: 'Reduces value by approximately 20-30%'
        };
      case 'Salvage':
        return {
          description: 'Vehicle was declared a total loss by insurance',
          icon: <AlertCircle className="h-4 w-4 text-red-500" />,
          impact: 'Reduces value by approximately 50% or more'
        };
      case 'Lemon':
        return {
          description: 'Vehicle had significant defects and was bought back by manufacturer',
          icon: <AlertCircle className="h-4 w-4 text-red-500" />,
          impact: 'Reduces value by approximately 25-40%'
        };
      case 'Flood':
        return {
          description: 'Vehicle sustained water damage from flooding',
          icon: <AlertCircle className="h-4 w-4 text-red-500" />,
          impact: 'Reduces value by approximately 40-60%'
        };
      default:
        return {
          description: 'No specific title status information available',
          icon: <Info className="h-4 w-4 text-gray-500" />,
          impact: 'Impact unknown'
        };
    }
  };

  const statusInfo = getTitleStatusInfo(value);

  return (
    <div className="rounded-2xl shadow p-4 bg-white">
      <h3 className="text-xl font-semibold mb-4">Title Status</h3>
      
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select title status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Clean">Clean Title</SelectItem>
          <SelectItem value="Rebuilt">Rebuilt/Reconstructed</SelectItem>
          <SelectItem value="Salvage">Salvage Title</SelectItem>
          <SelectItem value="Lemon">Lemon Law/Manufacturer Buyback</SelectItem>
          <SelectItem value="Flood">Flood/Water Damage</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="mt-4 bg-muted/40 p-3 rounded-md">
        <div className="flex items-center gap-2 mb-2">
          {statusInfo.icon}
          <span className="font-medium">{value} Title</span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-2">{statusInfo.description}</p>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="text-sm flex items-center text-muted-foreground underline underline-offset-2">
              <Info className="h-3.5 w-3.5 mr-1" />
              Value Impact
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">{statusInfo.impact}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
