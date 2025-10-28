import QRCode from 'qrcode';

/**
 * Generates a QR code data URL for a tracking number
 * @param trackingNumber - The tracking number to encode
 * @param appUrl - Base URL of the application
 * @returns Base64 data URL of the QR code image
 */
export async function generateTrackingQRCode(
  trackingNumber: string,
  appUrl: string = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
): Promise<string> {
  const trackingUrl = `${appUrl}/tracking/${trackingNumber}`;
  
  try {
    // Generate QR code as data URL (PNG format)
    const qrCodeDataUrl = await QRCode.toDataURL(trackingUrl, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generates a QR code as a buffer for file storage
 * @param trackingNumber - The tracking number to encode
 * @param appUrl - Base URL of the application
 * @returns Buffer containing the QR code image
 */
export async function generateTrackingQRCodeBuffer(
  trackingNumber: string,
  appUrl: string = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
): Promise<Buffer> {
  const trackingUrl = `${appUrl}/tracking/${trackingNumber}`;
  
  try {
    // Generate QR code as buffer
    const buffer = await QRCode.toBuffer(trackingUrl, {
      errorCorrectionLevel: 'M',
      type: 'png',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    return buffer;
  } catch (error) {
    console.error('Error generating QR code buffer:', error);
    throw new Error('Failed to generate QR code buffer');
  }
}

/**
 * Validates if a tracking URL matches the expected pattern
 */
export function isValidTrackingUrl(url: string): boolean {
  const pattern = /^https?:\/\/.+\/tracking\/MPM-\d{8}-\d{5}$/;
  return pattern.test(url);
}

/**
 * Extracts tracking number from a tracking URL
 */
export function extractTrackingNumberFromUrl(url: string): string | null {
  const match = url.match(/\/tracking\/(MPM-\d{8}-\d{5})$/);
  return match ? match[1] : null;
}

/**
 * Generates tracking URL from tracking number
 */
export function generateTrackingUrl(
  trackingNumber: string,
  appUrl: string = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
): string {
  return `${appUrl}/tracking/${trackingNumber}`;
}

