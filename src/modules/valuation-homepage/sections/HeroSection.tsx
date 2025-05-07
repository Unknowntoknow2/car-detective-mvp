
import React from "react";
import { CDButton } from "@/components/ui-kit/CDButton";
import { HeadingXL, BodyL } from "@/components/ui-kit/typography";
import { homepageConfig } from "../homepage.config";
import styles from "../styles";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const HeroSection: React.FC = () => {
  const { hero } = homepageConfig;

  return (
    <section className={styles.hero.wrapper}>
      <div className={styles.hero.background} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={styles.hero.container}
      >
        <HeadingXL className={styles.hero.tagline} as="h1">
          {hero.tagline}
        </HeadingXL>
        
        <BodyL className={styles.hero.subheading}>
          {hero.subheading}
        </BodyL>
        
        <div className={styles.hero.ctaContainer}>
          <Link to={hero.primaryCtaLink}>
            <CDButton size="lg">
              {hero.ctaButton.primary}
            </CDButton>
          </Link>
          
          <Link to={hero.secondaryCtaLink}>
            <CDButton variant="ghost" size="lg">
              {hero.ctaButton.secondary}
            </CDButton>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
