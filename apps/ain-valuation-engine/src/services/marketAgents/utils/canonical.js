export function canonUrl(url) {
    try {
        const u = new URL(url);
        u.hash = "";
        u.search = "";
        return u.toString().replace(/\/$/, "");
    }
    catch {
        return url;
    }
}
export function canonPhone(phone) {
    return phone.replace(/\D/g, "");
}
export function canonDealerName(name) {
    return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}
export function canonVIN(vin) {
    return vin.trim().toUpperCase();
}
