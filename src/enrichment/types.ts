
export interface StatVinData {
  vin: string;
  salePrice?: string;
  damage?: string;
  primaryDamage?: string;
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
  secondaryDamage?: string;
  saleType?: string;
  runAndDrive?: boolean;
  // Enhanced data structure for enrichment
  vehicleDetails?: {
    make: string;
    model: string;
    year: string;
    mileage: string;
  };
  photos?: string[];
  auctionSalesHistory?: Array<{
    date: string;
    price: string;
    location: string;
    condition: string;
  }>;
  ownershipHistory?: Array<{
    owner: string;
    period: string;
    usage: string;
  }>;
  damageHistory?: Array<{
    type: string;
    severity: string;
    date: string;
    description: string;
  }>;
  serviceHistory?: Array<{
    date: string;
    type: string;
    mileage: string;
    provider: string;
  }>;
  titleHistory?: Array<{
    status: string;
    date: string;
    state: string;
  }>;
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
  lastUpdated?: string;
  sources: {
    statVin: StatVinData | null;
    facebook: FacebookListing[] | null;
    craigslist: CraigslistListing[] | null;
    ebay: EbayListing[] | null;
    carsdotcom: any | null;
    offerup: any | null;
  };
}
