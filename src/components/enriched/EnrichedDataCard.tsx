
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, MapPin, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
// import { format } from 'date-fns'; // Disabled for MVP

interface EnrichedDataCardProps {
  data: {
    id: string;
    title: string;
    price?: number;
    location?: string;
    date?: string;
    source: string;
    url?: string;
    images?: string[];
    metadata?: Record<string, any>;
  };
  className?: string;
}

export function EnrichedDataCard({ data, className = '' }: EnrichedDataCardProps) {
  const formatDate = (dateString: string) => {
    // Simple date formatting for MVP
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {data.title}
          </CardTitle>
          <Badge variant="secondary" className="ml-2 flex-shrink-0">
            {data.source}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {data.price && (
          <div className="flex items-center text-lg font-bold text-primary">
            <DollarSign className="h-4 w-4 mr-1" />
            {formatCurrency(data.price)}
          </div>
        )}
        
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {data.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {data.location}
            </div>
          )}
          
          {data.date && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(data.date)}
            </div>
          )}
        </div>
        
        {data.url && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => window.open(data.url, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Listing
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default EnrichedDataCard;
