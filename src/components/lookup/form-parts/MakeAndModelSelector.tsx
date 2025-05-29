
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Make {
  id: string;
  make_name: string;
}

interface Model {
  id: string;
  model_name: string;
}

interface Props {
  makeId: string | null;
  setMakeId: (id: string) => void;
  modelId: string | null;
  setModelId: (id: string) => void;
}

const MakeAndModelSelector: React.FC<Props> = ({ makeId, setMakeId, modelId, setModelId }) => {
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);

  // ✅ Fetch all makes
  useEffect(() => {
    const fetchMakes = async () => {
      const { data, error } = await supabase.from("makes").select("id, make_name");
      if (error) {
        console.error("Error loading makes:", error.message);
      } else {
        setMakes(data || []);
      }
    };
    fetchMakes();
  }, []);

  // ✅ Fetch models based on selected makeId
  useEffect(() => {
    const fetchModels = async () => {
      if (!makeId) {
        setModels([]);
        return;
      }
      
      console.log('🔍 Fetching models for makeId:', makeId);
      console.log('🔍 makeId type:', typeof makeId);
      console.log('🔍 makeId length:', makeId.length);
      
      const { data, error } = await supabase
        .from("models")
        .select("id, model_name")
        .eq("make_id", makeId);

      if (error) {
        console.error("Error loading models:", error.message);
      } else {
        console.log('✅ Models loaded:', data?.length || 0);
        setModels(data || []);
      }
    };
    fetchModels();
  }, [makeId]);

  const handleMakeChange = (value: string) => {
    console.log('🎯 Make changed to UUID:', value);
    setMakeId(value);
    setModelId(''); // Reset model when make changes
  };

  return (
    <div className="grid gap-4">
      <div>
        <Label>Select Make</Label>
        <Select onValueChange={handleMakeChange} value={makeId || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Select a make" />
          </SelectTrigger>
          <SelectContent>
            {makes.map((make) => (
              <SelectItem key={make.id} value={make.id}>
                {make.make_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Select Model</Label>
        <Select onValueChange={(value) => setModelId(value)} value={modelId || ""} disabled={!models.length}>
          <SelectTrigger>
            <SelectValue placeholder={models.length ? "Select a model" : "Select make first"} />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.model_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MakeAndModelSelector;
