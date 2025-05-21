import nodemailer from 'nodemailer';

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

interface EmailServiceResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Helper function to handle sending errors
const handleSendError = (err: unknown, type: string): EmailServiceResponse => {
  const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
  console.error(`Failed to send ${type} email:`, errorMessage);
  return { success: false, error: errorMessage };
};

// Create reusable transporter object using the default SMTP transport
let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

// Function to send a basic email
export const sendEmail = async (options: EmailOptions): Promise<EmailServiceResponse> => {
  try {
    const transporter = getTransporter();

    // Send mail with defined transport object
    const info = await transporter.sendMail(options);
    console.log('Message sent: %s', info.messageId);
    return { success: true, message: 'Email sent successfully' };
  } catch (err: unknown) {
    return handleSendError(err, 'generic');
  }
};

// Function to send a welcome email
export const sendWelcomeEmail = async (to: string, name: string): Promise<EmailServiceResponse> => {
  const html = `
    <p>Hello ${name},</p>
    <p>Welcome to our Vehicle Valuation service! We're excited to have you.</p>
    <p>Start valuing your vehicles today!</p>
  `;

  try {
    return await sendEmail({
      from: `"Vehicle Valuation Service" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Welcome to Vehicle Valuation Service',
      html,
    });
  } catch (err: unknown) {
    return handleSendError(err, 'welcome');
  }
};

// Function to send a password reset email
export const sendPasswordResetEmail = async (to: string, token: string): Promise<EmailServiceResponse> => {
  const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`;
  const html = `
    <p>Hello,</p>
    <p>You requested a password reset. Click the following link to reset your password:</p>
    <a href="${resetLink}">Reset Password</a>
    <p>This link is valid for 24 hours.</p>
  `;

  try {
    return await sendEmail({
      from: `"Vehicle Valuation Service" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Password Reset Request',
      html,
    });
  } catch (err: unknown) {
    return handleSendError(err, 'password reset');
  }
};

/**
 * Creates and starts an email campaign
 * @param campaignName The name of the campaign
 * @param templateId The ID of the email template to use
 * @param recipientIds Array of user IDs to receive the email
 * @param scheduledDate Optional date to schedule the campaign
 */
export const createEmailCampaign = async (
  campaignName: string,
  templateId: string,
  recipientIds: string[],
  scheduledDate?: Date
) => {
  try {
    console.log(`Creating email campaign: ${campaignName}`);
    console.log(`Using template ID: ${templateId}`);
    console.log(`Recipients: ${recipientIds.length}`);
    if (scheduledDate) {
      console.log(`Scheduled for: ${scheduledDate.toISOString()}`);
    }
    
    // In a real implementation, this would call an API to create the campaign
    return {
      id: `campaign_${Date.now()}`,
      name: campaignName,
      status: 'scheduled',
      recipientCount: recipientIds.length,
      scheduledDate: scheduledDate?.toISOString() || new Date().toISOString()
    };
  } catch (err) {
    console.error('Error creating email campaign:', err instanceof Error ? err.message : String(err));
    throw new Error(`Failed to create email campaign: ${err instanceof Error ? err.message : String(err)}`);
  }
};
