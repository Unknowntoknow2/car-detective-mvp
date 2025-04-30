
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface VehicleInfo {
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  exteriorColor?: string;
  vin?: string;
}

interface VehicleFoundCardProps {
  vehicle: VehicleInfo;
  plateValue?: string;
  stateValue?: string;
}

export function VehicleFoundCard({ 
  vehicle, 
  plateValue, 
  stateValue 
}: VehicleFoundCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-green-50/80 border border-green-200 rounded-lg p-4 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-green-100 p-1.5 mt-0.5">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        </div>
        
        <div className="space-y-2 flex-1">
          <div>
            <h3 className="text-base font-medium text-green-800">Vehicle Found</h3>
            <p className="text-sm text-green-700 font-medium">
              {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {plateValue && stateValue && (
              <>
                <div>
                  <p className="text-xs text-green-700/70">License Plate:</p>
                  <p className="font-medium text-green-800">{plateValue}</p>
                </div>
                <div>
                  <p className="text-xs text-green-700/70">State:</p>
                  <p className="font-medium text-green-800">{stateValue}</p>
                </div>
              </>
            )}
            
            {vehicle.exteriorColor && (
              <div>
                <p className="text-xs text-green-700/70">Color:</p>
                <p className="font-medium text-green-800">{vehicle.exteriorColor}</p>
              </div>
            )}
            
            {vehicle.vin && (
              <div>
                <p className="text-xs text-green-700/70">VIN:</p>
                <p className="font-medium text-green-800 font-mono text-xs tracking-wide">{vehicle.vin}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
