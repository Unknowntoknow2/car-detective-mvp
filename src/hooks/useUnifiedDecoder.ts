import { useState, useEffect } from 'react';
import { fetchVehicleData } from '@/services/vehicleService';

interface DecodedVehicleInfo {
  make: string;
  model: string;
  year: number;
  vin: string;
  bodyType?: string;
  trim?: string;
  engine?: string;
  transmission?: string;
  driveType?: string;
  fuelType?: string;
  exteriorColor?: string;
  interiorColor?: string;
}

interface UseUnifiedDecoderProps {
  identifier: string;
  identifierType: 'vin' | 'plate';
}

export const useUnifiedDecoder = ({ identifier, identifierType }: UseUnifiedDecoderProps) => {
  const [decodedData, setDecodedData] = useState<DecodedVehicleInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const decodeVehicle = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let data: any = null;

        if (identifierType === 'vin') {
          data = await fetchVehicleData({ vin: identifier });
        } else if (identifierType === 'plate') {
          // Implement plate decoding logic here if needed
          setError('Plate decoding not yet implemented');
          return;
        }

        if (data) {
          setDecodedData({
            make: data.make,
            model: data.model,
            year: data.year,
            vin: data.vin,
            bodyType: data.bodyType,
            trim: data.trim,
            engine: data.engine,
            transmission: data.transmission,
            driveType: data.driveType,
            fuelType: data.fuelType,
            exteriorColor: data.exteriorColor,
            interiorColor: data.interiorColor,
            postalCode: data.zipCode, // assuming postalCode is valid in DecodedVehicleInfo
          });
        } else {
          setError('Vehicle data not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to decode vehicle');
      } finally {
        setIsLoading(false);
      }
    };

    if (identifier) {
      decodeVehicle();
    } else {
      setDecodedData(null);
    }
  }, [identifier, identifierType]);

  return { decodedData, isLoading, error };
};
