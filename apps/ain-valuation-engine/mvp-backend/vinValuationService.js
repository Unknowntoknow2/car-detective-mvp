import axios from "axios";
import logger from "./logger.js";
export async function decodeVinAndEstimate(vin) {
  const cleanVin = vin.trim().toUpperCase();
  if (!cleanVin || cleanVin.length !== 17) throw new Error('Invalid VIN');
  const nhtsaUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${cleanVin}?format=json`;
  const { data } = await axios.get(nhtsaUrl);
  const basics = {};
  data.Results.forEach((item) => {
    if (item.Variable && item.Value) basics[item.Variable] = item.Value;
  });
  const year = basics.ModelYear;
  const make = basics.Make;
  const model = basics.Model;
  const trim = basics.Trim || basics.Series || "";
  const msrp = 25000;
  const age = year ? Math.max(0, new Date().getFullYear() - Number(year)) : 0;
  const est_value = Math.round(msrp * Math.pow(0.88, age));
  return {
    vin: cleanVin,
    year,
    make,
    model,
    trim,
    msrp,
    est_value,
    source: "NHTSA"
  };
}
