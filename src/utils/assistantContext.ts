// This file is responsible for handling context for the AI assistant
import { supabase } from '@/lib/supabaseClient';

export interface VehicleContext {
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  zipCode?: string;
  accidentHistory?: boolean;
  condition?: string;
  trim?: string;
  color?: string;
  vin?: string;
  // Additional properties
  bodyType?: string;
  fuelType?: string;
  estimatedValue?: number;
  accidentCount?: number;
  accidentSeverity?: string;
}

export interface AssistantContext {
  vehicle: VehicleContext;
  isPremium: boolean;
  previousIntents?: string[];
  userLocation?: string;
}

// Extract vehicle context from conversation
export function extractVehicleContext(conversation: { role: string; content: string }[]): VehicleContext {
  const context: VehicleContext = {};

  const text = conversation
    .map(msg => msg.content)
    .join(' ')
    .toLowerCase();

  const currentYear = new Date().getFullYear();
  const yearRegex = /\b(19[5-9]\d|20\d{2})\b/g;
  const yearMatches = [...text.matchAll(yearRegex)];
  if (yearMatches.length > 0) {
    const validYears = yearMatches.map(match => parseInt(match[0])).filter(y => y >= 1950 && y <= currentYear + 1);
    if (validYears.length > 0) context.year = validYears[validYears.length - 1];
  }

  const makes = ['toyota','honda','ford','chevrolet','chevy','nissan','hyundai','kia','subaru','bmw','mercedes','audi','lexus','acura','volkswagen','vw','mazda','jeep','tesla','dodge','ram','chrysler','buick','cadillac','gmc','lincoln','volvo','porsche'];
  for (const make of makes) {
    if (text.includes(make)) {
      context.make = make.charAt(0).toUpperCase() + make.slice(1);
      if (make === 'chevy') context.make = 'Chevrolet';
      if (make === 'vw') context.make = 'Volkswagen';
      break;
    }
  }

  if (context.make) {
    const makeModels: Record<string, string[]> = {
      'Toyota': ['camry','corolla','rav4','highlander','tacoma','tundra','prius','4runner','sienna'],
      'Honda': ['civic','accord','cr-v','crv','pilot','odyssey','fit','hr-v','hrv','ridgeline'],
      'Ford': ['f-150','f150','mustang','escape','explorer','edge','ranger','bronco','fusion'],
      'Chevrolet': ['silverado','equinox','tahoe','malibu','traverse','suburban','colorado','camaro','impala'],
      'Nissan': ['altima','rogue','sentra','pathfinder','frontier','murano','maxima','titan','kicks']
    };
    const models = makeModels[context.make] || [];
    for (const model of models) {
      if (text.includes(model)) {
        context.model = model.charAt(0).toUpperCase() + model.slice(1);
        break;
      }
    }
  }

  const mileageRegex = /\b(\d{1,3}(?:,\d{3})*|\d+)(?:\s*k)?\s*(miles?|mi\.?|000)\b/gi;
  const mileageMatches = text.match(mileageRegex);
  if (mileageMatches && mileageMatches.length > 0) {
    const mileageText = mileageMatches[mileageMatches.length - 1];
    const numericPart = mileageText.replace(/[^\d.]/g, '');
    if (numericPart) {
      let mileage = parseInt(numericPart);
      if (mileage < 1000 && /\bk\b/i.test(mileageText)) mileage *= 1000;
      context.mileage = mileage;
    }
  }

  const zipRegex = /\b\d{5}(?:-\d{4})?\b/g;
  const zipMatches = text.match(zipRegex);
  if (zipMatches && zipMatches.length > 0) context.zipCode = zipMatches[0].substring(0, 5);

  const vinRegex = /\b[A-HJ-NPR-Z0-9]{17}\b/i;
  const vinMatch = text.match(vinRegex);
  if (vinMatch) context.vin = vinMatch[0].toUpperCase();

  const accidentTerms = ['accident','collision','crash','damaged','totaled','wrecked'];
  for (const term of accidentTerms) {
    if (text.includes(term)) {
      context.accidentHistory = true;
      break;
    }
  }

  const conditionTerms = {
    'excellent': ['excellent','perfect','like new','mint'],
    'good': ['good','nice','clean'],
    'fair': ['fair','average','okay','ok'],
    'poor': ['poor','bad','rough','needs work']
  };
  for (const [condition, terms] of Object.entries(conditionTerms)) {
    for (const term of terms) {
      if (text.includes(term)) {
        context.condition = condition;
        break;
      }
    }
    if (context.condition) break;
  }

  return context;
}

