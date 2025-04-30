
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CarFront, FileText, Camera, Info, DollarSign, LineChart, CalendarClock, FileClock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ValuationServiceId } from "./services";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: ValuationServiceId) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const isMobile = useIsMobile();
  const [overflowActive, setOverflowActive] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      const tabsContainer = document.querySelector('[data-tabs-list]');
      if (tabsContainer) {
        const isOverflowing = tabsContainer.scrollWidth > tabsContainer.clientWidth;
        setOverflowActive(isOverflowing);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <>
      <TabsList 
        data-tabs-list
        className={`w-full flex justify-start ${
          overflowActive ? 'overflow-x-auto pb-3 hide-scrollbar' : 'justify-center'
        }`}
      >
        <TabsTrigger 
          value="vin" 
          onClick={() => onTabChange('vin')}
          className="min-w-max flex-shrink-0"
        >
          <div className="flex items-center gap-2">
            <CarFront className="h-4 w-4" />
            <span>{isMobile ? 'VIN' : 'VIN Lookup'}</span>
          </div>
        </TabsTrigger>
        
        <TabsTrigger 
          value="plate" 
          onClick={() => onTabChange('plate')}
          className="min-w-max flex-shrink-0"
        >
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>{isMobile ? 'Plate' : 'License Plate'}</span>
          </div>
        </TabsTrigger>
        
        <TabsTrigger 
          value="manual" 
          onClick={() => onTabChange('manual')}
          className="min-w-max flex-shrink-0"
        >
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>{isMobile ? 'Manual' : 'Manual Entry'}</span>
          </div>
        </TabsTrigger>
        
        <TabsTrigger 
          value="photo" 
          onClick={() => onTabChange('photo')}
          className="min-w-max flex-shrink-0"
        >
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            <span>{isMobile ? 'Photo' : 'Photo Upload'}</span>
          </div>
        </TabsTrigger>
        
        <TabsTrigger 
          value="dealers" 
          onClick={() => onTabChange('dealers')}
          className="min-w-max flex-shrink-0"
        >
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>{isMobile ? 'Dealers' : 'Dealer Offers'}</span>
          </div>
        </TabsTrigger>
        
        <TabsTrigger 
          value="market" 
          onClick={() => onTabChange('market')}
          className="min-w-max flex-shrink-0"
        >
          <div className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span>{isMobile ? 'Market' : 'Market Analysis'}</span>
          </div>
        </TabsTrigger>
        
        <TabsTrigger 
          value="forecast" 
          onClick={() => onTabChange('forecast')}
          className="min-w-max flex-shrink-0"
        >
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4" />
            <span>{isMobile ? 'Forecast' : '12-Month Forecast'}</span>
          </div>
        </TabsTrigger>
        
        <TabsTrigger 
          value="carfax" 
          onClick={() => onTabChange('carfax')}
          className="min-w-max flex-shrink-0"
        >
          <div className="flex items-center gap-2">
            <FileClock className="h-4 w-4" />
            <span>{isMobile ? 'Carfax' : 'Carfax Report'}</span>
          </div>
        </TabsTrigger>
      </TabsList>
      
      {overflowActive && (
        <div className="w-full text-center text-xs text-muted-foreground mt-2">
          <span>Swipe to see more options →</span>
        </div>
      )}
    </>
  );
}
