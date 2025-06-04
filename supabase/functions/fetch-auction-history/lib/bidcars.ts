// supabase/functions/fetch-auction-history/lib/bidcars.ts
export async function fetchFromBidCars(vin: string) {
  try {
    const url = `https://bid.cars/en/search/${vin}`;
    const html = await fetch(url).then((res) => res.text());

    if (!html.includes("Auction lot")) return null;

    const priceMatch = html.match(/Final bid.*?\$(\d[\d,]*)/);
    const odometerMatch = html.match(/Odometer.*?([\d,]+) mi/);
    const dateMatch = html.match(/Sold on.*?(\d{2}\/\d{2}\/\d{4})/);
    const images = Array.from(
      html.matchAll(/<img src="(https:\/\/images\.bid\.cars\/[^"]+)"/g),
    ).map((m) => m[1]);

    return {
      vin,
      auction_source: "Bid.Cars",
      price: priceMatch?.[1] ? `$${priceMatch[1]}` : null,
      odometer: odometerMatch?.[1] + " mi",
      sold_date: dateMatch?.[1] || null,
      photo_urls: images.slice(0, 5),
      condition_grade: null,
    };
  } catch {
    return null;
  }
}
