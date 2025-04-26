
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TabContentWrapper } from "./TabContentWrapper";

export function PhotoUploadTab() {
  return (
    <TabContentWrapper
      title="Photo Analysis"
      description="Upload photos for AI-powered condition assessment"
    >
      <div className="p-12 border-2 border-dashed border-slate-300 rounded-lg text-center">
        <Camera className="h-12 w-12 mx-auto mb-4 text-slate-400" />
        <p className="text-slate-600 mb-4">Drag and drop up to 5 photos of your vehicle</p>
        <Button variant="outline">Upload Photos</Button>
      </div>
    </TabContentWrapper>
  );
}
