
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Wrench, User, HelpCircle } from 'lucide-react';

interface ServiceHistorySectionProps {
  value: string;
  onChange: (value: string) => void;
}

const serviceOptions = [
  {
    id: 'dealer',
    title: 'Dealer Maintained',
    description: 'Professional service at authorized dealerships',
    icon: CheckCircle,
    valueImpact: '+5% to +10%',
    color: 'text-green-600 bg-green-50 border-green-200'
  },
  {
    id: 'independent',
    title: 'Independent Shop',
    description: 'Qualified mechanics at independent shops',
    icon: Wrench,
    valueImpact: '+2% to +5%',
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  {
    id: 'owner',
    title: 'Owner Maintained',
    description: 'Self-serviced by owner',
    icon: User,
    valueImpact: 'Neutral impact',
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200'
  },
  {
    id: 'unknown',
    title: 'Unknown History',
    description: 'No maintenance records available',
    icon: HelpCircle,
    valueImpact: '-5% to -10%',
    color: 'text-red-600 bg-red-50 border-red-200'
  }
];

export function ServiceHistorySection({ value, onChange }: ServiceHistorySectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Service History</CardTitle>
        <p className="text-sm text-muted-foreground">
          How has the vehicle been maintained?
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {serviceOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.id;
          
          return (
            <div
              key={option.id}
              onClick={() => onChange(option.id)}
              className={`
                relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md
                ${isSelected 
                  ? `${option.color} ring-2 ring-blue-500 ring-offset-2` 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
                }
              `}
            >
              <div className="flex items-start space-x-3">
                <Icon className={`h-5 w-5 mt-0.5 ${isSelected ? option.color.split(' ')[0] : 'text-gray-400'}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                      {option.title}
                    </h3>
                    <Badge variant={isSelected ? 'default' : 'secondary'} className="text-xs">
                      {option.valueImpact}
                    </Badge>
                  </div>
                  <p className={`text-sm mt-1 ${isSelected ? 'text-gray-700' : 'text-gray-500'}`}>
                    {option.description}
                  </p>
                </div>
                {isSelected && (
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
