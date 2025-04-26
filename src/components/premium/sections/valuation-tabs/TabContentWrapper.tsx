
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TabContentWrapperProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function TabContentWrapper({ title, description, children }: TabContentWrapperProps) {
  return (
    <Card className="border-2 border-primary/10">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-xl font-semibold text-slate-900">{title}</CardTitle>
        <p className="text-slate-600 mt-1">{description}</p>
      </CardHeader>
      
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
}
