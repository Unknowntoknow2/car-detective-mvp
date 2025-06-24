
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FollowUpAnswers, ServiceHistoryDetails, ModificationDetails, AccidentDetails } from '@/types/follow-up-answers';
import { toast } from 'sonner';

interface UseFollowUpDataLoaderProps {
  vin: string;
  initialData?: Partial<FollowUpAnswers>;
}

export function useFollowUpDataLoader({ vin, initialData }: UseFollowUpDataLoaderProps) {
  const [formData, setFormData] = useState<FollowUpAnswers>(() => ({
    vin,
    zip_code: '',
    mileage: 0,
    condition: 'good',
    accidents: {
      hadAccident: false,
      count: 0,
      severity: 'minor',
      repaired: false,
      frameDamage: false,
      description: '',
      types: [],
      repairShops: [],
      airbagDeployment: false
    } as AccidentDetails,
    transmission: 'automatic',
    title_status: 'clean',
    previous_use: 'personal',
    serviceHistory: { 
      hasRecords: false,
      frequency: 'unknown',
      dealerMaintained: false,
      description: '',
      services: []
    } as ServiceHistoryDetails,
    tire_condition: 'good',
    exterior_condition: 'good',
    interior_condition: 'good',
    brake_condition: 'good',
    dashboard_lights: [],
    modifications: {
      hasModifications: false,
      modified: false,
      types: [],
      additionalNotes: ''
    } as ModificationDetails,
    features: [],
    additional_notes: '',
    completion_percentage: 0,
    is_complete: false,
    previous_owners: 1,
    loan_balance: 0,
    payoffAmount: 0,
    year: initialData?.year || new Date().getFullYear(),
    ...initialData
  }));

  const [isLoading, setIsLoading] = useState(false);

  // Enhanced data migration and validation
  const migrateAndValidateData = useCallback((data: any): Partial<FollowUpAnswers> => {
    // Handle serviceHistory column mapping with enhanced validation
    let serviceHistory = data.serviceHistory || data.servicehistory;
    if (!serviceHistory && data.service_history) {
      serviceHistory = {
        hasRecords: Boolean(data.service_history),
        description: data.service_history,
        frequency: 'unknown',
        dealerMaintained: false,
        services: []
      };
    }

    // Validate and fix JSONB fields
    const validateJsonField = (field: any, defaultValue: any) => {
      if (!field) return defaultValue;
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch {
          return defaultValue;
        }
      }
      return field;
    };

    return {
      ...data,
      accidents: validateJsonField(data.accidents, {
        hadAccident: false,
        count: 0,
        severity: 'minor',
        repaired: false,
        frameDamage: false,
        description: '',
        types: [],
        repairShops: [],
        airbagDeployment: false
      }),
      modifications: validateJsonField(data.modifications, {
        hasModifications: false,
        modified: false,
        types: [],
        additionalNotes: ''
      }),
      serviceHistory: validateJsonField(serviceHistory, {
        hasRecords: false,
        frequency: 'unknown',
        dealerMaintained: false,
        description: '',
        services: []
      }),
      dashboard_lights: Array.isArray(data.dashboard_lights) ? data.dashboard_lights : [],
      features: Array.isArray(data.features) ? data.features : [],
      exterior_condition: data.exterior_condition || 'good',
      interior_condition: data.interior_condition || 'good',
      brake_condition: data.brake_condition || 'good',
      additional_notes: data.additional_notes || '',
      year: data.year || new Date().getFullYear(),
      loan_balance: data.loan_balance || 0,
      payoffAmount: data.payoff_amount || data.payoffAmount || 0,
      transmission: data.transmission || 'automatic'
    };
  }, []);

  const loadExistingData = useCallback(async () => {
    if (!vin) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('follow_up_answers')
        .select('*')
        .eq('vin', vin)
        .maybeSingle();

      if (error) {
        console.error('Error loading follow-up data:', error);
        
        // Try to load from localStorage backup
        try {
          const backup = localStorage.getItem(`followup_backup_${vin}`);
          if (backup) {
            const backupData = JSON.parse(backup);
            setFormData(prev => ({ ...prev, ...backupData }));
            toast.info('Loaded your saved progress from local backup');
          }
        } catch (backupError) {
          console.warn('Failed to load backup data:', backupError);
        }
        return;
      }

      if (data) {
        const migratedData = migrateAndValidateData(data);
        setFormData(prev => ({
          ...prev,
          ...migratedData
        }));
      }
    } catch (error) {
      console.error('Error loading follow-up data:', error);
      
      // Load backup on error
      try {
        const backup = localStorage.getItem(`followup_backup_${vin}`);
        if (backup) {
          const backupData = JSON.parse(backup);
          setFormData(prev => ({ ...prev, ...backupData }));
        }
      } catch (backupError) {
        console.warn('No backup available:', backupError);
      }
    } finally {
      setIsLoading(false);
    }
  }, [vin, migrateAndValidateData]);

  useEffect(() => {
    loadExistingData();
  }, [loadExistingData]);

  return {
    formData,
    setFormData,
    isLoading,
    loadExistingData
  };
}
