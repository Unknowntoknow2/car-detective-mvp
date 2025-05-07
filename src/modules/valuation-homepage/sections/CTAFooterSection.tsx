
import React from "react";
import { CDButton } from "@/components/ui-kit/CDButton";
import { HeadingL, BodyM } from "@/components/ui-kit/typography";
import { homepageConfig } from "../homepage.config";
import styles from "../styles";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const CTAFooterSection: React.FC = () => {
  const { ctaFooter } = homepageConfig;

  return (
    <section className={styles.ctaFooter.wrapper}>
      <div className={styles.ctaFooter.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <HeadingL className={styles.ctaFooter.heading} as="h2">
            {ctaFooter.headline}
          </HeadingL>
          
          <Link to={ctaFooter.buttonLink}>
            <CDButton 
              size="lg" 
              className={styles.ctaFooter.ctaButton}
              variant="secondary"
            >
              {ctaFooter.buttonText}
            </CDButton>
          </Link>
          
          <BodyM className={styles.ctaFooter.subtext}>
            {ctaFooter.subtext}
          </BodyM>
        </motion.div>
      </div>
    </section>
  );
};

export default CTAFooterSection;
