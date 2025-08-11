import { useState, useCallback } from 'react'
import VINInput from './components/VINInput'
import { decodeVin, extractVehicleInfo, assessDataQuality, VINDecodeError, isVinDecodeSuccessful } from './services/unifiedVinDecoder'
import './App.css'

function App() {
  const [vin, setVin] = useState('')
  const [validation, setValidation] = useState({ isValid: null })
  const [decodedData, setDecodedData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleVINChange = useCallback((newVin) => {
    setVin(newVin)
    setError(null)
    if (!newVin.trim()) {
      setDecodedData(null)
    }
  }, [])

  const handleValidationChange = useCallback((validationResult) => {
    setValidation(validationResult)
  }, [])

  const handleDecodeVIN = async () => {
    if (!validation.isValid || !vin.trim()) return

    setLoading(true)
    setError(null)
    
    try {
      console.log('🚗 Starting VIN decode for:', vin)
      
      // Use unified VIN decoder (Supabase edge function -> NHTSA fallback)
      const result = await decodeVin(vin)
      console.log('✅ Decode successful:', result)
      
      // Check if decode was successful
      if (!isVinDecodeSuccessful(result)) {
        throw new VINDecodeError(
          'VIN decode returned no data', 
          'NO_DATA', 
          result.metadata.errorText
        )
      }
      
      const vehicleInfo = extractVehicleInfo(result)
      console.log('📋 Extracted vehicle info:', vehicleInfo)
      
      const quality = assessDataQuality(vehicleInfo)
      console.log('🎯 Quality assessment:', quality)
      
      setDecodedData({
        raw: result.raw,
        categories: result.categories,
        metadata: result.metadata,
        vehicleInfo,
        quality
      })
    } catch (err) {
      console.error('❌ VIN decode failed:', err)
      if (err instanceof VINDecodeError) {
        setError(`${err.message}: ${err.details || ''}`)
      } else {
        setError('Failed to decode VIN. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>🚗 AIN Vehicle Valuation Engine</h1>
          <p>Enterprise-grade VIN decoding with ISO 3779 validation</p>
        </header>

        <main className="main">
          <div className="vin-section">
            <h2>Vehicle Identification</h2>
            <p>Enter a 17-character VIN to decode vehicle information</p>
            
            <VINInput
              onVINChange={handleVINChange}
              onValidationChange={handleValidationChange}
              placeholder="Enter VIN (e.g., 1HGBH41JXMN109186)"
              autoFocus={true}
            />
            
            <button
              className={`decode-button ${validation.isValid ? 'decode-button--enabled' : 'decode-button--disabled'}`}
              onClick={handleDecodeVIN}
              disabled={!validation.isValid || loading}
            >
              {loading ? '🔄 Decoding...' : '🔍 Decode VIN'}
            </button>
          </div>

          {error && (
            <div className="error-section">
              <h3>❌ Error</h3>
              <p>{error}</p>
            </div>
          )}

          {decodedData && (
            <div className="results-section">
              <div className="results-header">
                <h3>✅ Vehicle Information</h3>
                <div className="quality-badge">
                  Quality Score: {decodedData.quality.score}/100 (Grade {decodedData.quality.grade})
                </div>
              </div>

              <div className="vehicle-info">
                <div className="info-grid">
                  <div className="info-item">
                    <label>Make</label>
                    <span>{decodedData.vehicleInfo.make}</span>
                  </div>
                  <div className="info-item">
                    <label>Model</label>
                    <span>{decodedData.vehicleInfo.model}</span>
                  </div>
                  <div className="info-item">
                    <label>Year</label>
                    <span>{decodedData.vehicleInfo.modelYear}</span>
                  </div>
                  <div className="info-item">
                    <label>Body Class</label>
                    <span>{decodedData.vehicleInfo.bodyClass}</span>
                  </div>
                  <div className="info-item">
                    <label>Manufacturer</label>
                    <span>{decodedData.vehicleInfo.manufacturer}</span>
                  </div>
                  <div className="info-item">
                    <label>Engine</label>
                    <span>{decodedData.vehicleInfo.engineInfo.cylinders} cyl, {decodedData.vehicleInfo.engineInfo.fuelType}</span>
                  </div>
                </div>

                {decodedData.quality.issues.length > 0 && decodedData.quality.issues[0] !== 'No issues detected' && (
                  <div className="quality-issues">
                    <h4>⚠️ Data Quality Issues:</h4>
                    <ul>
                      {decodedData.quality.issues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="metadata">
                <small>
                  Decoded: {new Date(decodedData.timestamp).toLocaleString()} | 
                  Source: {decodedData.source} | 
                  VIN: {decodedData.vin}
                </small>
              </div>
            </div>
          )}
        </main>

        <footer className="footer">
          <p>🔒 Secure VIN processing • 🛡️ Privacy protected • ⚡ Real-time validation</p>
        </footer>
      </div>
    </div>
  )
}

export default App
