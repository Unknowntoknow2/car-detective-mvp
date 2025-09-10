import { useState, useCallback } from 'react'
import VINInput from './components/VINInput'
import { decodeVin, extractVehicleInfo, assessDataQuality, VINDecodeError, isVinDecodeSuccessful } from './services/unifiedVinDecoder'
import { fetchValuation } from './services/vehicleDataService'
import { exportValuationPDF } from './utils/pdfExport'
import './App.css'

function App() {
  const [vin, setVin] = useState('')
  const [validation, setValidation] = useState({ isValid: null })
  const [decodedData, setDecodedData] = useState(null)
  const [userFields, setUserFields] = useState({ mileage: '', zip: '', condition: '', titleStatus: '', color: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [valuation, setValuation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleVINChange = useCallback((newVin) => {
    setVin(newVin)
    setError(null)
    setValuation(null)
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
    setValuation(null)
    try {
      console.log('🚗 Starting VIN decode for:', vin)
      const result = await decodeVin(vin)
      console.log('✅ Decode successful:', result)
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

  // Handle user field changes
  const handleUserFieldChange = (e) => {
    const { name, value } = e.target;
    setUserFields((prev) => ({ ...prev, [name]: value }));
    setValuation(null);
  };

  // Validate all required fields before valuation
  const requiredFields = [
    { key: 'vin', label: 'VIN', value: vin },
    { key: 'year', label: 'Year', value: decodedData?.vehicleInfo?.modelYear },
    { key: 'make', label: 'Make', value: decodedData?.vehicleInfo?.make },
    { key: 'model', label: 'Model', value: decodedData?.vehicleInfo?.model },
    { key: 'mileage', label: 'Mileage', value: userFields.mileage },
    { key: 'zip', label: 'ZIP', value: userFields.zip },
    { key: 'condition', label: 'Condition', value: userFields.condition },
    { key: 'titleStatus', label: 'Title Status', value: userFields.titleStatus }
  ];
  const missingFields = requiredFields.filter(f => !f.value || f.value === '');
  const isReadyForValuation = missingFields.length === 0;

  // Call backend valuation API
  const handleValuate = async () => {
    // Inline error reporting for missing fields
    if (!isReadyForValuation) {
      const errs = {};
      missingFields.forEach(f => { errs[f.key] = `${f.label} is required.` });
      setFieldErrors(errs);
      setError('Please complete all required fields.');
      return;
    }
    setFieldErrors({});
    setLoading(true);
    setError(null);
    try {
      const vehicleProfile = {
        vin,
        year: decodedData.vehicleInfo.modelYear,
        make: decodedData.vehicleInfo.make,
        model: decodedData.vehicleInfo.model,
        mileage: Number(userFields.mileage),
        zip: userFields.zip,
        condition: userFields.condition,
        titleStatus: userFields.titleStatus,
        color: userFields.color
      };
      const result = await fetchValuation(vehicleProfile);
      if (!result || result.estimatedValue == null) {
        setError('Valuation unavailable: missing data or no comparable vehicles. Please check your inputs or try again later.');
        setValuation(null);
        return;
      }
      setValuation(result);
    } catch (err) {
      setError(err.message || 'Valuation failed.');
      setValuation(null);
    } finally {
      setLoading(false);
    }
  };

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
                  Quality Score: {decodedData.quality.score}/100
                </div>
              </div>
              <div className="vehicle-info">
                <div className="info-grid">
                  <div className="info-item"><label>Make</label><span>{decodedData.vehicleInfo.make}</span></div>
                  <div className="info-item"><label>Model</label><span>{decodedData.vehicleInfo.model}</span></div>
                  <div className="info-item"><label>Year</label><span>{decodedData.vehicleInfo.modelYear}</span></div>
                  <div className="info-item"><label>Body Class</label><span>{decodedData.vehicleInfo.bodyClass}</span></div>
                  <div className="info-item"><label>Manufacturer</label><span>{decodedData.vehicleInfo.manufacturer}</span></div>
                </div>
              </div>
              <form className="user-fields-form" onSubmit={e => { e.preventDefault(); handleValuate(); }}>
                <div className="user-fields-grid">
                  <div className="user-field">
                    <label>Mileage*</label>
                    <input name="mileage" type="number" min="0" value={userFields.mileage} onChange={handleUserFieldChange} required />
                    {fieldErrors.mileage && <span className="field-error">{fieldErrors.mileage}</span>}
                  </div>
                  <div className="user-field">
                    <label>ZIP*</label>
                    <input name="zip" type="text" value={userFields.zip} onChange={handleUserFieldChange} required />
                    {fieldErrors.zip && <span className="field-error">{fieldErrors.zip}</span>}
                  </div>
                  <div className="user-field">
                    <label>Condition*</label>
                    <select name="condition" value={userFields.condition} onChange={handleUserFieldChange} required>
                      <option value="">Select</option>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                    {fieldErrors.condition && <span className="field-error">{fieldErrors.condition}</span>}
                  </div>
                  <div className="user-field">
                    <label>Title Status*</label>
                    <select name="titleStatus" value={userFields.titleStatus} onChange={handleUserFieldChange} required>
                      <option value="">Select</option>
                      <option value="clean">Clean</option>
                      <option value="salvage">Salvage</option>
                      <option value="rebuilt">Rebuilt</option>
                    </select>
                    {fieldErrors.titleStatus && <span className="field-error">{fieldErrors.titleStatus}</span>}
                  </div>
                  <div className="user-field">
                    <label>Color*</label>
                    <input name="color" type="text" value={userFields.color} onChange={handleUserFieldChange} required />
                    {fieldErrors.color && <span className="field-error">{fieldErrors.color}</span>}
                  </div>
                </div>
                <button className="valuate-button" type="submit" disabled={!isReadyForValuation || loading}>{loading ? '🔄 Valuating...' : '💰 Get Valuation'}</button>
              </form>
              {valuation && (
                <div className="valuation-result">
                  <h3>💰 Estimated Value: ${valuation.estimatedValue.toLocaleString()}</h3>
                  <div>Confidence: {(valuation.confidence * 100).toFixed(0)}%</div>
                  <div>Price Range: ${valuation.priceRange.low.toLocaleString()} - ${valuation.priceRange.high.toLocaleString()}</div>
                  <div className="explanation">{valuation.explanation}</div>
                  <button className="pdf-export-btn" onClick={() => exportValuationPDF(valuation, { ...decodedData.vehicleInfo, ...userFields, vin })}>
                    📄 Export PDF
                  </button>
                </div>
              )}
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
