
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FollowUpAnswers } from "@/types/follow-up-answers";
import { toast } from "sonner";

interface UnifiedFollowUpFormProps {
  vin: string;
  initialData?: Partial<FollowUpAnswers>;
  onSubmit: (data: FollowUpAnswers) => void;
  onSave?: (data: FollowUpAnswers) => void;
}

export function UnifiedFollowUpForm({
  vin,
  initialData = {},
  onSubmit,
  onSave
}: UnifiedFollowUpFormProps) {
  const [formData, setFormData] = useState<FollowUpAnswers>({
    vin,
    zip_code: initialData.zip_code || "",
    mileage: initialData.mileage || 0,
    condition: initialData.condition || "good",
    accidents: initialData.accidents || false,
    maintenance_records: initialData.maintenance_records || false,
    modifications: initialData.modifications || "",
    additional_notes: initialData.additional_notes || "",
    ...initialData
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      toast.success("Follow-up completed successfully!");
    } catch (error) {
      toast.error("Failed to submit follow-up");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    if (onSave) {
      try {
        await onSave(formData);
        toast.success("Progress saved");
      } catch (error) {
        toast.error("Failed to save progress");
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Vehicle Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zip_code">ZIP Code</Label>
              <Input
                id="zip_code"
                value={formData.zip_code}
                onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
                placeholder="Enter ZIP code"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Current Mileage</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData(prev => ({ ...prev, mileage: Number(e.target.value) }))}
                placeholder="Current mileage"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="modifications">Modifications (if any)</Label>
            <Input
              id="modifications"
              value={formData.modifications}
              onChange={(e) => setFormData(prev => ({ ...prev, modifications: e.target.value }))}
              placeholder="List any modifications"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additional_notes">Additional Notes</Label>
            <Textarea
              id="additional_notes"
              value={formData.additional_notes}
              onChange={(e) => setFormData(prev => ({ ...prev, additional_notes: e.target.value }))}
              placeholder="Any additional information about the vehicle"
              rows={3}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {onSave && (
              <Button
                type="button"
                variant="outline"
                onClick={handleSave}
                className="flex-1"
              >
                Save Progress
              </Button>
            )}
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Submitting..." : "Complete Valuation"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
