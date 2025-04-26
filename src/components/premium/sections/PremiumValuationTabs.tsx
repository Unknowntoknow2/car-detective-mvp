
import { Tabs } from "@/components/ui/tabs";
import { TabHeader } from "./valuation-tabs/TabHeader";
import { TabNavigation } from "./valuation-tabs/TabNavigation";
import { TabContent } from "./valuation-tabs/TabContent";
import { useValuationState } from "./valuation-tabs/hooks/useValuationState";
import { ValuationServiceId } from "./valuation-tabs/services";

export function PremiumValuationTabs() {
  const {
    activeTab,
    setActiveTab,
    vinValue,
    setVinValue,
    plateValue,
    setPlateValue,
    plateState,
    setPlateState,
    isLoading,
    vehicle,
    handleVinLookup,
    handlePlateLookup,
    handleManualSubmit
  } = useValuationState();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <TabHeader />
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={(value: ValuationServiceId) => setActiveTab(value)} 
        className="w-full space-y-8"
      >
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <TabNavigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
        </div>
        
        <div className="bg-surface rounded-xl p-6">
          <TabContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            vinValue={vinValue}
            plateValue={plateValue}
            plateState={plateState}
            isLoading={isLoading}
            vehicle={vehicle}
            onVinChange={setVinValue}
            onPlateChange={setPlateValue}
            onStateChange={setPlateState}
            onVinLookup={handleVinLookup}
            onPlateLookup={handlePlateLookup}
            onManualSubmit={handleManualSubmit}
          />
        </div>
      </Tabs>
    </div>
  );
}
