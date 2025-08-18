// Unit tests for vPIC data mapping helpers
// Tests for toBool, parseAirbagFlag, and safety equipment mapping functions

// @ts-ignore remote Deno std import
import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";

// Minimal Deno declaration for editors without full Deno env
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const Deno: { test: (name: string, fn: () => void | Promise<void>) => void };

interface SafetyEquipment {
  abs: boolean | null;
  esc: boolean | null;
  traction_control: boolean | null;
  dynamic_brake_support: boolean | null;
  cib: boolean | null;
  adaptive_cruise_control: boolean | null;
  forward_collision_warning: boolean | null;
  lane_departure_warning: boolean | null;
  lane_keep_system: boolean | null;
  lane_centering_assistance: boolean | null;
  pedestrian_aeb: boolean | null;
  rear_visibility_system: boolean | null;
  rear_aeb: boolean | null;
  rear_cross_traffic_alert: boolean | null;
  park_assist: boolean | null;
  tpms: boolean | null;
  edr: boolean | null;
  blind_spot_monitoring: boolean | null;
}

interface AirbagMap {
  front: boolean | null;
  side: boolean | null;
  curtain: boolean | null;
  knee: boolean | null;
  seat_cushion: boolean | null;
  pretensioner: boolean | null;
}

interface LightingMap {
  daytime_running_lights: boolean | null;
  lower_beam_source: string | null;
  automatic_beam_switching: boolean | null;
}

// Import the helper functions from the main file
// Note: In a real setup, these would be exported from a separate module
function toBool(s: string | null): boolean | null {
  if (!s || s.trim() === '' || s.toLowerCase() === 'na' || s.toLowerCase() === 'not applicable') {
    return null;
  }
  const normalized = s.toLowerCase().trim();
  if (normalized === 'yes' || normalized === 'standard' || normalized === 'true') {
    return true;
  }
  if (normalized === 'no' || normalized === 'false') {
    return false;
  }
  return null;
}

function parseAirbagFlag(s: string | null): boolean | null {
  if (!s || s.trim() === '' || s.toLowerCase() === 'na' || s.toLowerCase() === 'not applicable') {
    return null;
  }
  // Any non-empty string indicates the airbag is present
  return s.trim().length > 0;
}

// Map vPIC response to our safety equipment structure
function mapSafetyEquipment(vpicData: Record<string, any>): SafetyEquipment {
  return {
    abs: toBool(vpicData.ABS),
    esc: toBool(vpicData.ESC),
    traction_control: toBool(vpicData.TractionControl),
    dynamic_brake_support: toBool(vpicData.DynamicBrakeSupport),
    cib: toBool(vpicData.CIB),
    adaptive_cruise_control: toBool(vpicData.AdaptiveCruiseControl),
    forward_collision_warning: toBool(vpicData.ForwardCollisionWarning),
    lane_departure_warning: toBool(vpicData.LaneDepartureWarning),
    lane_keep_system: toBool(vpicData.LaneKeepSystem),
    lane_centering_assistance: toBool(vpicData.LaneCenteringAssistance),
    pedestrian_aeb: toBool(vpicData.PedestrianAutomaticEmergencyBraking),
    rear_visibility_system: toBool(vpicData.RearVisibilitySystem),
    rear_aeb: toBool(vpicData.RearAutomaticEmergencyBraking),
    rear_cross_traffic_alert: toBool(vpicData.RearCrossTrafficAlert),
    park_assist: toBool(vpicData.ParkAssist),
    tpms: toBool(vpicData.TPMS),
    edr: toBool(vpicData.EDR),
    blind_spot_monitoring: toBool(vpicData.BlindSpotMon)
  };
}

// Map vPIC response to our airbag structure
function mapAirbags(vpicData: Record<string, any>): AirbagMap {
  return {
    front: parseAirbagFlag(vpicData.AirBagLocFront),
    side: parseAirbagFlag(vpicData.AirBagLocSide),
    curtain: parseAirbagFlag(vpicData.AirBagLocCurtain),
    knee: parseAirbagFlag(vpicData.AirBagLocKnee),
    seat_cushion: parseAirbagFlag(vpicData.AirBagLocSeatCushion),
    pretensioner: toBool(vpicData.Pretensioner)
  };
}

// Map vPIC response to our lighting structure
function mapLighting(vpicData: Record<string, any>): LightingMap {
  return {
    daytime_running_lights: toBool(vpicData.DaytimeRunningLight),
    lower_beam_source: vpicData.LowerBeamHeadlampLightSource || null,
    automatic_beam_switching: toBool(vpicData.SemiautomaticHeadlampBeamSwitching)
  };
}

// Test toBool function
Deno.test("toBool function tests", () => {
  // Test positive cases
  assertEquals(toBool("Yes"), true);
  assertEquals(toBool("YES"), true);
  assertEquals(toBool("yes"), true);
  assertEquals(toBool("Standard"), true);
  assertEquals(toBool("STANDARD"), true);
  assertEquals(toBool("standard"), true);
  assertEquals(toBool("True"), true);
  assertEquals(toBool("true"), true);

  // Test negative cases
  assertEquals(toBool("No"), false);
  assertEquals(toBool("NO"), false);
  assertEquals(toBool("no"), false);
  assertEquals(toBool("False"), false);
  assertEquals(toBool("false"), false);

  // Test null cases
  assertEquals(toBool(null), null);
  assertEquals(toBool(""), null);
  assertEquals(toBool("   "), null);
  assertEquals(toBool("NA"), null);
  assertEquals(toBool("na"), null);
  assertEquals(toBool("Not Applicable"), null);
  assertEquals(toBool("not applicable"), null);

  // Test unknown values
  assertEquals(toBool("Maybe"), null);
  assertEquals(toBool("Unknown"), null);
  assertEquals(toBool("Optional"), null);
});

