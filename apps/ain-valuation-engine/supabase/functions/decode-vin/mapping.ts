export const toBool = (x?: string | null): boolean => {
  const s = String(x ?? '').trim();
  if (!s) return false;
  return /^(y|yes|true|1)$/i.test(s);
};

export const parseAirbagFlag = (x?: string | null): boolean => {
  const s = String(x ?? '').trim();
  if (!s) return false;               // tests want false, not null, when empty/missing
  return true;                        // any non-empty string is truthy for presence
};

export function mapSafetyEquipment(src?: any) {
  if (!src) {
    return { abs: null, traction_control: null, electronic_stability_control: null };
  }
  return {
    abs: toBool(src.ABS),
    traction_control: toBool(src.TractionControl),
    electronic_stability_control: toBool(src.ElectronicStabilityControl),
  };
}

export function mapAirbags(src?: any) {
  if (!src) {
    // when the whole source is missing, tests expect nulls
    return { front: null, side: null, rear: null, curtains: null };
  }
  // for present source, missing fields should be boolean false (not null)
  return {
    front: parseAirbagFlag(src.AirBagLocFront),
    side: parseAirbagFlag(src.AirBagLocSide),
    rear: parseAirbagFlag(src.AirBagLocRear),
    curtains: parseAirbagFlag(src.AirBagLocCurtain),
  };
}

export function mapLighting(src?: any) {
  if (!src) {
    return { daytime_running_lights: null, adaptive_headlights: null, automatic_headlights: null };
  }
  return {
    daytime_running_lights: toBool(src.DaytimeRunningLight),
    adaptive_headlights: toBool(src.AdaptiveHeadlights),
    automatic_headlights: toBool(src.AutoHeadlight),
  };
}
