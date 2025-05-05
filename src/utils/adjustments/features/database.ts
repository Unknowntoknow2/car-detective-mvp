
import { FeatureValue } from './types';

/**
 * Premium Features Database
 * 
 * This database contains standard valuation adjustments for premium vehicle features.
 * Each feature has both a percentage and fixed dollar adjustment value.
 * 
 * The percentage adjustment is applied to the base value of the vehicle.
 * The fixed adjustment is added regardless of the vehicle's base value.
 * 
 * Example:
 * - For a $20,000 vehicle with leather seats (1% + $300):
 *   Adjustment would be (20000 * 0.01) + 300 = $500
 */
export const PREMIUM_FEATURES: Record<string, FeatureValue> = {
  // Interior comfort features
  'leather seats': {
    name: 'Leather Seats',
    percentValue: 0.01,  // 1% of base value
    fixedValue: 300,     // $300 fixed value
    description: 'Premium leather upholstery'
  },
  'heated seats': {
    name: 'Heated Seats',
    percentValue: 0.005, // 0.5% of base value
    fixedValue: 250,     // $250 fixed value
    description: 'Heated front seats'
  },
  'ventilated seats': {
    name: 'Ventilated/Cooled Seats',
    percentValue: 0.007, // 0.7% of base value
    fixedValue: 350,     // $350 fixed value
    description: 'Ventilated or cooled front seats'
  },
  'heated steering wheel': {
    name: 'Heated Steering Wheel',
    percentValue: 0.003, // 0.3% of base value
    fixedValue: 150,     // $150 fixed value
    description: 'Heated steering wheel for cold weather comfort'
  },
  
  // Roof features
  'sunroof': {
    name: 'Sunroof/Moonroof',
    percentValue: 0.015, // 1.5% of base value
    fixedValue: 500,     // $500 fixed value
    description: 'Standard-size sunroof or moonroof'
  },
  'panoramic roof': {
    name: 'Panoramic Roof',
    percentValue: 0.02,  // 2% of base value
    fixedValue: 800,     // $800 fixed value
    description: 'Full panoramic glass roof'
  },
  
  // Technology features
  'navigation system': {
    name: 'Navigation System',
    percentValue: 0.01,  // 1% of base value
    fixedValue: 400,     // $400 fixed value
    description: 'Built-in GPS navigation system'
  },
  'premium audio': {
    name: 'Premium Audio System',
    percentValue: 0.015, // 1.5% of base value
    fixedValue: 600,     // $600 fixed value
    description: 'Brand-name premium audio system (Bose, Harman Kardon, etc.)'
  },
  'heads up display': {
    name: 'Heads-Up Display',
    percentValue: 0.01,  // 1% of base value
    fixedValue: 500,     // $500 fixed value
    description: 'Windshield heads-up display for driver information'
  },
  
  // Driver assistance features
  'adaptive cruise': {
    name: 'Adaptive Cruise Control',
    percentValue: 0.012, // 1.2% of base value
    fixedValue: 450,     // $450 fixed value
    description: 'Cruise control with automatic distance adjustment'
  },
  'lane keep assist': {
    name: 'Lane Keep Assist',
    percentValue: 0.008, // 0.8% of base value
    fixedValue: 300,     // $300 fixed value
    description: 'Active lane keeping assistance'
  },
  '360 camera': {
    name: '360-Degree Camera System',
    percentValue: 0.015, // 1.5% of base value
    fixedValue: 600,     // $600 fixed value
    description: 'Surround-view camera system'
  },
  'blind spot': {
    name: 'Blind Spot Monitoring',
    percentValue: 0.008, // 0.8% of base value
    fixedValue: 350,     // $350 fixed value
    description: 'Blind spot detection and warning system'
  },
  
  // Luxury and convenience features
  'third row': {
    name: 'Third Row Seating',
    percentValue: 0.018, // 1.8% of base value
    fixedValue: 700,     // $700 fixed value
    description: 'Third row of seats (added capacity)'
  },
  'power liftgate': {
    name: 'Power Liftgate/Trunk',
    percentValue: 0.006, // 0.6% of base value
    fixedValue: 300,     // $300 fixed value
    description: 'Power-operated rear liftgate or trunk'
  },
  'remote start': {
    name: 'Remote Start',
    percentValue: 0.005, // 0.5% of base value
    fixedValue: 250,     // $250 fixed value
    description: 'Remote engine start capability'
  },
  'wireless charging': {
    name: 'Wireless Phone Charging',
    percentValue: 0.004, // 0.4% of base value
    fixedValue: 200,     // $200 fixed value
    description: 'Built-in wireless phone charging pad'
  }
};
