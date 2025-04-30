
import React, { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface SectionCardProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  rightContent?: ReactNode;
}

export function SectionCard({ title, icon: Icon, children, rightContent }: SectionCardProps) {
  return (
    <Card className="p-6 border border-slate-200 shadow-sm bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-slate-800 flex items-center">
          <Icon className="h-5 w-5 mr-2 text-primary" />
          {title}
        </h3>
        {rightContent}
      </div>
      
      {children}
    </Card>
  );
}
