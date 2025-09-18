import { useEffect, useState } from "react"
import { valuateVehicle } from "@/ain-backend/valuationEngine"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import type { VariableValue } from "../../types/VariableValue"
import {
  TitleStatus,
  VehicleCondition,
  type DataGap,
  type ValuationResult,
  type VehicleData,
} from "../../types/ValuationTypes"

type StringKeys<T> = Extract<keyof T, string>

// Narrow a possibly-undefined value with a clear runtime error in dev/test.
function assertDefined<T>(value: T | undefined, name: string | number | symbol): T {
  if (value === undefined) {
    throw new Error(`${String(name)} is required but was undefined`)
  }
  return value
}

interface DataCollectionFormProps {
  decodedVin: VariableValue[]
  vin: string
  onComplete: (valuation: ValuationResult) => void
}

type VehicleDataDraft = Partial<VehicleData> & Record<string, unknown>

export function DataCollectionForm({ decodedVin, vin, onComplete }: DataCollectionFormProps) {
  const [vehicleData, setVehicleData] = useState<VehicleDataDraft>({})
  const [dataGaps, setDataGaps] = useState<DataGap[]>([])
  const [currentGapIndex, setCurrentGapIndex] = useState(0)
  const [isCollecting, setIsCollecting] = useState(true)
  const [isGeneratingValuation, setIsGeneratingValuation] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const requiredFields: StringKeys<VehicleData>[] = [
    'vin','year','make','model','mileage','condition','titleStatus'
  ]

  useEffect(() => {
    // Extract basic vehicle data from decoded VIN
    const extractedData = extractVehicleDataFromVin(decodedVin, vin)
    setVehicleData(extractedData)

    // Identify data gaps that need user input
    const gaps = identifyDataGaps(extractedData)
    setDataGaps(gaps)

    if (gaps.length === 0) {
      setIsCollecting(false)
    }
  }, [decodedVin, vin])

  function extractVehicleDataFromVin(decoded: VariableValue[], vin: string): VehicleDataDraft {
    const data: VehicleDataDraft = { vin }
    // Google-level: log all decoded fields for mapping
    if (decoded && decoded.length > 0) {
      // eslint-disable-next-line no-console
      console.log('[VIN DECODE] All decoded fields:', decoded)
    }
    decoded.forEach(item => {
      const val = item.Value !== undefined && item.Value !== null ? String(item.Value) : undefined;
      switch (item.Variable) {
        case 'Make':
          data.make = val
          break
        case 'Model':
          data.model = val
          break
        case 'Model Year':
          data.year = val ? parseInt(val) : undefined
          break
        case 'Trim':
          data.trim = val
          break
        case 'Engine Number of Cylinders':
        case 'Engine Displacement (L)':
        case 'Engine Model':
          data.engineSize = val
          break
        case 'Fuel Type - Primary':
        case 'Fuel Type':
          data.fuelType = val
          break
        case 'Drive Type':
        case 'Drive':
          data.drivetrain = val
          break
        case 'Transmission Style':
        case 'Transmission':
          data.transmission = val
          break
        case 'Body Class':
          data.body = val
          break
        case 'Doors':
        case 'Number of Doors':
          data.doors = val ? parseInt(val) : undefined
          break
        case 'Exterior Color':
        case 'Color':
          data.exteriorColor = val
          break
        case 'Interior Color':
          data.interiorColor = val
          break
        case 'Plant Country':
          data.plantCountry = val
          break
        case 'Plant State':
          data.plantState = val
          break
        case 'Plant City':
          data.plantCity = val
          break
        // Add more mappings as needed
        default:
          // Optionally, collect unmapped fields for future mapping
          break
      }
    })
    return data
  }

  function identifyDataGaps(data: VehicleDataDraft): DataGap[] {
    const gaps: DataGap[] = []
    if (!data.mileage) {
      gaps.push({
        field: 'mileage',
        required: true,
        prompt: 'What is the current mileage of your vehicle?',
        validationRules: [
          { type: 'required', message: 'Mileage is required for accurate valuation' },
          { type: 'min', value: 0, message: 'Mileage cannot be negative' },
          { type: 'max', value: 999999, message: 'Please enter a valid mileage' }
        ]
      })
    }
    if (!data.zip) {
      gaps.push({
        field: 'zip',
        required: true,
        prompt: 'What is your ZIP code? (This helps us find local market comparisons)',
        validationRules: [
          { type: 'required', message: 'ZIP code is required' },
          { type: 'pattern', value: /^\d{5}(-\d{4})?$/, message: 'Please enter a valid ZIP code' }
        ]
      })
    }
    if (!data.condition) {
      gaps.push({
        field: 'condition',
        required: true,
        prompt: 'What is the overall condition of your vehicle?',
        validationRules: [
          { type: 'required', message: 'Vehicle condition is required' }
        ]
      })
    }
    if (!data.titleStatus) {
      gaps.push({
        field: 'titleStatus',
        required: true,
        defaultValue: TitleStatus.CLEAN,
        prompt: 'What is the title status of your vehicle?',
        validationRules: [
          { type: 'required', message: 'Title status is required' }
        ]
      })
    }
    if (!data.exteriorColor) {
      gaps.push({
        field: 'exteriorColor',
        required: false,
        prompt: 'What is the exterior color of your vehicle? (Optional)',
        validationRules: []
      })
    }
    return gaps
  }

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setVehicleData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateCurrentInput = (): boolean => {
    const currentGap = dataGaps[currentGapIndex]
    if (!currentGap) return true

    const value = vehicleData[currentGap.field as keyof VehicleDataDraft]
    const newErrors: Record<string, string> = {}

    for (const rule of currentGap.validationRules || []) {
      switch (rule.type) {
        case 'required':
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            newErrors[currentGap.field] = rule.message
          }
          break
        case 'min':
          if (typeof value === 'number' && typeof rule.value === 'number' && value < rule.value) {
            newErrors[currentGap.field] = rule.message
          }
          break
        case 'max':
          if (typeof value === 'number' && typeof rule.value === 'number' && value > rule.value) {
            newErrors[currentGap.field] = rule.message
          }
          break
        case 'pattern':
          if (typeof value === 'string' && rule.value instanceof RegExp && !rule.value.test(value)) {
            newErrors[currentGap.field] = rule.message
          }
          break
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (!validateCurrentInput()) {
      return
    }

    if (currentGapIndex < dataGaps.length - 1) {
      setCurrentGapIndex(prev => prev + 1)
    } else {
      setIsCollecting(false)
      generateValuation()
    }
  }

  const handlePrevious = () => {
    if (currentGapIndex > 0) {
      setCurrentGapIndex(prev => prev - 1)
    }
  }

  const generateValuation = async () => {
    setIsGeneratingValuation(true)
    try {
      // Always build a complete VehicleData object from decoded VIN and user input
      const mileageInput = vehicleData.mileage as number | string | undefined
      const zipInput = vehicleData.zip as string | undefined
      const payload: VehicleData = {
        vin: assertDefined(vehicleData.vin as string | undefined, "vin"),
        year: assertDefined(vehicleData.year as number | undefined, "year"),
        make: assertDefined(vehicleData.make as string | undefined, "make"),
        model: assertDefined(vehicleData.model as string | undefined, "model"),
        mileage: Number(assertDefined(mileageInput, "mileage")),
        zip: assertDefined(zipInput, "zip"),
        condition: assertDefined(vehicleData.condition as string | undefined, "condition"),
        titleStatus: assertDefined(vehicleData.titleStatus as string | undefined, "titleStatus"),
        trim: vehicleData.trim ?? undefined,
        color: vehicleData.color ?? vehicleData.exteriorColor ?? undefined,
        fuelType: vehicleData.fuelType as string | undefined,
        transmission: vehicleData.transmission as string | undefined,
        drivetrain: (vehicleData.drivetrain as string | undefined) ?? (vehicleData['driveType'] as string | undefined),
      }
      // Strict validation: all required fields must be present, non-empty, and valid
      const missing = requiredFields.filter((f: StringKeys<VehicleData>) => {
        const v = payload[f];
        if (v === undefined || v === null) return true;
        if (typeof v === 'string' && v.trim() === '') return true;
        if (f === 'mileage' && (typeof v !== 'number' || isNaN(v) || v <= 0)) return true;
        if (f === 'year' && (typeof v !== 'number' || isNaN(v) || v < 1900)) return true;
        return false;
      });
      // Log the full vehicleData for debugging
      // eslint-disable-next-line no-console
      console.log('[Valuation Submission] vehicleData:', payload)
      if (missing.length > 0) {
        alert('Missing or invalid required fields: ' + missing.join(', '))
        setIsGeneratingValuation(false)
        return
      }
      const result = await valuateVehicle(payload)
      if (result) {
        // Normalize the result to ensure camelCase and required fields
        const normalizeResult = (val: any): ValuationResult => ({
          ...val,
          estimatedValue: val.estimatedValue ?? val.estimated_value ?? val.finalValue ?? null,
          priceRange: val.priceRange ?? val.range ?? { low: null, high: null },
          confidence: val.confidence ?? val.confidenceScore ?? null,
          timestamp: val.timestamp ?? val.createdAt ?? Date.now(),
        })
        onComplete(normalizeResult(result))
      } else {
        console.error('Valuation failed')
      }
    } catch (error) {
      console.error('Valuation error:', error)
    } finally {
      setIsGeneratingValuation(false)
    }
  }

  const renderCurrentInput = () => {
    const currentGap = dataGaps[currentGapIndex]
    if (!currentGap) return null

    const value = vehicleData[currentGap.field as keyof VehicleDataDraft]
    const error = errors[currentGap.field]

    switch (currentGap.field) {
      case 'mileage':
        return (
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Enter mileage (e.g., 45000)"
              value={String(value ?? '')}
              onChange={(e) => handleInputChange(currentGap.field, parseInt(e.target.value) || 0)}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        );

      case 'zip':
        return (
          <div className="space-y-2">
            <Input
              placeholder="Enter ZIP code (e.g., 90210)"
              value={String(value ?? '')}
              onChange={(e) => handleInputChange(currentGap.field, e.target.value)}
              className={error ? 'border-red-500' : ''}
              maxLength={10}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        );

      case 'condition':
        return (
          <div className="space-y-2">
            <select
              value={String(value ?? '')}
              onChange={(e) => handleInputChange(currentGap.field, e.target.value)}
              className={`w-full p-3 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select condition</option>
              <option value={VehicleCondition.EXCELLENT}>Excellent - Like new, no visible wear</option>
              <option value={VehicleCondition.VERY_GOOD}>Very Good - Minor wear, well maintained</option>
              <option value={VehicleCondition.GOOD}>Good - Normal wear, good condition</option>
              <option value={VehicleCondition.FAIR}>Fair - Some wear, needs minor repairs</option>
              <option value={VehicleCondition.POOR}>Poor - Significant wear, needs major repairs</option>
            </select>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        );

      case 'titleStatus':
        return (
          <div className="space-y-2">
            <select
              value={String(value ?? TitleStatus.CLEAN)}
              onChange={(e) => handleInputChange(currentGap.field, e.target.value)}
              className={`w-full p-3 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value={TitleStatus.CLEAN}>Clean Title</option>
              <option value={TitleStatus.SALVAGE}>Salvage Title</option>
              <option value={TitleStatus.REBUILT}>Rebuilt Title</option>
              <option value={TitleStatus.FLOOD}>Flood Damage</option>
              <option value={TitleStatus.LEMON}>Lemon Title</option>
              <option value={TitleStatus.MANUFACTURER_BUYBACK}>Manufacturer Buyback</option>
            </select>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        );

      case 'exteriorColor':
        return (
          <div className="space-y-2">
            <Input
              placeholder="Enter exterior color (e.g., White, Black, Silver)"
              value={String(value ?? '')}
              onChange={(e) => handleInputChange(currentGap.field, e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        );

      default:
        return (
          <Input
            placeholder={`Enter ${currentGap.field}`}
            value={String(value ?? '')}
            onChange={(e) => handleInputChange(currentGap.field, e.target.value)}
            className={error ? 'border-red-500' : ''}
          />
        )
    }
  }

  if (isGeneratingValuation) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold mb-2">Generating Your Valuation</h3>
        <p className="text-gray-600">
          We're analyzing market data and vehicle history to provide you with the most accurate valuation...
        </p>
      </div>
    )
  }

  if (!isCollecting) {
    // Check for missing required fields
    const missing = requiredFields.filter(f => !vehicleData[f])
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <h3 className="text-lg font-semibold mb-4">Data Collection Complete</h3>
        <p className="text-gray-600 mb-4">
          {missing.length === 0
            ? 'We have all the information needed to generate your valuation.'
            : <span className="text-red-600">Missing required fields: {missing.join(', ')}</span>
          }
        </p>
        <Button onClick={generateValuation} className="w-full" disabled={missing.length > 0}>
          Generate Valuation Report
        </Button>
      </div>
    )
  }

  const currentGap = dataGaps[currentGapIndex]
  const progress = ((currentGapIndex) / dataGaps.length) * 100

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Step {currentGapIndex + 1} of {dataGaps.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Current question */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">{currentGap?.prompt}</h3>
        {renderCurrentInput()}
        
        {!currentGap?.required && (
          <p className="text-sm text-gray-500 mt-2">
            This field is optional but helps improve valuation accuracy.
          </p>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentGapIndex === 0}
        >
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={currentGap?.required && !vehicleData[currentGap.field as keyof VehicleDataDraft]}
        >
          {currentGapIndex === dataGaps.length - 1 ? 'Complete' : 'Next'}
        </Button>
      </div>

      {/* Vehicle summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h4 className="font-medium mb-2">Vehicle Information</h4>
        <p className="text-sm text-gray-600">
          {vehicleData.year} {vehicleData.make} {vehicleData.model}
          {vehicleData.trim && ` ${vehicleData.trim}`}
        </p>
        {vehicleData.mileage && (
          <p className="text-sm text-gray-600">
            Mileage: {vehicleData.mileage.toLocaleString()} miles
          </p>
        )}
      </div>
    </div>
  )
}
