import axios from 'axios';
export async function decodeVinAndEstimate(vin) {
    const cleanVin = vin.trim().toUpperCase();
    if (!cleanVin || cleanVin.length !== 17)
        throw new Error('Invalid VIN');
    // Decode with NHTSA
    const nhtsaUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${cleanVin}?format=json`;
    const { data } = await axios.get(nhtsaUrl);
    const basics = {};
    data.Results.forEach((item) => {
        if (item.Variable && item.Value)
            basics[item.Variable] = item.Value;
    });
    // Extract main fields
    const year = basics.ModelYear;
    const make = basics.Make;
    const model = basics.Model;
    const trim = basics.Trim || basics.Series || "";
    const msrp = 25000; // Placeholder: Replace with real MSRP if available
    // Simple depreciation: Value drops 12%/year from MSRP (very basic)
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
