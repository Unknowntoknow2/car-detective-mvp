import { useState } from "react";
import { GlobalErrorBoundary } from "@/components/security/GlobalErrorBoundary";
import { VinLookupForm } from "@/components/lookup/vin/VinLookupForm";
import { DataCollectionForm } from "@/components/followup/DataCollectionForm";
import { ValuationResultsDisplay } from "@/components/valuation/UnifiedValuationResult";
import logger from "./utils/logger";
import type { VariableValue } from "./types/VariableValue";
import type { ValuationResult } from "@/components/valuation/valuation-core/ValuationResult";

/** Application state defining the current step in the valuation workflow */
type AppState = 'vin-lookup' | 'data-collection' | 'valuation-results';

/**
 * Main application component managing the vehicle valuation workflow.
 * 
 * This component orchestrates the three-step valuation process:
 * 1. VIN lookup and decoding
 * 2. Additional data collection
 * 3. Final valuation results display
 * 
 * The component manages state transitions and data flow between steps,
 * ensuring a smooth user experience through the valuation process.
 * 
 * @component
 * @returns {JSX.Element} The main application interface
 * 
 * @example
 * ```tsx
 * import App from './App';
 * 
 * function Root() {
 *   return <App />;
 * }
 * ```
 * 
 * @stateFlow
 * vin-lookup → data-collection → valuation-results
 * 
 * @features
 * - Multi-step wizard interface
 * - State persistence between steps
 * - Error handling and recovery
 * - Structured logging for debugging
 */
function App() {
  const [currentState, setCurrentState] = useState<AppState>('vin-lookup');
  const [decodedVin, setDecodedVin] = useState<VariableValue[]>([]);
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);
  const [currentVin, setCurrentVin] = useState<string>('');

  /**
   * Handles successful VIN decoding and transitions to data collection step.
   * 
   * @param {VariableValue[]} data - Decoded vehicle data from VIN lookup
   * @param {string} vin - The original VIN that was decoded
   */
  const handleVinDecoded = (data: VariableValue[], vin: string) => {
    logger.info("Decoded VIN result:", data);
    setDecodedVin(data);
    setCurrentVin(vin);
    setCurrentState('data-collection');
  };

  /**
   * Handles completion of data collection and transitions to results display.
   * 
   * @param {ValuationResult} valuation - Complete valuation results
   */
  const handleDataCollectionComplete = (valuation: ValuationResult) => {
    logger.info("Valuation completed:", valuation);
    setValuationResult(valuation);
    setCurrentState('valuation-results');
  };

  /**
   * Resets the application to initial state for a new valuation.
   */
  const handleStartOver = () => {
    setCurrentState('vin-lookup');
    setDecodedVin([]);
    setCurrentVin('');
    setValuationResult(null);
  };

  /**
   * Renders the appropriate component based on current application state.
   * 
   * @returns {JSX.Element} The current step component
   */
  const renderCurrentState = () => {
    switch (currentState) {
      case 'vin-lookup':
        return (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AIN Vehicle Valuation Engine
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Get an accurate, AI-powered valuation for your vehicle using comprehensive market analysis, 
              vehicle history, and real-time data from multiple sources.
            </p>
            <VinLookupForm onSuccess={handleVinDecoded} />
          </div>
        );
      
      case 'data-collection':
        return (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Vehicle Information
            </h1>
            <p className="text-gray-600 mb-8">
              We need a few more details to provide the most accurate valuation.
            </p>
            <DataCollectionForm 
              decodedVin={decodedVin} 
              vin={currentVin}
              onComplete={handleDataCollectionComplete}
            />
            <button 
              onClick={handleStartOver}
              className="mt-6 text-blue-600 hover:text-blue-800 underline"
            >
              Start Over with Different VIN
            </button>
          </div>
        );
      
      case 'valuation-results':
        return (
          <div>
            {valuationResult && <ValuationResultsDisplay valuation={valuationResult} />}
            <div className="text-center mt-8">
              <button 
                onClick={handleStartOver}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                Value Another Vehicle
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <GlobalErrorBoundary context="AppRoot">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">AIN Valuation</h1>
              </div>
              {currentState !== 'vin-lookup' && (
                <button 
                  onClick={handleStartOver}
                  className="text-gray-600 hover:text-gray-900"
                >
                  New Valuation
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderCurrentState()}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600">
              <p className="mb-2">
                Powered by advanced AI and comprehensive market data analysis
              </p>
              <div className="flex justify-center space-x-6 text-sm">
                <span>✓ 100+ Comparable Analysis</span>
                <span>✓ Real-time Market Data</span>
                <span>✓ Vehicle History Integration</span>
                <span>✓ AI-Powered Explanations</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </GlobalErrorBoundary>
  );
}

export default App;