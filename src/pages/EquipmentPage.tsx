
import React from 'react';

const EquipmentPage = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Vehicle Equipment & Features</h1>
      
      <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
        <p className="text-lg mb-4">
          Select the equipment and features present in your vehicle for a more accurate valuation.
          Certain features can significantly impact your vehicle's market value.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Comfort & Convenience</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" id="leather" className="mr-2" />
                <label htmlFor="leather">Leather Seats</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="sunroof" className="mr-2" />
                <label htmlFor="sunroof">Sunroof/Moonroof</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="heated" className="mr-2" />
                <label htmlFor="heated">Heated Seats</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="navigation" className="mr-2" />
                <label htmlFor="navigation">Navigation System</label>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Performance</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" id="premium" className="mr-2" />
                <label htmlFor="premium">Premium Wheels</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="turbo" className="mr-2" />
                <label htmlFor="turbo">Turbo/Supercharger</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="sport" className="mr-2" />
                <label htmlFor="sport">Sport Package</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="towing" className="mr-2" />
                <label htmlFor="towing">Towing Package</label>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Safety & Technology</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" id="blind" className="mr-2" />
                <label htmlFor="blind">Blind Spot Monitoring</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="adaptive" className="mr-2" />
                <label htmlFor="adaptive">Adaptive Cruise Control</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="lane" className="mr-2" />
                <label htmlFor="lane">Lane Departure Warning</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="360" className="mr-2" />
                <label htmlFor="360">360° Camera System</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <a 
          href="/premium" 
          className="bg-primary text-white py-2 px-6 rounded-md hover:bg-primary/90 transition-colors inline-block"
        >
          Continue to Valuation
        </a>
      </div>
    </div>
  );
};

export default EquipmentPage;
