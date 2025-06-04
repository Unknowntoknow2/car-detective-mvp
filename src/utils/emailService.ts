<<<<<<< HEAD
// Utility functions for email service
=======
import { supabase } from "@/integrations/supabase/client";

export type EmailType =
  | "abandoned_valuation"
  | "premium_upsell"
  | "dealer_offer_followup"
  | "photo_upload_prompt"
  | "reactivation";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

/**
 * Creates a new email campaign
 * @param subject - Email subject
 * @param body - Email body content (HTML)
 * @param audienceType - Type of audience (users, dealers, etc.)
 * @returns Created campaign ID
 */
<<<<<<< HEAD
export const createEmailCampaign = async (
  subject: string,
  body: string,
  audienceType: string
): Promise<string> => {
  try {
    // Implementation would be added here in a real application
    // This is a placeholder function to satisfy the import
    console.log('Creating email campaign:', { subject, body, audienceType });
    return 'campaign-' + Math.random().toString(36).substring(2, 15);
  } catch (error) {
    console.error('Error creating email campaign:', error);
    throw error;
=======
export async function sendEmail(
  emailType: EmailType,
  email: string,
  userId?: string,
  valuationId?: string,
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "trigger-email-campaign",
      {
        body: {
          emailType,
          email,
          userId,
          valuationId,
        },
      },
    );

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, message: "Email sent successfully" };
  } catch (err) {
    console.error("Exception sending email:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Trigger the email campaign scheduler to run
 * This would typically be called by an admin or on a schedule
 */
export async function runEmailCampaignScheduler(): Promise<
  { success: boolean; results?: any; error?: string }
> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "schedule-email-campaigns",
      {
        body: {},
      },
    );

    if (error) {
      console.error("Error running email campaign scheduler:", error);
      return { success: false, error: error.message };
    }

    return { success: true, results: data.results };
  } catch (err) {
    console.error("Exception running email campaign scheduler:", err);
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
  recipientCount: number,
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    // Get the current user's ID before making the insert
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    const { error } = await supabase.from("email_campaigns").insert({
      subject,
      body,
      audience_type: audienceType,
      recipient_count: recipientCount,
      user_id: userId,
    });

    if (error) {
      console.error("Error creating email campaign:", error);
      return { success: false, error: error.message };
    }

    return { success: true, message: "Email campaign created successfully" };
  } catch (err) {
    console.error("Exception creating email campaign:", err);
    return { success: false, error: err.message };
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  }
};

/**
 * Sends a test email for the campaign
 * @param campaignId - ID of the campaign
 * @param testEmail - Email address to send test to
 */
export const sendTestEmail = async (campaignId: string, testEmail: string): Promise<void> => {
  try {
    console.log(`Sending test email for campaign ${campaignId} to ${testEmail}`);
    // Implementation would be added here
  } catch (error) {
    console.error('Error sending test email:', error);
    throw error;
  }
};

/**
 * Launches the email campaign to all recipients
 * @param campaignId - ID of the campaign
 */
export const launchCampaign = async (campaignId: string): Promise<number> => {
  try {
    console.log(`Launching campaign ${campaignId}`);
    // Implementation would be added here
    return Math.floor(Math.random() * 1000); // Mocked recipient count
  } catch (error) {
    console.error('Error launching campaign:', error);
    throw error;
  }
};
