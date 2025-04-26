
import { CarFront, Search, FileText, Camera, Building, ChartBar, Calendar, Shield } from "lucide-react";

export const valuationServices = [
  { id: "vin", title: "VIN Lookup", icon: CarFront },
  { id: "plate", title: "Plate Lookup", icon: Search },
  { id: "manual", title: "Manual Entry", icon: FileText },
  { id: "photo", title: "Photo Analysis", icon: Camera },
  { id: "dealers", title: "Dealer Offers", icon: Building },
  { id: "market", title: "Market Analysis", icon: ChartBar },
  { id: "forecast", title: "12-Month Forecast", icon: Calendar },
  { id: "carfax", title: "CARFAX Report", icon: Shield }
] as const;

export type ValuationServiceId = typeof valuationServices[number]['id'];
