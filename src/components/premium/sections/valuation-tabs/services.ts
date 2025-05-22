
export type ValuationServiceId = 'vin' | 'plate' | 'manual' | 'photo' | 'dealers' | 'market' | 'forecast' | 'carfax';

export const services = [
  {
    id: 'vin' as ValuationServiceId,
    name: 'VIN Lookup',
    description: 'Look up a vehicle by VIN'
  },
  {
    id: 'plate' as ValuationServiceId,
    name: 'License Plate',
    description: 'Look up a vehicle by license plate'
  },
  {
    id: 'manual' as ValuationServiceId,
    name: 'Manual Entry',
    description: 'Manually enter vehicle details'
  },
  {
    id: 'photo' as ValuationServiceId,
    name: 'Photo Upload',
    description: 'Upload a photo of your vehicle'
  },
  {
    id: 'dealers' as ValuationServiceId,
    name: 'Dealer Network',
    description: 'Connect with local dealers'
  },
  {
    id: 'market' as ValuationServiceId,
    name: 'Market Analysis',
    description: 'See market trends for your vehicle'
  },
  {
    id: 'forecast' as ValuationServiceId,
    name: 'Value Forecast',
    description: 'Predict future value trends'
  },
  {
    id: 'carfax' as ValuationServiceId,
    name: 'History Report',
    description: 'View vehicle history report'
  }
];
