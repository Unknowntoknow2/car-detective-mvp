
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ENABLE_PLATE_LOOKUP, ENABLE_PHOTO_UPLOAD } from '@/lib/constants';
import { Car, License, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useValuationContext } from '@/hooks/useValuationContext';

interface LookupTabsProps {
  defaultTab?: string;
}

export function LookupTabs({ defaultTab = 'vin' }: LookupTabsProps) {
  const navigate = useNavigate();
  const { 
    vinValue, setVinValue,
    plateValue, setPlateValue,
    stateValue, setStateValue,
    setLookupMethod
  } = useValuationContext();
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleVinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vinValue.trim()) {
      toast.error('Please enter a valid VIN');
      return;
    }
    
    setIsLoading(true);
    setLookupMethod('vin');
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      navigate('/valuation', { state: { lookupMethod: 'vin', value: vinValue } });
    }, 500);
  };
  
  const handlePlateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateValue.trim()) {
      toast.error('Please enter a license plate number');
      return;
    }
    
    if (!stateValue) {
      toast.error('Please select a state');
      return;
    }
    
    setIsLoading(true);
    setLookupMethod('plate');
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      navigate('/valuation', { state: { lookupMethod: 'plate', value: plateValue, state: stateValue } });
    }, 500);
  };
  
  const handleManualSubmit = () => {
    setLookupMethod('manual');
    navigate('/valuation', { state: { lookupMethod: 'manual' } });
  };
  
  const handlePhotoSubmit = () => {
    toast.info('Photo upload feature coming soon!');
  };
  
  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
        <TabsTrigger value="vin" className="flex items-center gap-2">
          <Car className="h-4 w-4" />
          <span>VIN</span>
        </TabsTrigger>
        
        {ENABLE_PLATE_LOOKUP && (
          <TabsTrigger value="plate" className="flex items-center gap-2">
            <License className="h-4 w-4" />
            <span>License Plate</span>
          </TabsTrigger>
        )}
        
        <TabsTrigger value="manual" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Manual Entry</span>
        </TabsTrigger>
        
        {ENABLE_PHOTO_UPLOAD && (
          <TabsTrigger value="photo" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span>Photo</span>
          </TabsTrigger>
        )}
      </TabsList>
      
      <Card>
        <CardContent className="pt-6">
          <TabsContent value="vin">
            <form onSubmit={handleVinSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
                  <Input
                    id="vin"
                    placeholder="Enter 17-character VIN"
                    value={vinValue}
                    onChange={(e) => setVinValue(e.target.value)}
                    maxLength={17}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Find your VIN on your vehicle registration, insurance card, or driver's side dashboard.
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Processing...' : 'Get Valuation'}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="plate">
            <form onSubmit={handlePlateSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="plate">License Plate</Label>
                    <Input
                      id="plate"
                      placeholder="Enter license plate"
                      value={plateValue}
                      onChange={(e) => setPlateValue(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Select value={stateValue} onValueChange={setStateValue}>
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        <SelectItem value="IL">Illinois</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Processing...' : 'Get Valuation'}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="manual">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Manually enter your vehicle details if you don't have your VIN or license plate handy.
              </p>
              <Button onClick={handleManualSubmit} className="w-full">
                Manual Entry Form
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="photo">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upload a photo of your vehicle for AI-assisted valuation.
              </p>
              <Button onClick={handlePhotoSubmit} className="w-full">
                Upload Vehicle Photo
              </Button>
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}

export default LookupTabs;
