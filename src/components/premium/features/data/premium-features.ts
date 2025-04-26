import { FileText, Camera, DollarSign, ChartBar } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface PremiumFeature {
  id: string;
  title: string;
  icon: LucideIcon;
  value: string;
  color: string;
  description: string;
  benefits: string[];
}

export const premiumFeatures: PremiumFeature[] = [
  {
    id: "carfax",
    title: "Full CARFAX® Report",
    icon: FileText,
    value: "$44 Value",
    color: "blue",
    description: "Complete vehicle history with accident records, service history, and title verification",
    benefits: [
      "Uncover accident history and severity",
      "View complete service records",
      "Verify title status and ownership history",
      "Check reported mileage accuracy",
      "Identify fleet/commercial use"
    ]
  },
  {
    id: "photo",
    title: "AI Photo Analysis",
    icon: Camera,
    value: "+15% Accuracy",
    color: "green",
    description: "Upload up to 5 photos for AI to analyze condition, damage, and wear patterns",
    benefits: [
      "Detect visible damage and wear",
      "Assess paint condition and body panels",
      "Identify interior wear patterns",
      "Compare to similar vehicles",
      "Generate condition score"
    ]
  },
  {
    id: "dealer",
    title: "Dealer-Beat Offers",
    icon: DollarSign,
    value: "Increased Offers",
    color: "orange",
    description: "Compare offers from CarMax, Carvana, and local dealers who compete for your business",
    benefits: [
      "Get multiple dealer offers instantly",
      "Compare against major buyers",
      "Leverage competing offers",
      "Access dealer-only pricing",
      "Skip dealership visits"
    ]
  },
  {
    id: "market",
    title: "Open Marketplace Data",
    icon: ChartBar,
    value: "Real-time Data",
    color: "purple",
    description: "See average prices on Facebook, Craigslist, and other platforms in your area",
    benefits: [
      "Track private party listings",
      "Monitor price trends",
      "Compare across platforms",
      "Identify best marketplaces",
      "Get real-time updates"
    ]
  },
  {
    id: "forecast",
    title: "12-Month Forecast",
    icon: ChartBar,
    value: "Strategic Timing",
    color: "indigo",
    description: "Predictive analysis of your vehicle's value over the next year with optimal selling time",
    benefits: [
      "Predict value changes",
      "Identify best selling time",
      "Account for seasonal trends",
      "Plan ahead for sales",
      "Maximize return"
    ]
  },
  {
    id: "calculator",
    title: "Feature Value Calculator",
    icon: DollarSign,
    value: "+20% Granularity",
    color: "rose",
    description: "See exactly how much each option and feature adds to your vehicle's worth",
    benefits: [
      "Calculate feature premiums",
      "Compare trim levels",
      "Assess upgrade value",
      "Optimize modifications",
      "Understand market preferences"
    ]
  },
  {
    id: "zip",
    title: "ZIP Market Analysis",
    icon: ChartBar,
    value: "Localized Accuracy",
    color: "cyan",
    description: "Location-adjusted valuation based on supply and demand in your specific region",
    benefits: [
      "Get location-specific pricing",
      "See local market demand",
      "Compare regional differences",
      "Track inventory levels",
      "Access demographic data"
    ]
  },
  {
    id: "report",
    title: "Professional PDF Report",
    icon: FileText,
    value: "Shareable Report",
    color: "amber",
    description: "Comprehensive, shareable report with all insights and data in a professional format",
    benefits: [
      "Generate professional reports",
      "Include all analytics",
      "Share with potential buyers",
      "Export data easily",
      "Access historical reports"
    ]
  }
];

export const featureCategories = [
  { value: "all", label: "All Features" },
  { value: "history", label: "Vehicle History" },
  { value: "valuation", label: "Valuation Tools" },
  { value: "market", label: "Market Analysis" }
];

export const getCategoryFeatures = (category: string): PremiumFeature[] => {
  switch (category) {
    case "history":
      return premiumFeatures.filter(f => ["carfax", "photo"].includes(f.id));
    case "valuation":
      return premiumFeatures.filter(f => ["calculator", "forecast"].includes(f.id));
    case "market":
      return premiumFeatures.filter(f => ["market", "dealer", "zip"].includes(f.id));
    default:
      return premiumFeatures;
  }
};
