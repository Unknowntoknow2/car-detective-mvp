
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface AccidentHistorySectionProps {
  hasAccident: boolean | null;
  setHasAccident: (value: boolean | null) => void;
  accidentSeverity: 'minor' | 'moderate' | 'severe';
  setAccidentSeverity: (value: 'minor' | 'moderate' | 'severe') => void;
  accidentRepaired: boolean;
  setAccidentRepaired: (value: boolean) => void;
  accidentDescription: string;
  setAccidentDescription: (value: string) => void;
}

export function AccidentHistorySection({
  hasAccident,
  setHasAccident,
  accidentSeverity,
  setAccidentSeverity,
  accidentRepaired,
  setAccidentRepaired,
  accidentDescription,
  setAccidentDescription
}: AccidentHistorySectionProps) {
  return (
    <div className="space-y-4 border-t pt-6">
      <h3 className="text-lg font-semibold">Accident History</h3>
      
      <div>
        <Label>Has this vehicle been in any accidents?</Label>
        <div className="flex gap-4 mt-2">
          <button
            type="button"
            onClick={() => setHasAccident(false)}
            className={`px-4 py-2 rounded-md border ${
              hasAccident === false 
                ? 'bg-green-100 border-green-300 text-green-800' 
                : 'bg-gray-50 border-gray-300'
            }`}
          >
            No
          </button>
          <button
            type="button"
            onClick={() => setHasAccident(true)}
            className={`px-4 py-2 rounded-md border ${
              hasAccident === true 
                ? 'bg-red-100 border-red-300 text-red-800' 
                : 'bg-gray-50 border-gray-300'
            }`}
          >
            Yes
          </button>
        </div>
      </div>

      {hasAccident && (
        <>
          <div>
            <Label htmlFor="accident-severity">Accident Severity</Label>
            <Select value={accidentSeverity} onValueChange={setAccidentSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minor">Minor (cosmetic damage)</SelectItem>
                <SelectItem value="moderate">Moderate (structural damage)</SelectItem>
                <SelectItem value="severe">Severe (major structural damage)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Was the damage properly repaired?</Label>
            <div className="flex gap-4 mt-2">
              <button
                type="button"
                onClick={() => setAccidentRepaired(true)}
                className={`px-4 py-2 rounded-md border ${
                  accidentRepaired 
                    ? 'bg-green-100 border-green-300 text-green-800' 
                    : 'bg-gray-50 border-gray-300'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setAccidentRepaired(false)}
                className={`px-4 py-2 rounded-md border ${
                  !accidentRepaired 
                    ? 'bg-red-100 border-red-300 text-red-800' 
                    : 'bg-gray-50 border-gray-300'
                }`}
              >
                No
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="accident-description">Additional Details (Optional)</Label>
            <Textarea
              id="accident-description"
              value={accidentDescription}
              onChange={(e) => setAccidentDescription(e.target.value)}
              placeholder="Describe the accident and repairs if relevant"
              rows={3}
            />
          </div>
        </>
      )}
    </div>
  );
}
