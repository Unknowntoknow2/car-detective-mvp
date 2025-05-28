
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface TitleStatusSectionProps {
  titleStatus: 'clean' | 'salvage' | 'rebuilt' | 'branded' | 'lemon';
  setTitleStatus: (value: 'clean' | 'salvage' | 'rebuilt' | 'branded' | 'lemon') => void;
  previousOwners: number;
  setPreviousOwners: (value: number) => void;
  previousUse: 'personal' | 'commercial' | 'rental' | 'emergency';
  setPreviousUse: (value: 'personal' | 'commercial' | 'rental' | 'emergency') => void;
}

export function TitleStatusSection({
  titleStatus,
  setTitleStatus,
  previousOwners,
  setPreviousOwners,
  previousUse,
  setPreviousUse
}: TitleStatusSectionProps) {
  return (
    <div className="space-y-4 border-t pt-6">
      <h3 className="text-lg font-semibold">Title & Ownership</h3>
      
      <div>
        <Label htmlFor="title-status">Title Status</Label>
        <Select value={titleStatus} onValueChange={setTitleStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Select title status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="clean">Clean (Full market value)</SelectItem>
            <SelectItem value="salvage">Salvage (-40% to -60% value)</SelectItem>
            <SelectItem value="rebuilt">Rebuilt (-20% to -40% value)</SelectItem>
            <SelectItem value="branded">Branded (-15% to -30% value)</SelectItem>
            <SelectItem value="lemon">Lemon Law (-30% to -50% value)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="previous-owners">Number of Previous Owners</Label>
        <Input
          id="previous-owners"
          type="number"
          min="1"
          max="10"
          value={previousOwners}
          onChange={(e) => setPreviousOwners(parseInt(e.target.value) || 1)}
        />
      </div>

      <div>
        <Label htmlFor="previous-use">Previous Use</Label>
        <Select value={previousUse} onValueChange={setPreviousUse}>
          <SelectTrigger>
            <SelectValue placeholder="Select previous use" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal">Personal (Full market value)</SelectItem>
            <SelectItem value="commercial">Commercial / Fleet (-5% to -15% value)</SelectItem>
            <SelectItem value="rental">Rental / Ride-share (-10% to -20% value)</SelectItem>
            <SelectItem value="emergency">Police or Emergency (-15% to -25% value)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
