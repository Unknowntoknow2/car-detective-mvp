/**
 * VIN Decode API Connector Template
 * Supports multiple VIN decode services with fallback chain
 */

export interface VinDecodeResult {
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  bodyType?: string;
  engineType?: string;
  transmission?: string;
  fuelType?: string;
  driveType?: string;
  doors?: number;
  cylinders?: number;
  displacement?: number;
  manufacturerName?: string;
  plantCountry?: string;
  plantState?: string;
  plantCity?: string;
  vehicleType?: string;
  safetyRating?: {
    overall?: number;
    driver?: number;
    passenger?: number;
    rollover?: number;
  };
  confidence: number;
  source: string;
}

export abstract class VinDecodeConnector {
  protected name: string;
  protected apiKey?: string;
  protected baseUrl: string;
  protected rateLimit: { requests: number; windowMs: number };
  
  constructor(name: string, baseUrl: string, apiKey?: string) {
    this.name = name;
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.rateLimit = { requests: 100, windowMs: 60000 }; // Default: 100 requests per minute
  }

  abstract decodeVin(vin: string): Promise<VinDecodeResult>;
  
  protected validateVin(vin: string): boolean {
    // Basic VIN validation
    if (!vin || vin.length !== 17) return false;
    
    // Check for invalid characters
    const invalidChars = /[IOQ]/gi;
    if (invalidChars.test(vin)) return false;
    
    return true;
  }

  protected calculateCheckDigit(vin: string): string {
    const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
    const values: Record<string, number> = {
      'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8,
      'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7, 'R': 9,
      'S': 2, 'T': 3, 'U': 4, 'V': 5, 'W': 6, 'X': 7, 'Y': 8, 'Z': 9
    };

    let sum = 0;
    for (let i = 0; i < 17; i++) {
      const char = vin[i];
      const value = isNaN(parseInt(char)) ? values[char] || 0 : parseInt(char);
      sum += value * weights[i];
    }

    const remainder = sum % 11;
    return remainder === 10 ? 'X' : remainder.toString();
  }
}

/**
 * NHTSA VIN Decode Connector (Free)
 */
export class NHTSAVinDecoder extends VinDecodeConnector {
  constructor() {
    super('NHTSA', 'https://vpic.nhtsa.dot.gov/api/vehicles');
  }

  async decodeVin(vin: string): Promise<VinDecodeResult> {
    if (!this.validateVin(vin)) {
      throw new Error('Invalid VIN format');
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/decodevin/${vin}?format=json`
      );

      if (!response.ok) {
        throw new Error(`NHTSA API error: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseNHTSAResponse(vin, data);

    } catch (error) {
      throw new Error(`NHTSA VIN decode failed: ${error}`);
    }
  }

  private parseNHTSAResponse(vin: string, data: any): VinDecodeResult {
    const results = data.Results || [];
    const resultMap = new Map();
    
    results.forEach((item: any) => {
      if (item.Value && item.Value !== 'Not Applicable') {
        resultMap.set(item.Variable, item.Value);
      }
    });

    return {
      vin,
      make: resultMap.get('Make') || '',
      model: resultMap.get('Model') || '',
      year: parseInt(resultMap.get('Model Year')) || 0,
      trim: resultMap.get('Trim') || resultMap.get('Series'),
      bodyType: resultMap.get('Body Class'),
      engineType: resultMap.get('Engine Configuration'),
      transmission: resultMap.get('Transmission Style'),
      fuelType: resultMap.get('Fuel Type - Primary'),
      driveType: resultMap.get('Drive Type'),
      doors: parseInt(resultMap.get('Doors')) || undefined,
      cylinders: parseInt(resultMap.get('Engine Number of Cylinders')) || undefined,
      displacement: parseFloat(resultMap.get('Displacement (L)')) || undefined,
      manufacturerName: resultMap.get('Manufacturer Name'),
      plantCountry: resultMap.get('Plant Country'),
      plantState: resultMap.get('Plant State'),
      vehicleType: resultMap.get('Vehicle Type'),
      confidence: this.calculateConfidence(resultMap),
      source: 'NHTSA'
    };
  }

  private calculateConfidence(resultMap: Map<string, any>): number {
    const requiredFields = ['Make', 'Model', 'Model Year'];
    const optionalFields = ['Trim', 'Body Class', 'Engine Configuration', 'Fuel Type - Primary'];
    
    let confidence = 0.5; // Base confidence
    
    // Required fields
    for (const field of requiredFields) {
      if (resultMap.get(field)) {
        confidence += 0.15;
      }
    }
    
    // Optional fields
    for (const field of optionalFields) {
      if (resultMap.get(field)) {
        confidence += 0.05;
      }
    }
    
    return Math.min(confidence, 0.95);
  }
}

/**
 * VinAudit API Connector (Paid)
 */
export class VinAuditDecoder extends VinDecodeConnector {
  constructor(apiKey: string) {
    super('VinAudit', 'https://api.vinaudit.com/v2', apiKey);
  }

