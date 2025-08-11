/**
 * VIN Identity & Validation (ISO 3779)
 */
export type VinValidationErrorCode =
  | "400_INVALID_VIN_FORMAT"
  | "422_CHECK_DIGIT_FAIL";

export interface VinValid {
  ok: true;
  vin: string;
  wmi: string;
  vds: string;
  vis: string;
  checkDigit: string;
}
export interface VinInvalid {
  ok: false;
  code: VinValidationErrorCode;
  message: string;
  vin?: string;
}
export type VinValidationResult = VinValid | VinInvalid;

const VIN_ALLOWED_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;
const TRANSLIT: Record<string, number> = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,
  J:1,K:2,L:3,M:4,N:5,P:7,R:9,
  S:2,T:3,U:4,V:5,W:6,X:7,Y:8,Z:9,
  "0":0,"1":1,"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9
};
const WEIGHTS = [8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2];

export function validateVin(rawVin: string): VinValidationResult {
  if (!rawVin || typeof rawVin !== "string") {
    return { ok:false, code:"400_INVALID_VIN_FORMAT", message:"VIN must be a non-empty string" };
  }
  const normalized = rawVin.trim().replace(/\s+/g, "").toUpperCase();
  if (normalized.length !== 17) {
    return { ok:false, code:"400_INVALID_VIN_FORMAT", message:"VIN must be exactly 17 characters after normalization" };
  }
  if (!VIN_ALLOWED_REGEX.test(normalized)) {
    return { ok:false, code:"400_INVALID_VIN_FORMAT", message:"VIN contains invalid characters (I,O,Q not allowed)" };
  }
  const expected = computeCheckDigit(normalized);
  const actual = normalized[8];
  if (expected !== actual) {
    return { ok:false, code:"422_CHECK_DIGIT_FAIL", message:`Check digit mismatch (expected ${expected}, got ${actual})`, vin: normalized };
  }
  return {
    ok: true,
    vin: normalized,
    wmi: normalized.slice(0,3),
    vds: normalized.slice(3,9),
    vis: normalized.slice(9,17),
    checkDigit: actual
  };
}
export function isValidVin(vin: string) { return validateVin(vin).ok; }

function computeCheckDigit(vin: string): string {
  let sum = 0;
  for (let i=0;i<17;i++){
    const v = TRANSLIT[vin[i]];
    if (v === undefined) return "_";
    sum += v * WEIGHTS[i];
  }
  const r = sum % 11;
  return r === 10 ? "X" : String(r);
}
