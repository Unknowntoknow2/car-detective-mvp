
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FormValidationError } from '@/components/premium/common/FormValidationError';
import { AccidentToggle } from '@/components/premium/form/steps/vehicle-details/AccidentToggle';
import { Shield } from 'lucide-react';

interface AccidentSectionProps {
  hasAccident: string;
  setHasAccident: (value: string) => void;
  accidentDescription: string;
  setAccidentDescription: (description: string) => void;
  isDisabled?: boolean;
  error?: string;
}

export function AccidentSection({
  hasAccident,
  setHasAccident,
  accidentDescription,
  setAccidentDescription,
  isDisabled = false,
  error
}: AccidentSectionProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-base font-medium text-slate-700">Accident History</h4>
      <p className="text-sm text-slate-500 mb-3">
        Vehicles without accident history typically maintain 15-20% higher resale value
      </p>
      
      <AccidentToggle 
        hasAccident={hasAccident} 
        onToggle={setHasAccident} 
      />
      
      {hasAccident === 'yes' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-4 space-y-2"
        >
          <Label htmlFor="accidentDescription" className="text-sm font-medium text-slate-700">
            Accident Details <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="accidentDescription"
            placeholder="Please describe the accident(s), including severity, when it happened, and what parts of the vehicle were affected."
            value={accidentDescription}
            onChange={(e) => setAccidentDescription(e.target.value)}
            className={error ? "border-red-300 focus:ring-red-200" : ""}
            rows={3}
            disabled={isDisabled}
          />
          {error && <FormValidationError error={error} />}
        </motion.div>
      )}
    </div>
  );
}
