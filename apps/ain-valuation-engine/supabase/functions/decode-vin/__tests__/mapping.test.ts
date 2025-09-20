import { describe, it, expect } from "vitest";
import { toBool, parseAirbagFlag, mapSafetyEquipment, mapAirbags, mapLighting } from "../mapping";

describe("toBool function tests", () => {
  it("positive cases", () => {
    expect(toBool("Yes")).toBe(true);
    expect(toBool("YES")).toBe(true);
    expect(toBool("yes")).toBe(true);
    expect(toBool("y")).toBe(true);
    expect(toBool("TRUE")).toBe(true);
    expect(toBool("1")).toBe(true);
  });
  it("negative/edge cases", () => {
    expect(toBool("No")).toBe(false);
    expect(toBool("0")).toBe(false);
    expect(toBool("")).toBe(false);
    expect(toBool(undefined)).toBe(false);
    expect(toBool(null)).toBe(false);
  });
});

describe("parseAirbagFlag function tests", () => {
  it("treats any non-empty string as true", () => {
    expect(parseAirbagFlag("1st Row (Driver & Passenger)")).toBe(true);
    expect(parseAirbagFlag("Front")).toBe(true);
    expect(parseAirbagFlag("Side")).toBe(true);
  });
  it("falsey for empty or missing", () => {
    expect(parseAirbagFlag("")).toBe(false);
    expect(parseAirbagFlag(undefined)).toBe(false);
    expect(parseAirbagFlag(null)).toBe(false);
  });
});

describe("mapSafetyEquipment", () => {
  it("maps booleans and nulls correctly", () => {
    const result = mapSafetyEquipment({
      ABS: "Yes",
      TractionControl: "No",
      ElectronicStabilityControl: "Yes",
    });
    expect(result).toEqual({
      abs: true,
      traction_control: false,
      electronic_stability_control: true,
    });
  });
});

describe("mapAirbags", () => {
  it("maps airbag presence flags", () => {
    const result = mapAirbags({
      AirBagLocFront: "1st Row (Driver & Passenger)",
      AirBagLocSide: "Front",
      AirBagLocRear: "",
      AirBagLocCurtain: "All Rows",
    });
    expect(result).toEqual({
      front: true,
      side: true,
      rear: false,
      curtains: true,
    });
  });
});

describe("mapLighting", () => {
  it("maps lighting booleans and nulls", () => {
    const result = mapLighting({
      DaytimeRunningLight: "Yes",
      AdaptiveHeadlights: "No",
      AutoHeadlight: "Yes",
    });
    expect(result).toEqual({
      daytime_running_lights: true,
      adaptive_headlights: false,
      automatic_headlights: true,
    });
  });
});

describe("Edge cases and mixed data", () => {
  it("returns nulls when source missing", () => {
    const safetyResult = mapSafetyEquipment(undefined);
    const airbagResult = mapAirbags(undefined);
    const lightingResult = mapLighting(undefined);
    expect(safetyResult.abs).toBeNull();
    expect(airbagResult.front).toBeNull();
    expect(lightingResult.daytime_running_lights).toBeNull();
  });
});
