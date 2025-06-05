
import {
  Building,
  Calendar,
  Camera,
  CarFront,
  ChartBar,
  FileText,
  Search,
  Shield,
} from "lucide-react";

export type ValuationServiceId =
  | "vin"
  | "plate"
  | "manual"
  | "photo"
  | "dealers"
  | "market"
  | "forecast"
  | "carfax";

export interface ValuationService {
  id: ValuationServiceId;
  title: string;
  icon: typeof CarFront;
  description: string;
}

export const valuationServices: ValuationService[] = [
  {
    id: "vin",
    title: "VIN Lookup",
    icon: CarFront,
    description:
      "Enter your Vehicle Identification Number (VIN) for the most accurate identification.",
  },
  {
    id: "plate",
    title: "Plate Lookup",
    icon: Search,
    description:
      "Use your license plate number for quick vehicle identification.",
  },
  {
    id: "manual",
    title: "Manual Entry",
    icon: FileText,
    description: "Enter your vehicle details manually.",
  },
  {
    id: "photo",
    title: "Photo Analysis",
    icon: Camera,
    description:
      "Upload a photo of your vehicle for AI-powered identification.",
  },
  {
    id: "dealers",
    title: "Dealer Offers",
    icon: Building,
    description: "Get purchase offers from local dealerships.",
  },
  {
    id: "market",
    title: "Market Analysis",
    icon: ChartBar,
    description: "Compare your vehicle to similar listings.",
  },
  {
    id: "forecast",
    title: "12-Month Forecast",
    icon: Calendar,
    description: "Predict your vehicle's future value.",
  },
  {
    id: "carfax",
    title: "CARFAX Report",
    icon: Shield,
    description: "View detailed vehicle history.",
  },
];
