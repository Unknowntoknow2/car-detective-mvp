
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { VinLookup } from './VinLookup';
import { PlateLookup } from './PlateLookup';
import { ManualLookup } from './ManualLookup';
import { CarFront, Search, FileText } from 'lucide-react';

interface LookupTabsProps {
  lookup: 'vin' | 'plate' | 'manual';
  onLookupChange: (value: 'vin' | 'plate' | 'manual') => void;
  formProps: any; // Pass through all form-related props
}

export function LookupTabs({ lookup, onLookupChange, formProps }: LookupTabsProps) {
  return (
    <Tabs value={lookup} onValueChange={onLookupChange}>
      <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-background border rounded-lg">
        <TabsTrigger 
          value="vin" 
          className="py-4 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-2"
        >
          <CarFront className="h-5 w-5" />
          <span>VIN Lookup</span>
        </TabsTrigger>
        <TabsTrigger 
          value="plate"
          className="py-4 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-2"
        >
          <Search className="h-5 w-5" />
          <span>Plate Lookup</span>
        </TabsTrigger>
        <TabsTrigger 
          value="manual"
          className="py-4 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-2"
        >
          <FileText className="h-5 w-5" />
          <span>Manual Entry</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="vin" className="pt-6">
        <VinLookup {...formProps} />
      </TabsContent>

      <TabsContent value="plate" className="pt-6">
        <PlateLookup {...formProps} />
      </TabsContent>

      <TabsContent value="manual" className="pt-6">
        <ManualLookup {...formProps} />
      </TabsContent>
    </Tabs>
  );
}
