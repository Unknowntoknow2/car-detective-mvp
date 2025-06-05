// src/components/premium/sections/VINLookupTabs.tsx
import React from "react";

export function VINLookupTabs() {
  return (
    <section className="py-10 px-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">VIN Lookup Options</h2>
      <div className="flex gap-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded shadow">
          VIN Entry
        </button>
        <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded border border-blue-200">
          License Plate Lookup
        </button>
        <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded border border-blue-200">
          Manual Entry
        </button>
      </div>
      <p className="mt-3 text-gray-600">
        Use any method above for the most accurate premium vehicle report.
      </p>
    </section>
  );
}
