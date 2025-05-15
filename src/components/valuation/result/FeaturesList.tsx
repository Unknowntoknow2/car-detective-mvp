import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

interface FeaturesListProps {
  features?: string[];
  title?: string;
  emptyMessage?: string;
  showIcons?: boolean;
}

const FeaturesList: React.FC<FeaturesListProps> = ({
  features = [],
  title = 'Vehicle Features',
  emptyMessage = 'No features specified',
  showIcons = true
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {features && features.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {features.map((feature, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="flex items-center gap-1 px-2 py-1 bg-primary/5"
              >
                {showIcons && <Check className="h-3 w-3 text-primary" />}
                <span>{feature}</span>
              </Badge>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-20 text-muted-foreground">
            {showIcons && <X className="h-4 w-4 mr-2 opacity-70" />}
            <span>{emptyMessage}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeaturesList;