  async decodeVin(vin: string): Promise<VinDecodeResult> {
    if (!this.validateVin(vin)) {
      throw new Error('Invalid VIN format');
    }

    if (!this.apiKey) {
      throw new Error('VinAudit API key required');
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/decode?vin=${vin}&key=${this.apiKey}&format=json`
      );

      if (!response.ok) {
        throw new Error(`VinAudit API error: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseVinAuditResponse(vin, data);

    } catch (error) {
      throw new Error(`VinAudit VIN decode failed: ${error}`);
    }
  }

  private parseVinAuditResponse(vin: string, data: any): VinDecodeResult {
    const spec = data.specification || {};
    
    return {
      vin,
      make: spec.make || '',
      model: spec.model || '',
      year: spec.year || 0,
      trim: spec.trim,
      bodyType: spec.body_type,
      engineType: spec.engine_type,
      transmission: spec.transmission,
      fuelType: spec.fuel_type,
      driveType: spec.drive_type,
      doors: spec.doors,
      cylinders: spec.cylinders,
      displacement: spec.displacement,
      manufacturerName: spec.manufacturer,
      safetyRating: data.safety_rating,
      confidence: 0.9, // VinAudit typically has high confidence
      source: 'VinAudit'
    };
  }
}

/**
 * ClearVin API Connector (Paid)
 */
export class ClearVinDecoder extends VinDecodeConnector {
  constructor(apiKey: string) {
    super('ClearVin', 'https://api.clearvin.com', apiKey);
  }

  async decodeVin(vin: string): Promise<VinDecodeResult> {
    if (!this.validateVin(vin)) {
      throw new Error('Invalid VIN format');
    }

    if (!this.apiKey) {
      throw new Error('ClearVin API key required');
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/v1/vehicles/${vin}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`ClearVin API error: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseClearVinResponse(vin, data);

    } catch (error) {
      throw new Error(`ClearVin VIN decode failed: ${error}`);
    }
  }

  private parseClearVinResponse(vin: string, data: any): VinDecodeResult {
    const vehicle = data.vehicle || {};
    
    return {
      vin,
      make: vehicle.make || '',
      model: vehicle.model || '',
      year: vehicle.year || 0,
      trim: vehicle.trim,
      bodyType: vehicle.body_style,
      engineType: vehicle.engine?.type,
      transmission: vehicle.transmission?.type,
      fuelType: vehicle.fuel_type,
      driveType: vehicle.drivetrain,
      doors: vehicle.doors,
      cylinders: vehicle.engine?.cylinders,
      displacement: vehicle.engine?.displacement,
      manufacturerName: vehicle.manufacturer,
      confidence: 0.92, // ClearVin typically has very high confidence
      source: 'ClearVin'
    };
  }
}

/**
 * Composite VIN Decoder with fallback chain
 */
export class CompositeVinDecoder {
  private decoders: VinDecodeConnector[];

  constructor(decoders: VinDecodeConnector[]) {
    this.decoders = decoders;
  }

  async decodeVin(vin: string): Promise<VinDecodeResult> {
    const errors: string[] = [];

    for (const decoder of this.decoders) {
      try {
        const result = await decoder.decodeVin(vin);
        if (result.confidence > 0.7) {
          return result;
        }
      } catch (error) {
        errors.push(`${decoder.constructor.name}: ${error}`);
        continue;
      }
    }

    throw new Error(`All VIN decoders failed: ${errors.join(', ')}`);
  }

  /**
   * Decode VIN with all providers and return best result
   */
  async decodeVinWithBestResult(vin: string): Promise<VinDecodeResult> {
    const results = await Promise.allSettled(
      this.decoders.map(decoder => decoder.decodeVin(vin))
    );

    const successfulResults = results
      .filter((result): result is PromiseFulfilledResult<VinDecodeResult> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);

    if (successfulResults.length === 0) {
      throw new Error('No VIN decoder succeeded');
    }

    // Return result with highest confidence
    return successfulResults.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );
  }
}

// Factory function for easy setup
export function createVinDecoder(config: {
  vinAuditApiKey?: string;
  clearVinApiKey?: string;
  preferredOrder?: ('nhtsa' | 'vinaudit' | 'clearvin')[];
}): CompositeVinDecoder {
  const decoders: VinDecodeConnector[] = [];
  const order = config.preferredOrder || ['clearvin', 'vinaudit', 'nhtsa'];

  for (const provider of order) {
    switch (provider) {
      case 'nhtsa':
        decoders.push(new NHTSAVinDecoder());
        break;
      case 'vinaudit':
        if (config.vinAuditApiKey) {
          decoders.push(new VinAuditDecoder(config.vinAuditApiKey));
        }
        break;
      case 'clearvin':
        if (config.clearVinApiKey) {
          decoders.push(new ClearVinDecoder(config.clearVinApiKey));
        }
        break;
    }
  }

  if (decoders.length === 0) {
    // Fallback to free NHTSA
    decoders.push(new NHTSAVinDecoder());
  }

  return new CompositeVinDecoder(decoders);
}