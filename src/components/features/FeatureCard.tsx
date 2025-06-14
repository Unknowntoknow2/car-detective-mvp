
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { EnhancedFeature } from '@/data/enhanced-features-database';

interface FeatureCardProps {
  feature: EnhancedFeature;
  isSelected: boolean;
  onToggle: (name: string) => void;
  valueImpact: number;
  category: string;
}

const getCategoryColors = (category: string) => {
  const colorSchemes: Record<string, { bg: string; border: string; text: string }> = {
    'Technology': {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800'
    },
    'Safety & Security': {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800'
    },
    'Climate Control': {
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
      text: 'text-cyan-800'
    },
    'Audio & Entertainment': {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-800'
    },
    'Interior Materials': {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800'
    },
    'Exterior Features': {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      text: 'text-indigo-800'
    },
    'Performance Packages': {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800'
    },
    'Driver Assistance': {
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      text: 'text-teal-800'
    },
    'Luxury Materials': {
      bg: 'bg-violet-50',
      border: 'border-violet-200',
      text: 'text-violet-800'
    },
    'Service & Maintenance': {
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      text: 'text-slate-800'
    },
    'Tires & Brakes': {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-800'
    },
    'Vehicle Basics': {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-800'
    }
  };

  return colorSchemes[category] || colorSchemes['Technology'];
};

export const FeatureCard: React.FC<FeatureCardProps> = ({
  feature,
  isSelected,
  onToggle,
  valueImpact,
  category,
}) => {
  const handleClick = () => {
    onToggle(feature.name);
  };

  const colors = getCategoryColors(category);

  return (
    <div
      onClick={handleClick}
      className={`
        relative p-3 rounded-lg border cursor-pointer transition-all duration-200
        ${colors.bg} ${colors.border}
        hover:shadow-sm hover:scale-[1.01]
        ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50 shadow-sm' : ''}
      `}
    >
      {/* Checkbox */}
      <div className="absolute top-2 right-2">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggle(feature.name)}
          className="pointer-events-none h-4 w-4"
        />
      </div>

      {/* Feature Name */}
      <div className="pr-6 mb-2">
        <h4 className={`font-medium text-sm ${colors.text} leading-tight`}>
          {feature.name}
        </h4>
      </div>

      {/* Value Display */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-medium ${colors.text} opacity-70`}>
            {feature.impact}
          </span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
            {feature.rarity}
          </span>
        </div>
        
        <div className="text-right">
          <span className="text-green-700 font-semibold text-sm">
            +${valueImpact.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
