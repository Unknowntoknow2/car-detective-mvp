import { supabase } from "../../db/supabaseClient.js";
const cache = new Map();
export async function getZipPoint(zip) {
    if (cache.has(zip))
        return cache.get(zip);
    const { data, error } = await supabase.from("zip_centroids").select("zip,lat,lon").eq("zip", zip).single();
    if (error || !data)
        return null;
    const z = { zip: data.zip, lat: Number(data.lat), lon: Number(data.lon) };
    cache.set(zip, z);
    return z;
}
export function haversineMiles(a, b) {
    const R = 3958.761; // miles
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lon - a.lon);
    const s1 = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(s1));
}
