
import { useState, useEffect } from 'react';

interface VehicleInfo {
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage?: number;
  condition?: string;
}

interface GeneratedCondition {
  exterior: number;
  interior: number;
  mechanical: number;
  overall: string;
}

export function useAICondition(vehicleInfo: VehicleInfo) {
  const [generatedCondition, setGeneratedCondition] = useState<GeneratedCondition | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!vehicleInfo.make || !vehicleInfo.model) return;

    const generateCondition = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // For now, we'll use a mock implementation
        // In a real implementation, this would call an API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate mock condition based on year and mileage
        const currentYear = new Date().getFullYear();
        const age = currentYear - vehicleInfo.year;
        const mileage = vehicleInfo.mileage || 50000;
        
        let baseCondition = 5; // Start at excellent
        
        // Decrease based on age
        baseCondition -= Math.min(age * 0.2, 2);
        
        // Decrease based on mileage
        baseCondition -= Math.min((mileage / 50000) * 0.3, 2);
        
        // Ensure it stays between 1 and 5
        baseCondition = Math.max(1, Math.min(5, baseCondition));
        
        // Add some random variation
        const exterior = Math.max(1, Math.min(5, baseCondition + (Math.random() * 0.6 - 0.3)));
        const interior = Math.max(1, Math.min(5, baseCondition + (Math.random() * 0.6 - 0.3)));
        const mechanical = Math.max(1, Math.min(5, baseCondition + (Math.random() * 0.6 - 0.3)));
        
        const overall = getOverallCondition((exterior + interior + mechanical) / 3);
        
        setGeneratedCondition({
          exterior: Math.round(exterior * 10) / 10,
          interior: Math.round(interior * 10) / 10,
          mechanical: Math.round(mechanical * 10) / 10,
          overall
        });
      } catch (err) {
        console.error('Error generating condition:', err);
        setError('Failed to generate condition assessment');
      } finally {
        setIsLoading(false);
      }
    };
    
    generateCondition();
  }, [vehicleInfo.make, vehicleInfo.model, vehicleInfo.year, vehicleInfo.mileage]);

  return { generatedCondition, isLoading, error };
}

function getOverallCondition(average: number): string {
  if (average >= 4.5) return "Excellent";
  if (average >= 3.5) return "Very Good";
  if (average >= 2.5) return "Good";
  if (average >= 1.5) return "Fair";
  return "Poor";
}
