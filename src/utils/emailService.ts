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

/**
 * Create a new email campaign in the database
 * @param subject Email subject
 * @param body Email body
 * @param audienceType Audience type
 * @param recipientCount Number of recipients
 * @returns Promise with the result of the operation
 */
export async function createEmailCampaign(
  subject: string,
  body: string,
  audienceType: string,
  recipientCount: number
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const { error } = await supabase.from('email_campaigns').insert({
      subject,
      body,
      audience_type: audienceType,
      recipient_count: recipientCount,
      user_id: supabase.auth.getUser().then(({ data }) => data.user?.id)
    });

    if (error) {
      console.error('Error creating email campaign:', error);
      return { success: false, error: error.message };
    }

    return { success: true, message: 'Email campaign created successfully' };
  } catch (err) {
    console.error('Exception creating email campaign:', err);
    return { success: false, error: err.message };
  }
}
