import { format } from 'date-fns';

/**
 * Generates a unique tracking number in the format: MPM-YYYYMMDD-XXXXX
 * Example: MPM-20250128-00001
 */
export function generateTrackingNumber(): string {
  const dateStr = format(new Date(), 'yyyyMMdd');
  
  // Generate 5-digit random number padded with zeros
  const randomNum = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0');
  
  return `MPM-${dateStr}-${randomNum}`;
}

/**
 * Validates if a tracking number matches the expected format
 */
export function isValidTrackingNumber(trackingNumber: string): boolean {
  const pattern = /^MPM-\d{8}-\d{5}$/;
  return pattern.test(trackingNumber);
}

/**
 * Extracts the date from a tracking number
 */
export function getDateFromTrackingNumber(trackingNumber: string): Date | null {
  if (!isValidTrackingNumber(trackingNumber)) {
    return null;
  }
  
  const dateStr = trackingNumber.split('-')[1];
  const year = parseInt(dateStr.substring(0, 4));
  const month = parseInt(dateStr.substring(4, 6)) - 1; // Month is 0-indexed
  const day = parseInt(dateStr.substring(6, 8));
  
  return new Date(year, month, day);
}

/**
 * Formats a tracking number for display (already in correct format)
 */
export function formatTrackingNumber(trackingNumber: string): string {
  return trackingNumber;
}

