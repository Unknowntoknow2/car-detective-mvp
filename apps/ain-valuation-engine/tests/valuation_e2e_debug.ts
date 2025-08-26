import axios from "axios";

const VIN = process.argv[2] || "4T1B31HK0KU509959";

async function main() {
  const payload = {
    vin: VIN,
    year: 2019,
    make: "Toyota",
    model: "Camry",
    trim: "SE",
    bodyStyle: "Sedan",
    engine: "2.5L I4",
    transmission: "Automatic",
  };

  try {
    const res = await axios.post("http://localhost:3000/api/valuate", payload);
    console.log("Valuation Response:");
    console.dir(res.data, { depth: null });
  } catch (err: any) {
    console.error("Error:", err.response?.data || err.message);
  }
}

main();
