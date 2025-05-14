
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, FileText } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type EntityStatus = 'success' | 'warning' | 'error' | 'info' | 'default';

export type EntityCardAction = {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
};

interface EntityCardProps {
  id: string;
  title: string;
  subtitle?: string | null;
  status?: {
    label: string;
    variant?: EntityStatus;
  };
  image?: string | null;
  imageAlt?: string;
  imagePlaceholder?: React.ReactNode;
  price?: number | string;
  secondaryInfo?: string | null;
  detailsPath?: string;
  actions?: EntityCardAction[];
  className?: string;
}

export const EntityCard: React.FC<EntityCardProps> = ({
  id,
  title,
  subtitle,
  status,
  image,
  imageAlt = "Item image",
  imagePlaceholder = <FileText className="h-12 w-12 text-muted-foreground" />,
  price,
  secondaryInfo,
  detailsPath,
  actions = [],
  className = "",
}) => {
  const navigate = useNavigate();

  // Get status badge styling
  const getStatusBadge = (status: EntityStatus = 'default', label: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500">{label}</Badge>;
      case 'warning':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">{label}</Badge>;
      case 'error':
        return <Badge variant="destructive">{label}</Badge>;
      case 'info':
        return <Badge variant="secondary">{label}</Badge>;
      default:
        return <Badge variant="outline">{label}</Badge>;
    }
  };

  return (
    <Card key={id} className={`overflow-hidden ${className}`}>
      {/* Entity Image */}
      <AspectRatio ratio={16 / 9}>
        {image ? (
          <img 
            src={image} 
            alt={imageAlt}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            {imagePlaceholder}
          </div>
        )}
      </AspectRatio>
      
      <CardContent className="p-4 pb-2">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          {status && getStatusBadge(status.variant, status.label)}
        </div>
        
        <div className="flex items-center justify-between mb-2">
          {price !== undefined && (
            <span className="text-lg font-bold text-primary">
              {typeof price === 'number' ? `$${price.toLocaleString()}` : price}
            </span>
          )}
          {secondaryInfo && (
            <span className="text-sm text-muted-foreground">
              {secondaryInfo}
            </span>
          )}
        </div>
        
        {subtitle && (
          <p className="text-sm text-muted-foreground mb-2">{subtitle}</p>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        {detailsPath && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(detailsPath)}
          >
            View Details
          </Button>
        )}
        <div className="flex gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'outline'}
              size="sm"
              onClick={action.onClick}
            >
              {action.icon && (
                <span className="mr-1">{action.icon}</span>
              )}
              {action.label}
            </Button>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default EntityCard;
