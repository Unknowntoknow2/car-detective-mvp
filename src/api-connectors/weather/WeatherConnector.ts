/**
 * Weather Impact API Connector Template
 * Analyzes weather patterns and their impact on vehicle valuation
 */

export interface WeatherData {
  location: {
    zipCode: string;
    city: string;
    state: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  
  current: {
    temperature: number;
    humidity: number;
    precipitation: number;
    windSpeed: number;
    uvIndex: number;
    visibility: number;
    conditions: string;
    timestamp: string;
  };
  
  historical: {
    averageTemperature: number;
    temperatureRange: [number, number];
    annualPrecipitation: number;
    snowfall: number;
    humidityAverage: number;
    sunlightHours: number;
    extremeWeatherDays: number;
    period: string; // e.g., "5-year average"
  };
  
  seasonal: {
    spring: SeasonalData;
    summer: SeasonalData;
    fall: SeasonalData;
    winter: SeasonalData;
  };
  
  hazards: WeatherHazard[];
  airQuality: AirQualityData;
}

export interface SeasonalData {
  avgTemperature: number;
  precipitation: number;
  humidityAverage: number;
  extremeEvents: number;
  roadSaltExposure: number; // scale 0-10
}

export interface WeatherHazard {
  type: 'hurricane' | 'tornado' | 'hail' | 'flood' | 'wildfire' | 'ice_storm' | 'snow' | 'heat_wave';
  frequency: number; // events per year
  severity: 'low' | 'moderate' | 'high' | 'extreme';
  lastOccurrence?: string;
  averageDamage?: number;
}

export interface AirQualityData {
  aqi: number;
  pm25: number;
  pm10: number;
  ozone: number;
  co: number;
  so2: number;
  no2: number;
  pollutionLevel: 'good' | 'moderate' | 'unhealthy_sensitive' | 'unhealthy' | 'very_unhealthy' | 'hazardous';
}

export interface WeatherImpactAnalysis {
  overallRisk: 'low' | 'moderate' | 'high' | 'extreme';
  riskScore: number; // 0-100
  
  impacts: {
    paintDegradation: number; // UV, acid rain impact
    metalCorrosion: number; // salt, humidity impact
    interiorWear: number; // heat, UV impact
    mechanicalStress: number; // temperature cycles, extreme weather
    floodRisk: number; // flood zone risk
    hailDamage: number; // hail frequency/severity
  };
  
  valuationAdjustment: {
    percentage: number; // -5% to +5% typically
    dollarAmount: number;
    reasoning: string[];
  };
  
  recommendations: string[];
  confidence: number;
}

export interface WeatherSearchParams {
  zipCode: string;
  vehicleAge?: number;
  vehicleType?: 'sedan' | 'suv' | 'truck' | 'convertible' | 'sports';
  garageKept?: boolean;
  period?: 'current' | '1year' | '5year' | '10year';
}

export abstract class WeatherConnector {
  protected name: string;
  protected apiKey?: string;
  protected baseUrl: string;
  
  constructor(name: string, baseUrl: string, apiKey?: string) {
    this.name = name;
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  abstract getWeatherData(params: WeatherSearchParams): Promise<WeatherData>;
  abstract analyzeWeatherImpact(weatherData: WeatherData, params: WeatherSearchParams): Promise<WeatherImpactAnalysis>;
}

/**
 * OpenWeatherMap Connector
 */
export class OpenWeatherConnector extends WeatherConnector {
  constructor(apiKey: string) {
    super('OpenWeatherMap', 'https://api.openweathermap.org/data/3.0', apiKey);
  }

  async getWeatherData(params: WeatherSearchParams): Promise<WeatherData> {
    if (!this.apiKey) {
      throw new Error('OpenWeatherMap API key required');
    }

    try {
      // Get coordinates from zip code
      const geoResponse = await fetch(
        `http://api.openweathermap.org/geo/1.0/zip?zip=${params.zipCode},US&appid=${this.apiKey}`
      );
      
      if (!geoResponse.ok) {
        throw new Error(`Geocoding failed: ${geoResponse.statusText}`);
      }
      
      const geoData = await geoResponse.json();
      const { lat, lon, name, state } = geoData;

      // Get current weather
      const currentResponse = await fetch(
        `${this.baseUrl}/onecall?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&exclude=minutely,hourly`
      );
      
      if (!currentResponse.ok) {
        throw new Error(`Weather API failed: ${currentResponse.statusText}`);
      }
      
      const currentData = await currentResponse.json();
      
      // Get historical data (would require additional API calls)
      const historicalData = await this.getHistoricalData(lat, lon, params.period || '5year');
      
      return this.parseOpenWeatherResponse({
        geo: { lat, lon, name, state, zipCode: params.zipCode },
        current: currentData,
        historical: historicalData
      });

    } catch (error) {
      throw new Error(`OpenWeatherMap request failed: ${error}`);
    }
  }

