
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings, Zap, Car, Volume2 } from 'lucide-react';
import { FollowUpAnswers, ModificationDetails } from '@/types/follow-up-answers';

interface ModificationsTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const MODIFICATION_TYPES = [
  {
    category: 'Performance',
    icon: Zap,
    color: 'red',
    items: [
      { id: 'cold_air_intake', label: 'Cold Air Intake', impact: '+$200-500', description: 'Improves airflow to engine' },
      { id: 'exhaust_system', label: 'Performance Exhaust', impact: '+$300-800', description: 'Cat-back or turbo-back exhaust' },
      { id: 'turbo_supercharger', label: 'Turbo/Supercharger', impact: '+$1000-3000', description: 'Forced induction modification' },
      { id: 'engine_tune', label: 'ECU Tune/Chip', impact: '+$200-600', description: 'Software engine optimization' }
    ]
  },
  {
    category: 'Suspension & Handling',
    icon: Car,
    color: 'blue',
    items: [
      { id: 'lowering_springs', label: 'Lowering Springs', impact: '+$100-400', description: 'Reduces ride height' },
      { id: 'coilovers', label: 'Coilover Suspension', impact: '+$500-2000', description: 'Adjustable height and damping' },
      { id: 'sway_bars', label: 'Performance Sway Bars', impact: '+$200-500', description: 'Reduces body roll in corners' },
      { id: 'strut_tower_brace', label: 'Strut Tower Brace', impact: '+$100-300', description: 'Chassis reinforcement' }
    ]
  },
  {
    category: 'Wheels & Tires',
    icon: Settings,
    color: 'green',
    items: [
      { id: 'aftermarket_wheels', label: 'Aftermarket Wheels', impact: '+$300-2000', description: 'Non-OEM wheel upgrade' },
      { id: 'performance_tires', label: 'Performance Tires', impact: '+$200-800', description: 'High-performance tire compound' },
      { id: 'wheel_spacers', label: 'Wheel Spacers', impact: '+$50-200', description: 'Increases track width' }
    ]
  },
  {
    category: 'Audio & Electronics',
    icon: Volume2,
    color: 'purple',
    items: [
      { id: 'aftermarket_stereo', label: 'Aftermarket Stereo', impact: '+$200-1000', description: 'Non-OEM head unit' },
      { id: 'premium_speakers', label: 'Premium Speakers', impact: '+$300-1500', description: 'Upgraded speaker system' },
      { id: 'amplifier', label: 'Audio Amplifier', impact: '+$200-800', description: 'External audio amplification' },
      { id: 'subwoofer', label: 'Subwoofer System', impact: '+$300-1200', description: 'Bass enhancement system' }
    ]
  }
];

export function ModificationsTab({ formData, updateFormData }: ModificationsTabProps) {
  const modifications = formData.modifications || {
    hasModifications: false,
    modified: false,
    types: []
  };

  const handleModificationToggle = (checked: boolean) => {
    updateFormData({
      modifications: {
        ...modifications,
        hasModifications: checked,
        modified: checked,
        types: checked ? modifications.types : []
      }
    });
  };

  const handleTypeToggle = (typeId: string, checked: boolean) => {
    const currentTypes = modifications.types || [];
    const updatedTypes = checked
      ? [...currentTypes, typeId]
      : currentTypes.filter(t => t !== typeId);

    updateFormData({
      modifications: {
        ...modifications,
        types: updatedTypes
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Main Toggle */}
      <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="h-4 w-4 text-gray-600" />
          <h3 className="font-medium text-sm">Vehicle Modifications</h3>
        </div>
        
        <div
          className={`p-2 rounded-md border cursor-pointer transition-all ${
            modifications.hasModifications
              ? 'bg-blue-100 border-blue-300'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => handleModificationToggle(!modifications.hasModifications)}
        >
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={modifications.hasModifications}
              onCheckedChange={handleModificationToggle}
              className="pointer-events-none"
            />
            <div>
              <div className="font-medium text-xs">Has Modifications</div>
              <div className="text-xs text-gray-600 mt-1">
                Vehicle has aftermarket parts or modifications
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modification Categories */}
      {modifications.hasModifications && (
        <div className="space-y-4">
          {MODIFICATION_TYPES.map((category) => (
            <div key={category.category} className={`p-3 rounded-lg border bg-${category.color}-50 border-${category.color}-200`}>
              <div className="flex items-center gap-2 mb-3">
                <category.icon className={`h-4 w-4 text-${category.color}-600`} />
                <h3 className="font-medium text-sm">{category.category}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {category.items.map((item) => {
                  const isSelected = modifications.types?.includes(item.id) || false;
                  
                  return (
                    <div
                      key={item.id}
                      className={`p-2 rounded-md border cursor-pointer transition-all ${
                        isSelected
                          ? `bg-${category.color}-100 border-${category.color}-300`
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleTypeToggle(item.id, !isSelected)}
                    >
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleTypeToggle(item.id, !!checked)}
                          className="pointer-events-none mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-xs">{item.label}</div>
                          <div className="text-xs text-gray-600 mt-1">{item.description}</div>
                          <div className={`text-xs mt-1 px-1 py-0.5 rounded text-${category.color}-700 bg-${category.color}-100`}>
                            {item.impact}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {modifications.types && modifications.types.length > 0 && (
            <div className="p-3 bg-blue-100 rounded-md border border-blue-300">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Quality modifications can increase value, while poor installations may decrease it.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
