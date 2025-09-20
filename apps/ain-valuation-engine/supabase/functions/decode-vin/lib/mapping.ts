/**
 * Lightweight helpers ported for Node/Vitest.
 * Keep signatures stable for tests.
 */

export function toBool(v?: unknown): boolean | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim().toLowerCase();
  if (!s) return false;
  if (['yes', 'y', 'true', 't', '1'].includes(s)) return true;
  if (['no', 'n', 'false', 'f', '0'].includes(s)) return false;
  // If it's any other non-empty token (e.g., "Present"), treat as true.
  return true;
}

export function parseAirbagFlag(v?: unknown): boolean | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (!s) return false;
  return true;
}

export function mapSafetyEquipment(src?: {
  ABS?: unknown;
  TractionControl?: unknown;
  ElectronicStabilityControl?: unknown;
  TPMS?: unknown;
  BrakeAssist?: unknown;
}) {
  if (!src) {
    return {
      abs: null,
      traction_control: null,
      electronic_stability_control: null,
      tpms: null,
      brake_assist: null,
    };
  }
  return {
    abs: toBool(src.ABS),
    traction_control: toBool(src.TractionControl),
    electronic_stability_control: toBool(src.ElectronicStabilityControl),
    tpms: toBool(src.TPMS),
    brake_assist: toBool(src.BrakeAssist),
  };
}

export function mapAirbags(src?: {
  AirBagLocFront?: unknown;
  AirBagLocSide?: unknown;
  AirBagLocKnee?: unknown;
  AirBagLocCurtain?: unknown;
  AirBagLocRear?: unknown;
}) {
  if (!src) {
    return {
      front: null,
      side: null,
      knee: null,
      curtain: null,
      rear: null,
    };
  }
  return {
    front: parseAirbagFlag(src.AirBagLocFront),
    side: parseAirbagFlag(src.AirBagLocSide),
    knee: parseAirbagFlag(src.AirBagLocKnee),
    curtain: parseAirbagFlag(src.AirBagLocCurtain),
    rear: parseAirbagFlag(src.AirBagLocRear),
  };
}

export function mapLighting(src?: {
  DaytimeRunningLight?: unknown;
  AdaptiveHeadlights?: unknown;
  AutomaticHeadlights?: unknown;
}) {
  if (!src) {
    return {
      daytime_running_lights: null,
      adaptive_headlights: null,
      automatic_headlights: null,
    };
  }
  return {
    daytime_running_lights: toBool(src.DaytimeRunningLight),
    adaptive_headlights: toBool(src.AdaptiveHeadlights),
    automatic_headlights: toBool(src.AutomaticHeadlights),
  };
}
