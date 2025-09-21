import QRCode from 'qrcode';

export interface ShareLinkData {
  vin: string;
  zipCode: string;
  finalValue: number;
  confidenceScore: number;
  userId?: string;
  timestamp: number;
}

export interface GeneratedShareData {
  link: string;
  qr: string;
  token: string;
}

export async function generateShareLinkAndQR(data: ShareLinkData): Promise<GeneratedShareData> {
  try {
    
    // Generate a unique token for this valuation
    const token = generateShareToken(data);
    
    // Create the shareable URL
    const baseUrl = window.location.origin;
    const shareLink = `${baseUrl}/shared/${token}`;
    
    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(shareLink, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    
    return {
      link: shareLink,
      qr: qrCodeDataUrl,
      token: token
    };
  } catch (error) {
    console.error('❌ Failed to generate share link and QR:', error);
    throw error;
  }
}

function generateShareToken(data: ShareLinkData): string {
  // Create a deterministic but unique token based on the valuation data
  const tokenData = `${data.vin}-${data.zipCode}-${data.finalValue}-${data.timestamp}`;
  
  // Simple hash function (in production, use crypto.subtle or a proper library)
  let hash = 0;
  for (let i = 0; i < tokenData.length; i++) {
    const char = tokenData.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to a more readable format
  const token = Math.abs(hash).toString(36).toUpperCase();
  return `VAL_${token}`;
}

export function extractDataFromShareToken(token: string): { isValid: boolean; data?: any } {
  try {
    if (!token.startsWith('VAL_')) {
      return { isValid: false };
    }
    
    // For now, just validate the format
    // In a full implementation, you'd decode the token or look it up in the database
    return {
      isValid: true,
      data: { token }
    };
  } catch (error) {
    console.error('❌ Failed to extract data from share token:', error);
    return { isValid: false };
  }
}

export async function generateQRCodeOnly(url: string): Promise<string> {
  try {
    return await QRCode.toDataURL(url, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  } catch (error) {
    console.error('❌ Failed to generate QR code:', error);
    throw error;
  }
}