  async analyzeWeatherImpact(weatherData: WeatherData, params: WeatherSearchParams): Promise<WeatherImpactAnalysis> {
    const impacts = this.calculateWeatherImpacts(weatherData, params);
    const riskScore = this.calculateRiskScore(impacts);
    const valuationAdjustment = this.calculateValuationAdjustment(impacts, params);
    
    return {
      overallRisk: this.categorizeRisk(riskScore),
      riskScore,
      impacts,
      valuationAdjustment,
      recommendations: this.generateRecommendations(impacts, weatherData),
      confidence: 0.8
    };
  }

  private async getHistoricalData(lat: number, lon: number, period: string): Promise<any> {
    // Simplified - in reality, this would make multiple API calls for historical data
    return {
      averageTemperature: 15,
      temperatureRange: [-10, 35] as [number, number],
      annualPrecipitation: 800,
      snowfall: 50,
      humidityAverage: 65,
      sunlightHours: 2500,
      extremeWeatherDays: 15,
      period: '5-year average'
    };
  }

  private parseOpenWeatherResponse(data: any): WeatherData {
    const { geo, current, historical } = data;
    
    return {
      location: {
        zipCode: geo.zipCode,
        city: geo.name,
        state: geo.state,
        coordinates: {
          latitude: geo.lat,
          longitude: geo.lon
        }
      },
      
      current: {
        temperature: current.current.temp,
        humidity: current.current.humidity,
        precipitation: current.daily[0].rain?.['1h'] || 0,
        windSpeed: current.current.wind_speed,
        uvIndex: current.current.uvi,
        visibility: current.current.visibility / 1000, // Convert to km
        conditions: current.current.weather[0].description,
        timestamp: new Date(current.current.dt * 1000).toISOString()
      },
      
      historical,
      
      seasonal: {
        spring: { avgTemperature: 15, precipitation: 100, humidityAverage: 60, extremeEvents: 2, roadSaltExposure: 2 },
        summer: { avgTemperature: 25, precipitation: 80, humidityAverage: 70, extremeEvents: 3, roadSaltExposure: 0 },
        fall: { avgTemperature: 10, precipitation: 90, humidityAverage: 65, extremeEvents: 2, roadSaltExposure: 1 },
        winter: { avgTemperature: -5, precipitation: 120, humidityAverage: 55, extremeEvents: 4, roadSaltExposure: 8 }
      },
      
      hazards: this.identifyHazards(current, geo),
      
      airQuality: {
        aqi: 85,
        pm25: 12,
        pm10: 25,
        ozone: 0.06,
        co: 0.3,
        so2: 0.02,
        no2: 0.03,
        pollutionLevel: 'moderate'
      }
    };
  }

  private identifyHazards(currentData: any, geo: any): WeatherHazard[] {
    // Simplified hazard identification based on location and weather patterns
    const hazards: WeatherHazard[] = [];
    
    // Latitude-based hazard assessment
    if (geo.lat > 40) {
      hazards.push({
        type: 'snow',
        frequency: 15,
        severity: 'moderate',
        lastOccurrence: '2024-01-15'
      });
      
      hazards.push({
        type: 'ice_storm',
        frequency: 2,
        severity: 'high',
        lastOccurrence: '2023-12-10'
      });
    }
    
    if (geo.lat < 35 && geo.lat > 25) {
      hazards.push({
        type: 'hurricane',
        frequency: 0.5,
        severity: 'extreme',
        lastOccurrence: '2023-09-15',
        averageDamage: 15000
      });
      
      hazards.push({
        type: 'hail',
        frequency: 3,
        severity: 'moderate',
        averageDamage: 2500
      });
    }
    
    return hazards;
  }

