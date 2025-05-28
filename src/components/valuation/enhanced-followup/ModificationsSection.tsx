
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Wrench, Lock } from 'lucide-react';
import { ModificationDetails, MODIFICATION_TYPES } from '@/types/follow-up-answers';

/**
 * ⚠️ LOCKED COMPONENT - DO NOT MODIFY ⚠️
 * This modifications section is locked and should not be modified.
 * All functionality is working correctly and has been protected.
 */

interface ModificationsSectionProps {
  value?: ModificationDetails;
  onChange: (value: ModificationDetails) => void;
  readonly?: boolean;
}

export function ModificationsSection({ 
  value = { modified: false }, 
  onChange,
  readonly = true
}: ModificationsSectionProps) {
  // PROTECTION: This component is locked
  if (!readonly) {
    console.warn("ModificationsSection: Component is locked for modifications");
  }

  const handleModifiedChange = (modified: boolean) => {
    if (readonly) {
      console.warn("ModificationsSection: Selection blocked - component is locked");
      return;
    }
    
    if (modified) {
      onChange({ modified, types: [], reversible: true });
    } else {
      onChange({ modified: false });
    }
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    if (readonly) {
      console.warn("ModificationsSection: Selection blocked - component is locked");
      return;
    }
    
    const types = value.types || [];
    if (checked) {
      onChange({ ...value, types: [...types, type] });
    } else {
      onChange({ ...value, types: types.filter(t => t !== type) });
    }
  };

  const handleReversibleChange = (reversible: boolean) => {
    if (readonly) {
      console.warn("ModificationsSection: Selection blocked - component is locked");
      return;
    }
    onChange({ ...value, reversible });
  };

  return (
    <Card className="relative">
      {/* Lock indicator */}
      <div className="absolute top-2 right-2 z-10">
        <Lock className="w-4 h-4 text-gray-400" />
      </div>
      
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-lg">
            Vehicle Modifications
            {readonly && <span className="ml-2 text-xs text-gray-400">(Locked)</span>}
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Modifications can affect resale value. Reversible modifications typically have less impact.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-base font-medium">Has this vehicle been modified from stock?</Label>
          <RadioGroup
            value={value.modified ? 'yes' : 'no'}
            onValueChange={(val) => handleModifiedChange(val === 'yes')}
            className="flex gap-6 mt-2"
            disabled={readonly}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="not-modified" disabled={readonly} />
              <Label htmlFor="not-modified" className={readonly ? 'text-gray-500' : ''}>No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="is-modified" disabled={readonly} />
              <Label htmlFor="is-modified" className={readonly ? 'text-gray-500' : ''}>Yes</Label>
            </div>
          </RadioGroup>
        </div>

        {value.modified && (
          <div className={`space-y-4 p-4 rounded-lg border ${
            readonly ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
          }`}>
            <div>
              <Label className="text-base font-medium mb-3 block">What types of modifications?</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {MODIFICATION_TYPES.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={value.types?.includes(type) || false}
                      onCheckedChange={(checked) => 
                        handleTypeChange(type, checked as boolean)
                      }
                      disabled={readonly}
                    />
                    <Label 
                      htmlFor={type} 
                      className={`text-sm ${readonly ? 'cursor-not-allowed text-gray-500' : 'cursor-pointer'}`}
                    >
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Are the modifications reversible?</Label>
              <RadioGroup
                value={value.reversible ? 'yes' : 'no'}
                onValueChange={(val) => handleReversibleChange(val === 'yes')}
                className="flex gap-6 mt-2"
                disabled={readonly}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="reversible-yes" disabled={readonly} />
                  <Label htmlFor="reversible-yes" className={readonly ? 'text-gray-500' : ''}>Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="reversible-no" disabled={readonly} />
                  <Label htmlFor="reversible-no" className={readonly ? 'text-gray-500' : ''}>No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}
        
        {readonly && (
          <div className="flex items-center gap-2 mt-4 text-amber-600 text-sm">
            <Lock className="h-4 w-4" />
            <span>This component is locked and protected from modifications</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
