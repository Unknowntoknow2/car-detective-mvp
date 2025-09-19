import type { VehicleData, VehicleDataCanonical } from '../../apps/ain-valuation-engine/src/types/canonical'

export type { VehicleData, VehicleDataCanonical }

export type PartialVehicleData = Partial<VehicleData> & {
  zipCode?: string
}
