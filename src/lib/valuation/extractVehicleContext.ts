
import { VehicleContext, AssistantContext } from '@/types/assistant';

export function extractVehicleContext(conversation: { role: string; content: string }[]): VehicleContext {
  try {
    const context: VehicleContext = {};
    const text = conversation.map(msg => msg.content).join(' ').toLowerCase();

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
  } catch (error) {
    console.error('❌ Error in extractVehicleContext:', error);
    return {}; // prevent crashing loop
  }
}

export function extractLocationContext(conversation: { role: string; content: string }[]): { region?: string; zipCode?: string } {
  try {
    const locationInfo: { region?: string; zipCode?: string } = {};
    const text = conversation.map(msg => msg.content).join(' ').toLowerCase();
    
    // Extract ZIP code
    const zipRegex = /\b\d{5}(?:-\d{4})?\b/g;
    const zipMatches = text.match(zipRegex);
    if (zipMatches && zipMatches.length > 0) {
      locationInfo.zipCode = zipMatches[0].substring(0, 5);
    }
    
    // Extract state/region
    const states = [
      'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut', 'delaware', 
      'florida', 'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 
      'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota', 'mississippi', 
      'missouri', 'montana', 'nebraska', 'nevada', 'new hampshire', 'new jersey', 'new mexico', 
      'new york', 'north carolina', 'north dakota', 'ohio', 'oklahoma', 'oregon', 'pennsylvania',
      'rhode island', 'south carolina', 'south dakota', 'tennessee', 'texas', 'utah', 'vermont',
      'virginia', 'washington', 'west virginia', 'wisconsin', 'wyoming'
    ];
    
    for (const state of states) {
      if (text.includes(state)) {
        locationInfo.region = state.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        break;
      }
    }
    
    return locationInfo;
  } catch (error) {
    console.error('❌ Error in extractLocationContext:', error);
    return {}; // prevent crashing
  }
}

// Re-export the functions from assistantContext.ts to maintain compatibility
export { detectIntent, generateResponse } from '@/utils/assistantContext';
