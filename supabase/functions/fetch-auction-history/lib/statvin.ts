// supabase/functions/fetch-auction-history/lib/statvin.ts
export async function fetchFromStatVIN(vin: string) {
  try {
    const url = `https://www.stat.vin/search/${vin}`;
    const html = await fetch(url).then((res) => res.text());

    if (!html.includes("Vehicle Information")) return null;

    const priceMatch = html.match(/Final Price.*?\$([\d,]+)/);
    const odometerMatch = html.match(/Odometer.*?([\d,]+) miles/);
    const dateMatch = html.match(/Sale Date.*?(\d{4}-\d{2}-\d{2})/);
    const images = Array.from(
      html.matchAll(/<img[^>]+src="(https:\/\/cdn\.stat\.vin\/[^"]+)"/g),
    ).map((m) => m[1]);

    return {
      vin,
      auction_source: "Stat.VIN",
      price: priceMatch?.[1] ? `$${priceMatch[1]}` : null,
      odometer: odometerMatch?.[1] + " miles",
      sold_date: dateMatch?.[1] || null,
      photo_urls: images.slice(0, 5),
      condition_grade: null,
    };
  } catch (err) {
    console.error("[StatVIN Error]", err);
    return null;
  }
}
