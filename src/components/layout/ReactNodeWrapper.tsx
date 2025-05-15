
import { ReactNode } from 'react';

interface ReactNodeWrapperProps {
  children: ReactNode;
}

export const ReactNodeWrapper: React.FC<ReactNodeWrapperProps> = ({ children }) => {
  return <>{children}</>;
};
