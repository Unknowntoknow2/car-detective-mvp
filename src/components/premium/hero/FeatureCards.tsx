
import { FileText, Building, ChartBar } from "lucide-react";

export function FeatureCards() {
  return (
    <div className="grid sm:grid-cols-3 gap-6 mt-8">
      <div className="bg-white p-6 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold">Full CARFAX Report</h3>
        </div>
        <p className="text-sm text-text-secondary">Complete vehicle history with accident records and service data</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Building className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold">Dealer-beat Offers</h3>
        </div>
        <p className="text-sm text-text-secondary">Compare real-time offers from local dealerships</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full bg-primary/10">
            <ChartBar className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold">12-Month Forecast</h3>
        </div>
        <p className="text-sm text-text-secondary">AI-powered price prediction for optimal selling time</p>
      </div>
    </div>
  );
}
