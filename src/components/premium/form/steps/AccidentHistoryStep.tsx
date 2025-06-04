import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { FormData } from "@/types/premium-valuation";
import { AlertTriangle } from "lucide-react";

interface AccidentHistoryStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}

export function AccidentHistoryStep({
  step,
  formData,
  setFormData,
  updateValidity,
}: AccidentHistoryStepProps) {
  useEffect(() => {
    // Convert boolean or string to boolean for validation
    const hasAccidentBool = typeof formData.hasAccident === "string"
      ? formData.hasAccident === "yes"
      : !!formData.hasAccident;
<<<<<<< HEAD
      
    const isValid = formData.hasAccident !== undefined;
    updateValidity(step, isValid);
  }, [formData.hasAccident, formData.accidentDescription, step, updateValidity]);
=======
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

    const isValid = !hasAccidentBool ||
      (hasAccidentBool && formData.accidentDescription?.trim() !== "");
    updateValidity(step, isValid);
  }, [
    formData.hasAccident,
    formData.accidentDescription,
    step,
    updateValidity,
  ]);

  const handleAccidentChange = (value: "yes" | "no") => {
    setFormData((prev) => ({
      ...prev,
      hasAccident: value,
<<<<<<< HEAD
      accidentDescription: value === 'no' ? '' : prev.accidentDescription
    }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
=======
      accidentDescription: value === "yes" ? prev.accidentDescription : "",
    }));
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      ...prev,
      accidentDescription: e.target.value,
    }));
  };

  // Convert the hasAccident value to string for RadioGroup
<<<<<<< HEAD
  const hasAccidentStr = typeof formData.hasAccident === 'boolean'
    ? formData.hasAccident ? 'yes' : 'no'
    : formData.hasAccident || 'no';
=======
  const hasAccidentStr = typeof formData.hasAccident === "boolean"
    ? formData.hasAccident ? "yes" : "no"
    : formData.hasAccident || "";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Accident History
        </h2>
        <p className="text-gray-600 mb-6">
<<<<<<< HEAD
          Accident history significantly impacts vehicle value. Clean history vehicles typically retain 15-25% more value.
=======
          Information about previous accidents helps provide a more accurate
          valuation.
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-gray-700 mb-3 block">
            Has this vehicle been in any accidents?
          </Label>
          <RadioGroup
            value={hasAccidentStr}
            onValueChange={(val) => handleAccidentChange(val as "yes" | "no")}
            className="flex space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="accident-no" />
              <Label htmlFor="accident-no">No accidents</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="accident-yes" />
              <Label htmlFor="accident-yes">Yes, has accident history</Label>
            </div>
          </RadioGroup>
        </div>

<<<<<<< HEAD
        {hasAccidentStr === 'yes' && (
          <div className="space-y-3">
=======
        {hasAccidentStr === "yes" && (
          <div className="space-y-3 animate-in fade-in">
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-600 mt-1" />
              <Label htmlFor="accident-description" className="text-gray-700">
                Accident details (required)
              </Label>
            </div>

            <Textarea
<<<<<<< HEAD
              id="accident-description"
              placeholder="Please describe the accident(s), including severity, damage, and repairs..."
              value={formData.accidentDescription || ''}
              onChange={handleDescriptionChange}
=======
              id="acc-details"
              placeholder="When did it occur? What was the severity? What repairs were made?"
              value={formData.accidentDescription || ""}
              onChange={handleDetailsChange}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
              className="min-h-[100px]"
              required
            />

            <p className="text-sm text-gray-500">
<<<<<<< HEAD
              Include information about when the accident occurred, what parts were damaged, and what repairs were made.
            </p>
          </div>
        )}

        {hasAccidentStr === 'no' && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <p className="text-green-800 font-medium">Clean accident history</p>
            </div>
            <p className="text-green-700 text-sm mt-1">
              No accident history helps maintain higher resale value
=======
              Providing accurate details about previous accidents helps us
              determine their impact on the vehicle's value.
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
