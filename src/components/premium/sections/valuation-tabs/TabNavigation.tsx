
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { valuationServices, ValuationServiceId } from "./services";

interface TabNavigationProps {
  activeTab: ValuationServiceId;
  onTabChange: (value: ValuationServiceId) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm pt-4 pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <TabsList className="flex w-full mb-6 overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200 p-1.5 gap-1">
        {valuationServices.map((service) => (
          <TabsTrigger
            key={service.id}
            value={service.id}
            className="flex-1 flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-colors min-w-[120px]"
          >
            <service.icon className="h-5 w-5" />
            <span className="font-medium text-sm whitespace-nowrap">{service.title}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
}
