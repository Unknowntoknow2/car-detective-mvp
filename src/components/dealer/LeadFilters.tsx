
import React from 'react';
import { CDButton } from '@/components/ui-kit/CDButton';
import { CDCard } from '@/components/ui-kit/CDCard';
import { Filter } from 'lucide-react';

interface LeadFiltersProps {
  onFilterChange: (filters: {
    zipRadius: number;
    priceRange: [number, number];
    make?: string;
    model?: string;
    condition?: string;
  }) => void;
}

export function LeadFilters({ onFilterChange }: LeadFiltersProps) {
  const [zipRadius, setZipRadius] = React.useState(25);
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 50000]);
  const [make, setMake] = React.useState<string>();
  const [model, setModel] = React.useState<string>();
  const [condition, setCondition] = React.useState<string>();

  const handleFilterApply = () => {
    onFilterChange({
      zipRadius,
      priceRange,
      make,
      model,
      condition,
    });
  };

  const radiusOptions = [10, 25, 50, 100];

  return (
    <CDCard className="mb-6">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} />
          <h2 className="text-lg font-semibold">Filter Leads</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">ZIP Radius (miles)</label>
            <div className="flex gap-2">
              {radiusOptions.map(option => (
                <button
                  key={option}
                  className={`px-3 py-1 text-sm rounded-md ${
                    zipRadius === option
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => setZipRadius(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Price Range</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="w-24 px-2 py-1 border rounded"
                value={priceRange[0]}
                onChange={e => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                min={0}
              />
              <span>to</span>
              <input
                type="number"
                className="w-24 px-2 py-1 border rounded"
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                min={0}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Condition</label>
            <select
              className="w-full px-2 py-1 border rounded"
              value={condition || ''}
              onChange={e => setCondition(e.target.value || undefined)}
            >
              <option value="">Any</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end">
          <CDButton
            variant="primary"
            onClick={handleFilterApply}
          >
            Apply Filters
          </CDButton>
        </div>
      </div>
    </CDCard>
  );
}
