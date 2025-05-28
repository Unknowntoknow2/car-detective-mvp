
// ARCHIVED - DO NOT USE
// These auction utilities have been centralized into getEnrichedVehicleData.ts

// Original files archived:
// - src/utils/auctions/iaai.ts
// - src/utils/auctions/copart.ts  
// - src/utils/auctions/manheim.ts

export interface ArchivedAuctionResult {
  vin: string;
  source: string;
  price: string;
  sold_date: string;
  odometer: string;
  condition_grade: string;
  location: string;
  photo_urls: string[];
}

// These functions are now replaced by the centralized BrightData integration
