import React, { useState, useEffect } from 'react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { vinRegex } from '@/lib/utils';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { ConditionForm } from './ConditionForm';
import { AdditionalDetailsForm } from './AdditionalDetailsForm';
import { LoanDetailsForm } from './LoanDetailsForm';

export interface TabbedFollowUpFormProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
  onSave: () => void;
}

const TabbedFollowUpForm: React.FC<TabbedFollowUpFormProps> = ({
  formData,
  updateFormData,
  onSubmit,
  isLoading,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<string>('vehicle');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSaveProgress = () => {
    onSave();
  };

  return (
    <div className="space-y-6">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">Select a tab</label>
        <select
          id="tabs"
          className="block w-full rounded-md border-gray-200 focus:border-primary focus:ring-primary"
          value={activeTab}
          onChange={(e) => handleTabChange(e.target.value)}
        >
          <option value="vehicle">Vehicle Details</option>
          <option value="condition">Condition Details</option>
          <option value="additional">Additional Details</option>
          <option value="loan">Loan Details</option>
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => handleTabChange('vehicle')}
              className={`${activeTab === 'vehicle'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Vehicle Details
            </button>
            <button
              onClick={() => handleTabChange('condition')}
              className={`${activeTab === 'condition'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Condition Details
            </button>
            <button
              onClick={() => handleTabChange('additional')}
              className={`${activeTab === 'additional'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Additional Details
            </button>
            <button
              onClick={() => handleTabChange('loan')}
              className={`${activeTab === 'loan'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Loan Details
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'vehicle' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="vin">VIN (Vehicle Identification Number)</Label>
            <Input
              type="text"
              id="vin"
              value={formData.vin}
              onChange={(e) => {
                const vinValue = e.target.value.toUpperCase();
                if (vinValue === '' || vinRegex.test(vinValue)) {
                  updateFormData({ vin: vinValue });
                } else {
                  toast.error('Invalid VIN format');
                }
              }}
              placeholder="Enter VIN"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zip_code">Zip Code</Label>
              <Input
                type="text"
                id="zip_code"
                value={formData.zip_code}
                onChange={(e) => updateFormData({ zip_code: e.target.value })}
                placeholder="Enter Zip Code"
              />
            </div>
            <div>
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                type="number"
                id="mileage"
                value={formData.mileage || ''}
                onChange={(e) => updateFormData({ mileage: Number(e.target.value) })}
                placeholder="Enter Mileage"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'condition' && (
        <ConditionForm formData={formData} updateFormData={updateFormData} />
      )}

      {activeTab === 'additional' && (
        <AdditionalDetailsForm formData={formData} updateFormData={updateFormData} />
      )}

      {activeTab === 'loan' && (
        <LoanDetailsForm formData={formData} updateFormData={updateFormData} />
      )}

      <div className="flex justify-between items-center pt-6 border-t">
        <button
          type="button"
          onClick={handleSaveProgress}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Save Progress
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            type="button"
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Next
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || !formData.is_complete}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Submitting...' : 'Submit Valuation'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabbedFollowUpForm;
