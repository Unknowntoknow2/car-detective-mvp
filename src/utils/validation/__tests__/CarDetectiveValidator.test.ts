
import { CarDetectiveValidator, VehicleFormData } from "../CarDetectiveValidator";

describe("CarDetectiveValidator", () => {
  const validFormData: VehicleFormData = {
    make: "Toyota",
    model: "Camry",
    year: 2020,
    mileage: 50000,
    zipCode: "90210",
    condition: "Good",
    fuelType: "Gasoline",
    transmission: "Automatic"
  };

  describe("isValidForm", () => {
    it("should return valid for complete valid data", () => {
      const result = CarDetectiveValidator.isValidForm(validFormData);
      expect(result.valid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it("should validate required fields", () => {
      const result = CarDetectiveValidator.isValidForm({
        ...validFormData,
        make: ""
      });
      expect(result.valid).toBe(false);
      expect(result.errors.make).toBeTruthy();
    });

    it("should validate numeric ranges", () => {
      const result = CarDetectiveValidator.isValidForm({
        ...validFormData,
        year: 1970,
        mileage: 350000
      });
      expect(result.valid).toBe(false);
      expect(result.errors.year).toBeTruthy();
      expect(result.errors.mileage).toBeTruthy();
    });

    it("should handle string values for numeric fields", () => {
      const result = CarDetectiveValidator.isValidForm({
        ...validFormData,
        year: "2020",
        mileage: "50000"
      });
      expect(result.valid).toBe(true);
    });
  });

  describe("validateField", () => {
    it("should validate make field", () => {
      expect(CarDetectiveValidator.validateField("make", "Toyota")).toBeNull();
      expect(CarDetectiveValidator.validateField("make", "")).not.toBeNull();
    });

    it("should validate year field", () => {
      expect(CarDetectiveValidator.validateField("year", 2020)).toBeNull();
      expect(CarDetectiveValidator.validateField("year", "2020")).toBeNull();
      expect(CarDetectiveValidator.validateField("year", 1970)).not.toBeNull();
      expect(CarDetectiveValidator.validateField("year", 2050)).not.toBeNull();
    });

    it("should validate mileage field", () => {
      expect(CarDetectiveValidator.validateField("mileage", 50000)).toBeNull();
      expect(CarDetectiveValidator.validateField("mileage", "50000")).toBeNull();
      expect(CarDetectiveValidator.validateField("mileage", -100)).not.toBeNull();
      expect(CarDetectiveValidator.validateField("mileage", 350000)).not.toBeNull();
    });

    it("should validate zipCode field", () => {
      expect(CarDetectiveValidator.validateField("zipCode", "90210")).toBeNull();
      expect(CarDetectiveValidator.validateField("zipCode", "9021")).not.toBeNull();
      expect(CarDetectiveValidator.validateField("zipCode", "902100")).not.toBeNull();
      expect(CarDetectiveValidator.validateField("zipCode", "abcde")).not.toBeNull();
    });

    it("should validate condition field", () => {
      expect(CarDetectiveValidator.validateField("condition", "Good")).toBeNull();
      expect(CarDetectiveValidator.validateField("condition", "Excellent")).toBeNull();
      expect(CarDetectiveValidator.validateField("condition", "Fair")).toBeNull();
      expect(CarDetectiveValidator.validateField("condition", "Poor")).toBeNull();
      expect(CarDetectiveValidator.validateField("condition", "Average")).not.toBeNull();
    });

    it("should validate fuelType field", () => {
      expect(CarDetectiveValidator.validateField("fuelType", "Gasoline")).toBeNull();
      expect(CarDetectiveValidator.validateField("fuelType", "Diesel")).toBeNull();
      expect(CarDetectiveValidator.validateField("fuelType", "Electric")).toBeNull();
      expect(CarDetectiveValidator.validateField("fuelType", "Invalid")).not.toBeNull();
    });

    it("should validate transmission field", () => {
      expect(CarDetectiveValidator.validateField("transmission", "Automatic")).toBeNull();
      expect(CarDetectiveValidator.validateField("transmission", "Manual")).toBeNull();
      expect(CarDetectiveValidator.validateField("transmission", "Invalid")).not.toBeNull();
    });
  });

  describe("isValidVIN", () => {
    it("should validate correct VINs", () => {
      expect(CarDetectiveValidator.isValidVIN("1HGCM82633A004352")).toBe(true);
      expect(CarDetectiveValidator.isValidVIN("5YJSA1E11FF000337")).toBe(true);
    });

    it("should reject invalid VINs", () => {
      expect(CarDetectiveValidator.isValidVIN("")).toBe(false);
      expect(CarDetectiveValidator.isValidVIN("TOOLONG1234567890123")).toBe(false);
      expect(CarDetectiveValidator.isValidVIN("TOOSHORT123")).toBe(false);
      expect(CarDetectiveValidator.isValidVIN("1HGCM82633A00435I")).toBe(false); // Contains invalid character I
      expect(CarDetectiveValidator.isValidVIN("1HGCM82633A00435O")).toBe(false); // Contains invalid character O
      expect(CarDetectiveValidator.isValidVIN("1HGCM82633A00435Q")).toBe(false); // Contains invalid character Q
    });

    it("should handle spaces and case", () => {
      expect(CarDetectiveValidator.isValidVIN("1HGCM 82633 A004352")).toBe(true);
      expect(CarDetectiveValidator.isValidVIN("1hgcm82633a004352")).toBe(true);
    });
  });

  describe("isValidPlate", () => {
    it("should validate correct license plates", () => {
      expect(CarDetectiveValidator.isValidPlate("ABC123", "CA")).toBe(true);
      expect(CarDetectiveValidator.isValidPlate("123ABC", "NY")).toBe(true);
      expect(CarDetectiveValidator.isValidPlate("AB-123", "TX")).toBe(true);
    });

    it("should reject invalid license plates", () => {
      expect(CarDetectiveValidator.isValidPlate("", "CA")).toBe(false);
      expect(CarDetectiveValidator.isValidPlate("ABC123", "")).toBe(false);
      expect(CarDetectiveValidator.isValidPlate("AB*123", "NY")).toBe(false);
      expect(CarDetectiveValidator.isValidPlate("TOOLONG123", "TX")).toBe(false);
    });
  });
});
