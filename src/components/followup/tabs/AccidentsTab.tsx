import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface AccidentsTabProps {
  formData: any;
  updateFormData: (updates: any) => void;
}

export function AccidentsTab({ formData, updateFormData }: AccidentsTabProps) {
  const handleAccidentCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    updateFormData({ accidents: isNaN(value) ? 0 : value });
  };

  const handleFrameDamageChange = (checked: boolean) => {
    updateFormData({ frame_damage: checked });
  };

  const handleFloodDamageChange = (checked: boolean) => {
    updateFormData({ flood_damage: checked });
  };

  const handleAccidentDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({ accident_details: e.target.value });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Accident History</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="accidentCount">Number of Accidents</Label>
            <Input
              type="number"
              id="accidentCount"
              value={formData.accidents || ''}
              onChange={handleAccidentCountChange}
              placeholder="Enter number of accidents"
            />
          </div>

          <div>
            <Label htmlFor="frameDamage">Frame Damage</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="checkbox"
                id="frameDamage"
                checked={formData.frame_damage || false}
                onChange={(e) => handleFrameDamageChange(e.target.checked)}
              />
              <Label htmlFor="frameDamage">Check if frame damage exists</Label>
            </div>
          </div>

          <div>
            <Label htmlFor="floodDamage">Flood Damage</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="checkbox"
                id="floodDamage"
                checked={formData.flood_damage || false}
                onChange={(e) => handleFloodDamageChange(e.target.checked)}
              />
              <Label htmlFor="floodDamage">Check if flood damage exists</Label>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="accidentDetails">Accident Details</Label>
          <Textarea
            id="accidentDetails"
            placeholder="Describe any accidents or damage"
            value={formData.accident_details || ''}
            onChange={handleAccidentDetailsChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
