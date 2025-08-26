import * as z from "zod";
// For decode, allow just VIN; for full pipeline, require all fields
export const vehicleSchema = z.object({
    vin: z.string().length(17),
    year: z.number().int().gte(1980).lte(new Date().getFullYear() + 1).optional(),
    make: z.string().min(1).optional(),
    model: z.string().min(1).optional(),
    trim: z.string().optional(),
    bodyStyle: z.string().optional(),
    engine: z.string().optional(),
    transmission: z.string().optional(),
});
export function normalizeVehicleData(input) {
    return vehicleSchema.parse(input);
}
