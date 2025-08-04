import { apiClient } from './apiClient';
import { VehicleHistory, AccidentRecord, ServiceRecord, OwnershipRecord, TitleRecord, RecallRecord, ApiResponse } from '@/types/ValuationTypes';

interface CarfaxResponse {
  vin: string;
  reportData: any;
}

interface AutocheckResponse {
  vehicleHistory: any;
}

export class VehicleHistoryService {
  private readonly carfaxApiKey = import.meta.env.VITE_CARFAX_API_KEY;
  private readonly autocheckApiKey = import.meta.env.VITE_AUTOCHECK_API_KEY;
  private readonly nhtsaBaseUrl = 'https://api.nhtsa.gov/recalls/recallsByVehicle';

  async getVehicleHistory(vin: string): Promise<ApiResponse<VehicleHistory>> {
    try {
      // Parallel requests to multiple history sources
      const [carfaxResults, autocheckResults, recallResults] = await Promise.allSettled([
        this.getCarfaxHistory(vin),
        this.getAutocheckHistory(vin),
        this.getNHTSARecalls(vin),
      ]);

      // Combine results from all sources
      const history: VehicleHistory = {
        vin,
        accidentHistory: [],
        serviceRecords: [],
        ownershipHistory: [],
        titleHistory: [],
        recallsHistory: [],
      };

      // Process Carfax results
      if (carfaxResults.status === 'fulfilled' && carfaxResults.value.success) {
        const carfaxData = carfaxResults.value.data;
        if (carfaxData) {
          history.accidentHistory.push(...this.extractCarfaxAccidents(carfaxData));
          history.serviceRecords.push(...this.extractCarfaxService(carfaxData));
          history.ownershipHistory.push(...this.extractCarfaxOwnership(carfaxData));
          history.titleHistory.push(...this.extractCarfaxTitles(carfaxData));
        }
      }

      // Process Autocheck results
      if (autocheckResults.status === 'fulfilled' && autocheckResults.value.success) {
        const autocheckData = autocheckResults.value.data;
        if (autocheckData) {
          history.accidentHistory.push(...this.extractAutocheckAccidents(autocheckData));
          history.serviceRecords.push(...this.extractAutocheckService(autocheckData));
          history.ownershipHistory.push(...this.extractAutocheckOwnership(autocheckData));
        }
      }

      // Process NHTSA recall results
      if (recallResults.status === 'fulfilled' && recallResults.value.success) {
        const recallData = recallResults.value.data;
        if (recallData) {
          history.recallsHistory.push(...recallData);
        }
      }

      // Remove duplicates and sort by date
      history.accidentHistory = this.deduplicateAccidents(history.accidentHistory);
      history.serviceRecords = this.deduplicateService(history.serviceRecords);
      history.ownershipHistory = this.deduplicateOwnership(history.ownershipHistory);
      history.titleHistory = this.deduplicateTitles(history.titleHistory);

      return {
        success: true,
        data: history,
        metadata: {
          source: 'multiple_history_sources',
          timestamp: new Date(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch vehicle history',
        metadata: {
          source: 'vehicle_history_service',
          timestamp: new Date(),
        },
      };
    }
  }

  private async getCarfaxHistory(vin: string): Promise<ApiResponse<any>> {
    if (!this.carfaxApiKey) {
      throw new Error('Carfax API key missing');
    }

    return apiClient.get<CarfaxResponse>(
      `https://api.carfax.com/v2/reports/${vin}`,
      {
        'X-API-Key': this.carfaxApiKey,
      }
    );
  }

  private async getAutocheckHistory(vin: string): Promise<ApiResponse<any>> {
    if (!this.autocheckApiKey) {
      throw new Error('Autocheck API key missing');
    }

    return apiClient.get<AutocheckResponse>(
      `https://api.autocheck.com/v1/history/${vin}`,
      {
        'Authorization': `Bearer ${this.autocheckApiKey}`,
      }
    );
  }

  private async getNHTSARecalls(vin: string): Promise<ApiResponse<RecallRecord[]>> {
    try {
      const response = await apiClient.get<any>(
        `${this.nhtsaBaseUrl}?vin=${vin}&format=json`
      );

      if (!response.success) {
        return {
          success: false,
          error: response.error,
          metadata: response.metadata,
        };
      }

      const recalls = response.data?.results?.map(this.transformNHTSARecall) || [];
      return { ...response, data: recalls };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch NHTSA recalls',
        metadata: {
          source: 'nhtsa_recalls',
          timestamp: new Date(),
        },
      };
    }
  }

  private extractCarfaxAccidents(data: any): AccidentRecord[] {
    if (!data.accidents) return [];

    return data.accidents.map((accident: any) => ({
      date: new Date(accident.date),
      severity: this.mapSeverity(accident.severity),
      description: accident.description,
      damageAmount: accident.estimatedDamage,
    }));
  }

  private extractCarfaxService(data: any): ServiceRecord[] {
    if (!data.serviceRecords) return [];

    return data.serviceRecords.map((service: any) => ({
      date: new Date(service.date),
      mileage: service.mileage,
      serviceType: service.type,
      description: service.description,
      cost: service.cost,
      dealer: service.dealer,
    }));
  }

  private extractCarfaxOwnership(data: any): OwnershipRecord[] {
    if (!data.ownership) return [];

    return data.ownership.map((owner: any) => ({
      startDate: new Date(owner.startDate),
      endDate: owner.endDate ? new Date(owner.endDate) : undefined,
      ownerType: this.mapOwnerType(owner.type),
      state: owner.state,
    }));
  }

  private extractCarfaxTitles(data: any): TitleRecord[] {
    if (!data.titles) return [];

    return data.titles.map((title: any) => ({
      date: new Date(title.date),
      state: title.state,
      titleType: this.mapTitleType(title.type),
      mileage: title.mileage,
    }));
  }

  private extractAutocheckAccidents(data: any): AccidentRecord[] {
    if (!data.events) return [];

    return data.events
      .filter((event: any) => event.type === 'accident')
      .map((accident: any) => ({
        date: new Date(accident.date),
        severity: this.mapSeverity(accident.severity || 'unknown'),
        description: accident.description,
      }));
  }

  private extractAutocheckService(data: any): ServiceRecord[] {
    if (!data.events) return [];

    return data.events
      .filter((event: any) => event.type === 'service')
      .map((service: any) => ({
        date: new Date(service.date),
        mileage: service.mileage || 0,
        serviceType: 'maintenance',
        description: service.description,
        dealer: service.dealer || false,
      }));
  }

  private extractAutocheckOwnership(data: any): OwnershipRecord[] {
    // Autocheck typically provides ownership count rather than detailed records
    if (!data.ownershipCount) return [];

    // Create approximate ownership records
    const records: OwnershipRecord[] = [];
    for (let i = 0; i < data.ownershipCount; i++) {
      records.push({
        startDate: new Date(2020 + i, 0, 1), // Approximate dates
        endDate: i === data.ownershipCount - 1 ? undefined : new Date(2020 + i + 1, 0, 1),
        ownerType: 'personal',
        state: 'Unknown',
      });
    }
    return records;
  }

  private transformNHTSARecall(recall: any): RecallRecord {
    return {
      recallNumber: recall.NHTSACampaignNumber,
      date: new Date(recall.ReportReceivedDate),
      description: recall.Summary,
      status: recall.RemedyStatus === 'Remedy Available' ? 'completed' : 'open',
    };
  }

  private mapSeverity(severity: string): 'minor' | 'moderate' | 'severe' {
    const severityMap: Record<string, 'minor' | 'moderate' | 'severe'> = {
      'minor': 'minor',
      'moderate': 'moderate',
      'major': 'severe',
      'severe': 'severe',
      'unknown': 'minor',
    };

    return severityMap[severity.toLowerCase()] || 'minor';
  }

  private mapOwnerType(type: string): 'personal' | 'fleet' | 'rental' | 'lease' {
    const typeMap: Record<string, 'personal' | 'fleet' | 'rental' | 'lease'> = {
      'personal': 'personal',
      'individual': 'personal',
      'fleet': 'fleet',
      'commercial': 'fleet',
      'rental': 'rental',
      'lease': 'lease',
    };

    return typeMap[type.toLowerCase()] || 'personal';
  }

  private mapTitleType(type: string): any {
    // This would map to the TitleStatus enum
    const typeMap: Record<string, string> = {
      'clean': 'clean',
      'clear': 'clean',
      'salvage': 'salvage',
      'rebuilt': 'rebuilt',
      'flood': 'flood',
      'lemon': 'lemon',
    };

    return typeMap[type.toLowerCase()] || 'clean';
  }

  private deduplicateAccidents(accidents: AccidentRecord[]): AccidentRecord[] {
    const seen = new Set();
    return accidents.filter(accident => {
      const key = `${accident.date.toISOString()}-${accident.description}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  private deduplicateService(records: ServiceRecord[]): ServiceRecord[] {
    const seen = new Set();
    return records.filter(record => {
      const key = `${record.date.toISOString()}-${record.mileage}-${record.serviceType}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  private deduplicateOwnership(records: OwnershipRecord[]): OwnershipRecord[] {
    const seen = new Set();
    return records.filter(record => {
      const key = `${record.startDate.toISOString()}-${record.ownerType}-${record.state}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }

  private deduplicateTitles(records: TitleRecord[]): TitleRecord[] {
    const seen = new Set();
    return records.filter(record => {
      const key = `${record.date.toISOString()}-${record.state}-${record.titleType}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}

export const vehicleHistoryService = new VehicleHistoryService();