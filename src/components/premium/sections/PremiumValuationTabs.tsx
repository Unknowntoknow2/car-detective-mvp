
import { Tabs } from "@/components/ui/tabs";
import { TabHeader } from "./valuation-tabs/TabHeader";
import { TabNavigation } from "./valuation-tabs/TabNavigation";
import { TabContent } from "./valuation-tabs/TabContent";
import { useValuationState } from "./valuation-tabs/hooks/useValuationState";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
      <TabHeader />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
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
      </Tabs>
    </div>
  );
}
