import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FollowUpForm from "@/components/followup/FollowUpForm";

const ValuationFollowUpPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const vin = searchParams.get("vin");

  const handleSubmit = async (followUpData: any) => {
    if (!vin) {
      alert("VIN is missing from URL.");
      return;
    }

    const storedData = localStorage.getItem(`vin_lookup_${vin}`);
    if (!storedData) {
      alert("Cached VIN data not found.");
      return;
    }

    const baseData = JSON.parse(storedData);
    const { make, model, year, trim, engine, drivetrain, fuelType, zipCode } = baseData;
    const payload = {
      vin,
      make,
      model,
      year,
      trim,
      engine,
      drivetrain,
      fuelType,
      zipCode,
      ...followUpData,
    };

    try {
      const response = await fetch("https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/submit-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result?.id) {
        console.error("Submit error:", result?.error || "Unknown");
        alert("Failed to submit valuation. Please try again.");
        return;
      }

      navigate(`/valuation/result/${result.id}`);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Network error. Try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <FollowUpForm
        onSubmit={handleSubmit}
        apiData={{
          make: "",
          model: "",
          year: new Date().getFullYear(),
          zipCode: "",
        }}
      />
    </div>
  );
};

export default ValuationFollowUpPage;
