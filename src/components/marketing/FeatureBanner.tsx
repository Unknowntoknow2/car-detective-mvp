
import React from 'react';

interface FeatureBannerProps {
  title: string;
  description: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

const FeatureBanner: React.FC<FeatureBannerProps> = ({
  title,
  description,
  ctaText = 'Learn More',
  onCtaClick
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="mb-4">{description}</p>
      {onCtaClick && (
        <button 
          onClick={onCtaClick}
          className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium"
        >
          {ctaText}
        </button>
      )}
    </div>
  );
};

export default FeatureBanner;
