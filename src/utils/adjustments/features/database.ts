
import { FeatureValue } from './types';

/**
 * Premium feature value database
 * In a production environment, this would be fetched from a database or API
 */
export const PREMIUM_FEATURES: Record<string, FeatureValue> = {
  // Safety features
  'adaptive cruise control': {
    name: 'Adaptive Cruise Control',
    percentValue: 0.01,
    fixedValue: 300,
    description: 'Automatically adjusts speed to maintain safe following distance'
  },
  'blind spot monitoring': {
    name: 'Blind Spot Monitoring',
    percentValue: 0.005,
    fixedValue: 250,
    description: 'Alerts driver when vehicles are in blind spots'
  },
  'lane departure warning': {
    name: 'Lane Departure Warning',
    percentValue: 0.005,
    fixedValue: 200,
    description: 'Alerts driver when vehicle drifts out of lane'
  },
  'automatic emergency braking': {
    name: 'Automatic Emergency Braking',
    percentValue: 0.01,
    fixedValue: 300,
    description: 'Automatically applies brakes to prevent collisions'
  },
  
  // Comfort features
  'leather seats': {
    name: 'Leather Seats',
    percentValue: 0.015,
    fixedValue: 800,
    description: 'Premium leather upholstery'
  },
  'heated seats': {
    name: 'Heated Seats',
    percentValue: 0.01,
    fixedValue: 400,
    description: 'Seats with heating elements for cold weather comfort'
  },
  'ventilated seats': {
    name: 'Ventilated Seats',
    percentValue: 0.01,
    fixedValue: 450,
    description: 'Seats with cooling ventilation for hot weather comfort'
  },
  'heated steering wheel': {
    name: 'Heated Steering Wheel',
    percentValue: 0.005,
    fixedValue: 200,
    description: 'Steering wheel with heating elements'
  },
  
  // Technology features
  'navigation system': {
    name: 'Navigation System',
    percentValue: 0.01,
    fixedValue: 500,
    description: 'Built-in GPS navigation system'
  },
  'premium audio': {
    name: 'Premium Audio System',
    percentValue: 0.015,
    fixedValue: 700,
    description: 'High-end branded audio system with enhanced sound quality'
  },
  'head-up display': {
    name: 'Head-Up Display',
    percentValue: 0.01,
    fixedValue: 400,
    description: 'Projects information onto windshield in driver\'s line of sight'
  },
  'wireless charging': {
    name: 'Wireless Charging',
    percentValue: 0.005,
    fixedValue: 150,
    description: 'Wireless smartphone charging pad'
  },
  
  // Exterior features
  'sunroof': {
    name: 'Sunroof/Moonroof',
    percentValue: 0.01,
    fixedValue: 600,
    description: 'Opening roof panel for light and ventilation'
  },
  'panoramic roof': {
    name: 'Panoramic Roof',
    percentValue: 0.015,
    fixedValue: 900,
    description: 'Extended glass roof covering most of vehicle ceiling'
  },
  'alloy wheels': {
    name: 'Premium Alloy Wheels',
    percentValue: 0.005,
    fixedValue: 350,
    description: 'Upgraded alloy wheel design'
  },
  'led headlights': {
    name: 'LED Headlights',
    percentValue: 0.005,
    fixedValue: 300,
    description: 'Advanced LED lighting technology'
  }
};
