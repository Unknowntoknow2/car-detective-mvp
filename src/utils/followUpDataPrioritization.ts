import { FollowUpAnswers } from '@/types/follow-up-answers';
import { supabase } from '@/integrations/supabase/client';

export interface PrioritizedValuationData {
  mileage: number;
  condition: string;
  zipCode: string;
  dataSource: 'user_followup' | 'system_default' | 'initial_input';
  followUpCompleted: boolean;
  prioritizedFields: {
    mileage: {
      value: number;
      source: 'user_followup' | 'system_default' | 'initial_input';
      confidence: 'high' | 'medium' | 'low';
    };
    condition: {
      value: string;
      source: 'user_followup' | 'system_default' | 'initial_input';
      confidence: 'high' | 'medium' | 'low';
    };
    zipCode: {
      value: string;
      source: 'user_followup' | 'system_default' | 'initial_input';
      confidence: 'high' | 'medium' | 'low';
    };
  };
  additionalFollowUpData?: {
    accidents?: any;
    modifications?: any;
    serviceHistory?: any;
    titleStatus?: string;
    previousOwners?: number;
  };
}

/**
 * Prioritizes user-provided follow-up data over system defaults
 * Order of priority: 1) User follow-up data, 2) Initial input, 3) System defaults
 */
export async function getPrioritizedValuationData(
  vin: string,
  initialData: {
    mileage?: number;
    condition?: string;
    zipCode?: string;
  }
): Promise<PrioritizedValuationData> {
  console.log('🔄 Getting prioritized valuation data for VIN:', vin);

  // Try to get follow-up data first
  const { data: followUpData, error: followUpError } = await supabase
    .from('follow_up_answers')
    .select('*')
    .eq('vin', vin)
    .eq('is_complete', true)
    .order('updated_at', { ascending: false })
    .maybeSingle();

  if (followUpError) {
    console.log('⚠️ No follow-up data found:', followUpError.message);
  }

  // Default values for missing data
  const defaultValues = {
    mileage: 60000,
    condition: 'good',
    zipCode: '94016'
  };

  let prioritizedData: PrioritizedValuationData;

  if (followUpData && followUpData.is_complete) {
    console.log('✅ Using user follow-up data as priority source');
    
    prioritizedData = {
      mileage: followUpData.mileage || initialData.mileage || defaultValues.mileage,
      condition: followUpData.condition || initialData.condition || defaultValues.condition,
      zipCode: followUpData.zip_code || initialData.zipCode || defaultValues.zipCode,
      dataSource: 'user_followup',
      followUpCompleted: true,
      prioritizedFields: {
        mileage: {
          value: followUpData.mileage || initialData.mileage || defaultValues.mileage,
          source: followUpData.mileage ? 'user_followup' : 
                  initialData.mileage ? 'initial_input' : 'system_default',
          confidence: followUpData.mileage ? 'high' : 
                     initialData.mileage ? 'medium' : 'low'
        },
        condition: {
          value: followUpData.condition || initialData.condition || defaultValues.condition,
          source: followUpData.condition ? 'user_followup' : 
                  initialData.condition ? 'initial_input' : 'system_default',
          confidence: followUpData.condition ? 'high' : 
                     initialData.condition ? 'medium' : 'low'
        },
        zipCode: {
          value: followUpData.zip_code || initialData.zipCode || defaultValues.zipCode,
          source: followUpData.zip_code ? 'user_followup' : 
                  initialData.zipCode ? 'initial_input' : 'system_default',
          confidence: followUpData.zip_code ? 'high' : 
                     initialData.zipCode ? 'medium' : 'low'
        }
      },
      additionalFollowUpData: {
        accidents: followUpData.accidents,
        modifications: followUpData.modifications,
        serviceHistory: followUpData.serviceHistory,
        titleStatus: followUpData.title_status,
        previousOwners: followUpData.previous_owners
      }
    };
  } else {
    console.log('📋 Using initial input/system defaults as data source');
    
    prioritizedData = {
      mileage: initialData.mileage || defaultValues.mileage,
      condition: initialData.condition || defaultValues.condition,
      zipCode: initialData.zipCode || defaultValues.zipCode,
      dataSource: 'initial_input',
      followUpCompleted: false,
      prioritizedFields: {
        mileage: {
          value: initialData.mileage || defaultValues.mileage,
          source: initialData.mileage ? 'initial_input' : 'system_default',
          confidence: initialData.mileage ? 'medium' : 'low'
        },
        condition: {
          value: initialData.condition || defaultValues.condition,
          source: initialData.condition ? 'initial_input' : 'system_default',
          confidence: initialData.condition ? 'medium' : 'low'
        },
        zipCode: {
          value: initialData.zipCode || defaultValues.zipCode,
          source: initialData.zipCode ? 'initial_input' : 'system_default',
          confidence: initialData.zipCode ? 'medium' : 'low'
        }
      }
    };
  }

  console.log('📊 Prioritized data result:', {
    dataSource: prioritizedData.dataSource,
    followUpCompleted: prioritizedData.followUpCompleted,
    mileageSource: prioritizedData.prioritizedFields.mileage.source,
    conditionSource: prioritizedData.prioritizedFields.condition.source,
    zipSource: prioritizedData.prioritizedFields.zipCode.source
  });

  return prioritizedData;
}

/**
 * Checks if follow-up data is available and more recent than initial valuation
 */
export async function hasRecentFollowUpData(vin: string, valuationDate?: string): Promise<boolean> {
  const { data: followUpData } = await supabase
    .from('follow_up_answers')
    .select('updated_at, is_complete')
    .eq('vin', vin)
    .eq('is_complete', true)
    .order('updated_at', { ascending: false })
    .maybeSingle();

  if (!followUpData) return false;

  if (!valuationDate) return true;

  return new Date(followUpData.updated_at) > new Date(valuationDate);
}

/**
 * Gets data source explanation for transparency
 */
export function getDataSourceExplanation(prioritizedData: PrioritizedValuationData): string {
  const { prioritizedFields, followUpCompleted } = prioritizedData;
  
  if (followUpCompleted) {
    return `Using enhanced follow-up data provided by you for improved accuracy. Mileage from ${prioritizedFields.mileage.source}, condition from ${prioritizedFields.condition.source}, location from ${prioritizedFields.zipCode.source}.`;
  } else {
    return `Using initial input and system defaults. For improved accuracy, consider completing the follow-up questions.`;
  }
}