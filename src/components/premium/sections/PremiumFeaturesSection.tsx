// src/components/premium/sections/PremiumFeaturesSection.tsx

import React from "react";
import { CheckCircle } from "lucide-react";

const features = [
  "Dealer Market Offers & Counteroffers",
  "Auction Price History (Manheim, Copart, IAAI)",
  "Open Marketplace Comparison (CarMax, Cars.com, Craigslist, FB)",
  "PDF Report Download + QR Code",
  "AI-Powered VIN/Photo/Service Analysis",
  "Advanced Feature/Condition Scoring",
  "Priority Dealer Support",
];

export const PremiumFeaturesSection: React.FC = () => {
  return (
    <section className="w-full max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Premium Features
      </h2>
      <ul className="space-y-4">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-3 bg-muted rounded-lg px-4 py-3 shadow-sm"
          >
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <span className="text-base font-medium">{feature}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PremiumFeaturesSection;
