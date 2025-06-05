
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DealerSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const DealerSidebar: React.FC<DealerSidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
}) => {
  return (
    <div className={`bg-white border-r transition-all duration-300 ${
      collapsed ? "w-20" : "w-64"
    } h-full`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h2 className="font-bold text-lg">Dealer Panel</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DealerSidebar;
