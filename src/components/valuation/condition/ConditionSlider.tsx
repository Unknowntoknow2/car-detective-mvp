
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

export interface ConditionSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  description?: string;
  id?: string;
  name?: string;
}

export function ConditionSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  description,
  id,
  name
}: ConditionSliderProps) {
  const handleChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      
      <Slider
        id={id}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={handleChange}
        className="py-2"
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
