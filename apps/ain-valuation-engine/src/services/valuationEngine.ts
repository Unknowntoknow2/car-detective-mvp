import { decodeVin, isVinDecodeSuccessful, extractLegacyVehicleInfo } from './unifiedVinDecoder'
import supabase from '../integrations/supabase/client'
import logger from '../utils/logger'
import { valuationRequestsTotal, valuationDuration, databaseOperations } from '../utils/metrics'

/**
 * Executes a complete vehicle valuation process for a given VIN number.
 * 
 * This function handles the entire valuation workflow including:
 * - VIN decoding and validation
 * - Data storage and audit logging
 * - Performance metrics tracking
 * - Error handling and recovery
 * 
 * @param {string} vin - The Vehicle Identification Number to process (17 characters)
 * @returns {Promise<any>} The decoded vehicle information and valuation data
 * 
 * @throws {Error} When VIN decoding fails or database operations encounter errors
 * 
 * @example
 * ```typescript
 * try {
 *   const result = await runValuation('1HGBH41JXMN109186');
 *   console.log('Valuation complete:', result);
 * } catch (error) {
 *   console.error('Valuation failed:', error);
 * }
 * ```
 * 
 * @metrics
 * - Tracks valuation request counts by status (started/success/error)
 * - Measures valuation duration for performance monitoring
 * - Records database operation metrics for audit purposes
 */
export async function runValuation(vin: string) {
  const timer = valuationDuration.startTimer();
  
  try {
    valuationRequestsTotal.inc({ status: 'started' });
    
    const decoded = await decodeVin(vin)

    if (!isVinDecodeSuccessful(decoded)) {
      throw new Error(decoded.metadata.errorText || 'VIN decoding failed')
    }

    // Extract legacy format for database storage
    const legacyData = extractLegacyVehicleInfo(decoded)

    // Save to Supabase
    const dbTimer = Date.now();
    await supabase.from('vin_history').insert([
      {
        vin,
        response: legacyData
      }
    ])
    
    databaseOperations.inc({ 
      operation: 'insert', 
      table: 'vin_history', 
      status: 'success' 
    });

    valuationRequestsTotal.inc({ status: 'success' });
    timer({ status: 'success' });
    
    return decoded
  } catch (error) {
    logger.error('Valuation failed:', error)
    valuationRequestsTotal.inc({ status: 'error' });
    databaseOperations.inc({ 
      operation: 'insert', 
      table: 'vin_history', 
      status: 'error' 
    });
    timer({ status: 'error' });
    throw error
  }
}
