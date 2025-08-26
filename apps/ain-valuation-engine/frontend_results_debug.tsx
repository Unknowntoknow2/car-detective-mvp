// frontend_results_debug.tsx
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { ValuationResultsDisplay } from "./src/components/result/ValuationResultsDisplay";
// If ValuationResultCard exists, import it as well
// import { ValuationResultCard } from "./src/components/result/ValuationResultCard";
import { ValuationResult } from "./src/types/ValuationTypes";

// Canonical debug valuation result from Step 3
const sampleResult: ValuationResult = {
  estimatedValue: 18493,
  confidence: 1,
  priceRange: { low: 16644, high: 20343 },
  explanation:
    "Vehicle age: 0 years; Mileage: 97,104 miles; Condition: excellent; Title status: Clean (clean title); Market adjustment applied",
  adjustments: [
    { factor: "Mileage", percentage: -32.4 },
    { factor: "Condition", percentage: 10 },
    { factor: "Title", percentage: 0 },
  ],
  marketFactors: [
    { factor: "Market", impact: 0.05, description: "5% market uplift" },
  ],
  vehicleData: {
    vin: "4T1K31AK5PU607399",
    mileage: 97104,
    zip: "95821",
    condition: "Very Good",
    titleStatus: "Clean",
    color: "White",
  },
};

function debugRender() {
  const displayHTML = ReactDOMServer.renderToString(
    <StaticRouter location="/results">
      <ValuationResultsDisplay valuation={sampleResult} />
    </StaticRouter>
  );
  // Uncomment if ValuationResultCard exists and is used in your UI
  // const cardHTML = ReactDOMServer.renderToString(
  //   <ValuationResultCard profile={sampleResult} />
  // );

  console.log("=== Frontend Results Debug ===");
  console.log("ValuationResultsDisplay Render:");
  console.log(displayHTML.slice(0, 500), "...");

  // console.log("ValuationResultCard Render:");
  // console.log(cardHTML.slice(0, 500), "...");

  // Guardrail checks
  if (
    displayHTML.includes("18493") ||
    displayHTML.includes("18,493")
    // || cardHTML.includes("18493") || cardHTML.includes("18,493")
  ) {
    console.log("✅ PASS: UI rendered estimatedValue correctly ($18,493)");
  } else {
    console.error("❌ FAIL: UI did NOT render estimatedValue (fallback to $0/N/A)");
    process.exit(1);
  }

  console.log("🎯 Frontend Results Debug completed successfully.");
}

debugRender();
