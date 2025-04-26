
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { valuationServices, ValuationServiceId } from "./services";

interface TabNavigationProps {
  activeTab: ValuationServiceId;
  onTabChange: (value: ValuationServiceId) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm py-8 px-8 border-b border-slate-200">
      <TabsList className="flex w-full overflow-x-auto bg-slate-50/80 rounded-xl shadow-sm border border-slate-200 p-2.5 gap-2">
        {valuationServices.map((service) => (
          <TabsTrigger
            key={service.id}
            value={service.id}
            className="flex-1 flex flex-col items-center justify-center gap-3 py-4 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200 min-w-[160px] hover:bg-slate-100 data-[state=active]:hover:bg-primary/90 data-[state=active]:shadow-sm"
          >
            <service.icon className="h-6 w-6" />
            <span className="font-medium whitespace-nowrap">{service.title}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
}
