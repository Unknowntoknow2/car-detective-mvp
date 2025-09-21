import logger from '../utils/logger.js';
export async function valuateVehicle(vehicleData) {
    let valuation = null;
    try {
        // Google-level: Explicitly check all required fields and throw detailed errors
        const missingFields = [];
        if (!vehicleData.vin)
            missingFields.push('VIN');
        if (!vehicleData.year)
            missingFields.push('Year');
        if (!vehicleData.make)
            missingFields.push('Make');
        if (!vehicleData.model)
            missingFields.push('Model');
        if (vehicleData.mileage === undefined || vehicleData.mileage === null)
            missingFields.push('Mileage');
        if (!vehicleData.condition)
            missingFields.push('Condition');
        if (!vehicleData.titleStatus)
            missingFields.push('Title Status');
        if (missingFields.length > 0) {
            const msg = `Missing required field(s): ${missingFields.join(', ')}`;
            logger.error('Valuation error:', msg);
            throw new Error(msg);
        }
        // Base valuation logic
        const currentYear = new Date().getFullYear();
        const vehicleAge = currentYear - (vehicleData.year || currentYear);
        let baseValue = 30000;
        const depreciationRate = 0.15;
        baseValue = baseValue * Math.pow(1 - depreciationRate, vehicleAge);
        // Mileage adjustment
        const averageMilesPerYear = 12000;
        const expectedMileage = vehicleAge * averageMilesPerYear;
        const actualMileage = (vehicleData.mileage ?? expectedMileage);
        const mileageVariance = actualMileage - expectedMileage;
        const mileageAdjustment = mileageVariance * -0.10;
        // Normalize condition
        let normalizedCondition = 'good';
        if (typeof vehicleData.condition === 'string') {
            const c = vehicleData.condition.toLowerCase();
            if (c.includes('excellent') || c.includes('very good'))
                normalizedCondition = 'excellent';
            else if (c.includes('good'))
                normalizedCondition = 'good';
            else if (c.includes('fair'))
                normalizedCondition = 'fair';
            else if (c.includes('poor'))
                normalizedCondition = 'poor';
            else
                logger.warn?.(`Unknown condition: ${vehicleData.condition}`);
        }
        const conditionMultipliers = {
            excellent: 1.1,
            'very good': 1.05,
            good: 1.0,
            fair: 0.85,
            poor: 0.7
        };
        const conditionMultiplier = conditionMultipliers[normalizedCondition] ?? 1.0;
        const conditionAdjustment = baseValue * (conditionMultiplier - 1);
        // Title status adjustment
        let titleAdj = 0;
        let titleNote = '';
        if (typeof vehicleData.titleStatus === 'string') {
            const t = vehicleData.titleStatus.toLowerCase();
            if (t.includes('salvage') || t.includes('rebuilt')) {
                titleAdj = -0.25 * baseValue;
                titleNote = ' (reduced for salvage/rebuilt title)';
            }
            else if (t.includes('clean')) {
                titleAdj = 0;
                titleNote = ' (clean title)';
            }
            else {
                logger.warn?.(`Unknown title status: ${vehicleData.titleStatus}`);
            }
        }
        // Market factors (simplified)
        const marketFactors = baseValue * 0.05;
        // Calculate final value
        const finalValue = Math.max(0, baseValue + mileageAdjustment + conditionAdjustment + titleAdj + marketFactors);
        // Confidence calculation
        let confidence = 0.5;
        if (vehicleData.year)
            confidence += 0.2;
        if (vehicleData.make && vehicleData.model)
            confidence += 0.2;
        if (vehicleData.mileage)
            confidence += 0.1;
        if (vehicleData.condition)
            confidence += 0.1;
        confidence = Math.min(1.0, confidence);
        // Build canonical ValuationResult
        valuation = {
            estimatedValue: Math.round(finalValue),
            confidence: Math.round(confidence * 100) / 100,
            priceRange: {
                low: Math.round(finalValue * 0.9),
                high: Math.round(finalValue * 1.1)
            },
            explanation: [
                `Vehicle age: ${vehicleAge} years`,
                `Mileage: ${actualMileage.toLocaleString()} miles`,
                `Condition: ${normalizedCondition}`,
                `Title status: ${vehicleData.titleStatus || 'unknown'}${titleNote}`,
                `Market adjustment applied`
            ].join('; '),
            adjustments: [
                { factor: 'Mileage', percentage: Math.round((mileageAdjustment / baseValue) * 1000) / 10 },
                { factor: 'Condition', percentage: Math.round((conditionAdjustment / baseValue) * 1000) / 10 },
                { factor: 'Title', percentage: Math.round((titleAdj / baseValue) * 1000) / 10 }
            ],
            marketFactors: [
                { factor: 'Market', impact: 0.05, description: '5% market uplift' }
            ],
            vehicleData
        };
    }
    catch (error) {
        logger.error('Valuation error:', error);
        valuation = {
            estimatedValue: 0,
            confidence: 0,
            priceRange: { low: 0, high: 0 },
            explanation: (error instanceof Error ? error.message : 'Valuation calculation failed'),
            adjustments: [],
            marketFactors: [],
            vehicleData
        };
    }
    // 🛡️ Guardrail: Never silently return 0/null
    if (!valuation ||
        valuation.estimatedValue === 0 ||
        valuation.estimatedValue === null ||
        valuation.estimatedValue === undefined) {
        throw new Error("ValuationEngineError: Invalid valuation (zero/null) result");
    }
    return valuation;
}
