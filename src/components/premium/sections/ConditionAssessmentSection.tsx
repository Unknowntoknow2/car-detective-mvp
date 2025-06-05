// src/components/premium/sections/ConditionAssessmentSection.tsx
import React from "react";

export function ConditionAssessmentSection() {
  return (
    <section className="py-10 px-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Condition Assessment</h2>
      <p className="mb-4">
        Our platform provides a detailed, transparent assessment of your vehicle’s condition—factoring in everything from mechanical health to cosmetic details, just like a real dealer inspection.
      </p>
      <ul className="list-disc pl-6 space-y-1 text-gray-700">
        <li>Mechanical condition (engine, transmission, etc.)</li>
        <li>Exterior & interior wear and tear</li>
        <li>Service & accident history</li>
        <li>Ownership and maintenance records</li>
      </ul>
    </section>
  );
}
