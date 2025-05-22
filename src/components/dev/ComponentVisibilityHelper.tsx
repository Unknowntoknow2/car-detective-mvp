
import React from 'react';
import { SHOW_ALL_COMPONENTS } from '@/lib/constants';

interface ComponentVisibilityHelperProps {
  children: React.ReactNode;
  isVisible?: boolean;
  name: string;
  fallback?: React.ReactNode;
}

/**
 * Helper component to ensure UI components are visible in development mode
 */
export const ComponentVisibilityHelper: React.FC<ComponentVisibilityHelperProps> = ({
  children,
  isVisible = true,
  name,
  fallback
}) => {
  const shouldRender = SHOW_ALL_COMPONENTS || isVisible;
  
  if (!shouldRender) {
    return fallback ? <>{fallback}</> : null;
  }
  
  return (
    <>
      {SHOW_ALL_COMPONENTS && (
        <div className="bg-green-100 text-green-800 text-xs p-1 mb-1 rounded-t-sm">
          Component: {name}
        </div>
      )}
      {children}
    </>
  );
};

export default ComponentVisibilityHelper;
