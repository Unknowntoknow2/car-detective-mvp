
import React from "react";
import { FormData } from "@/types/premium-valuation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AccidentHistorySectionProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function AccidentHistorySection({ formData, setFormData }: AccidentHistorySectionProps) {
  const handleAccidentHistoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      accidentHistory: value === "yes"
    }));
  };

  const handleAccidentDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      accidentDescription: e.target.value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accident History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-base">Has this vehicle been in any accidents?</Label>
          <RadioGroup
            value={formData.accidentHistory === true ? "yes" : formData.accidentHistory === false ? "no" : ""}
            onValueChange={handleAccidentHistoryChange}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-accident" />
              <Label htmlFor="no-accident">No accidents</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes-accident" />
              <Label htmlFor="yes-accident">Yes, has been in accidents</Label>
            </div>
          </RadioGroup>
        </div>

        {formData.accidentHistory && (
          <div>
            <Label htmlFor="accident-description">Accident Description</Label>
            <Textarea
              id="accident-description"
              value={formData.accidentDescription || ""}
              onChange={handleAccidentDescriptionChange}
              placeholder="Please describe the accident(s) and any repairs made..."
              className="mt-1"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
