
import { useEffect, useState } from "react";
import { CheckIcon, ChevronDownIcon, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ColorOption {
  color: string;
  multiplier: number;
  category: string;
  description?: string;
}

interface ColorSwatchProps {
  value: string;
  onChange: (value: string, multiplier: number) => void;
  className?: string;
  disabled?: boolean;
}

export function ColorSwatch({ value, onChange, className, disabled = false }: ColorSwatchProps) {
  const [open, setOpen] = useState(false);
  const [colors, setColors] = useState<ColorOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch color options from database
  useEffect(() => {
    const fetchColors = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('color_adjustment')
          .select('*')
          .order('category', { ascending: false });

        if (error) {
          throw error;
        }

        setColors(data || []);
      } catch (error) {
        console.error('Error fetching colors:', error);
        toast.error('Failed to load color options');
      } finally {
        setLoading(false);
      }
    };

    fetchColors();
  }, []);

  // Get color object by name
  const getColorByName = (name: string): ColorOption | undefined => {
    return colors.find(c => c.color.toLowerCase() === name.toLowerCase());
  };

  // Find current selected color
  const selectedColor = getColorByName(value);

  // Group colors by category
  const colorsByCategory = colors.reduce<Record<string, ColorOption[]>>((acc, color) => {
    if (!acc[color.category]) {
      acc[color.category] = [];
    }
    acc[color.category].push(color);
    return acc;
  }, {});

  // Helper to get CSS background color
  const getColorStyle = (colorName: string) => {
    const colorMap: Record<string, string> = {
      'White': '#FFFFFF',
      'Black': '#000000',
      'Silver': '#C0C0C0',
      'Gray': '#808080',
      'Red': '#FF0000',
      'Blue': '#0000FF',
      'Green': '#008000',
      'Yellow': '#FFFF00',
      'Orange': '#FFA500',
      'Purple': '#800080',
      'Brown': '#A52A2A',
      'Pink': '#FFC0CB',
      'Gold': '#FFD700',
    };
    
    return colorMap[colorName] || '#CCCCCC';
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-between", className)}
        >
          <div className="flex items-center">
            {value ? (
              <>
                <div
                  className="h-4 w-4 rounded-full mr-2 border border-gray-200"
                  style={{ backgroundColor: getColorStyle(value) }}
                />
                <span>{value}</span>
                {selectedColor && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({selectedColor.multiplier > 1 ? '+' : ''}{((selectedColor.multiplier - 1) * 100).toFixed(0)}%)
                  </span>
                )}
              </>
            ) : (
              <div className="flex items-center text-muted-foreground">
                <Palette className="mr-2 h-4 w-4" />
                <span>Select color</span>
              </div>
            )}
          </div>
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <div className="max-h-[300px] overflow-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Loading colors...</div>
          ) : (
            <div className="p-1">
              {Object.entries(colorsByCategory).map(([category, categoryColors]) => (
                <div key={category} className="mb-2">
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    {category} {category === 'Rare' ? '(+10%)' : category === 'Common' ? '(-5%)' : ''}
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {categoryColors.map((color) => (
                      <button
                        key={color.color}
                        className={cn(
                          "flex items-center justify-between w-full rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
                          value === color.color && "bg-accent text-accent-foreground"
                        )}
                        onClick={() => {
                          onChange(color.color, color.multiplier);
                          setOpen(false);
                        }}
                      >
                        <div className="flex items-center">
                          <div
                            className="h-3 w-3 rounded-full mr-2 border border-gray-200"
                            style={{ backgroundColor: getColorStyle(color.color) }}
                          />
                          {color.color}
                        </div>
                        {value === color.color && <CheckIcon className="h-4 w-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
