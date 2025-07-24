import { DecodedVehicleInfo } from '@/types/vehicle';
import { supabase } from '@/integrations/supabase/client';

export async function fetchVehicleByVin(vin: string): Promise<DecodedVehicleInfo> {
  console.log('🔄 vehicleLookupService: Starting VIN decode for:', vin);
  
  // Validate VIN format first
  if (!vin || vin.length !== 17) {
    console.error('❌ vehicleLookupService: Invalid VIN format:', vin);
    throw new Error('Invalid VIN format. VIN must be 17 characters long.');
  }

  let lastError: Error | null = null;
  const maxRetries = 3;
  const retryDelay = 1000; // 1 second

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 vehicleLookupService: Attempt ${attempt}/${maxRetries} for VIN: ${vin}`);
      
      // Call the unified-decode edge function with timeout
      const timeoutMs = 10000; // 10 seconds
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      try {
        const { data, error } = await supabase.functions.invoke('unified-decode', {
          body: { vin: vin.toUpperCase() },
          headers: {
            'Content-Type': 'application/json',
          }
        });

        clearTimeout(timeoutId);

        console.log('🔍 vehicleLookupService: Edge function response:', { data, error, hasData: !!data, hasError: !!error });

        if (error) {
          console.error(`❌ vehicleLookupService: Edge function error (attempt ${attempt}):`, error);
          lastError = new Error(`Edge function error: ${JSON.stringify(error)}`);
          
          if (attempt === maxRetries) {
            throw lastError;
          }
          
          console.log(`⏱️ vehicleLookupService: Retrying in ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }

        // Check for successful response
        if (data && data.success && data.decoded) {
          const decodedData = data.decoded;
          console.log('✅ vehicleLookupService: Raw decoded data:', decodedData);
          
          // Validate required fields
          if (!decodedData.make || !decodedData.model || !decodedData.year) {
            console.error('❌ vehicleLookupService: Missing required vehicle data:', decodedData);
            lastError = new Error('Incomplete vehicle data from NHTSA');
            
            if (attempt === maxRetries) {
              throw lastError;
            }
            continue;
          }
          
          const vehicleInfo: DecodedVehicleInfo = {
            vin: decodedData.vin || vin.toUpperCase(),
            year: decodedData.year,
            make: decodedData.make,
            model: decodedData.model,
            trim: decodedData.trim || 'Standard',
            engine: decodedData.engine || (decodedData.engineCylinders ? `${decodedData.engineCylinders}-Cylinder` : ''),
            transmission: decodedData.transmission || 'Unknown',
            bodyType: decodedData.bodyType || 'Unknown',
            fuelType: decodedData.fuelType || 'Unknown',
            drivetrain: decodedData.drivetrain || 'Unknown',
            exteriorColor: 'Unknown',
            doors: decodedData.doors || 'Unknown',
            seats: decodedData.seats || 'Unknown',
            displacement: decodedData.displacementL || '',
            mileage: 0, // Default for new lookup
            condition: 'Good', // Default condition
            confidenceScore: 85,
            // Add sample photos for demo purposes
            photos: [
              'https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'
            ],
            primaryPhoto: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop'
          };

          console.log('✅ vehicleLookupService: Successfully processed vehicle data:', vehicleInfo);
          
          // Verify the vehicle was saved to database
          try {
            const { data: savedVehicle, error: dbError } = await supabase
              .from('decoded_vehicles')
              .select('*')
              .eq('vin', vin.toUpperCase())
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            if (dbError) {
              console.warn('⚠️ vehicleLookupService: Could not verify database save:', dbError);
            } else if (savedVehicle) {
              console.log('✅ vehicleLookupService: Confirmed vehicle saved to database:', savedVehicle.id);
            } else {
              console.warn('⚠️ vehicleLookupService: Vehicle not found in database - may not have been saved');
            }
          } catch (dbCheckError) {
            console.warn('⚠️ vehicleLookupService: Database check failed:', dbCheckError);
          }
          
          return vehicleInfo;
          
        } else {
          console.error(`❌ vehicleLookupService: Invalid response (attempt ${attempt}):`, { 
            hasData: !!data, 
            success: data?.success, 
            hasDecoded: !!data?.decoded,
            error: data?.error 
          });
          
          lastError = new Error(data?.error || 'No vehicle data returned from decode service');
          
          if (attempt === maxRetries) {
            throw lastError;
          }
          
          console.log(`⏱️ vehicleLookupService: Retrying in ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
        
      } catch (timeoutError) {
        clearTimeout(timeoutId);
        console.error(`❌ vehicleLookupService: Request timeout (attempt ${attempt}):`, timeoutError);
        lastError = new Error('Request timeout - please try again');
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        console.log(`⏱️ vehicleLookupService: Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
      
    } catch (error) {
      console.error(`❌ vehicleLookupService: Exception on attempt ${attempt}:`, error);
      lastError = error instanceof Error ? error : new Error('Unknown error occurred');
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      console.log(`⏱️ vehicleLookupService: Retrying in ${retryDelay}ms...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  // This shouldn't be reached, but just in case
  throw lastError || new Error('VIN lookup failed after all retries');
}

export async function fetchVehicleByPlate(plate: string, state: string): Promise<DecodedVehicleInfo> {
  console.log('🔄 vehicleLookupService: Plate lookup for:', plate, 'state:', state);
  
  // Simulate API delay for plate lookup (this is still mock as there's no real plate API)
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Enhanced mock vehicle data for plate lookup
  const mockVehicle: DecodedVehicleInfo = {
    plate,
    state,
    year: 2020,
    make: 'Honda',
    model: 'Accord',
    trim: 'Sport',
    engine: '1.5L Turbo 4-Cylinder',
    transmission: 'CVT',
    bodyType: 'Sedan',
    fuelType: 'Gasoline',
    drivetrain: 'FWD',
    exteriorColor: 'Still Night Pearl',
    interiorColor: 'Black Leather',
    doors: '4',
    seats: '5',
    displacement: '1.5L',
    mileage: 52000,
    condition: 'Good',
    confidenceScore: 80,
    photos: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop'
    ],
    primaryPhoto: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop'
  };
  
  console.log('✅ vehicleLookupService: Plate lookup completed (mock data):', mockVehicle);
  return mockVehicle;
}

export async function fetchTrimOptions(make: string, model: string, year: number): Promise<string[]> {
  console.log('Fetching trim options for:', make, model, year);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock trim options based on make/model
  const trimOptions: Record<string, string[]> = {
    'Toyota_Camry': ['L', 'LE', 'SE', 'XLE', 'XSE', 'TRD'],
    'Honda_Accord': ['LX', 'Sport', 'EX', 'EX-L', 'Touring'],
    'Ford_F-150': ['Regular Cab', 'SuperCab', 'SuperCrew', 'Raptor'],
    'Chevrolet_Silverado': ['Work Truck', 'Custom', 'LT', 'RST', 'LTZ', 'High Country']
  };
  
  const key = `${make}_${model}`;
  return trimOptions[key] || ['Base', 'Premium', 'Luxury'];
}
