
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { VinInput } from './VinInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { ManualLookup } from './ManualLookup';
import { Label } from '@/components/ui/label';
import { states } from './shared/states-data';
import { Loader2 } from 'lucide-react';

interface FormProps {
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading: boolean;
  submitButtonText?: string;
  onVinLookup?: (vin: string) => void;
  onPlateLookup?: (plate: string, state: string) => void;
}

interface LookupTabsProps {
  lookup: 'vin' | 'plate' | 'manual';
  onLookupChange: (value: 'vin' | 'plate' | 'manual') => void;
  formProps: FormProps;
}

export function LookupTabs({ lookup, onLookupChange, formProps }: LookupTabsProps) {
  const [vin, setVin] = React.useState('');
  const [plate, setPlate] = React.useState('');
  const [state, setState] = React.useState('');
  
  const handleVinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vin.length !== 17) return;
    formProps.onVinLookup?.(vin);
  };
  
  const handlePlateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate || !state) return;
    formProps.onPlateLookup?.(plate, state);
  };
  
  return (
    <Tabs 
      value={lookup} 
      onValueChange={(value) => onLookupChange(value as 'vin' | 'plate' | 'manual')}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="vin">VIN Lookup</TabsTrigger>
        <TabsTrigger value="plate">Plate Lookup</TabsTrigger>
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
      </TabsList>
      
      <TabsContent value="vin">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleVinSubmit} className="space-y-4">
              <VinInput 
                value={vin}
                onChange={setVin}
                placeholder="Enter 17-character VIN"
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={vin.length !== 17 || formProps.isLoading}
              >
                {formProps.isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Looking up VIN...
                  </>
                ) : (
                  'Look Up VIN'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="plate">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handlePlateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plate">License Plate</Label>
                  <Input 
                    id="plate"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value.toUpperCase())}
                    placeholder="Enter plate number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select value={state} onValueChange={setState}>
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={!plate || !state || formProps.isLoading}
              >
                {formProps.isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Looking up plate...
                  </>
                ) : (
                  'Look Up Plate'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="manual">
        <Card>
          <CardContent className="pt-6">
            <ManualLookup 
              onSubmit={formProps.onSubmit}
              isLoading={formProps.isLoading}
              submitButtonText={formProps.submitButtonText}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
