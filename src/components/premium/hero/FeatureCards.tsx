
export function FeatureCards() {
  return (
    <div className="grid sm:grid-cols-3 gap-6 mt-12 text-left">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="font-semibold mb-2">Full CARFAX Report</h3>
        <p className="text-sm text-slate-600">Complete vehicle history with accident records and service data</p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="font-semibold mb-2">Dealer-beat Offers</h3>
        <p className="text-sm text-slate-600">Compare real-time offers from local dealerships</p>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="font-semibold mb-2">12-Month Forecast</h3>
        <p className="text-sm text-slate-600">AI-powered price prediction for optimal selling time</p>
      </div>
    </div>
  );
}
