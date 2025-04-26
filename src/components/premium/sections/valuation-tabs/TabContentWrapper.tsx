
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface TabContentWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function TabContentWrapper({ title, description, children }: TabContentWrapperProps) {
  return (
    <Card className="p-8 border border-slate-200 shadow-sm rounded-xl bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2 text-slate-900">{title}</h3>
          <p className="text-slate-600">{description}</p>
        </div>
        {children}
      </div>
    </Card>
  );
}
