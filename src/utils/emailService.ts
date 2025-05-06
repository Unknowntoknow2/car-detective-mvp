
import { supabase } from '@/integrations/supabase/client';

export type EmailType = 
  | 'abandoned_valuation' 
  | 'premium_upsell' 
  | 'dealer_offer_followup' 
  | 'photo_upload_prompt' 
  | 'reactivation';

/**
 * Trigger an email to be sent to a user
 * @param emailType The type of email to send
 * @param email The recipient's email address
 * @param userId Optional user ID for tracking
 * @param valuationId Optional valuation ID for context
 * @returns Promise with the email sending result
 */
export async function sendEmail(
  emailType: EmailType,
  email: string,
  userId?: string,
  valuationId?: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('trigger-email-campaign', {
      body: {
        emailType,
        email,
        userId,
        valuationId
      }
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, message: 'Email sent successfully' };
  } catch (err) {
    console.error('Exception sending email:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Trigger the email campaign scheduler to run
 * This would typically be called by an admin or on a schedule
 */
export async function runEmailCampaignScheduler(): Promise<{ success: boolean; results?: any; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('schedule-email-campaigns', {
      body: {}
    });

    if (error) {
      console.error('Error running email campaign scheduler:', error);
      return { success: false, error: error.message };
    }

    return { success: true, results: data.results };
  } catch (err) {
    console.error('Exception running email campaign scheduler:', err);
    return { success: false, error: err.message };
  }
}
