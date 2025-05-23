
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { AssistantContext } from '@/utils/assistantContext';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

interface AskAIParams {
  question: string;
  userContext?: Record<string, any> | null;
  chatHistory?: Message[];
  valuationId?: string;
}

export async function askAI({ question, userContext, chatHistory, valuationId }: AskAIParams): Promise<{
  answer?: string;
  error?: string;
}> {
  try {
    // Enhanced context for improved conversation awareness
    const enhancedContext: AssistantContext = {
      ...(userContext as AssistantContext || {}),
      vehicle: {
        ...(userContext?.vehicle || {})
      },
      userLocation: {
        zipCode: userContext?.vehicle?.zipCode || '',
        region: determineRegion(userContext?.vehicle?.zipCode || '')
      },
      isPremium: userContext?.isPremium || false,
      previousIntents: userContext?.previousIntents || []
    };
    
    // Add valuation data if available
    if (valuationId) {
      const valuation = await getValuationData(valuationId);
      if (valuation) {
        enhancedContext.vehicle = {
          ...enhancedContext.vehicle,
          make: valuation.make || enhancedContext.vehicle?.make,
          model: valuation.model || enhancedContext.vehicle?.model,
          year: valuation.year || enhancedContext.vehicle?.year,
          mileage: valuation.mileage || enhancedContext.vehicle?.mileage,
          condition: valuation.condition || enhancedContext.vehicle?.condition || 'Unknown',
          zipCode: valuation.zipCode || valuation.zip_code || enhancedContext.vehicle?.zipCode || '',
          estimatedValue: valuation.estimatedValue || valuation.estimated_value
        };
      }
    }
    
    // Create a detailed system prompt
    const promptDetails = [];
    
    // Add vehicle details if available
    if (enhancedContext.vehicle && Object.keys(enhancedContext.vehicle).length > 0) {
      const v = enhancedContext.vehicle;
      if (v.make && v.model && v.year) {
        promptDetails.push(`Vehicle: ${v.year} ${v.make} ${v.model}`);
      }
      if (v.mileage) promptDetails.push(`Mileage: ${v.mileage.toLocaleString()} miles`);
      if (v.condition) promptDetails.push(`Condition: ${v.condition}`);
      if (v.zipCode) promptDetails.push(`Location: ${v.zipCode}`);
      if (v.estimatedValue) promptDetails.push(`Estimated Value: $${v.estimatedValue.toLocaleString()}`);
      if (v.accidentCount !== undefined) {
        promptDetails.push(`Accident History: ${v.accidentCount} accident(s)${v.accidentSeverity ? ` (${v.accidentSeverity})` : ''}`);
      }
    }
    
    // Note premium status
    if (enhancedContext.isPremium) {
      promptDetails.push("Premium User: Yes");
    }
    
    // Add intent information if available
    if (enhancedContext.previousIntents && enhancedContext.previousIntents.length > 0) {
      const lastIntent = enhancedContext.previousIntents[enhancedContext.previousIntents.length - 1];
      promptDetails.push(`Current Intent: ${lastIntent.replace('_', ' ')}`);
    }
    
    // Create the full system prompt
    const systemPrompt = `You are AIN — Auto Intelligence Network™, a GPT-4-powered vehicle valuation assistant built by Car Detective. Your job is to assist users with car valuations, market trends, premium report benefits, dealer offers, and CARFAX® insights. 

Use the user's context to give smart, helpful answers. Always respond in a confident, conversational tone that's data-driven, respectful, intelligent, and helpful.

Never guess. If info is missing (e.g., no valuation), ask for it clearly and specifically. Don't repeat yourself or ask for information the user has already provided.

If the user asks about accident impact and you know their vehicle details, explain the typical value impact by severity (minor: 3-5%, moderate: 5-10%, severe: 10-20%).

If the user asks about best time to sell and you know their location, provide regional seasonal trends (e.g., Bay Area spring demand peaks in March-April).

For premium features (CARFAX reports, market comparables, detailed forecasts), offer upgrade information only when relevant to the conversation.

Your goal: help individuals sell smarter and help dealers make profitable decisions with speed and trust.

${promptDetails.length > 0 ? `\nUser context:\n${promptDetails.join('\n')}` : ''}`;

    // First try using Supabase Function if available
    try {
      const { data, error } = await supabase.functions.invoke('ask-ai', {
        body: {
          question,
          userContext: enhancedContext,
          systemPrompt,
          chatHistory: chatHistory?.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }
      });
      
      if (!error && data?.answer) {
        return { answer: data.answer };
      }
      
      // If Supabase function failed, we'll try the regular API endpoint as fallback
      console.warn('Supabase function failed, falling back to regular endpoint', error);
    } catch (e) {
      console.warn('Supabase not configured correctly, using regular endpoint');
    }
    
    // Regular API endpoint as fallback - in a real implementation, this would call your backend
    // For now, we'll simulate a response based on the question
    const simulatedResponse = simulateAIResponse(question, enhancedContext);
    return { answer: simulatedResponse };
    
  } catch (error: any) {
    console.error('AI assistant error:', error);
    return { error: error.message || 'Failed to get AI response' };
  }
}

