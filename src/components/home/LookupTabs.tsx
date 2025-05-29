
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, FileText, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usStates } from '@/data/states';

export function LookupTabs() {
  const navigate = useNavigate();
  const [vin, setVin] = useState('');
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('CA');

  const handleVinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vin.trim().length === 17) {
      navigate(`/valuation/${vin.trim().toUpperCase()}`);
    }
  };

  const handlePlateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (plate.trim() && state) {
      navigate('/valuation/plate');
    }
  };

  const handleManualEntry = () => {
    navigate('/premium');
  };

  return (
    <Tabs defaultValue="vin" className="w-full max-w-md mx-auto">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="vin">VIN</TabsTrigger>
        <TabsTrigger value="plate">Plate</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>
      
      <TabsContent value="vin">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              VIN Lookup
            </CardTitle>
            <CardDescription>
              Enter your 17-character VIN for instant vehicle details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVinSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vin">Vehicle Identification Number</Label>
                <Input
                  id="vin"
                  value={vin}
                  onChange={(e) => setVin(e.target.value.toUpperCase())}
                  placeholder="1HGBH41JXMN109186"
                  maxLength={17}
                  className="font-mono"
                />
              </div>
              <Button type="submit" className="w-full" disabled={vin.length !== 17}>
                Get Vehicle Details
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="plate">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              License Plate
            </CardTitle>
            <CardDescription>
              Find vehicle information using license plate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePlateSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plate">License Plate Number</Label>
                <Input
                  id="plate"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {usStates.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={!plate || !state}>
                Lookup Vehicle
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="manual">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Manual Entry
            </CardTitle>
            <CardDescription>
              Enter vehicle details manually for valuation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleManualEntry} className="w-full">
              Start Manual Entry
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
