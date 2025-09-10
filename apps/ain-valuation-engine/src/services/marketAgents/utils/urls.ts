export function carsDotCom({ make, model, zip, radius=100 }: { make?: string; model?: string; zip?: string; radius?: number; }) {
  const m = encodeURIComponent(make ?? "");
  const mo = encodeURIComponent(model ?? "");
  const z = encodeURIComponent(zip ?? "");
  return `https://www.cars.com/shopping/results/?makes[]=${m}&models[]=${mo}&maximum_distance=${radius}&zip=${z}`;
}

export function carGurus({ make, model, zip }: { make?: string; model?: string; zip?: string; }) {
  const q = [make, model].filter(Boolean).join(" ");
  return `https://www.cargurus.com/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?zip=${encodeURIComponent(zip ?? "")}&showNegotiable=true&distance=100&entitySelectingHelper.selectedEntity=${encodeURIComponent(q)}`;
}

export function autoTrader({ make, model, zip, radius=100 }: { make?: string; model?: string; zip?: string; radius?: number; }) {
  const m = encodeURIComponent(make ?? "");
  const mo = encodeURIComponent(model ?? "");
  const z = encodeURIComponent(zip ?? "");
  return `https://www.autotrader.com/cars-for-sale/all-cars/${m}/${mo}/${z}?dma=&searchRadius=${radius}`;
}

export function trueCar({ make, model, zip, radius=100 }: { make?: string; model?: string; zip?: string; radius?: number; }) {
  const m = encodeURIComponent((make ?? "").toLowerCase());
  const mo = encodeURIComponent((model ?? "").toLowerCase());
  const z = encodeURIComponent(zip ?? "");
  return `https://www.truecar.com/used-cars-for-sale/listings/${m}/${mo}/location-${z}/?searchRadius=${radius}`;
}

export function edmunds({ make, model, zip, radius=100 }: { make?: string; model?: string; zip?: string; radius?: number; }) {
  const m = encodeURIComponent(make ?? "");
  const mo = encodeURIComponent(model ?? "");
  const z = encodeURIComponent(zip ?? "");
  return `https://www.edmunds.com/used/${m}/${mo}/?radius=${radius}&zip=${z}`;
}

// Add more as needed. Be sure to respect each site's ToS/robots and your allowlist.
