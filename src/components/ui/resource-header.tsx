
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ResourceHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  count?: number;
  renderExtra?: () => React.ReactNode;
  className?: string;
}

export const ResourceHeader: React.FC<ResourceHeaderProps> = ({
  title,
  description,
  actionLabel = "Add New",
  onAction,
  icon = <Plus size={16} />,
  count,
  renderExtra,
  className = "",
}) => {
  return (
    <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${className}`}>
      <div>
        <h2 className="text-2xl font-bold">
          {title}
          {typeof count === 'number' && (
            <span className="ml-2 text-muted-foreground font-normal text-lg">
              ({count})
            </span>
          )}
        </h2>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        {renderExtra && renderExtra()}
        {onAction && (
          <Button className="flex items-center gap-2" onClick={onAction}>
            {icon}
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResourceHeader;
