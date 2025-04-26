
import { Button } from "@/components/ui/button";
import { TabContentWrapper } from "./TabContentWrapper";

interface UnauthorizedRedirectTabProps {
  setActiveTab: (tab: string) => void;
}

export function UnauthorizedRedirectTab({ setActiveTab }: UnauthorizedRedirectTabProps) {
  return (
    <TabContentWrapper
      title="Vehicle Information Required"
      description="First enter your vehicle information using VIN, plate, or manual entry"
    >
      <div className="p-12 bg-slate-50 rounded-lg border border-slate-200 text-center">
        <p className="text-slate-600 mb-4">
          First enter your vehicle information using VIN, plate, or manual entry
        </p>
        <Button variant="default" onClick={() => setActiveTab("vin")}>
          Start Vehicle Lookup
        </Button>
      </div>
    </TabContentWrapper>
  );
}
