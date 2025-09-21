// apps/ain-valuation-engine/src/ain-backend/valuationEngine.ts
import * as svc from '@/services/valuationEngine'
import type { VehicleData, ValuationResult } from '@/components/valuation/valuation-core/ValuationResult'

/**
 * Stable façade for valuation calls used by the UI.
 * Delegates to the service layer, supporting legacy names.
 */
export async function valuateVehicle(data: VehicleData): Promise<ValuationResult> {
  if (process.env.NODE_ENV !== 'production' && (data as any).zip === undefined) {
    throw new Error('valuateVehicle: zip is required in VehicleDataCanonical')
  }
  const fn =
    (svc as any).valuateVehicle ??
    (svc as any).processValuation ??
    (svc as any).runValuation

  if (typeof fn !== 'function') {
    throw new Error(
      'valuationEngine export not found (expected valuateVehicle, processValuation, or runValuation)'
    )
  }

  return (await fn(data)) as ValuationResult
}

export type { VehicleData, ValuationResult }
