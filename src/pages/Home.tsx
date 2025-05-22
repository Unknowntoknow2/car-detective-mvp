
import React from "react";
import { EnhancedHomePage } from "@/components/home/EnhancedHomePage";
import { SHOW_ALL_COMPONENTS } from '@/lib/constants';

export default function Home() {
  console.log('✅ Home page rendering EnhancedHomePage');
  
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
}
