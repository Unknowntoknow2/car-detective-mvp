
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  image?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Car Detective — AI-Powered Vehicle Valuation',
  description = 'Get instant, AI-backed vehicle values with real auction insights, market listings, and premium dealer tools.',
  keywords = 'car valuation, used car price, AI car pricing, car value tool, car appraisal, auction value, carfax alternative',
  canonical,
  image = '/images/hero-car.png',
}) => {
  const fullTitle = title.includes('Car Detective') ? title : `${title} | Car Detective`;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {canonical && <meta property="og:url" content={canonical} />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content="Car Detective" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

export default SEO;
