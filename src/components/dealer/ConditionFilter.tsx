
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export type ConditionFilterOption = 'excellent' | 'good-or-better' | 'manual-only' | 'all';

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
              id="good-or-better" 
              checked={selectedFilter === 'good-or-better'}
              onCheckedChange={() => onFilterChange('good-or-better')}
            />
            <Label htmlFor="good-or-better" className="cursor-pointer">
              AI Verified: Good or Better
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="manual-only" 
              checked={selectedFilter === 'manual-only'}
              onCheckedChange={() => onFilterChange('manual-only')}
            />
            <Label htmlFor="manual-only" className="cursor-pointer">
              Manual Condition Only
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
