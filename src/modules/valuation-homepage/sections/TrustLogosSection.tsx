
import React from "react";
import { homepageConfig } from "../homepage.config";
import styles from "../styles";
import { motion } from "framer-motion";
import { Caption } from "@/components/ui-kit/typography";

// Fallback logo components in case image paths don't exist
const LogoPlaceholder: React.FC<{ name: string }> = ({ name }) => {
  return (
    <div className="px-4 py-2 rounded bg-neutral-lighter font-medium text-neutral-darker">
      {name}
    </div>
  );
};

export const TrustLogosSection: React.FC = () => {
  const { trustLogos } = homepageConfig;

  return (
    <section className={styles.trustLogos.wrapper}>
      <div className={styles.trustLogos.container}>
        <Caption className={styles.trustLogos.heading}>
          Powered By
        </Caption>
        
        <motion.div 
          className={styles.trustLogos.logoGrid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {trustLogos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut" 
              }}
            >
              {logo.imageUrl ? (
                <img 
                  src={logo.imageUrl} 
                  alt={logo.alt}
                  className={styles.trustLogos.logo}
                />
              ) : (
                <LogoPlaceholder name={logo.name} />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustLogosSection;
