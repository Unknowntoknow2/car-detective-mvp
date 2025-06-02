
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

// Zod schema for FollowUpAnswers validation
const FollowUpAnswersSchema = z.object({
  vin: z.string().min(17).max(17),
  zip_code: z.string().optional(),
  mileage: z.number().optional(),
  condition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
  transmission: z.enum(['automatic', 'manual', 'unknown']).optional(),
  title_status: z.enum(['clean', 'salvage', 'rebuilt', 'lien', 'unknown']).optional(),
  previous_use: z.enum(['personal', 'fleet', 'rental', 'taxi', 'government', 'unknown']).default('personal'),
  previous_owners: z.number().optional(),
  serviceHistory: z.object({
    hasRecords: z.boolean(),
    lastService: z.string().optional(),
    frequency: z.enum(['regular', 'occasional', 'rare', 'unknown']).optional(),
    dealerMaintained: z.boolean().optional(),
    description: z.string().optional(),
  }).optional(),
  tire_condition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
  brake_condition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
  exterior_condition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
  interior_condition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
  dashboard_lights: z.array(z.string()).default([]),
  accident_history: z.object({
    hadAccident: z.boolean(),
    count: z.number().optional(),
    location: z.string().optional(),
    severity: z.enum(['minor', 'moderate', 'severe']),
    repaired: z.boolean().optional(),
    frameDamage: z.boolean().optional(),
    description: z.string().optional(),
  }).optional(),
  modifications: z.object({
    hasModifications: z.boolean(),
    modified: z.boolean().optional(),
    types: z.array(z.string()),
  }).optional(),
  features: z.array(z.string()).default([]),
  additional_notes: z.string().default(''),
  service_history: z.string().default(''),
  loan_balance: z.number().optional(),
  has_active_loan: z.boolean().optional(),
  payoffAmount: z.number().optional(),
  accidents: z.number().optional(),
  frame_damage: z.boolean().optional(),
  smoking: z.boolean().optional(),
  petDamage: z.boolean().optional(),
  rust: z.boolean().optional(),
  hailDamage: z.boolean().optional(),
  completion_percentage: z.number().default(0),
  is_complete: z.boolean().default(false),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate the request body
    const validatedData = FollowUpAnswersSchema.parse(req.body);

    // Create the follow-up response record
    const { data, error } = await supabase
      .from('follow_up_answers')
      .insert([{
        vin: validatedData.vin,
        zip_code: validatedData.zip_code,
        mileage: validatedData.mileage,
        condition: validatedData.condition,
        transmission: validatedData.transmission,
        title_status: validatedData.title_status,
        previous_use: validatedData.previous_use,
        previous_owners: validatedData.previous_owners,
        service_history: validatedData.service_history,
        tire_condition: validatedData.tire_condition,
        dashboard_lights: validatedData.dashboard_lights,
        frame_damage: validatedData.frame_damage,
        accidents: JSON.stringify(validatedData.accident_history),
        modifications: JSON.stringify(validatedData.modifications),
        completion_percentage: validatedData.completion_percentage,
        is_complete: validatedData.is_complete,
        // Add any additional fields as needed
      }])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ 
        error: 'Failed to save follow-up data',
        details: error.message 
      });
    }

    // Return the inserted row ID
    return res.status(200).json({ 
      id: data.id,
      message: 'Follow-up data saved successfully' 
    });

  } catch (error) {
    console.error('API error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors 
      });
    }

    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred while processing your request'
    });
  }
}
