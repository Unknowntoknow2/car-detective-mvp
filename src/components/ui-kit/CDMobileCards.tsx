
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface CDMobileCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
  icon?: React.ReactNode;
  showChevron?: boolean;
}

export const CDMobileCard: React.FC<CDMobileCardProps> = ({
  children,
  className,
  onClick,
  interactive = false,
  icon,
  showChevron = false,
}) => {
  return (
    <motion.div
      className={cn(
        "w-full bg-white rounded-xl border border-neutral-light overflow-hidden",
        "transition-shadow duration-200",
        interactive && "active:bg-neutral-lighter cursor-pointer",
        className
      )}
      onClick={interactive ? onClick : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
    >
      <div className="flex items-center p-4">
        {icon && <div className="mr-3 flex-shrink-0">{icon}</div>}
        <div className="flex-1">{children}</div>
        {showChevron && (
          <ChevronRight className="h-5 w-5 text-neutral-dark flex-shrink-0" />
        )}
      </div>
    </motion.div>
  );
};

interface CDMobileActionCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export const CDMobileActionCard: React.FC<CDMobileActionCardProps> = ({
  title,
  description,
  icon,
  onClick,
  className,
}) => {
  return (
    <CDMobileCard
      interactive
      icon={icon}
      showChevron
      onClick={onClick}
      className={className}
    >
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-0.5">{description}</p>
        )}
      </div>
    </CDMobileCard>
  );
};

interface CDMobileBottomSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  height?: "auto" | "25%" | "50%" | "75%" | "90%";
}

export const CDMobileBottomSheet: React.FC<CDMobileBottomSheetProps> = ({
  children,
  isOpen,
  onClose,
  title,
  height = "auto",
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={cn(
              "fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl",
              "shadow-xl max-h-[90vh] overflow-auto safe-area-inset",
              height === "auto" ? "h-auto" : `h-[${height}]`
            )}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="sticky top-0 bg-white pt-2 pb-1 px-4 border-b border-neutral-light z-10">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-2" />
              {title && (
                <h2 className="text-lg font-semibold text-center pb-2">{title}</h2>
              )}
            </div>
            <div className="p-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

interface CDMobileListProps {
  children: React.ReactNode;
  className?: string;
}

export const CDMobileList: React.FC<CDMobileListProps> = ({
  children,
  className,
}) => {
  return (
    <ul
      className={cn(
        "divide-y divide-neutral-light overflow-hidden rounded-xl border border-neutral-light bg-white",
        className
      )}
    >
      {children}
    </ul>
  );
};

interface CDMobileListItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  showChevron?: boolean;
  icon?: React.ReactNode;
}

export const CDMobileListItem: React.FC<CDMobileListItemProps> = ({
  children,
  onClick,
  className,
  showChevron = false,
  icon,
}) => {
  return (
    <li
      className={cn(
        "flex items-center p-4 active:bg-neutral-lighter",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {icon && <div className="mr-3 flex-shrink-0">{icon}</div>}
      <div className="flex-1">{children}</div>
      {showChevron && (
        <ChevronRight className="h-5 w-5 text-neutral-dark flex-shrink-0" />
      )}
    </li>
  );
};

export default {
  CDMobileCard,
  CDMobileActionCard,
  CDMobileBottomSheet,
  CDMobileList,
  CDMobileListItem,
};