// Simplified function to determine region from ZIP code
function determineRegion(zipCode: string): string {
  if (!zipCode) return '';
  
  const firstDigit = zipCode.charAt(0);
  
  const regions: Record<string, string> = {
    '0': 'Northeast',
    '1': 'Northeast',
    '2': 'South Atlantic',
    '3': 'Southeast',
    '4': 'Midwest',
    '5': 'Midwest',
    '6': 'South Central',
    '7': 'Southwest',
    '8': 'Mountain West',
    '9': 'West Coast'
  };
  
  return regions[firstDigit] || '';
}

// Fetch valuation data - in a real implementation, this would query your database
async function getValuationData(valuationId: string) {
  try {
    const { data, error } = await supabase
      .from('valuations')
      .select('*')
      .eq('id', valuationId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching valuation data:', error);
    return null;
  }
}

// Temporary function to simulate AI responses for preview purposes
function simulateAIResponse(question: string, context: AssistantContext): string {
  const q = question.toLowerCase();
  const vehicle = context.vehicle;
  
  // Prepare vehicle description if available
  let vehicleDesc = '';
  if (vehicle?.make && vehicle?.model && vehicle?.year) {
    vehicleDesc = `your ${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  }
  
  // Check for accident-related questions
  if (q.includes('accident') || q.includes('damage') || q.includes('crash')) {
    if (!vehicleDesc) {
      return "To explain how accidents affect a car's value, I need to know what vehicle you have. Could you share the make, model, and year?";
    }
    
    if (vehicle?.accidentCount !== undefined) {
      const severity = vehicle.accidentSeverity || 'moderate';
      const impactPercents = { 'minor': '3-5%', 'moderate': '5-10%', 'severe': '10-20%' };
      const impactPercent = impactPercents[severity as keyof typeof impactPercents];
      
      return `Based on ${vehicleDesc} with ${vehicle.accidentCount} ${vehicle.accidentCount === 1 ? 'accident' : 'accidents'} of ${severity} severity, I estimate the value impact to be around ${impactPercent}. ${context.isPremium ? 'Your Premium access shows the detailed value adjustment in your report.' : 'For a detailed analysis including CARFAX accident history and specific value impact, consider our Premium report.'}`;
    }
    
    return `For ${vehicleDesc}, accident impact varies by severity. Minor accidents typically reduce value by 3-5%, moderate by 5-10%, and severe by 10-20% or more. Has your vehicle been in an accident, and if so, how severe was it?`;
  }
  
  // Check for timing/selling questions
  if (q.includes('when') || q.includes('best time') || q.includes('sell') || q.includes('market')) {
    const region = context.userLocation?.region || 'your region';
    const zipCode = vehicle?.zipCode || context.userLocation?.zipCode;
    
    let seasonalAdvice = 'spring (March-May) is typically the best time to sell';
    let regionName = region;
    
    // Special case for certain ZIP codes
    if (zipCode) {
      if (zipCode.startsWith('941') || zipCode.startsWith('940') || zipCode.startsWith('943')) {
        regionName = 'the San Francisco Bay Area';
        seasonalAdvice = 'early spring (March-April) typically sees higher demand due to tech hiring cycles and bonus season';
      } else if (zipCode.startsWith('900') || zipCode.startsWith('902')) {
        regionName = 'Los Angeles';
        seasonalAdvice = 'February through May typically sees strong demand due to tax refund season';
      }
    }
    
    if (vehicleDesc) {
      return `For ${vehicleDesc} in ${regionName}, ${seasonalAdvice}. This is when inventory is lower and demand starts increasing, potentially getting you 5-10% more than during the off-season. ${context.isPremium ? 'Your Premium report includes a detailed seasonal forecast chart showing projected values over the next 12 months.' : ''}`;
    } else {
      return `In ${regionName}, ${seasonalAdvice}. This is when inventory is lower and demand starts increasing, potentially getting you 5-10% more than during the off-season. If you tell me your vehicle's make, model, and year, I can provide more specific timing advice.`;
    }
  }
  
  // Check for value-related questions
  if (q.includes('worth') || q.includes('value') || q.includes('price') || q.includes('how much')) {
    if (!vehicleDesc) {
      return "I'd be happy to help you determine your car's value. To give you an accurate estimate, I need to know the make, model, and year of your vehicle. Could you provide those details?";
    }
    
    if (!vehicle?.mileage) {
      return `To give you an accurate valuation for ${vehicleDesc}, I need to know the mileage. Could you share how many miles are on your vehicle?`;
    }
    
    if (vehicle.estimatedValue) {
      return `Based on current market data, ${vehicleDesc} with ${vehicle.mileage.toLocaleString()} miles is worth approximately $${vehicle.estimatedValue.toLocaleString()}. ${context.isPremium ? 'Your Premium report includes detailed comparables and price breakdown by feature.' : 'For a comprehensive valuation with CARFAX history integration and market comparables, consider upgrading to our Premium report.'}`;
    }
    
    return `For ${vehicleDesc} with ${vehicle.mileage.toLocaleString()} miles, I'll need to generate a valuation. Would you like me to do that for you now? I can also factor in the vehicle condition if you provide that information.`;
  }
  
  // Default response if no specific intent is detected
  if (vehicleDesc) {
    return `I'm here to help with any questions about ${vehicleDesc}. I can provide information about its value, accident impact, best time to sell, market trends, and more. What specific information are you looking for?`;
  }
  
  return "I'm here to help with your car valuation questions. To get started, could you tell me the make, model, and year of your vehicle?";
}
