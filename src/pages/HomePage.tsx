
import React, { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { EnhancedHomePage } from '@/components/home/EnhancedHomePage';
import { SHOW_ALL_COMPONENTS } from '@/lib/constants';

const HomePage: React.FC = () => {
  // Add diagnostic logging to confirm component is being rendered
  console.log('✅ HomePage loaded');

  useEffect(() => {
    console.log('✅ HomePage mounted in DOM');
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <EnhancedHomePage />
      
      {/* Debug info only visible in development mode */}
      {SHOW_ALL_COMPONENTS && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 text-black p-3 rounded-lg text-xs z-50 opacity-80">
          Debug Mode: ON
        </div>
      )}
    </>
  );
};

export default HomePage;
