
import { ReactNode } from "react";

interface TabContentWrapperProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function TabContentWrapper({ title, description, children }: TabContentWrapperProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        <p className="text-slate-600">{description}</p>
      </div>
      
      <div>
        {children}
      </div>
    </div>
  );
}