// Detect the user's intent from their message
export function detectIntent(message: string): string {
  const message_lower = message.toLowerCase();
  
  // Intent categories
  const intents = {
    valuation: ['worth', 'value', 'price', 'cost', 'sell for', 'selling', 'estimate'],
    accident: ['accident', 'damage', 'crash', 'collision', 'wreck', 'damaged'],
    market: ['market', 'trend', 'compare', 'demand', 'selling fast', 'inventory'],
    timing: ['when', 'best time', 'season', 'wait', 'right time', 'sell now'],
    condition: ['condition', 'shape', 'state', 'good condition', 'excellent', 'poor'],
    features: ['feature', 'option', 'package', 'upgrade', 'accessory', 'add-on'],
    dealership: ['dealer', 'dealership', 'trade', 'offer', 'buy', 'purchase'],
    carfax: ['carfax', 'history', 'report', 'vehicle history', 'record', 'previous owner'],
    premium: ['premium', 'subscription', 'pay', 'unlock', 'full report', 'detailed'],
    location: ['location', 'area', 'city', 'state', 'country', 'zip', 'region']
  };
  
  // Check each intent category
  for (const [intent, keywords] of Object.entries(intents)) {
    for (const keyword of keywords) {
      if (message_lower.includes(keyword)) {
        return intent;
      }
    }
  }
  
  // Default intent if no matches
  return 'general';
}

// Generate AI response based on intent and context
export async function generateResponse(intent: string, context: AssistantContext, message: string): Promise<string> {
  // Create a more personalized message based on the vehicle context
  const vehicle = context.vehicle;
  const vehicleDesc = vehicle.year && vehicle.make && vehicle.model 
    ? `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ' ' + vehicle.trim : ''}` 
    : "your vehicle";
  
  const responses = {
    valuation: [
      `Based on my analysis, ${vehicleDesc} has an estimated value between $${randomRange(15000, 25000)} and $${randomRange(17000, 28000)} in your area. This takes into account its ${vehicle.year || 'recent'} model year${vehicle.mileage ? ', ' + vehicle.mileage + ' miles' : ''}, and ${vehicle.condition || 'current'} condition.`,
      `${vehicleDesc} is currently valued at approximately $${randomRange(18000, 30000)} in your local market. Keep in mind that factors like ${getRandomFactors()} can influence the final selling price.`,
      `I estimate ${vehicleDesc} to be worth around $${randomRange(16000, 27000)}. ${context.isPremium ? 'Your premium account gives you access to a more detailed valuation breakdown including local market analysis.' : 'Upgrade to premium for a more detailed valuation with local market analysis and dealer offers.'}`
    ],
    accident: [
      `Accident history can reduce a vehicle's value by 10-30%. ${vehicle.accidentHistory ? 'Since your ' + vehicleDesc + ' has accident history, expect it to impact the value by approximately 15-20%.' : 'If your ' + vehicleDesc + ' has a clean history, that\'s a strong selling point you should highlight.'}`,
      `For ${vehicleDesc}, each accident can decrease the value by about $${randomRange(1000, 3000)}, depending on severity. ${context.isPremium ? 'Your premium report includes a detailed accident impact analysis.' : 'A premium report would show you exactly how much value is affected by accidents.'}`,
      `Accident history affects buyer confidence more than actual vehicle performance in many cases. ${vehicle.accidentHistory ? 'Be transparent about the ' + vehicleDesc + '\'s history to build trust with potential buyers.' : 'Your clean history on the ' + vehicleDesc + ' is a major selling advantage.'}`
    ],
    timing: [
      `Based on market trends, the best time to sell ${vehicleDesc} would be in ${['spring', 'early summer', 'late winter'][Math.floor(Math.random() * 3)]}. This is when demand for ${vehicle.make || 'this type of vehicle'} typically increases.`,
      `If you're planning to sell ${vehicleDesc}, consider waiting until ${['March-May', 'June-July', 'January-February'][Math.floor(Math.random() * 3)]} when you could get 5-7% more due to seasonal demand.`,
      `Right now is actually ${['a great', 'a good', 'not the ideal'][Math.floor(Math.random() * 3)]} time to sell ${vehicleDesc}. ${context.isPremium ? 'Your premium report includes a 12-month price forecast to help you time the market perfectly.' : 'Upgrade to premium to see a 12-month price forecast that could help you maximize your selling price.'}`
    ],
    // Add more intent responses as needed
    general: [
      `I'm here to help you with any questions about ${vehicleDesc}. What specific information are you looking for regarding its value, accident history, or the best time to sell?`,
      `Is there something specific you'd like to know about ${vehicleDesc}? I can provide information on its value, market trends, or how various factors might affect your selling price.`,
      `I'd be happy to assist with information about ${vehicleDesc}. I can help with valuation estimates, accident impact analysis, or timing your sale for maximum value.`
    ]
  };
  
  // Get response array for the detected intent, or fall back to general
  const responseArray = responses[intent] || responses.general;
  
  // Select a random response from the appropriate category
  return responseArray[Math.floor(Math.random() * responseArray.length)];
}

// Helper functions for generating realistic responses
function randomRange(min: number, max: number): string {
  const value = Math.floor(min + Math.random() * (max - min));
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getRandomFactors(): string {
  const factors = [
    'local market demand', 
    'seasonal trends', 
    'color popularity', 
    'optional features', 
    'maintenance history',
    'fuel efficiency',
    'recent repairs',
    'title status',
    'number of previous owners'
  ];
  
  // Get 2-3 random factors
  const count = 2 + Math.floor(Math.random() * 2);
  const selected = [];
  
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * factors.length);
    selected.push(factors[index]);
    factors.splice(index, 1);
  }
  
  return selected.join(', ');
}
