
import React, { useEffect, useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { FeatureCheck } from './FeatureCheck';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface FeatureComparison {
  name: string;
  description?: string;
  basic: boolean | 'limited' | 'full';
  pro: boolean | 'limited' | 'full';
  enterprise: boolean | 'limited' | 'full';
  category?: string;
  basicTooltip?: string;
  proTooltip?: string;
  enterpriseTooltip?: string;
}

interface PlanComparisonTableProps {
  features: FeatureComparison[];
}

export const PlanComparisonTable: React.FC<PlanComparisonTableProps> = ({ features }) => {
  const [isSticky, setIsSticky] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Group features by category
  const categories = features.reduce((acc, feature) => {
    const category = feature.category || 'Features';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(feature);
    return acc;
  }, {} as Record<string, FeatureComparison[]>);

  return (
    <div className={`w-full bg-background transition-all duration-300 ${
      isSticky ? 'sticky top-0 z-20 shadow-md' : ''
    }`}>
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Plan Comparison</h2>
        
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[40%]">Feature</TableHead>
                <TableHead className="text-center">Basic</TableHead>
                <TableHead className="text-center">Pro</TableHead>
                <TableHead className="text-center">Enterprise</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(categories).map(([category, categoryFeatures]) => (
                <React.Fragment key={category}>
                  <TableRow className="bg-muted/20">
                    <TableCell colSpan={4} className="font-medium py-2">
                      {category}
                    </TableCell>
                  </TableRow>
                  {categoryFeatures.map((feature, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-1">
                          {feature.name}
                          {feature.description && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground ml-1" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs text-sm">{feature.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <FeatureCheck 
                          included={feature.basic} 
                          label={feature.basicTooltip}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <FeatureCheck 
                          included={feature.pro} 
                          label={feature.proTooltip}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <FeatureCheck 
                          included={feature.enterprise} 
                          label={feature.enterpriseTooltip}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
