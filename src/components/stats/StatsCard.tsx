
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { AnimatedCounter } from './AnimatedCounter';

interface StatsCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  formatter?: (value: number) => string;
  className?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
}

export function StatsCard({ 
  title, 
  value, 
  icon, 
  formatter = (val) => val.toLocaleString(), 
  className,
  trend 
}: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={value} formatter={formatter} />
            </div>
            {trend && (
              <div className="mt-1 flex items-center text-xs">
                <span className={trend.isPositive ? "text-green-600" : "text-red-600"}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                {trend.label && (
                  <span className="text-muted-foreground ml-1">{trend.label}</span>
                )}
              </div>
            )}
          </div>
          {icon && (
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
