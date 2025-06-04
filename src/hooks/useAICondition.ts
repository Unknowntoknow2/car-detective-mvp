<<<<<<< HEAD

import { useState, useEffect } from 'react';
import { AICondition } from '@/types/photo';
=======
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AICondition } from "@/types/photo";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export function useAICondition(
  vin?: string,
  photoUrl?: string,
  valuationId?: string
) {
  const [conditionData, setConditionData] = useState<AICondition | null>(null);
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConditionData = async () => {
      if (!vin && !photoUrl && !valuationId) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // In a real application, you'd call an API here
        // For now, we'll simulate a delay and return mock data
        await new Promise(resolve => setTimeout(resolve, 1000));

        const conditions = ['Excellent', 'Good', 'Fair', 'Poor'] as const;
        const randomIndex = Math.floor(Math.random() * conditions.length);
        const selectedCondition = conditions[randomIndex];

        // Generate appropriate issues based on condition
        let issues: string[] = [];
        let confidenceScore = 0;

        switch (selectedCondition) {
          case 'Excellent':
            issues = [];
            confidenceScore = 90 + Math.floor(Math.random() * 10); // 90-99
            break;
          case 'Good':
            issues = ['Minor scratches on driver door', 'Light wear on driver seat'];
            confidenceScore = 75 + Math.floor(Math.random() * 15); // 75-89
            break;
          case 'Fair':
            issues = ['Visible scratches on multiple panels', 'Moderate interior wear', 'Light rust spots'];
            confidenceScore = 60 + Math.floor(Math.random() * 15); // 60-74
            break;
          case 'Poor':
            issues = ['Significant paint damage', 'Heavy interior wear', 'Visible rust'];
            confidenceScore = 40 + Math.floor(Math.random() * 20); // 40-59
            break;
        }

        setConditionData({
          condition: selectedCondition,
          confidenceScore,
          issuesDetected: issues,
          summary: `Vehicle appears to be in ${selectedCondition.toLowerCase()} condition overall.`
        });
      } catch (err) {
        console.error('Error fetching AI condition data:', err);
        setError('Failed to analyze vehicle condition');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConditionData();
  }, [vin, photoUrl, valuationId]);
=======
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchConditionData() {
      if (!valuationId) return;

      setIsLoading(true);
      setError("");

      try {
        // Instead of querying photo_condition directly, use a function or query a table that exists
        // For now, we'll simulate the data as a workaround
        // In a real app, this would be fetched from an actual table/API

        // Simulated data based on valuation ID
        const simulatedData = {
          condition: "Good" as "Excellent" | "Good" | "Fair" | "Poor",
          confidenceScore: 75,
          aiSummary:
            "Vehicle appears to be in good condition with minor wear and tear.",
          issuesDetected: [
            "Minor scratches on passenger door",
            "Light wear on driver's seat",
          ],
          photoUrl: "https://example.com/photos/sample.jpg",
          bestPhotoUrl: "https://example.com/photos/best.jpg",
        };

        setConditionData(simulatedData);
      } catch (err: any) {
        console.error("Error fetching AI condition data:", err);
        setError(err.message || "Failed to fetch condition data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchConditionData();
  }, [valuationId]);
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

  return { conditionData, isLoading, error };
}
