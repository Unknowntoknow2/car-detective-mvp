
import { CheckCircle2 } from 'lucide-react';

interface VehicleFoundCardProps {
  vehicle: {
    year?: number;
    make?: string;
    model?: string;
    trim?: string;
  };
  plateValue: string;
  stateValue: string;
}

export function VehicleFoundCard({ vehicle, plateValue, stateValue }: VehicleFoundCardProps) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
      <div className="flex items-start">
        <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
        <div>
          <h3 className="font-medium text-green-800">Vehicle Found!</h3>
          <p className="text-green-700">
            {vehicle?.year} {vehicle?.make} {vehicle?.model}
            {vehicle?.trim && ` ${vehicle.trim}`}
          </p>
          <p className="text-sm text-green-600">
            Plate: {plateValue} ({stateValue})
          </p>
        </div>
      </div>
    </div>
  );
}