  private calculateWeatherImpacts(weatherData: WeatherData, params: WeatherSearchParams): WeatherImpactAnalysis['impacts'] {
    const age = params.vehicleAge || 5;
    const garageProtection = params.garageKept ? 0.3 : 1.0; // 70% reduction if garage kept
    
    return {
      paintDegradation: Math.min(100, weatherData.historical.sunlightHours / 30 * age * garageProtection),
      metalCorrosion: Math.min(100, (weatherData.historical.humidityAverage + weatherData.seasonal.winter.roadSaltExposure * 5) * age * garageProtection),
      interiorWear: Math.min(100, weatherData.historical.sunlightHours / 25 * age * garageProtection),
      mechanicalStress: Math.min(100, weatherData.historical.extremeWeatherDays * 2 * age * garageProtection),
      floodRisk: this.calculateFloodRisk(weatherData),
      hailDamage: this.calculateHailRisk(weatherData)
    };
  }

  private calculateFloodRisk(weatherData: WeatherData): number {
    const floodHazards = weatherData.hazards.filter(h => h.type === 'flood');
    return floodHazards.reduce((risk, hazard) => risk + hazard.frequency * 10, 0);
  }

  private calculateHailRisk(weatherData: WeatherData): number {
    const hailHazards = weatherData.hazards.filter(h => h.type === 'hail');
    return hailHazards.reduce((risk, hazard) => risk + hazard.frequency * 5, 0);
  }

  private calculateRiskScore(impacts: WeatherImpactAnalysis['impacts']): number {
    const weights = {
      paintDegradation: 0.2,
      metalCorrosion: 0.25,
      interiorWear: 0.15,
      mechanicalStress: 0.2,
      floodRisk: 0.1,
      hailDamage: 0.1
    };
    
    return Object.entries(impacts).reduce((score, [key, value]) => {
      const weight = weights[key as keyof typeof weights] || 0;
      return score + (value * weight);
    }, 0);
  }

  private calculateValuationAdjustment(impacts: WeatherImpactAnalysis['impacts'], params: WeatherSearchParams): WeatherImpactAnalysis['valuationAdjustment'] {
    const avgImpact = Object.values(impacts).reduce((sum, val) => sum + val, 0) / Object.keys(impacts).length;
    
    // Convert impact score to percentage adjustment (-5% to +2%)
    let percentage = 0;
    if (avgImpact > 80) percentage = -5;
    else if (avgImpact > 60) percentage = -3;
    else if (avgImpact > 40) percentage = -1;
    else if (avgImpact < 20) percentage = 1; // Low weather impact can be positive
    
    const reasoning: string[] = [];
    
    if (impacts.paintDegradation > 70) reasoning.push('High UV exposure may affect paint condition');
    if (impacts.metalCorrosion > 70) reasoning.push('Road salt and humidity increase corrosion risk');
    if (impacts.floodRisk > 30) reasoning.push('Elevated flood risk in this area');
    if (impacts.hailDamage > 40) reasoning.push('Frequent hail events may cause body damage');
    if (params.garageKept) reasoning.push('Garage protection reduces weather impact');
    
    return {
      percentage,
      dollarAmount: 0, // Would be calculated based on vehicle value
      reasoning
    };
  }

  private categorizeRisk(score: number): WeatherImpactAnalysis['overallRisk'] {
    if (score >= 80) return 'extreme';
    if (score >= 60) return 'high';
    if (score >= 40) return 'moderate';
    return 'low';
  }

  private generateRecommendations(impacts: WeatherImpactAnalysis['impacts'], weatherData: WeatherData): string[] {
    const recommendations: string[] = [];
    
    if (impacts.paintDegradation > 60) {
      recommendations.push('Consider vehicles with UV-resistant paint or ceramic coating');
    }
    
    if (impacts.metalCorrosion > 60) {
      recommendations.push('Look for vehicles with rust protection or galvanized components');
    }
    
    if (weatherData.seasonal.winter.roadSaltExposure > 6) {
      recommendations.push('Regular undercarriage washing recommended in winter');
    }
    
    if (impacts.floodRisk > 30) {
      recommendations.push('Verify flood history and consider higher insurance coverage');
    }
    
    if (impacts.hailDamage > 40) {
      recommendations.push('Inspect for hail damage and consider comprehensive insurance');
    }
    
    return recommendations;
  }
}

// Factory function
export function createWeatherConnector(config: {
  openWeatherApiKey?: string;
  provider?: 'openweather' | 'weatherapi' | 'accuweather';
}): WeatherConnector {
  const provider = config.provider || 'openweather';
  
  switch (provider) {
    case 'openweather':
      if (!config.openWeatherApiKey) {
        throw new Error('OpenWeatherMap API key required');
      }
      return new OpenWeatherConnector(config.openWeatherApiKey);
    
    default:
      throw new Error(`Unsupported weather provider: ${provider}`);
  }
}