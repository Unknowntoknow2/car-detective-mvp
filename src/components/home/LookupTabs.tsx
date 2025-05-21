
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import VinDecoderForm from "@/components/lookup/VinDecoderForm"; // Fixed import
import PlateDecoderForm from "@/components/lookup/PlateDecoderForm";
import { manualEntryToJson } from "@/utils/formatters";
import ManualEntryForm from "@/components/lookup/ManualEntryForm";
import { useNavigate } from "react-router-dom";
import { ManualEntryFormData } from "@/components/lookup/types/manualEntry";
import { ManualLookup } from '@/components/lookup/ManualLookup';
import { PlateLookup } from '@/components/lookup/PlateLookup';
// Remove PhotoUpload import as it doesn't exist yet

interface LookupTabsProps {
  defaultTab?: string;
  onSubmit?: (type: string, value: string, state?: string) => void;
}

export function LookupTabs({ 
  defaultTab = "vin",
  onSubmit
}: LookupTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const navigate = useNavigate();
  
  const handleTabChange = (value: string) => {
    console.log(`LOOKUP TABS: Tab changed to ${value}`);
    setActiveTab(value);
  };

  const handleVinSubmit = (vin: string) => {
    console.log(`LOOKUP TABS VIN: Form submitted with VIN: ${vin}`);
    if (onSubmit) {
      onSubmit("vin", vin);
    } else {
      navigate(`/result?vin=${vin}`);
    }
  };

  const handlePlateSubmit = (plate: string, state: string) => {
    console.log(`LOOKUP TABS PLATE: Form submitted with plate: ${plate} and state: ${state}`);
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
      localStorage.setItem('manual_entry_data', jsonData);
      navigate(`/result?manual=true`);
    }
  };

  return (
    <Tabs defaultValue={defaultTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="vin">VIN</TabsTrigger>
        <TabsTrigger value="plate">License Plate</TabsTrigger>
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
      </TabsList>
      
      <TabsContent value="vin" className="space-y-4 mt-4">
        <VinDecoderForm onSubmit={handleVinSubmit} />
      </TabsContent>
      
      <TabsContent value="plate" className="space-y-4 mt-4">
        <PlateDecoderForm onSubmit={handlePlateSubmit} />
      </TabsContent>
      
      <TabsContent value="manual" className="space-y-4 mt-4">
        <ManualEntryForm onSubmit={handleManualSubmit} />
      </TabsContent>
    </Tabs>
  );
}
