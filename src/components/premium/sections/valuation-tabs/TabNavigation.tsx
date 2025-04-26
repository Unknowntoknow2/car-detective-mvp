
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { valuationServices, ValuationServiceId } from "./services";

interface TabNavigationProps {
  activeTab: ValuationServiceId;
  onTabChange: (value: ValuationServiceId) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm py-6 px-6 lg:py-8 lg:px-10 border-b border-slate-200 shadow-sm">
      <div className="container mx-auto">
        <TabsList className="flex w-full overflow-x-auto bg-slate-50/80 rounded-xl border border-slate-200 p-1.5 md:p-2.5 gap-1.5 md:gap-2.5 h-auto min-h-16">
          {valuationServices.map((service) => (
            <TabsTrigger
              key={service.id}
              value={service.id}
              onClick={() => onTabChange(service.id)}
              className="flex-1 flex flex-col md:flex-row items-center justify-center gap-2 py-3 px-3 lg:px-4 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200 min-w-[120px] hover:bg-slate-100 data-[state=active]:hover:bg-primary/90 data-[state=active]:shadow-sm h-auto"
            >
              <service.icon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium whitespace-nowrap text-sm">{service.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </div>
  );
}
