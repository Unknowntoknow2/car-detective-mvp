// src/components/premium/sections/FreeVsPremiumComparison.tsx
import React from "react";

export function FreeVsPremiumComparison() {
  return (
    <section className="py-10 px-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Free vs. Premium Comparison</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">Feature</th>
            <th className="py-2 px-4 border">Free</th>
            <th className="py-2 px-4 border">Premium</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 px-4 border">Base Valuation</td>
            <td className="py-2 px-4 border text-center">✔️</td>
            <td className="py-2 px-4 border text-center">✔️</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border">AI-Powered Price</td>
            <td className="py-2 px-4 border text-center">—</td>
            <td className="py-2 px-4 border text-center">✔️</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border">PDF Report</td>
            <td className="py-2 px-4 border text-center">—</td>
            <td className="py-2 px-4 border text-center">✔️</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border">Auction History</td>
            <td className="py-2 px-4 border text-center">—</td>
            <td className="py-2 px-4 border text-center">✔️</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border">Market Comparison</td>
            <td className="py-2 px-4 border text-center">—</td>
            <td className="py-2 px-4 border text-center">✔️</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
