
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useVinDecoder } from '@/hooks/useVinDecoder';

export const useVinDecoderForm = () => {
  const [vin, setVin] = useState('');
  const { toast } = useToast();
  const { result, isLoading, error, decodeVin } = useVinDecoder();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vin.trim()) {
      toast({
        description: "Please enter a VIN",
        variant: "destructive"
      });
      return;
    }

    await decodeVin(vin);
  };

  return {
    vin,
    setVin,
    result,
    isLoading,
    error,
    handleSubmit
  };
};
