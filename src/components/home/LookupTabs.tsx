<<<<<<< HEAD

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
=======
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { VinDecoderForm } from "@/components/lookup/VinDecoderForm";
import PlateDecoderForm from "@/components/lookup/PlateDecoderForm";
import { manualEntryToJson } from "@/utils/formatters";
import ManualEntryForm from "@/components/lookup/manual/ManualEntryForm";
import { useNavigate } from "react-router-dom";
import { ManualEntryFormData } from "@/components/lookup/types/manualEntry";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface LookupTabsProps {
  defaultTab?: string;
}

<<<<<<< HEAD
export function LookupTabs({ defaultTab = "vin" }: LookupTabsProps) {
  const navigate = useNavigate();
  const [vin, setVin] = useState('');
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('CA');
=======
export function LookupTabs({
  defaultTab = "vin",
  onSubmit,
}: LookupTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    console.log(`LOOKUP TABS: Tab changed to ${value}`);
    setActiveTab(value);
  };
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

  const handleVinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vin.trim().length === 17) {
      navigate(`/valuation/${vin.trim().toUpperCase()}`);
    }
  };

<<<<<<< HEAD
  const handlePlateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (plate.trim() && state) {
      navigate(`/valuation/plate/${plate.trim().toUpperCase()}/${state}`);
    }
  };

  const handleManualEntry = () => {
    navigate('/valuation/manual');
  };

  return (
    <Tabs defaultValue={defaultTab} className="w-full max-w-md mx-auto">
=======
  const handlePlateSubmit = (plate: string, state: string) => {
    console.log(
      `LOOKUP TABS PLATE: Form submitted with plate: ${plate} and state: ${state}`,
    );
    if (onSubmit) {
      onSubmit("plate", plate, state);
    } else {
      navigate(`/result?plate=${plate}&state=${state}`);
    }
  };

  const handleManualSubmit = (data: ManualEntryFormData) => {
    console.log(`LOOKUP TABS MANUAL: Form submitted with data:`, data);

    // Convert the form data to a JSON string
    const jsonData = JSON.stringify(data); // Using JSON.stringify directly
    console.log(`LOOKUP TABS MANUAL: Converted to JSON:`, jsonData);

    if (onSubmit) {
      onSubmit("manual", jsonData);
    } else {
      // Store data in localStorage for the result page
      localStorage.setItem("manual_entry_data", jsonData);
      navigate(`/result?manual=true`);
    }
  };

  return (
    <Tabs
      defaultValue={defaultTab}
      onValueChange={handleTabChange}
      className="w-full"
    >
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="vin">VIN</TabsTrigger>
        <TabsTrigger value="plate">Plate</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>
<<<<<<< HEAD
      
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
=======

      <TabsContent value="vin" className="space-y-4 mt-4">
        <VinDecoderForm onSubmit={handleVinSubmit} />
      </TabsContent>

      <TabsContent value="plate" className="space-y-4 mt-4">
        <PlateDecoderForm onSubmit={handlePlateSubmit} />
      </TabsContent>

      <TabsContent value="manual" className="space-y-4 mt-4">
        <ManualEntryForm onSubmit={handleManualSubmit} />
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      </TabsContent>
    </Tabs>
  );
}
