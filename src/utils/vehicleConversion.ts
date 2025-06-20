
import { DecodedVehicleInfo, Vehicle } from '@/types/vehicle';

export function convertDecodedVehicleToVehicle(decoded: DecodedVehicleInfo): Vehicle {
  return {
    id: decoded.vin || `${decoded.make}_${decoded.model}_${decoded.year}`,
    vin: decoded.vin || '',
    make: decoded.make || '',
    model: decoded.model || '',
    year: decoded.year,
    mileage: decoded.mileage || 0,
    condition: decoded.condition || 'Good',
    trim: decoded.trim
  };
}
