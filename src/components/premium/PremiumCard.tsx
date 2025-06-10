
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Zap } from "lucide-react";

interface PremiumCardProps {
  title: string;
  description: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  onSelect: () => void;
}

export const PremiumCard = ({
  title,
  description,
  price,
  features,
  isPopular = false,
  onSelect,
}: PremiumCardProps) => {
  return (
    <Card className={`relative ${isPopular ? 'border-primary' : ''}`}>
      {isPopular && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <Badge variant="default" className="bg-primary">
            <Star className="w-3 h-3 mr-1" />
            Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Zap className="w-5 h-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="text-center space-y-4">
        <div>
          <div className="text-3xl font-bold">{price}</div>
        </div>
        
        <ul className="space-y-2 text-sm">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center justify-center">
              {feature}
            </li>
          ))}
        </ul>
        
        <Button 
          className="w-full" 
          variant={isPopular ? "default" : "outline"}
          onClick={onSelect}
        >
          Select Plan
        </Button>
      </CardContent>
    </Card>
  );
};

export default PremiumCard;
