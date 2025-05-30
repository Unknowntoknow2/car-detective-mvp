
import { v4 as uuidv4 } from 'uuid';
import { ReportData } from './types';

export interface WatermarkConfig {
  text: string;
  enabled: boolean;
  opacity?: number;
}

export interface TrackingConfig {
  userId: string;
  timestamp: number;
  vinHash?: string;
  enabled: boolean;
}

export function generateTrackingId(userId: string, vin?: string): string {
  const timestamp = Date.now();
  const vinPart = vin ? vin.slice(-6) : 'NOVIN';
  const userPart = userId.slice(0, 8);
  const randomPart = uuidv4().slice(0, 8);
  
  return `CD-${userPart}-${vinPart}-${timestamp}-${randomPart}`.toUpperCase();
}

export function createWatermarkConfig(isPremium: boolean = false): WatermarkConfig {
  return {
    text: isPremium 
      ? 'CarPerfector Premium Valuation – For Dealer Use Only'
      : 'CarPerfector Valuation Report',
    enabled: true,
    opacity: 0.1
  };
}

export function createTrackingConfig(userId: string, vin?: string): TrackingConfig {
  return {
    userId,
    timestamp: Date.now(),
    vinHash: vin ? btoa(vin).slice(0, 8) : undefined,
    enabled: true
  };
}

export function formatTrackingInfo(trackingId: string, reportData: ReportData): string {
  return `
Document ID: ${trackingId}
Generated: ${new Date(reportData.generatedAt).toLocaleString()}
Vehicle: ${reportData.year} ${reportData.make} ${reportData.model}
${reportData.vin ? `VIN: ${reportData.vin}` : ''}
CarPerfector.com - Premium Vehicle Valuations
  `.trim();
}
