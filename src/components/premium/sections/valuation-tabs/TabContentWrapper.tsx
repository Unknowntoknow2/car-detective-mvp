
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TabContentWrapperProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function TabContentWrapper({ title, description, children }: TabContentWrapperProps) {
  return (
    <Card className="border-2 border-primary/10 bg-white">
      <CardHeader className="bg-primary/5 space-y-2 px-6 py-5">
        <CardTitle className="text-2xl font-display font-semibold text-slate-900">
          {title}
        </CardTitle>
        <p className="text-slate-600 text-lg">
          {description}
        </p>
      </CardHeader>
      
      <CardContent className="p-8">
        {children}
      </CardContent>
    </Card>
  );
}
