
import { useState } from 'react';
import { decodeVin } from '@/services/vinService';
import { decodeLicensePlate, DecodedVehicleInfo } from '@/services/vehicleService';

export type DecoderType = 'vin' | 'plate';

export interface DecoderState {
  isLoading: boolean;
  error: string | null;
  data: DecodedVehicleInfo | null;
  decoderType: DecoderType | null;
  isValid: boolean;
}

export const useUnifiedDecoder = () => {
  const [state, setState] = useState<DecoderState>({
    isLoading: false,
    error: null,
    data: null,
    decoderType: null,
    isValid: false
  });

  // Reset the decoder state
  const resetDecoder = () => {
    setState({
      isLoading: false,
      error: null,
      data: null,
      decoderType: null,
      isValid: false
    });
  };

  // Decode a VIN number
  const decodeVinNumber = async (vin: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await decodeVin(vin);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to decode VIN');
      }
      
      setState({
        isLoading: false,
        error: null,
        data: response.data,
        decoderType: 'vin',
        isValid: true
      });
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to decode VIN';
      setState({
        isLoading: false,
        error: errorMessage,
        data: null,
        decoderType: 'vin',
        isValid: false
      });
      return null;
    }
  };

  // Decode a license plate
  const decodePlate = async (plate: string, state: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await decodeLicensePlate(plate, state);
      setState({
        isLoading: false,
        error: null,
        data,
        decoderType: 'plate',
        isValid: true
      });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to decode license plate';
      setState({
        isLoading: false,
        error: errorMessage,
        data: null,
        decoderType: 'plate',
        isValid: false
      });
      return null;
    }
  };

  return {
    ...state,
    decodeVin: decodeVinNumber,
    decodePlate,
    resetDecoder
  };
};
