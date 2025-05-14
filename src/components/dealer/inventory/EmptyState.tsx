
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center py-16 px-4 border rounded-xl bg-muted/20"
    >
      {icon && (
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto bg-primary/10 rounded-full p-6 w-fit mb-6"
        >
          {icon}
        </motion.div>
      )}
      
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        {description}
      </p>
      
      <Button 
        onClick={onAction}
        size="lg"
        className="px-8"
      >
        {actionLabel}
      </Button>
    </motion.div>
  );
};

export default EmptyState;
