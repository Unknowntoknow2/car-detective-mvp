import { apiClient } from './apiClient';
export class VehicleHistoryService {
    carfaxApiKey = import.meta.env.VITE_CARFAX_API_KEY;
    autocheckApiKey = import.meta.env.VITE_AUTOCHECK_API_KEY;
    nhtsaBaseUrl = 'https://api.nhtsa.gov/recalls/recallsByVehicle';
    async getVehicleHistory(vin) {
        try {
            // Parallel requests to multiple history sources
            const [carfaxResults, autocheckResults, recallResults] = await Promise.allSettled([
                this.getCarfaxHistory(vin),
                this.getAutocheckHistory(vin),
                this.getNHTSARecalls(vin),
            ]);
            // Combine results from all sources
            const history = {
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
        }
        catch (error) {
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
    async getCarfaxHistory(vin) {
        if (!this.carfaxApiKey) {
            return this.getMockCarfaxHistory(vin);
        }
        return apiClient.get(`https://api.carfax.com/v2/reports/${vin}`, {
            'X-API-Key': this.carfaxApiKey,
        });
    }
    async getAutocheckHistory(vin) {
        if (!this.autocheckApiKey) {
            return this.getMockAutocheckHistory(vin);
        }
        return apiClient.get(`https://api.autocheck.com/v1/history/${vin}`, {
            'Authorization': `Bearer ${this.autocheckApiKey}`,
        });
    }
    async getNHTSARecalls(vin) {
        try {
            const response = await apiClient.get(`${this.nhtsaBaseUrl}?vin=${vin}&format=json`);
            if (!response.success) {
                return {
                    success: false,
                    error: response.error,
                    metadata: response.metadata,
                };
            }
            const recalls = response.data?.results?.map(this.transformNHTSARecall) || [];
            return { ...response, data: recalls };
        }
        catch (error) {
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
    getMockCarfaxHistory(vin) {
        // Generate realistic mock data for testing
        const mockData = {
            vin,
            accidents: [
                {
                    date: '2022-03-15',
                    severity: 'minor',
                    description: 'Minor collision - front bumper damage',
                    estimatedDamage: 2500,
                },
            ],
            serviceRecords: [
                {
                    date: '2023-01-15',
                    mileage: 25000,
                    type: 'routine_maintenance',
                    description: 'Oil change, filter replacement',
                    dealer: true,
                    cost: 89.99,
                },
                {
                    date: '2022-07-10',
                    mileage: 20000,
                    type: 'inspection',
                    description: 'State inspection and emissions test',
                    dealer: false,
                    cost: 35.00,
                },
            ],
            ownership: [
                {
                    startDate: '2021-06-01',
                    endDate: null,
                    type: 'personal',
                    state: 'CA',
                },
            ],
            titles: [
                {
                    date: '2021-06-01',
                    state: 'CA',
                    type: 'clean',
                    mileage: 15000,
                },
            ],
        };
        return Promise.resolve({
            success: true,
            data: mockData,
            metadata: {
                source: 'carfax_mock',
                timestamp: new Date(),
            },
        });
    }
    getMockAutocheckHistory(vin) {
        // Generate complementary mock data
        const mockData = {
            vin,
            events: [
                {
                    date: '2023-06-20',
                    type: 'service',
                    description: 'Brake inspection and pad replacement',
                    mileage: 28000,
                    dealer: true,
                },
            ],
            ownershipCount: 1,
            accidentIndicators: 1,
        };
        return Promise.resolve({
            success: true,
            data: mockData,
            metadata: {
                source: 'autocheck_mock',
                timestamp: new Date(),
            },
        });
    }
    extractCarfaxAccidents(data) {
        if (!data.accidents)
            return [];
        return data.accidents.map((accident) => ({
            date: new Date(accident.date),
            severity: this.mapSeverity(accident.severity),
            description: accident.description,
            damageAmount: accident.estimatedDamage,
        }));
    }
    extractCarfaxService(data) {
        if (!data.serviceRecords)
            return [];
        return data.serviceRecords.map((service) => ({
            date: new Date(service.date),
            mileage: service.mileage,
            serviceType: service.type,
            description: service.description,
            cost: service.cost,
            dealer: service.dealer,
        }));
    }
    extractCarfaxOwnership(data) {
        if (!data.ownership)
            return [];
        return data.ownership.map((owner) => ({
            startDate: new Date(owner.startDate),
            endDate: owner.endDate ? new Date(owner.endDate) : undefined,
            ownerType: this.mapOwnerType(owner.type),
            state: owner.state,
        }));
    }
    extractCarfaxTitles(data) {
        if (!data.titles)
            return [];
        return data.titles.map((title) => ({
            date: new Date(title.date),
            state: title.state,
            titleType: this.mapTitleType(title.type),
            mileage: title.mileage,
        }));
    }
    extractAutocheckAccidents(data) {
        if (!data.events)
            return [];
        return data.events
            .filter((event) => event.type === 'accident')
            .map((accident) => ({
            date: new Date(accident.date),
            severity: this.mapSeverity(accident.severity || 'unknown'),
            description: accident.description,
        }));
    }
    extractAutocheckService(data) {
        if (!data.events)
            return [];
        return data.events
            .filter((event) => event.type === 'service')
            .map((service) => ({
            date: new Date(service.date),
            mileage: service.mileage || 0,
            serviceType: 'maintenance',
            description: service.description,
            dealer: service.dealer || false,
        }));
    }
    extractAutocheckOwnership(data) {
        // Autocheck typically provides ownership count rather than detailed records
        if (!data.ownershipCount)
            return [];
        // Create approximate ownership records
        const records = [];
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
    transformNHTSARecall(recall) {
        return {
            recallNumber: recall.NHTSACampaignNumber,
            date: new Date(recall.ReportReceivedDate),
            description: recall.Summary,
            status: recall.RemedyStatus === 'Remedy Available' ? 'completed' : 'open',
        };
    }
    mapSeverity(severity) {
        const severityMap = {
            'minor': 'minor',
            'moderate': 'moderate',
            'major': 'severe',
            'severe': 'severe',
            'unknown': 'minor',
        };
        return severityMap[severity.toLowerCase()] || 'minor';
    }
    mapOwnerType(type) {
        const typeMap = {
            'personal': 'personal',
            'individual': 'personal',
            'fleet': 'fleet',
            'commercial': 'fleet',
            'rental': 'rental',
            'lease': 'lease',
        };
        return typeMap[type.toLowerCase()] || 'personal';
    }
    mapTitleType(type) {
        // This would map to the TitleStatus enum
        const typeMap = {
            'clean': 'clean',
            'clear': 'clean',
            'salvage': 'salvage',
            'rebuilt': 'rebuilt',
            'flood': 'flood',
            'lemon': 'lemon',
        };
        return typeMap[type.toLowerCase()] || 'clean';
    }
    deduplicateAccidents(accidents) {
        const seen = new Set();
        return accidents.filter(accident => {
            const key = `${accident.date.toISOString()}-${accident.description}`;
            if (seen.has(key))
                return false;
            seen.add(key);
            return true;
        }).sort((a, b) => b.date.getTime() - a.date.getTime());
    }
    deduplicateService(records) {
        const seen = new Set();
        return records.filter(record => {
            const key = `${record.date.toISOString()}-${record.mileage}-${record.serviceType}`;
            if (seen.has(key))
                return false;
            seen.add(key);
            return true;
        }).sort((a, b) => b.date.getTime() - a.date.getTime());
    }
    deduplicateOwnership(records) {
        const seen = new Set();
        return records.filter(record => {
            const key = `${record.startDate.toISOString()}-${record.ownerType}-${record.state}`;
            if (seen.has(key))
                return false;
            seen.add(key);
            return true;
        }).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    }
    deduplicateTitles(records) {
        const seen = new Set();
        return records.filter(record => {
            const key = `${record.date.toISOString()}-${record.state}-${record.titleType}`;
            if (seen.has(key))
                return false;
            seen.add(key);
            return true;
        }).sort((a, b) => b.date.getTime() - a.date.getTime());
    }
}
export const vehicleHistoryService = new VehicleHistoryService();
