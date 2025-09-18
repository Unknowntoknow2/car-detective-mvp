// apps/ain-valuation-engine/src/ain-backend/valuationEngine.ts
import * as svc from '@/services/valuationEngine'
import type { VehicleData, ValuationResult } from '@/types/ValuationTypes'

/**
 * Stable façade for valuation calls used by the UI.
 * Delegates to the service layer, supporting legacy names.
 */
export async function valuateVehicle(data: VehicleData): Promise<ValuationResult> {
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
