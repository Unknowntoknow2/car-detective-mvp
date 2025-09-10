// Enhanced UI Components Export Index
// This file provides a clean interface for importing Enhanced UI components

// Main Dashboard Component
export { default as EnhancedUIDashboard } from './EnhancedUIDashboard';

// Individual Panel Components
export { default as MarketIntelligencePanel } from './panels/MarketIntelligencePanel';
export { default as AdjusterBreakdownPanel } from './panels/AdjusterBreakdownPanel';
export { default as ConfidenceMetricsPanel } from './panels/ConfidenceMetricsPanel';

// Utility function to create mock data (useful for testing/development)
export const createMockVehicleData = (vehicle: Partial<any>) => ({
  year: vehicle.year || 2020,
  make: vehicle.make || 'Honda',
  model: vehicle.model || 'Accord',
  trim: vehicle.trim || 'EX-L'
});

// Version information
export const ENHANCED_UI_VERSION = '1.0.0';
