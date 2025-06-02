
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { EnhancedFeature } from '@/data/enhanced-features-database';

interface FeatureCardProps {
  feature: EnhancedFeature;
  isSelected: boolean;
  onToggle: (name: string) => void;
  valueImpact: number;
  category: string;
}

const getCategoryColors = (category: string) => {
  const colorSchemes = {
    'Technology': {
      default: 'border-blue-200 bg-blue-50/30 hover:bg-blue-50',
      selected: 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-500',
      accent: 'text-blue-700'
    },
    'Safety & Security': {
      default: 'border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50',
      selected: 'bg-gradient-to-br from-emerald-100 to-emerald-200 border-emerald-500',
      accent: 'text-emerald-700'
    },
    'Climate Control': {
      default: 'border-cyan-200 bg-cyan-50/30 hover:bg-cyan-50',
      selected: 'bg-gradient-to-br from-cyan-100 to-cyan-200 border-cyan-500',
      accent: 'text-cyan-700'
    },
    'Audio & Entertainment': {
      default: 'border-purple-200 bg-purple-50/30 hover:bg-purple-50',
      selected: 'bg-gradient-to-br from-purple-100 to-purple-200 border-purple-500',
      accent: 'text-purple-700'
    },
    'Interior Materials': {
      default: 'border-amber-200 bg-amber-50/30 hover:bg-amber-50',
      selected: 'bg-gradient-to-br from-amber-100 to-amber-200 border-amber-500',
      accent: 'text-amber-700'
    },
    'Exterior Features': {
      default: 'border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50',
      selected: 'bg-gradient-to-br from-indigo-100 to-indigo-200 border-indigo-500',
      accent: 'text-indigo-700'
    },
    'Performance Packages': {
      default: 'border-red-200 bg-red-50/30 hover:bg-red-50',
      selected: 'bg-gradient-to-br from-red-100 to-red-200 border-red-500',
      accent: 'text-red-700'
    },
    'Driver Assistance': {
      default: 'border-teal-200 bg-teal-50/30 hover:bg-teal-50',
      selected: 'bg-gradient-to-br from-teal-100 to-teal-200 border-teal-500',
      accent: 'text-teal-700'
    },
    'Luxury Materials': {
      default: 'border-violet-200 bg-violet-50/30 hover:bg-violet-50',
      selected: 'bg-gradient-to-br from-violet-100 to-violet-200 border-violet-500',
      accent: 'text-violet-700'
    },
    'Service & Maintenance': {
      default: 'border-slate-200 bg-slate-50/30 hover:bg-slate-50',
      selected: 'bg-gradient-to-br from-slate-100 to-slate-200 border-slate-500',
      accent: 'text-slate-700'
    },
    'Tires & Brakes': {
      default: 'border-orange-200 bg-orange-50/30 hover:bg-orange-50',
      selected: 'bg-gradient-to-br from-orange-100 to-orange-200 border-orange-500',
      accent: 'text-orange-700'
    },
    'Vehicle Basics': {
      default: 'border-gray-200 bg-gray-50/30 hover:bg-gray-50',
      selected: 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-500',
      accent: 'text-gray-700'
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
      className={`p-4 rounded-xl border shadow-sm cursor-pointer transition-all duration-200 ${
        isSelected ? colors.selected : colors.default
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold text-gray-900 leading-tight">{feature.name}</h4>
        {isSelected && (
          <span className={`text-sm font-bold ${colors.accent}`}>
            +${valueImpact.toLocaleString()}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          <Badge 
            variant="outline" 
            className="text-xs border-current"
            title={`Impact: ${feature.impact}. Affects price by importance.`}
          >
            {feature.impact}
          </Badge>
          <Badge 
            variant="secondary" 
            className="text-xs"
            title={`Rarity: ${feature.rarity}. More rare = more value.`}
          >
            {feature.rarity}
          </Badge>
        </div>
        
        {!isSelected && valueImpact > 0 && (
          <Badge className={`text-xs font-medium border ${colors.accent.replace('text-', 'bg-').replace('-700', '-50')} ${colors.accent} border-current`}>
            +${valueImpact.toLocaleString()}
          </Badge>
        )}
      </div>
    </div>
  );
};
