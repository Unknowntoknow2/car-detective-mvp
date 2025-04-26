
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { valuationServices, ValuationServiceId } from "./services";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface TabNavigationProps {
  activeTab: ValuationServiceId;
  onTabChange: (value: ValuationServiceId) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Check if scroll arrows should be displayed
  const checkScroll = () => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
    }
  };

  // Handle scroll events
  useEffect(() => {
    const tabsElement = tabsRef.current;
    if (tabsElement) {
      tabsElement.addEventListener('scroll', checkScroll);
      checkScroll();
      
      // Check on resize as well
      window.addEventListener('resize', checkScroll);
      
      return () => {
        tabsElement.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  // Scroll left/right
  const scroll = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const scrollAmount = 200; // px to scroll
      const newPosition = direction === 'left' 
        ? tabsRef.current.scrollLeft - scrollAmount 
        : tabsRef.current.scrollLeft + scrollAmount;
      
      tabsRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  // Scroll active tab into view
  useEffect(() => {
    if (tabsRef.current) {
      const activeElement = tabsRef.current.querySelector(`[data-state="active"]`) as HTMLElement;
      if (activeElement) {
        const tabsRect = tabsRef.current.getBoundingClientRect();
        const activeRect = activeElement.getBoundingClientRect();
        
        if (activeRect.left < tabsRect.left || activeRect.right > tabsRect.right) {
          activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }
    }
  }, [activeTab]);

  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm py-6 px-6 lg:py-8 lg:px-10 border-b border-slate-200 shadow-sm">
      <div className="container mx-auto relative">
        {/* Left scroll arrow */}
        {showLeftArrow && (
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-1 shadow-md border border-slate-200 hover:bg-slate-50"
            aria-label="Scroll tabs left"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </button>
        )}
        
        {/* Tabs container with ref for scrolling */}
        <div className="overflow-hidden relative">
          <TabsList 
            ref={tabsRef}
            className="flex w-full overflow-x-auto scrollbar-hide bg-slate-50/80 rounded-xl border border-slate-200 p-1.5 md:p-2.5 gap-1.5 md:gap-2.5 h-auto min-h-16"
          >
            {valuationServices.map((service) => (
              <TabsTrigger
                key={service.id}
                value={service.id}
                onClick={() => onTabChange(service.id)}
                className="flex-shrink-0 flex flex-col md:flex-row items-center justify-center gap-2 py-3 px-3 lg:px-4 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200 min-w-[120px] hover:bg-slate-100 data-[state=active]:hover:bg-primary/90 data-[state=active]:shadow-sm h-auto"
              >
                <service.icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium whitespace-nowrap text-sm">{service.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {/* Right scroll arrow */}
        {showRightArrow && (
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-1 shadow-md border border-slate-200 hover:bg-slate-50"
            aria-label="Scroll tabs right"
          >
            <ChevronRight className="h-5 w-5 text-slate-600" />
          </button>
        )}
      </div>
    </div>
  );
}
