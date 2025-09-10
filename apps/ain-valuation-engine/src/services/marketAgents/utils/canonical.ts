import crypto from "crypto";

export function canonUrl(url: string): string {
  try {
    const u = new URL(url);
    u.hash = "";
    u.search = "";
    return u.toString().replace(/\/$/, "");
  } catch {
    return url;
  }
}

export function canonPhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function canonDealerName(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

export function canonVIN(vin: string): string {
  return vin.trim().toUpperCase();
}
