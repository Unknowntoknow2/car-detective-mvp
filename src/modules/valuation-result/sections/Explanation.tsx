// Update the import to use the correct Heading component
import { Heading } from "@/components/ui-kit/typography";
import { BodyM } from "@/components/ui-kit/typography";

// Rest of the file remains the same
export const Explanation = () => {
  const factors = [
    {
      name: "Market Demand",
      impact: "High",
      description: "Current market demand for this make and model is strong, positively affecting the valuation."
    },
    {
      name: "Vehicle Condition",
      impact: "Medium",
      description: "The overall condition is good with minor wear consistent with age."
    },
    {
      name: "Mileage",
      impact: "Medium",
      description: "The vehicle has slightly above average mileage for its age, which slightly reduces its value."
    },
    {
      name: "Service History",
      impact: "High",
      description: "Complete service history with regular maintenance increases buyer confidence and value."
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Heading className="text-2xl font-bold mb-4">Valuation Explanation</Heading>
      
      <div className="space-y-6">
        <div>
          <BodyM className="text-gray-700">
            This valuation is based on comprehensive analysis of market data, vehicle condition, 
            and comparable sales. Here are the key factors that influenced this valuation:
          </BodyM>
        </div>
        
        <div className="space-y-4">
          {factors.map((factor, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{factor.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  factor.impact === "High" 
                    ? "bg-green-100 text-green-800" 
                    : factor.impact === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {factor.impact} Impact
                </span>
              </div>
              <BodyM className="text-gray-600 text-sm mt-1">
                {factor.description}
              </BodyM>
            </div>
          ))}
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md">
          <BodyM className="text-blue-800">
            <strong>Expert Note:</strong> This vehicle maintains good value retention due to its 
            popularity, reliability record, and the current market conditions for similar vehicles 
            in your area.
          </BodyM>
        </div>
      </div>
    </div>
  );
};
