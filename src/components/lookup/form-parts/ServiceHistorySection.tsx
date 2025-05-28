
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ServiceHistorySectionProps {
  serviceHistory: 'dealer' | 'independent' | 'owner' | 'unknown';
  setServiceHistory: (value: 'dealer' | 'independent' | 'owner' | 'unknown') => void;
  hasRegularMaintenance: boolean | null;
  setHasRegularMaintenance: (value: boolean | null) => void;
  maintenanceNotes: string;
  setMaintenanceNotes: (value: string) => void;
}

export function ServiceHistorySection({
  serviceHistory,
  setServiceHistory,
  hasRegularMaintenance,
  setHasRegularMaintenance,
  maintenanceNotes,
  setMaintenanceNotes
}: ServiceHistorySectionProps) {
  return (
    <div className="space-y-4 border-t pt-6">
      <h3 className="text-lg font-semibold">Service History</h3>
      
      <div>
        <Label htmlFor="service-history">Where has the vehicle been serviced?</Label>
        <Select value={serviceHistory} onValueChange={setServiceHistory}>
          <SelectTrigger>
            <SelectValue placeholder="Select service history" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dealer">Dealer-maintained (+5% to +10% value)</SelectItem>
            <SelectItem value="independent">Independent mechanic (+2% to +5% value)</SelectItem>
            <SelectItem value="owner">Owner-maintained (Neutral impact)</SelectItem>
            <SelectItem value="unknown">No known history (-5% to -10% value)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Has the vehicle received regular maintenance?</Label>
        <div className="flex gap-4 mt-2">
          <button
            type="button"
            onClick={() => setHasRegularMaintenance(true)}
            className={`px-4 py-2 rounded-md border ${
              hasRegularMaintenance === true 
                ? 'bg-green-100 border-green-300 text-green-800' 
                : 'bg-gray-50 border-gray-300'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setHasRegularMaintenance(false)}
            className={`px-4 py-2 rounded-md border ${
              hasRegularMaintenance === false 
                ? 'bg-red-100 border-red-300 text-red-800' 
                : 'bg-gray-50 border-gray-300'
            }`}
          >
            No
          </button>
          <button
            type="button"
            onClick={() => setHasRegularMaintenance(null)}
            className={`px-4 py-2 rounded-md border ${
              hasRegularMaintenance === null 
                ? 'bg-gray-100 border-gray-400 text-gray-800' 
                : 'bg-gray-50 border-gray-300'
            }`}
          >
            Unknown
          </button>
        </div>
      </div>

      <div>
        <Label htmlFor="maintenance-notes">Maintenance Notes (Optional)</Label>
        <Textarea
          id="maintenance-notes"
          value={maintenanceNotes}
          onChange={(e) => setMaintenanceNotes(e.target.value)}
          placeholder="Any specific maintenance details or recent services"
          rows={3}
        />
      </div>
    </div>
  );
}
