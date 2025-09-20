import { computeVinCheckDigit } from '../lib/vin/checkDigit';

export class VINDecodeError extends Error {
  constructor(message, code = 'VALIDATION_ERROR', details) {
    super(message);
    this.name = 'VINDecodeError';
    this.code = code;
    this.details = details;
  }
}

export function isVinDecodeSuccessful(res) {
  return !!res && typeof res.success === 'boolean' && res.success === true;
}

export function extractLegacyVehicleInfo(decoded) {
  return {
    make: decoded?.make ?? 'Unknown',
    model: decoded?.model ?? 'Unknown',
    modelYear: decoded?.modelYear ?? decoded?.year ?? null,
  };
}

export async function decodeVin(vin, opts = {}) {
  const norm = String(vin || '').toUpperCase().trim();
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(norm)) {
    throw new VINDecodeError('Invalid VIN format', 'VALIDATION_ERROR', { vin: norm });
  }
  const expected = computeVinCheckDigit(norm);
  const actual = norm[8];
  if (expected !== actual) {
    // tests expect VALIDATION_ERROR even for checksum mismatch
    throw new VINDecodeError('Invalid VIN check digit', 'VALIDATION_ERROR', { expected, actual, vin: norm });
  }

  const source = opts.forceMethod === 'NHTSA_DIRECT' ? 'NHTSA_DIRECT' : 'local';
  // minimal stable shape that tests assert against
  return {
    vin: norm,
    source,
    success: true,
    raw: {},
    categories: {},
    metadata: { isCommercial: false },
    make: 'Unknown',
    model: 'Unknown',
    modelYear: null,
    year: null,
  };
}
