import * as svc from '@/services/valuationEngine'
import type { VehicleData, ValuationResult } from '@/types/ValuationTypes'

export async function valuateVehicle(data: VehicleData): Promise<ValuationResult> {
  const fn =
    (svc as any).valuateVehicle ??
    (svc as any).processValuation

  if (typeof fn !== 'function') {
    throw new Error('valuationEngine export not found (expected valuateVehicle or processValuation)')
  }
  return await fn(data)
}

export type { VehicleData, ValuationResult } from '@/types/ValuationTypes'
