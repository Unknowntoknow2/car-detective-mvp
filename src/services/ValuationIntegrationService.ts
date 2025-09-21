import { supabase } from '@/integrations/supabase/client';
import { UnifiedLookupService } from './UnifiedLookupService';
import { ValuationRequest, ValuationResult } from '@/types/vehicleData';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { ValuationApiService } from "@/services/ValuationApiService";

export interface EnrichmentData {
  vin: string;
  source: string;
  decodedData: any;
  enrichmentScore: number;
  lastEnrichedAt: string;
  featuresDetected?: any;
  buildData?: any;
}

export interface ValuationPipelineResult {
  success: boolean;
  requestId?: string;
  decodedVehicle?: DecodedVehicleInfo;
  enrichmentData?: EnrichmentData;
  valuationResult?: ValuationResult;
  error?: string;
  auditTrail: Array<{
    stage: string;
    timestamp: string;
    status: 'success' | 'failed' | 'skipped';
    message: string;
    data?: any;
  }>;
}

/**
 * Comprehensive service for integrating VIN decode → enrichment → valuation pipeline
 * This is the single source of truth for the end-to-end valuation flow
 */
export class ValuationIntegrationService {
  
  /**
   * Main entry point: Complete VIN to valuation pipeline
   */
  static async processVinToValuation(
    vin: string,
    additionalData?: Partial<ValuationRequest>,
    options: { tier?: 'free' | 'premium'; forceRefresh?: boolean } = {}
  ): Promise<ValuationPipelineResult> {
    const auditTrail: ValuationPipelineResult['auditTrail'] = [];
    const startTime = Date.now();

    try {

      // Stage 1: VIN Decode
      auditTrail.push({
        stage: 'vin_decode_start',
        timestamp: new Date().toISOString(),
        status: 'success',
        message: 'Starting VIN decode process'
      });

      const lookupResult = await UnifiedLookupService.lookupByVin(vin, {
        tier: options.tier || 'free',
        mode: 'vpic',
        includeHistory: options.tier === 'premium',
        includeMarketData: options.tier === 'premium'
      });

      if (!lookupResult.success || !lookupResult.vehicle) {
        auditTrail.push({
          stage: 'vin_decode_failed',
          timestamp: new Date().toISOString(),
          status: 'failed',
          message: lookupResult.error || 'VIN decode failed'
        });

        return {
          success: false,
          error: lookupResult.error || 'VIN decode failed',
          auditTrail
        };
      }

      const decodedVehicle = lookupResult.vehicle;
      auditTrail.push({
        stage: 'vin_decode_success',
        timestamp: new Date().toISOString(),
        status: 'success',
        message: `VIN decoded successfully via ${lookupResult.source}`,
        data: { confidence: lookupResult.confidence, source: lookupResult.source }
      });

      // Stage 2: VIN Enrichment (check if we have enrichment data)
      let enrichmentData: EnrichmentData | undefined;
      
      try {
        const { data: existingEnrichment } = await supabase
          .from('vin_enrichment_data')
          .select('*')
          .eq('vin', vin)
          .single();

        if (existingEnrichment && !options.forceRefresh) {
          enrichmentData = {
            vin: existingEnrichment.vin,
            source: existingEnrichment.source,
            decodedData: existingEnrichment.decoded_data,
            enrichmentScore: existingEnrichment.enrichment_score || 0,
            lastEnrichedAt: existingEnrichment.last_enriched_at || new Date().toISOString(),
            featuresDetected: existingEnrichment.features_detected,
            buildData: existingEnrichment.build_data
          };

          auditTrail.push({
            stage: 'vin_enrichment_cached',
            timestamp: new Date().toISOString(),
            status: 'success',
            message: 'Using cached VIN enrichment data',
            data: { enrichmentScore: enrichmentData.enrichmentScore }
          });
        } else {
          // Trigger enrichment via data quality orchestrator
          await supabase.functions.invoke('data-quality-orchestrator', {
            body: {
              job_type: 'vin_enrichment',
              batch_size: 1,
              force_reprocess: options.forceRefresh || false
            }
          });

          auditTrail.push({
            stage: 'vin_enrichment_triggered',
            timestamp: new Date().toISOString(),
            status: 'success',
            message: 'VIN enrichment job triggered'
          });
        }
      } catch (error) {
        auditTrail.push({
          stage: 'vin_enrichment_failed',
          timestamp: new Date().toISOString(),
          status: 'failed',
          message: `VIN enrichment failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }

      // Stage 3: Create Valuation Request using decoded data
      const valuationRequest: ValuationRequest = {
        vin: decodedVehicle.vin || vin,
        make: decodedVehicle.make,
        model: decodedVehicle.model,
        year: decodedVehicle.year,
        trim: decodedVehicle.trim,
        mileage: additionalData?.mileage || decodedVehicle.mileage,
        zip_code: additionalData?.zip_code || decodedVehicle.zipCode,
        condition: additionalData?.condition || decodedVehicle.condition,
        features: additionalData?.features || [],
        requested_by: 'web',
        meta: {
          source: lookupResult.source,
          confidence: lookupResult.confidence,
          tier: options.tier,
          enrichmentScore: enrichmentData?.enrichmentScore,
          originalInput: vin
        }
      };

      auditTrail.push({
        stage: 'valuation_request_prepared',
        timestamp: new Date().toISOString(),
        status: 'success',
        message: 'Valuation request prepared with decoded VIN data',
        data: valuationRequest
      });

      // Stage 4: Create valuation request
      const createResult = await ValuationApiService.createValuationRequest(valuationRequest);
      
      if (!createResult.success || !createResult.request_id) {
        auditTrail.push({
          stage: 'valuation_request_failed',
          timestamp: new Date().toISOString(),
          status: 'failed',
          message: createResult.error || 'Failed to create valuation request'
        });

        return {
          success: false,
          decodedVehicle,
          enrichmentData,
          error: createResult.error || 'Failed to create valuation request',
          auditTrail
        };
      }

      const requestId = createResult.request_id;
      auditTrail.push({
        stage: 'valuation_request_created',
        timestamp: new Date().toISOString(),
        status: 'success',
        message: `Valuation request created with ID: ${requestId}`
      });

      // Stage 5: Trigger market data aggregation
      const aggregationResult = await ValuationApiService.triggerAggregation(requestId);
      
      if (!aggregationResult.success) {
        auditTrail.push({
          stage: 'market_aggregation_failed',
          timestamp: new Date().toISOString(),
          status: 'failed',
          message: aggregationResult.error || 'Market data aggregation failed'
        });
      } else {
        auditTrail.push({
          stage: 'market_aggregation_success',
          timestamp: new Date().toISOString(),
          status: 'success',
          message: `Market data aggregated: ${aggregationResult.total_comps} comps from ${aggregationResult.sources_processed} sources`,
          data: aggregationResult
        });
      }

      // Stage 6: Get final valuation result
      const valuationResult = await ValuationApiService.getValuationResult(requestId);
      
      if (!valuationResult) {
        auditTrail.push({
          stage: 'valuation_result_failed',
          timestamp: new Date().toISOString(),
          status: 'failed',
          message: 'Failed to retrieve valuation result'
        });

        return {
          success: false,
          requestId,
          decodedVehicle,
          enrichmentData,
          error: 'Failed to retrieve valuation result',
          auditTrail
        };
      }

      auditTrail.push({
        stage: 'valuation_complete',
        timestamp: new Date().toISOString(),
        status: 'success',
        message: `Valuation completed: $${valuationResult.estimated_value} (${valuationResult.confidence_score}% confidence)`,
        data: {
          estimatedValue: valuationResult.estimated_value,
          confidence: valuationResult.confidence_score,
          compCount: valuationResult.comp_count,
          totalTimeMs: Date.now() - startTime
        }
      });

      // Store the complete audit trail in compliance log
      await this.logComplianceAudit(requestId, vin, auditTrail);

      return {
        success: true,
        requestId,
        decodedVehicle,
        enrichmentData,
        valuationResult,
        auditTrail
      };

    } catch (error) {
      console.error('❌ VIN to valuation pipeline failed:', error);
      
      auditTrail.push({
        stage: 'pipeline_failed',
        timestamp: new Date().toISOString(),
        status: 'failed',
        message: `Pipeline failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Pipeline failed',
        auditTrail
      };
    }
  }

  /**
   * Get enrichment data for a VIN
   */
  static async getVinEnrichmentData(vin: string): Promise<EnrichmentData | null> {
    try {
      const { data, error } = await supabase
        .from('vin_enrichment_data')
        .select('*')
        .eq('vin', vin)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        vin: data.vin,
        source: data.source,
        decodedData: data.decoded_data,
        enrichmentScore: data.enrichment_score || 0,
        lastEnrichedAt: data.last_enriched_at || new Date().toISOString(),
        featuresDetected: data.features_detected,
        buildData: data.build_data
      };
    } catch (error) {
      console.error('Error fetching VIN enrichment data:', error);
      return null;
    }
  }

  /**
   * Store enrichment data for a VIN
   */
  static async storeVinEnrichmentData(
    vin: string,
    source: string,
    decodedData: any,
    enrichmentScore: number = 0,
    additionalData?: { featuresDetected?: any; buildData?: any }
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('vin_enrichment_data')
        .upsert({
          vin,
          source,
          decoded_data: decodedData,
          enrichment_score: enrichmentScore,
          last_enriched_at: new Date().toISOString(),
          features_detected: additionalData?.featuresDetected,
          build_data: additionalData?.buildData
        }, {
          onConflict: 'vin,source'
        });

      return !error;
    } catch (error) {
      console.error('Error storing VIN enrichment data:', error);
      return false;
    }
  }

