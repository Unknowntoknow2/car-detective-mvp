import axios from 'axios';
export async function decodeVIN(vin: string) {
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`;
  const response = await axios.get(url);
  return response.data;
}
