
import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const variants = {
  enter: { opacity: 0, x: 20 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

interface FormStepsProps {
  currentStep: number;
  children: ReactNode;
}

export function FormSteps({ currentStep, children }: FormStepsProps) {
  return (
    <AnimatePresence>
      <motion.div
        key={currentStep}
        initial="enter"
        animate="center"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