// Test parseAirbagFlag function
Deno.test("parseAirbagFlag function tests", () => {
  // Test positive cases (any non-empty string)
  assertEquals(parseAirbagFlag("1st Row (Driver & Passenger)"), true);
  assertEquals(parseAirbagFlag("Front"), true);
  assertEquals(parseAirbagFlag("Side"), true);
  assertEquals(parseAirbagFlag("Curtain"), true);
  assertEquals(parseAirbagFlag("Available"), true);
  assertEquals(parseAirbagFlag("Standard"), true);
  assertEquals(parseAirbagFlag("Optional"), true);

  // Test null cases
  assertEquals(parseAirbagFlag(null), null);
  assertEquals(parseAirbagFlag(""), null);
  assertEquals(parseAirbagFlag("   "), null);
  assertEquals(parseAirbagFlag("NA"), null);
  assertEquals(parseAirbagFlag("na"), null);
  assertEquals(parseAirbagFlag("Not Applicable"), null);
  assertEquals(parseAirbagFlag("not applicable"), null);
});

// Test mapSafetyEquipment function
Deno.test("mapSafetyEquipment function tests", () => {
  const mockVpicData = {
    ABS: "Yes",
    ESC: "Standard",
    TractionControl: "No",
    DynamicBrakeSupport: "NA",
    CIB: null,
    AdaptiveCruiseControl: "",
    ForwardCollisionWarning: "Yes",
    LaneDepartureWarning: "Standard",
    LaneKeepSystem: "No",
    LaneCenteringAssistance: "Optional",
    PedestrianAutomaticEmergencyBraking: "Yes",
    RearVisibilitySystem: "Standard",
    RearAutomaticEmergencyBraking: "No",
    RearCrossTrafficAlert: "Yes",
    ParkAssist: "Optional",
    TPMS: "Standard",
    EDR: "Yes",
    BlindSpotMon: "Available"
  };

  const result = mapSafetyEquipment(mockVpicData);

  const expected = {
    abs: true,
    esc: true,
    traction_control: false,
    dynamic_brake_support: null,
    cib: null,
    adaptive_cruise_control: null,
    forward_collision_warning: true,
    lane_departure_warning: true,
    lane_keep_system: false,
    lane_centering_assistance: null, // "Optional" doesn't map to true/false
    pedestrian_aeb: true,
    rear_visibility_system: true,
    rear_aeb: false,
    rear_cross_traffic_alert: true,
    park_assist: null, // "Optional" doesn't map to true/false
    tpms: true,
    edr: true,
    blind_spot_monitoring: null // "Available" doesn't map to true/false
  };

  assertEquals(result, expected);
});

// Test mapAirbags function
Deno.test("mapAirbags function tests", () => {
  const mockVpicData = {
    AirBagLocFront: "1st Row (Driver & Passenger)",
    AirBagLocSide: "1st Row (Driver & Passenger)",
    AirBagLocCurtain: "1st and 2nd Rows",
    AirBagLocKnee: "Driver",
    AirBagLocSeatCushion: "",
    Pretensioner: "Yes"
  };

  const result = mapAirbags(mockVpicData);

  const expected = {
    front: true,
    side: true,
    curtain: true,
    knee: true,
    seat_cushion: null,
    pretensioner: true
  };

  assertEquals(result, expected);
});

// Test mapLighting function
Deno.test("mapLighting function tests", () => {
  const mockVpicData = {
    DaytimeRunningLight: "Standard",
    LowerBeamHeadlampLightSource: "Halogen",
    SemiautomaticHeadlampBeamSwitching: "Yes"
  };

  const result = mapLighting(mockVpicData);

  const expected = {
    daytime_running_lights: true,
    lower_beam_source: "Halogen",
    automatic_beam_switching: true
  };

  assertEquals(result, expected);
});

// Test edge cases
Deno.test("Edge cases and mixed data", () => {
  // Test with completely empty vPIC data
  const emptyData = {};
  
  const safetyResult = mapSafetyEquipment(emptyData);
  const airbagResult = mapAirbags(emptyData);
  const lightingResult = mapLighting(emptyData);

  // All should be null for missing data
  assertEquals(safetyResult.abs, null);
  assertEquals(airbagResult.front, null);
  assertEquals(lightingResult.daytime_running_lights, null);
  assertEquals(lightingResult.lower_beam_source, null);

  // Test with mixed case and whitespace
  const messyData = {
    ABS: "  YES  ",
    ESC: "  no  ",
    TractionControl: "  STANDARD  ",
    AirBagLocFront: "  Front Airbags  ",
    DaytimeRunningLight: "  Standard  "
  };

  const messySafety = mapSafetyEquipment(messyData);
  const messyAirbags = mapAirbags(messyData);
  const messyLighting = mapLighting(messyData);

  assertEquals(messySafety.abs, true);
  assertEquals(messySafety.esc, false);
  assertEquals(messySafety.traction_control, true);
  assertEquals(messyAirbags.front, true);
  assertEquals(messyLighting.daytime_running_lights, true);
});
