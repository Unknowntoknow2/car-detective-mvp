
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface EmailResponse {
  success: boolean;
  error?: string;
  messageId?: string;
}

export async function sendEmail(options: EmailOptions): Promise<EmailResponse> {
  try {
    // Mock email sending functionality
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      messageId: `mock-${Date.now()}`
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error occurred';
    return {
      success: false,
      error
    };
  }
}

export async function sendWelcomeEmail(email: string, name?: string): Promise<EmailResponse> {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Car Detective!</h2>
        <p>Hi ${name || 'there'},</p>
        <p>Thank you for signing up for Car Detective. We're excited to help you with your vehicle valuations!</p>
      </div>
    `;

    return await sendEmail({
      to: email,
      subject: 'Welcome to Car Detective!',
      html
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error occurred';
    return {
      success: false,
      error
    };
  }
}

export async function sendPasswordResetEmail(email: string, resetLink: string): Promise<EmailResponse> {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your Car Detective account.</p>
        <p><a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;

    return await sendEmail({
      to: email,
      subject: 'Reset Your Password - Car Detective',
      html
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error occurred';
    return {
      success: false,
      error
    };
  }
}
