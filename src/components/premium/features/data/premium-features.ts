
interface PremiumFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  categories: string[];
}

const features: PremiumFeature[] = [
  {
    id: "carfax",
    title: "CARFAX® History Report",
    description: "Full vehicle history including accidents, service records, and ownership history",
    icon: "📋",
    categories: ["history", "report"],
  },
  {
    id: "dealer_offers",
    title: "Dealer Offers",
    description: "See what dealers in your area would pay for your vehicle based on real market data",
    icon: "💵",
    categories: ["market"],
  },
  {
    id: "forecast",
    title: "12-Month Forecast",
    description: "Price projections for the next 12 months to help you decide the best time to sell",
    icon: "📈",
    categories: ["market"],
  },
  {
    id: "confidence_score",
    title: "Confidence Score",
    description: "Detailed confidence analysis showing how certain we are about your valuation",
    icon: "📊",
    categories: ["verification"],
  },
  {
    id: "pdf_report",
    title: "Professional PDF Report",
    description: "Downloadable, shareable PDF report with all valuation details and insights",
    icon: "📄",
    categories: ["report"],
  },
  {
    id: "market_analysis",
    title: "Market Analysis",
    description: "In-depth analysis of similar vehicles in your market with price comparisons",
    icon: "🔍",
    categories: ["market"],
  },
  {
    id: "condition_verification",
    title: "Condition Verification",
    description: "AI-powered verification of vehicle condition from your photos to ensure accuracy",
    icon: "✅",
    categories: ["verification"],
  },
  {
    id: "maintenance_predictor",
    title: "Maintenance Predictor",
    description: "Forecasted maintenance costs based on vehicle history and typical wear patterns",
    icon: "🔧",
    categories: ["history"],
  },
  {
    id: "title_verification",
    title: "Title Verification",
    description: "Verification of clean title and branded title history check",
    icon: "🛡️",
    categories: ["verification", "history"],
  },
];

export function getCategoryFeatures(category: string): PremiumFeature[] {
  if (category === "all") {
    return features;
  }
  return features.filter((feature) => feature.categories.includes(category));
}
