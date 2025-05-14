
import React from "react";
import { CDCard } from "@/components/ui-kit/CDCard";
import { Heading, BodyM } from "@/components/ui-kit/typography";
import { homepageConfig } from "../homepage.config";
import styles from "../styles";
import { motion } from "framer-motion";
import { Car, FileText, Search } from "lucide-react";

export const HowItWorksSection: React.FC = () => {
  const { steps } = homepageConfig;

  // Map iconType to actual icon components
  const getIconByType = (iconType: string) => {
    switch (iconType) {
      case "car": return <Car size={32} />;
      case "file-text": return <FileText size={32} />;
      case "search": return <Search size={32} />;
      default: return null;
    }
  };

  return (
    <section className={styles.steps.wrapper}>
      <div className={styles.container.inner}>
        <Heading 
          level={1} 
          className={styles.steps.heading}
        >
          How It Works
        </Heading>
        
        <div className={styles.steps.grid}>
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.2,
                ease: "easeOut" 
              }}
            >
              <CDCard 
                className={styles.steps.stepCard}
                padding="lg"
                variant="elevated"
              >
                <div className={styles.steps.icon}>
                  {getIconByType(step.iconType)}
                </div>
                
                <Heading 
                  level={2} 
                  className={styles.steps.stepTitle}
                >
                  {step.title}
                </Heading>
                
                <BodyM className={styles.steps.stepDescription}>
                  {step.description}
                </BodyM>
              </CDCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
