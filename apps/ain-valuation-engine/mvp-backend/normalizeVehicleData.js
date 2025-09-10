export function normalizeVehicleData({ vin, year, make, model, mileage, zip, condition, titleStatus }) {
  return {
    vin: vin ? String(vin).toUpperCase() : '',
    year: year ? Number(year) : null,
    make: make ? String(make).toUpperCase() : '',
    model: model ? String(model).toUpperCase() : '',
    mileage: mileage ? Number(mileage) : null,
    zip: zip ? String(zip) : '',
    condition: condition || 'GOOD',
    titleStatus: titleStatus || 'CLEAN',
  };
}
