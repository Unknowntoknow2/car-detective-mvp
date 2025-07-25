/**
 * Vehicle Incentives API Connector Template
 * Connects to manufacturer and regional incentive data sources
 */

export interface VehicleIncentive {
  id: string;
  type: 'rebate' | 'financing' | 'lease' | 'loyalty' | 'trade_in' | 'military' | 'student' | 'conquest';
  title: string;
  description: string;
  amount: number;
  percentage?: number;
  
  // Vehicle targeting
  make: string;
  models?: string[];
  years?: number[];
  trims?: string[];
  
  // Geographic targeting
  regions?: string[];
  states?: string[];
  zipCodes?: string[];
  dealerGroups?: string[];
  
  // Eligibility
  eligibilityRequirements: string[];
  restrictions: string[];
  combinableWith: string[];
  
  // Timing
  startDate: string;
  endDate: string;
  isActive: boolean;
  priority: number;
  
  // Source
  source: string;
  sourceUrl?: string;
  lastUpdated: string;
  confidence: number;
}

export interface IncentiveSearchParams {
  make: string;
  model?: string;
  year?: number;
  trim?: string;
  zipCode: string;
  customerType?: 'retail' | 'fleet' | 'military' | 'student';
  incentiveTypes?: string[];
  activeOnly?: boolean;
}

export interface IncentiveSearchResult {
  incentives: VehicleIncentive[];
  totalValue: number;
  applicableIncentives: VehicleIncentive[];
  searchParams: IncentiveSearchParams;
  source: string;
}

export abstract class IncentiveConnector {
  protected name: string;
  protected apiKey?: string;
  protected baseUrl: string;
  
  constructor(name: string, baseUrl: string, apiKey?: string) {
    this.name = name;
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  abstract searchIncentives(params: IncentiveSearchParams): Promise<IncentiveSearchResult>;
}

/**
 * Manufacturer Incentive Connector (Generic)
 */
export class ManufacturerIncentiveConnector extends IncentiveConnector {
  constructor(make: string, apiKey: string) {
    super(`${make}_incentives`, `https://api.${make.toLowerCase()}.com/incentives`, apiKey);
  }

  async searchIncentives(params: IncentiveSearchParams): Promise<IncentiveSearchResult> {
    // Implementation would vary by manufacturer
    // This is a template structure
    
    const mockIncentives: VehicleIncentive[] = [
      {
        id: 'mfg_001',
        type: 'rebate',
        title: 'Cash Back Incentive',
        description: '$2,000 cash back on select models',
        amount: 2000,
        make: params.make,
        models: [params.model || 'All'],
        years: [new Date().getFullYear()],
        regions: ['National'],
        eligibilityRequirements: ['Must finance through manufacturer'],
        restrictions: ['Cannot be combined with special financing'],
        combinableWith: ['loyalty_rebate'],
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        priority: 1,
        source: this.name,
        lastUpdated: new Date().toISOString(),
        confidence: 0.9
      }
    ];

    return {
      incentives: mockIncentives,
      totalValue: mockIncentives.reduce((sum, inc) => sum + inc.amount, 0),
      applicableIncentives: mockIncentives.filter(inc => inc.isActive),
      searchParams: params,
      source: this.name
    };
  }
}

/**
 * Edmunds Incentive Connector
 */
export class EdmundsIncentiveConnector extends IncentiveConnector {
  constructor(apiKey: string) {
    super('Edmunds', 'https://api.edmunds.com/api/vehicle/v2', apiKey);
  }

  async searchIncentives(params: IncentiveSearchParams): Promise<IncentiveSearchResult> {
    if (!this.apiKey) {
      throw new Error('Edmunds API key required');
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/incentives?make=${params.make}&model=${params.model}&zip=${params.zipCode}&api_key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Edmunds API error: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseEdmundsResponse(data, params);

    } catch (error) {
      throw new Error(`Edmunds incentive search failed: ${error}`);
    }
  }

  private parseEdmundsResponse(data: any, params: IncentiveSearchParams): IncentiveSearchResult {
    const incentives: VehicleIncentive[] = (data.incentives || []).map((item: any) => ({
      id: item.id || `edmunds_${Math.random().toString(36).substr(2, 9)}`,
      type: this.mapIncentiveType(item.incentiveType),
      title: item.name || item.title,
      description: item.description || '',
      amount: item.dollarAmount || 0,
      percentage: item.percentage,
      make: params.make,
      models: item.applicableModels || [params.model],
      years: item.applicableYears || [new Date().getFullYear()],
      regions: item.regions || ['National'],
      eligibilityRequirements: item.requirements || [],
      restrictions: item.restrictions || [],
      combinableWith: item.combinableWith || [],
      startDate: item.startDate || new Date().toISOString(),
      endDate: item.endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: Boolean(item.isActive),
      priority: item.priority || 1,
      source: 'Edmunds',
      sourceUrl: item.url,
      lastUpdated: item.lastUpdated || new Date().toISOString(),
      confidence: 0.85
    }));

    return {
      incentives,
      totalValue: incentives.reduce((sum, inc) => sum + inc.amount, 0),
      applicableIncentives: incentives.filter(inc => inc.isActive),
      searchParams: params,
      source: 'Edmunds'
    };
  }

