
import React, { useState, useEffect, useCallback } from 'react';
import TabbedFollowUpForm from './TabbedFollowUpForm';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { debounce } from 'lodash';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface UnifiedFollowUpFormProps {
  vin: string;
  initialData?: Partial<FollowUpAnswers>;
  onSubmit: (values: FollowUpAnswers) => Promise<void>;
  onSave?: (values: FollowUpAnswers) => Promise<void>;
}

export function UnifiedFollowUpForm({ vin, initialData, onSubmit, onSave }: UnifiedFollowUpFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FollowUpAnswers>({
    vin: vin,
    zip_code: initialData?.zip_code || '',
    mileage: initialData?.mileage,
    condition: initialData?.condition || 'good',
    transmission: initialData?.transmission || 'automatic',
    previous_owners: initialData?.previous_owners,
    previous_use: initialData?.previous_use || 'personal',
    title_status: initialData?.title_status || 'clean',
    dashboard_lights: initialData?.dashboard_lights || [],
    tire_condition: initialData?.tire_condition || 'good',
    exterior_condition: initialData?.exterior_condition || 'good',
    interior_condition: initialData?.interior_condition || 'good',
    smoking: initialData?.smoking || false,
    petDamage: initialData?.petDamage || false,
    rust: initialData?.rust || false,
    hailDamage: initialData?.hailDamage || false,
    frame_damage: initialData?.frame_damage || false,
    accident_history: initialData?.accident_history || {
      hadAccident: false,
      count: 0,
      location: '',
      severity: 'minor',
      repaired: false,
      frameDamage: false,
      description: ''
    },
    accidents: initialData?.accidents,
    modifications: initialData?.modifications || {
      hasModifications: false,
      modified: false,
      types: []
    },
    serviceHistory: initialData?.serviceHistory || {
      hasRecords: false,
      lastService: '',
      frequency: undefined,
      dealerMaintained: false,
      description: ''
    },
    service_history: initialData?.service_history,
    loan_balance: initialData?.loan_balance,
    has_active_loan: initialData?.has_active_loan || false,
    payoffAmount: initialData?.payoffAmount,
    features: initialData?.features || [],
    additional_notes: initialData?.additional_notes || '',
    is_complete: false,
    completion_percentage: 0
  });

  const [isLoading, setIsLoading] = useState(false);

  // Debounced auto-save function
  const debouncedAutoSave = useCallback(
    debounce(async (data: FollowUpAnswers) => {
      if (onSave) {
        try {
          await onSave(data);
          console.log('Auto-saved form data');
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }
    }, 2000),
    [onSave]
  );

  // Calculate completion percentage
  const calculateCompletionPercentage = (data: FollowUpAnswers): number => {
    const requiredFields = [
      data.zip_code,
      data.mileage,
      data.condition,
      data.transmission,
      data.title_status,
      data.tire_condition,
      data.exterior_condition,
      data.interior_condition
    ];
    
    const optionalFields = [
      data.previous_owners,
      data.serviceHistory?.hasRecords,
      data.accident_history?.hadAccident,
      data.features && data.features.length > 0,
      data.additional_notes
    ];
    
    const completedRequired = requiredFields.filter(field => 
      field !== undefined && field !== null && field !== ''
    ).length;
    
    const completedOptional = optionalFields.filter(field => 
      field !== undefined && field !== null && field !== false
    ).length;
    
    const requiredScore = (completedRequired / requiredFields.length) * 80; // 80% weight for required
    const optionalScore = (completedOptional / optionalFields.length) * 20; // 20% weight for optional
    
    return Math.round(requiredScore + optionalScore);
  };

  const updateFormData = (updates: Partial<FollowUpAnswers>) => {
    setFormData(prev => {
      const updated = { ...prev, ...updates };
      const completionPercentage = calculateCompletionPercentage(updated);
      
      const finalData = {
        ...updated,
        completion_percentage: completionPercentage
      };
      
      // Trigger auto-save
      debouncedAutoSave(finalData);
      
      return finalData;
    });
  };

  // Manual save progress function
  const handleSaveProgress = async () => {
    if (onSave) {
      try {
        setIsLoading(true);
        await onSave(formData);
        toast.success('Progress saved successfully');
      } catch (error) {
        console.error('Save failed:', error);
        toast.error('Failed to save progress');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Submit function
  const handleSubmit = async () => {
    const completionPercentage = calculateCompletionPercentage(formData);
    
    if (completionPercentage < 60) {
      toast.error('Please complete more sections before submitting');
      return;
    }
    
    const completeFormData = {
      ...formData,
      is_complete: true,
      completion_percentage: completionPercentage
    };
    
    try {
      setIsLoading(true);
      await onSubmit(completeFormData);
      toast.success('Valuation submitted successfully!');
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error('Failed to submit valuation');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial completion calculation
  useEffect(() => {
    const completionPercentage = calculateCompletionPercentage(formData);
    if (formData.completion_percentage !== completionPercentage) {
      setFormData(prev => ({
        ...prev,
        completion_percentage: completionPercentage
      }));
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Header */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-800">Complete Your Valuation</h2>
          <span className="text-sm font-medium text-gray-600">
            {formData.completion_percentage}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${formData.completion_percentage}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Fill out the sections below to get your most accurate vehicle valuation
        </p>
      </div>

      {/* Tabbed Form */}
      <TabbedFollowUpForm
        formData={formData}
        updateFormData={updateFormData}
        onAccidentsChange={(accidents) => updateFormData({ accident_history: accidents })}
        onServiceHistoryChange={(history) => updateFormData({ serviceHistory: history })}
        onModificationsChange={(mods) => updateFormData({ modifications: mods })}
        onSubmit={handleSubmit}
      />

      {/* Action Buttons */}
      <div className="mt-8 flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
        <button
          onClick={handleSaveProgress}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Progress'}
        </button>
        
        <div className="flex space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Back
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={isLoading || formData.completion_percentage < 60}
            className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-md hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Submitting...' : 'Submit Valuation'}
          </button>
        </div>
      </div>
    </div>
  );
}
