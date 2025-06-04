<<<<<<< HEAD
import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
=======
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VehicleLookupSchema } from "@/utils/schemas";
import { apiInvoke } from "@/utils/api";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
<<<<<<< HEAD
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
=======
} from "@/components/ui/select";
import { useVehicleSelectors } from "@/hooks/useVehicleSelectors";
import type { z } from "zod";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface VehicleLookupProps {
  onLookup: (data: { make: string; model: string; year?: number }) => void;
}

<<<<<<< HEAD
export function VehicleLookup({ onLookup }: VehicleLookupProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const make = searchParams.get('make') || '';
    const model = searchParams.get('model') || '';
    const yearParam = searchParams.get('year');
    const year = yearParam ? parseInt(yearParam, 10) : undefined;

    if (make && model) {
      onLookup({ make, model, year });
      toast.success(`Looking up: ${year ? year + ' ' : ''}${make} ${model}`);
    } else {
      toast.error('Make and model are required.');
    }
  };

  const handleVinLookup = () => {
    const vin = searchParams.get('vin') || undefined;
    if (vin) {
      navigate(`/valuation/vin?vin=${vin}`);
    } else {
      toast.error('VIN is required.');
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
=======
export default function VehicleLookup(
  { dispatch }: { dispatch: React.Dispatch<any> },
) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(VehicleLookupSchema),
    mode: "onChange",
  });

  const mode = watch("mode");
  const { makes, models, selectedMakeId, setSelectedMakeId, isLoading } =
    useVehicleSelectors();

  const onSubmit = async (data: FormData) => {
    console.log("Form Data Submitted:", data);

    try {
      const apiResult = await apiInvoke({
        endpoint: "vehicleLookup",
        data,
      });

      if (apiResult.success) {
        dispatch({ type: "UPDATE_VEHICLE", payload: apiResult.data });
        dispatch({ type: "NEXT_STEP" });
      } else {
        // Handle API error (show error message, etc.)
        console.error("API Error:", apiResult.error);
      }
    } catch (e) {
      console.error("Form Submission Error:", e);
    }
  };

  const handleMakeChange = (makeId: string) => {
    setSelectedMakeId(makeId);
    const selectedMake = makes.find((m) => m.id === makeId);
    setValue("manual.make", selectedMake?.make_name || "", {
      shouldValidate: true,
    });
    setValue("manual.model", "", { shouldValidate: true }); // Reset model when make changes
  };

  const handleModelChange = (modelId: string) => {
    const selectedModel = models.find((m) => m.id === modelId);
    setValue("manual.model", selectedModel?.model_name || "", {
      shouldValidate: true,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <h2 className="text-xl font-semibold">Step 1: Vehicle Lookup</h2>

      <div className="flex flex-col sm:flex-row sm:space-x-2">
        <div className="flex-1">
          <Input
            {...register("lookupValue")}
            placeholder="Enter VIN or Plate"
            aria-invalid={!!errors.lookupValue}
            aria-describedby={errors.lookupValue
              ? "lookupValue-error"
              : undefined}
          />
          {errors.lookupValue && (
            <ErrorMessage message={errors.lookupValue.message} />
          )}
        </div>
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="mt-2 sm:mt-0"
        >
          {isSubmitting ? "Processing..." : "Find Vehicle"}
        </Button>
      </div>

      {mode === "manual" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Select
              value={selectedMakeId}
              onValueChange={handleMakeChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Make" />
              </SelectTrigger>
              <SelectContent>
                {makes.map((make) => (
                  <SelectItem key={make.id} value={make.id}>
                    {make.make_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.manual?.make && (
              <ErrorMessage message={errors.manual.make.message} />
            )}
          </div>

          <div>
            <Select
              disabled={!selectedMakeId || isLoading}
              onValueChange={handleModelChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.model_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.manual?.model && (
              <ErrorMessage message={errors.manual.model.message} />
            )}
          </div>

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
          <div>
            <Label htmlFor="make">Make</Label>
            <Input
<<<<<<< HEAD
              type="text"
              id="make"
              placeholder="e.g., Toyota"
              value={searchParams.get('make') || ''}
              onChange={(e) => navigate(`?make=${e.target.value}`)}
              required
            />
          </div>
          <div>
            <Label htmlFor="model">Model</Label>
            <Input
              type="text"
              id="model"
              placeholder="e.g., Camry"
              value={searchParams.get('model') || ''}
              onChange={(e) => navigate(`?make=${searchParams.get('make')}&model=${e.target.value}`)}
              required
            />
          </div>
          <div>
            <Label htmlFor="year">Year</Label>
            <Input
              type="number"
              id="year"
              placeholder="e.g., 2018"
              value={searchParams.get('year') ? parseInt(searchParams.get('year') || '0', 10) : undefined}
              onChange={(e) => navigate(`?make=${searchParams.get('make')}&model=${searchParams.get('model')}&year=${e.target.value}`)}
            />
          </div>
          <Button type="submit">Lookup Vehicle</Button>
        </form>

        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-2">Lookup by VIN</h3>
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              id="vin"
              placeholder="Enter VIN"
              value={searchParams.get('vin') || ''}
              onChange={(e) => navigate(`?vin=${e.target.value}`)}
            />
            <Button type="button" onClick={handleVinLookup}>
              Lookup VIN
            </Button>
=======
              {...register("manual.year", { valueAsNumber: true })}
              type="number"
              placeholder="Year"
              aria-invalid={!!errors.manual?.year}
              aria-describedby={errors.manual?.year ? "year-error" : undefined}
            />
            {errors.manual?.year && (
              <ErrorMessage message={errors.manual.year.message} />
            )}
          </div>

          <div>
            <Input {...register("manual.trim")} placeholder="Trim (optional)" />
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
