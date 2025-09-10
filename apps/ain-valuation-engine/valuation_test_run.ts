import { valuateVehicle } from './src/ain-backend/valuationEngine';

async function main() {
  const result = await valuateVehicle({
    vin: '4T1K31AK5PU607399',
    mileage: 97104,
    zip: '95821',
    condition: 'Very Good',
    titleStatus: 'Clean',
    color: 'White'
  });
  console.log('Valuation result:', result);
}

main();
