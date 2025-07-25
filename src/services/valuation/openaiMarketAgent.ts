import type { MarketListing } from '@/types/marketListing';
import { BingSearchService, type BingSearchParams } from './bingSearchService';

export interface OpenAIMarketSearchParams {
  make: string;
  model: string;
  year: number;
  mileage?: number;
  zipCode: string;
  radius?: number;
  trim?: string;
}

export interface OpenAIFunctionCall {
  name: string;
  arguments: string;
}

/**
 * OpenAI Market Agent - Uses OpenAI function calling to route to Bing Search
 * Extension-ready architecture for future OpenAI integrations
 */
export class OpenAIMarketAgent {
  private static readonly OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

  /**
   * Search for vehicle listings using OpenAI function calling with Bing Search
   */
  static async searchVehicleListings(params: OpenAIMarketSearchParams): Promise<MarketListing[]> {
    console.log('🤖 OpenAI Market Agent: Starting function-calling search', params);

    const apiKey = this.getOpenAIApiKey();
    if (!apiKey) {
      console.warn('⚠️ OPENAI_API_KEY not configured - falling back to direct Bing search');
      return await this.fallbackToBingSearch(params);
    }

    try {
      const functionCall = await this.callOpenAIWithFunctions(params, apiKey);
      
      if (functionCall?.name === 'search_vehicle_listings_bing') {
        const bingParams = JSON.parse(functionCall.arguments);
        console.log('🔄 OpenAI routing to Bing Search with params:', bingParams);
        return await BingSearchService.searchVehicleListings(bingParams);
      }

      console.log('ℹ️ No function call returned from OpenAI, using direct Bing search');
      return await this.fallbackToBingSearch(params);

    } catch (error) {
      console.error('❌ OpenAI Market Agent error:', error);
      console.log('🔄 Falling back to direct Bing search');
      return await this.fallbackToBingSearch(params);
    }
  }

  /**
   * Call OpenAI with function definitions for vehicle search
   */
  private static async callOpenAIWithFunctions(
    params: OpenAIMarketSearchParams, 
    apiKey: string
  ): Promise<OpenAIFunctionCall | null> {
    const functionDefinition = {
      name: 'search_vehicle_listings_bing',
      description: 'Search for real vehicle listings using Bing Search API to guarantee only live, verified automotive marketplace results',
      parameters: {
        type: 'object',
        properties: {
          make: {
            type: 'string',
            description: 'Vehicle manufacturer (e.g., Toyota, Honda, Nissan)'
          },
          model: {
            type: 'string', 
            description: 'Vehicle model (e.g., Camry, Accord, Altima)'
          },
          year: {
            type: 'integer',
            description: 'Vehicle year'
          },
          mileage: {
            type: 'integer',
            description: 'Vehicle mileage (optional)'
          },
          zipCode: {
            type: 'string',
            description: 'Search area zip code'
          },
          radius: {
            type: 'integer',
            description: 'Search radius in miles (default: 50)'
          }
        },
        required: ['make', 'model', 'year', 'zipCode']
      }
    };

    const systemMessage = `You are a professional automotive market research agent. Your task is to search for REAL, LIVE vehicle listings using only verified automotive marketplace sources.

CRITICAL REQUIREMENTS:
- Use ONLY the search_vehicle_listings_bing function to find real listings
- NEVER generate or create synthetic/fake listing data
- If no real listings are found, return empty results
- Only use live automotive marketplace sources (AutoTrader, Cars.com, CarGurus, etc.)
- Ensure all URLs are real and accessible

Your role is to route requests to the Bing Search API which will return only verified, live marketplace listings.`;

    const userMessage = `Search for real market listings for a ${params.year} ${params.make} ${params.model}${params.trim ? ` ${params.trim}` : ''}${params.mileage ? ` with approximately ${params.mileage} miles` : ''} near zip code ${params.zipCode}.

Requirements:
- Find only REAL listings from automotive marketplaces
- Validate all URLs are working and accessible  
- Return empty results if no real listings are found
- Do not generate any synthetic or fake data`;

    const response = await fetch(this.OPENAI_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage }
        ],
        functions: [functionDefinition],
        function_call: { name: 'search_vehicle_listings_bing' },
        temperature: 0.1,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message;
    
    if (message?.function_call) {
      console.log('✅ OpenAI function call received:', message.function_call.name);
      return {
        name: message.function_call.name,
        arguments: message.function_call.arguments
      };
    }

    return null;
  }

  /**
   * Fallback to direct Bing search when OpenAI is not available
   */
  private static async fallbackToBingSearch(params: OpenAIMarketSearchParams): Promise<MarketListing[]> {
    const bingParams: BingSearchParams = {
      make: params.make,
      model: params.model,
      year: params.year,
      mileage: params.mileage,
      zipCode: params.zipCode,
      radius: params.radius || 50
    };

    return await BingSearchService.searchVehicleListings(bingParams);
  }

  /**
   * Get OpenAI API key from environment
   */
  private static getOpenAIApiKey(): string | null {
    return process.env.OPENAI_API_KEY || 
           process.env.VITE_OPENAI_API_KEY ||
           null;
  }

  /**
   * Validate search parameters
   */
  static validateSearchParams(params: OpenAIMarketSearchParams): string[] {
    const errors: string[] = [];

    if (!params.make || params.make.trim() === '') {
      errors.push('Make is required');
    }

    if (!params.model || params.model.trim() === '') {
      errors.push('Model is required');
    }

    if (!params.year || params.year < 1900 || params.year > new Date().getFullYear() + 1) {
      errors.push('Valid year is required');
    }

    if (!params.zipCode || !/^\d{5}(-\d{4})?$/.test(params.zipCode)) {
      errors.push('Valid zip code is required');
    }

    if (params.mileage && (params.mileage < 0 || params.mileage > 1000000)) {
      errors.push('Mileage must be between 0 and 1,000,000');
    }

    if (params.radius && (params.radius < 1 || params.radius > 500)) {
      errors.push('Radius must be between 1 and 500 miles');
    }

    return errors;
  }

  /**
   * Get agent status and configuration
   */
  static getAgentStatus(): {
    openaiConfigured: boolean;
    bingConfigured: boolean;
    ready: boolean;
  } {
    const openaiConfigured = !!this.getOpenAIApiKey();
    const bingConfigured = !!(process.env.BING_API_KEY || process.env.VITE_BING_API_KEY);

    return {
      openaiConfigured,
      bingConfigured,
      ready: bingConfigured // At minimum, Bing must be configured
    };
  }
}