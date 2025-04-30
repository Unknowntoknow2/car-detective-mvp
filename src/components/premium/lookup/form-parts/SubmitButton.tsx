
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SubmitButtonProps {
  isLoading: boolean;
  disabled?: boolean;
  text?: string;
  loadingText?: string;
}

export function SubmitButton({
  isLoading,
  disabled = false,
  text = "Submit Vehicle Details",
  loadingText = "Processing..."
}: SubmitButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: isLoading || disabled ? 1 : 1.02 }}
      whileTap={{ scale: isLoading || disabled ? 1 : 0.98 }}
    >
      <Button 
        type="submit" 
        disabled={isLoading || disabled}
        className="px-6 py-2.5 h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {loadingText}
          </>
        ) : (
          text
        )}
      </Button>
    </motion.div>
  );
}
