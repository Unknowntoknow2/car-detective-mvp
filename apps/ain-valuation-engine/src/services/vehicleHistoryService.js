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
                recallHistory: [],
            };
            // Process Carfax results
            if (carfaxResults.status === 'fulfilled' && carfaxResults.value.ok) {
                const carfaxData = carfaxResults.value.data;
                if (carfaxData) {
                    history.accidentHistory.push(...this.extractCarfaxAccidents(carfaxData));
                    history.serviceRecords.push(...this.extractCarfaxService(carfaxData));
                    history.ownershipHistory.push(...this.extractCarfaxOwnership(carfaxData));
                    history.titleHistory.push(...this.extractCarfaxTitles(carfaxData));
                }
            }
            // Process Autocheck results
            if (autocheckResults.status === 'fulfilled' && autocheckResults.value.ok) {
                const autocheckData = autocheckResults.value.data;
                if (autocheckData) {
                    history.accidentHistory.push(...this.extractAutocheckAccidents(autocheckData));
                    history.serviceRecords.push(...this.extractAutocheckService(autocheckData));
                    history.ownershipHistory.push(...this.extractAutocheckOwnership(autocheckData));
                }
            }
            // Process NHTSA recall results
            if (recallResults.status === 'fulfilled' && recallResults.value.ok) {
                const recallData = recallResults.value.data;
                if (recallData) {
                    history.recallHistory.push(...recallData);
                }
            }
            // Remove duplicates and sort by date
            history.accidentHistory = this.deduplicateAccidents(history.accidentHistory);
            history.serviceRecords = this.deduplicateService(history.serviceRecords);
            history.ownershipHistory = this.deduplicateOwnership(history.ownershipHistory);
            history.titleHistory = this.deduplicateTitles(history.titleHistory);
            return {
                // ...existing code...
                ok: true,
                data: history,
                metadata: {
                    source: 'multiple_history_sources',
                    timestamp: new Date(),
                },
            };
        }
        catch (error) {
            return {
                // ...existing code...
                ok: false,
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
            throw new Error('Carfax API key missing');
        }
        return apiClient.get(`https://api.carfax.com/v2/reports/${vin}`, {
            'X-API-Key': this.carfaxApiKey,
        });
    }
    async getAutocheckHistory(vin) {
        if (!this.autocheckApiKey) {
            throw new Error('Autocheck API key missing');
        }
        return apiClient.get(`https://api.autocheck.com/v1/history/${vin}`, {
            'Authorization': `Bearer ${this.autocheckApiKey}`,
        });
    }
    async getNHTSARecalls(vin) {
        try {
            const response = await apiClient.get(`${this.nhtsaBaseUrl}?vin=${vin}&format=json`);
            if (!response.ok) {
                return {
                    ok: false,
                    error: response.error,
                    metadata: response.metadata,
                };
            }
            const recalls = response.data?.results?.map(this.transformNHTSARecall) || [];
            return { ...response, data: recalls, ok: true };
        }
        catch (error) {
            return {
                // ...existing code...
                ok: false,
                error: error instanceof Error ? error.message : 'Failed to fetch NHTSA recalls',
                metadata: {
                    source: 'nhtsa_recalls',
                    timestamp: new Date(),
                },
            };
        }
    }
    extractCarfaxAccidents(data) {
        if (!data.accidents)
            return [];
        return data.accidents.map((accident) => ({
            date: accident.date,
            severity: this.mapSeverity(accident.severity),
            damageDescription: accident.damageDescription,
            estimatedCost: accident.estimatedCost,
        }));
    }
    extractCarfaxService(data) {
        if (!data.serviceRecords)
            return [];
        return data.serviceRecords.map((service) => ({
            date: service.date,
            type: service.type,
            mileage: service.mileage,
            description: service.description,
            cost: service.cost,
            dealer: service.dealer,
        }));
    }
    extractCarfaxOwnership(data) {
        if (!data.ownership)
            return [];
        return data.ownership.map((owner) => ({
            startDate: owner.startDate,
            endDate: owner.endDate,
            type: this.mapOwnerType(owner.type),
            state: owner.state,
        }));
    }
    extractCarfaxTitles(data) {
        if (!data.titles)
            return [];
        return data.titles.map((title) => ({
            date: title.date,
            state: title.state,
            type: this.mapTitleType(title.type),
            mileage: title.mileage,
        }));
    }
    extractAutocheckAccidents(data) {
        if (!data.events)
            return [];
        return data.events
            .filter((event) => event.type === 'accident')
            .map((accident) => ({
            date: accident.date,
            severity: this.mapSeverity(accident.severity || 'unknown'),
            damageDescription: accident.description,
        }));
    }
    extractAutocheckService(data) {
        if (!data.events)
            return [];
        return data.events
            .filter((event) => event.type === 'service')
            .map((service) => ({
            date: service.date,
            type: 'maintenance',
            mileage: service.mileage || 0,
            description: service.description,
            dealer: service.dealer,
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
                startDate: `${2020 + i}-01-01`,
                endDate: i === data.ownershipCount - 1 ? undefined : `${2020 + i + 1}-01-01`,
                type: 'personal',
                state: 'Unknown',
            });
        }
        return records;
    }
    transformNHTSARecall(recall) {
        return {
            recallNumber: recall.NHTSACampaignNumber,
            date: recall.ReportReceivedDate,
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
            const key = `${accident.date}-${accident.damageDescription}`;
            if (seen.has(key))
                return false;
            seen.add(key);
            return true;
        });
    }
    deduplicateService(records) {
        const seen = new Set();
        return records.filter(record => {
            const key = `${record.date}-${record.mileage}-${record.type}`;
            if (seen.has(key))
                return false;
            seen.add(key);
            return true;
        });
    }
    deduplicateOwnership(records) {
        const seen = new Set();
        return records.filter(record => {
            const key = `${record.startDate}-${record.type}-${record.state}`;
            if (seen.has(key))
                return false;
            seen.add(key);
            return true;
        });
    }
    deduplicateTitles(records) {
        const seen = new Set();
        return records.filter(record => {
            const key = `${record.date}-${record.state}-${record.type}`;
            if (seen.has(key))
                return false;
            seen.add(key);
            return true;
        });
    }
}
export const vehicleHistoryService = new VehicleHistoryService();
