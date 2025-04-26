
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TabContentWrapperProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function TabContentWrapper({ title, description, children }: TabContentWrapperProps) {
  return (
    <Card className="border-2 border-primary/10 bg-white shadow-sm">
      <CardHeader className="bg-primary/5 space-y-3 px-8 py-6 border-b border-primary/10">
        <CardTitle className="text-2xl font-display font-semibold text-slate-900">
          {title}
        </CardTitle>
        <p className="text-lg text-slate-600">
          {description}
        </p>
      </CardHeader>
      
      <CardContent className="p-8 lg:p-10">
        {children}
      </CardContent>
    </Card>
  );
}
