
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  isDisabled?: boolean;
  errors?: Record<string, string>;
}

const MakeAndModelSelector: React.FC<Props> = ({ makeId, setMakeId, modelId, setModelId, isDisabled, errors }) => {
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);

  // Fetch all makes
  useEffect(() => {
    const fetchMakes = async () => {
      const { data, error } = await supabase.from("makes").select("id, make_name");
      if (error) {
      } else {
        setMakes(data || []);
      }
    };
    fetchMakes();
  }, []);

  // Fetch models based on selected makeId
  useEffect(() => {
    const fetchModels = async () => {
      if (!makeId) {
        setModels([]);
        return;
      }
      
      const { data, error } = await supabase
        .from("models")
        .select("id, model_name")
        .eq("make_id", makeId);

      if (error) {
      } else {
        setModels(data || []);
      }
    };
    fetchModels();
  }, [makeId]);

  const handleMakeChange = (value: string) => {
    setMakeId(value);
    setModelId(''); // Reset model when make changes
  };

  return (
    <div className="grid gap-4">
      <div>
        <Label>Select Make</Label>
        <Select onValueChange={handleMakeChange} value={makeId || ""} disabled={isDisabled}>
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
        {errors?.make && <p className="text-sm text-red-500 mt-1">{errors.make}</p>}
      </div>

      <div>
        <Label>Select Model</Label>
        <Select onValueChange={(value) => setModelId(value)} value={modelId || ""} disabled={!models.length || isDisabled}>
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
        {errors?.model && <p className="text-sm text-red-500 mt-1">{errors.model}</p>}
      </div>
    </div>
  );
};

export { MakeAndModelSelector };
export default MakeAndModelSelector;
