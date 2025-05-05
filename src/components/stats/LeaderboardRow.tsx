
import React from 'react';
import { cn } from '@/lib/utils';
import { Trophy } from 'lucide-react';

interface LeaderboardRowProps {
  rank: number;
  title: string;
  subtitle?: string;
  value: string | number;
  highlight?: boolean;
  className?: string;
}

export function LeaderboardRow({ 
  rank, 
  title, 
  subtitle, 
  value, 
  highlight = false, 
  className 
}: LeaderboardRowProps) {
  return (
    <div className={cn(
      "flex items-center justify-between p-3 rounded-lg",
      highlight ? "bg-primary/10" : "hover:bg-muted transition-colors",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
          rank <= 3 ? "bg-amber-100 text-amber-800" : "bg-muted text-muted-foreground"
        )}>
          {rank <= 3 ? <Trophy className="h-4 w-4" /> : rank}
        </div>
        <div>
          <div className="font-medium">{title}</div>
          {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
        </div>
      </div>
      <div className="font-mono font-medium">{value}</div>
    </div>
  );
}
