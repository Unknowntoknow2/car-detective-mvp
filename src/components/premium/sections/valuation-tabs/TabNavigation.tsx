import { useRef, useEffect, useState } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Car, Search, FileText, Camera, Building, PieChart, TrendingUp } from "lucide-react";
import { ValuationServiceId } from "./services";
import { Button } from "@/components/ui/button";

interface TabNavigationProps {
  activeTab: ValuationServiceId;
  onTabChange: (tab: ValuationServiceId) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  
  const scrollTabs = (direction: 'left' | 'right') => {
    if (!tabsContainerRef.current) return;
    
    const container = tabsContainerRef.current;
    const scrollAmount = container.clientWidth * 0.5;
    
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };
  
  useEffect(() => {
    const checkScrollPosition = () => {
      if (!tabsContainerRef.current) return;
      
      const container = tabsContainerRef.current;
      setShowLeftScroll(container.scrollLeft > 0);
      setShowRightScroll(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
    };
    
    const container = tabsContainerRef.current;
    if (container) {
      checkScrollPosition();
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, []);
  
  useEffect(() => {
    if (!tabsContainerRef.current) return;
    
    const container = tabsContainerRef.current;
    const activeTabElement = container.querySelector(`[data-state="active"]`) as HTMLElement;
    
    if (activeTabElement) {
      const containerLeft = container.scrollLeft;
      const containerRight = containerLeft + container.clientWidth;
      const tabLeft = activeTabElement.offsetLeft;
      const tabRight = tabLeft + activeTabElement.clientWidth;
      
      if (tabLeft < containerLeft || tabRight > containerRight) {
        activeTabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTab]);

  const tabConfig = [
    { id: 'vin', label: 'VIN Lookup', icon: <Car className="h-4 w-4" /> },
    { id: 'plate', label: 'Plate Lookup', icon: <Search className="h-4 w-4" /> },
    { id: 'manual', label: 'Manual Entry', icon: <FileText className="h-4 w-4" /> },
    { id: 'photo', label: 'Photo Analysis', icon: <Camera className="h-4 w-4" /> },
    { id: 'dealers', label: 'Dealer Offers', icon: <Building className="h-4 w-4" /> },
    { id: 'market', label: 'Market Analysis', icon: <PieChart className="h-4 w-4" /> },
    { id: 'forecast', label: '12-Month Forecast', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'carfax', label: 'CARFAX® Report', icon: <FileText className="h-4 w-4" /> },
  ];

  return (
    <div className="relative">
      {showLeftScroll && (
        <Button 
          variant="ghost" 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-1 h-auto hidden sm:flex"
          onClick={() => scrollTabs('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}
      
      <div className="overflow-x-auto scrollbar-hide" ref={tabsContainerRef}>
        <TabsList className="rounded-xl border border-gray-200 p-1 inline-flex w-max min-w-full sm:min-w-0">
          {tabConfig.map(tab => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              onClick={() => onTabChange(tab.id as ValuationServiceId)}
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white py-2 px-3 flex items-center gap-2 whitespace-nowrap"
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      
      {showRightScroll && (
        <Button 
          variant="ghost" 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-1 h-auto hidden sm:flex"
          onClick={() => scrollTabs('right')}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
