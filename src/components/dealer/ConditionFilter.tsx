
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// Make sure this exactly matches the type in useDealerValuations.ts
export type ConditionFilterOption = 'excellent' | 'good' | 'fair' | 'poor' | 'all';

interface ConditionFilterProps {
  selectedFilter: ConditionFilterOption;
  onFilterChange: (filter: ConditionFilterOption) => void;
}

export function ConditionFilter({ selectedFilter, onFilterChange }: ConditionFilterProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-medium mb-3">Filter by Condition</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="excellent" 
              checked={selectedFilter === 'excellent'}
              onCheckedChange={() => onFilterChange('excellent')}
            />
            <Label htmlFor="excellent" className="cursor-pointer">
              AI Verified: Excellent
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="good" 
              checked={selectedFilter === 'good'}
              onCheckedChange={() => onFilterChange('good')}
            />
            <Label htmlFor="good" className="cursor-pointer">
              AI Verified: Good
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="fair" 
              checked={selectedFilter === 'fair'}
              onCheckedChange={() => onFilterChange('fair')}
            />
            <Label htmlFor="fair" className="cursor-pointer">
              AI Verified: Fair
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="poor" 
              checked={selectedFilter === 'poor'}
              onCheckedChange={() => onFilterChange('poor')}
            />
            <Label htmlFor="poor" className="cursor-pointer">
              AI Verified: Poor
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="all" 
              checked={selectedFilter === 'all'}
              onCheckedChange={() => onFilterChange('all')}
            />
            <Label htmlFor="all" className="cursor-pointer">
              Show All
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