  /**
   * Check if we have recent valuation data for a VIN
   */
  static async getCachedValuationByVin(vin: string, maxAgeHours: number = 168): Promise<ValuationResult | null> {
    try {
      const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
      
      const { data: recentRequest } = await supabase
        .from('valuation_requests')
        .select('id')
        .eq('vin', vin)
        .eq('status', 'completed')
        .gte('created_at', cutoffTime.toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (recentRequest) {
        return await ValuationApiService.getValuationResult(recentRequest.id);
      }

      return null;
    } catch (error) {
      console.error('Error checking cached valuation:', error);
      return null;
    }
  }

  /**
   * Log compliance audit trail
   */
  private static async logComplianceAudit(
    requestId: string,
    vin: string,
    auditTrail: ValuationPipelineResult['auditTrail']
  ): Promise<void> {
    try {
      await supabase
        .from('compliance_audit_log')
        .insert({
          entity_type: 'valuation_pipeline',
          entity_id: requestId,
          action: 'complete_pipeline',
          input_data: { vin },
          output_data: {
            stages_completed: auditTrail.length,
            success_stages: auditTrail.filter(t => t.status === 'success').length,
            failed_stages: auditTrail.filter(t => t.status === 'failed').length
          },
          data_sources_used: ['nhtsa', 'vin_enrichment_data', 'market_comps', 'market_listings'],
          processing_time_ms: Date.now() - new Date(auditTrail[0]?.timestamp).getTime()
        });
    } catch (error) {
      console.error('Error logging compliance audit:', error);
    }
  }

  /**
   * Validate VIN format before processing
   */
  static validateVin(vin: string): { valid: boolean; error?: string } {
    if (!vin) {
      return { valid: false, error: 'VIN is required' };
    }

    if (vin.length !== 17) {
      return { valid: false, error: 'VIN must be exactly 17 characters' };
    }

    const cleanVin = vin.replace(/[^A-HJ-NPR-Z0-9]/gi, '').toUpperCase();
    if (cleanVin.length !== 17) {
      return { valid: false, error: 'VIN contains invalid characters (I, O, Q not allowed)' };
    }

    if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(cleanVin)) {
      return { valid: false, error: 'VIN format is invalid' };
    }

    return { valid: true };
  }
}

export default ValuationIntegrationService;