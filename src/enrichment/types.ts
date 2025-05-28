
export interface StatVinData {
  vin: string;
  salePrice?: string;
  damage?: string;
  status?: string;
  auctionDate?: string;
  location?: string;
  images: string[];
  make?: string;
  model?: string;
  year?: string;
  mileage?: string;
  bodyType?: string;
  engine?: string;
  transmission?: string;
  fuelType?: string;
  drivetrain?: string;
  exteriorColor?: string;
  interiorColor?: string;
  keys?: number;
  seller?: string;
  lot?: string;
  estimatedRepairCost?: string;
  estimatedRetailValue?: string;
  condition?: string;
  titleType?: string;
  primaryDamage?: string;
  secondaryDamage?: string;
  saleType?: string;
  runAndDrive?: boolean;
}

export interface FacebookListing {
  id: string;
  title: string;
  price: number;
  location: string;
  imageUrl?: string;
  url: string;
  postedDate: string;
  condition?: string;
}

export interface CraigslistListing {
  id: string;
  title: string;
  price: number;
  location: string;
  imageUrl?: string;
  url: string;
  postedDate: string;
  condition?: string;
}

export interface EbayListing {
  id: string;
  title: string;
  price: number;
  location: string;
  imageUrl?: string;
  url: string;
  postedDate: string;
  condition?: string;
  bidCount?: number;
  endDate?: string;
}

export interface EnrichedVehicleData {
  vin: string;
  sources: {
    statVin: StatVinData | null;
    facebook: FacebookListing[] | null;
    craigslist: CraigslistListing[] | null;
    ebay: EbayListing[] | null;
    carsdotcom: any | null; // Reserved for future implementation
    offerup: any | null; // Reserved for future implementation
  };
}
