
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedDecoder } from '@/hooks/useUnifiedDecoder';
import { Card } from '@/components/ui/card';
import { ManualEntryForm } from '@/components/lookup/ManualEntryForm';
import { Loader2 } from 'lucide-react';

interface FreeValuationFormProps {
  onValuationComplete: () => void;
}

export function FreeValuationForm({ onValuationComplete }: FreeValuationFormProps) {
  const [vin, setVin] = useState('');
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('');
  const { decode, isLoading } = useUnifiedDecoder();
  const [activeTab, setActiveTab] = useState('vin');

  const handleSubmit = async (e: React.FormEvent, type: 'vin' | 'plate' | 'manual') => {
    e.preventDefault();
    
    try {
      const params = type === 'vin' 
        ? { vin } 
        : { licensePlate: plate, state };
      
      const result = await decode(type, params);
      if (result) {
        onValuationComplete();
      }
    } catch (error) {
      console.error('Valuation error:', error);
    }
  };

  const handleManualSubmit = async (data: any) => {
    // Store the manual entry data and proceed
    localStorage.setItem('manual_valuation_data', JSON.stringify(data));
    onValuationComplete();
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="vin" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="vin">VIN</TabsTrigger>
          <TabsTrigger value="plate">License Plate</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        </TabsList>

        <TabsContent value="vin" className="space-y-4">
          <form onSubmit={(e) => handleSubmit(e, 'vin')} className="space-y-4">
            <div>
              <label htmlFor="vin" className="block text-sm font-medium text-gray-700">
                Vehicle Identification Number (VIN)
              </label>
              <Input
                id="vin"
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                placeholder="Enter 17-character VIN"
                className="mt-1"
                maxLength={17}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || vin.length !== 17}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Valuation...
                </>
              ) : (
                'Get Free Valuation'
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="plate" className="space-y-4">
          <form onSubmit={(e) => handleSubmit(e, 'plate')} className="space-y-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="plate" className="block text-sm font-medium text-gray-700">
                  License Plate
                </label>
                <Input
                  id="plate"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  placeholder="Enter license plate"
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <Input
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value.toUpperCase())}
                  placeholder="Enter state (e.g., CA)"
                  className="mt-1"
                  maxLength={2}
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !plate || !state}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Valuation...
                </>
              ) : (
                'Get Free Valuation'
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <ManualEntryForm 
            onSubmit={handleManualSubmit}
            isLoading={isLoading}
            submitButtonText="Get Free Valuation"
            isPremium={false}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
