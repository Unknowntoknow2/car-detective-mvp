
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useState } from "react";

export const useSaveValuation = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const saveValuation = async (valuationData: {
    vin?: string | null;
    plate?: string | null;
    state?: string | null;
    make?: string | null;
    model?: string | null;
    year?: number | null;
    valuation: number | null;
    confidenceScore?: number | null;
    conditionScore?: number | null;
    is_vin_lookup?: boolean;
  }) => {
    if (!user) {
      toast.error("Please log in to save valuations");
      return false;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from('saved_valuations').insert({
        user_id: user.id,
        ...valuationData
      });

      if (error) throw error;

      toast.success("Valuation saved successfully!");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to save valuation");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveValuation, isSaving };
};