  private mapIncentiveType(type: string): VehicleIncentive['type'] {
    const typeMap: Record<string, VehicleIncentive['type']> = {
      'CASH_BACK': 'rebate',
      'REBATE': 'rebate',
      'FINANCING': 'financing',
      'LEASE': 'lease',
      'LOYALTY': 'loyalty',
      'TRADE_IN': 'trade_in',
      'MILITARY': 'military',
      'STUDENT': 'student',
      'CONQUEST': 'conquest'
    };
    return typeMap[type.toUpperCase()] || 'rebate';
  }
}

/**
 * Composite Incentive Connector
 */
export class CompositeIncentiveConnector {
  private connectors: IncentiveConnector[];

  constructor(connectors: IncentiveConnector[]) {
    this.connectors = connectors;
  }

  async searchIncentives(params: IncentiveSearchParams): Promise<IncentiveSearchResult> {
    const results = await Promise.allSettled(
      this.connectors.map(connector => connector.searchIncentives(params))
    );

    const successfulResults = results
      .filter((result): result is PromiseFulfilledResult<IncentiveSearchResult> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);

    if (successfulResults.length === 0) {
      throw new Error('All incentive connectors failed');
    }

    // Merge and deduplicate results
    const allIncentives = successfulResults.flatMap(result => result.incentives);
    const deduplicatedIncentives = this.deduplicateIncentives(allIncentives);
    const applicableIncentives = deduplicatedIncentives.filter(inc => inc.isActive);
    const totalValue = applicableIncentives.reduce((sum, inc) => sum + inc.amount, 0);

    return {
      incentives: deduplicatedIncentives,
      totalValue,
      applicableIncentives,
      searchParams: params,
      source: successfulResults.map(r => r.source).join(', ')
    };
  }

  private deduplicateIncentives(incentives: VehicleIncentive[]): VehicleIncentive[] {
    const seen = new Set<string>();
    const deduplicated: VehicleIncentive[] = [];

    for (const incentive of incentives) {
      const key = `${incentive.type}_${incentive.title}_${incentive.amount}`;
      
      if (!seen.has(key)) {
        seen.add(key);
        deduplicated.push(incentive);
      }
    }

    return deduplicated.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Calculate best incentive combinations
   */
  calculateBestCombination(incentives: VehicleIncentive[]): {
    combination: VehicleIncentive[];
    totalValue: number;
    savings: number;
  } {
    const applicableIncentives = incentives.filter(inc => inc.isActive);
    
    // Simple greedy algorithm - in practice, this would be more sophisticated
    const combination: VehicleIncentive[] = [];
    const used = new Set<string>();
    
    // Sort by value descending
    const sorted = [...applicableIncentives].sort((a, b) => b.amount - a.amount);
    
    for (const incentive of sorted) {
      if (used.has(incentive.id)) continue;
      
      // Check if this incentive can be combined with already selected ones
      const canCombine = combination.every(existing => 
        incentive.combinableWith.includes(existing.id) || 
        existing.combinableWith.includes(incentive.id)
      );
      
      if (canCombine) {
        combination.push(incentive);
        used.add(incentive.id);
        
        // Mark conflicting incentives as used
        incentive.restrictions.forEach(restriction => {
          const conflicting = sorted.find(inc => inc.title.includes(restriction));
          if (conflicting) used.add(conflicting.id);
        });
      }
    }
    
    const totalValue = combination.reduce((sum, inc) => sum + inc.amount, 0);
    
    return {
      combination,
      totalValue,
      savings: totalValue
    };
  }
}

// Factory function
export function createIncentiveConnector(config: {
  edmundsApiKey?: string;
  manufacturerKeys?: Record<string, string>;
  enabledSources?: string[];
}): CompositeIncentiveConnector {
  const connectors: IncentiveConnector[] = [];
  
  if (config.edmundsApiKey) {
    connectors.push(new EdmundsIncentiveConnector(config.edmundsApiKey));
  }
  
  if (config.manufacturerKeys) {
    Object.entries(config.manufacturerKeys).forEach(([make, apiKey]) => {
      connectors.push(new ManufacturerIncentiveConnector(make, apiKey));
    });
  }
  
  if (connectors.length === 0) {
    // Add a mock connector for development
    connectors.push(new ManufacturerIncentiveConnector('Toyota', 'mock-key'));
  }
  
  return new CompositeIncentiveConnector(connectors);
}