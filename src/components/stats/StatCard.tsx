
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { AnimatedCounter } from './AnimatedCounter';

interface StatCardProps {
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

export function StatCard({ 
  title, 
  value, 
  icon, 
  formatter = (val) => val.toLocaleString(), 
  className,
  trend 
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-[1.02] group", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          {title}
          {icon && (
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300">
              {icon}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="text-3xl font-bold">
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
      </CardContent>
    </Card>
  );
}
