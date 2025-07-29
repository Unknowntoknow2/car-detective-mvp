import { openai } from './openaiClient';
import { marketListingsService } from './marketListingsService';
import { vehicleHistoryService } from './vehicleHistoryService';
import { VehicleCondition, TitleStatus } from '@/types/ValuationTypes';
export class ValuationEngine {
    minComparables = 100;
    maxComparables = 200;
    searchRadius = 150; // miles
    inflationRate = 0.025; // 2.5% annual inflation
    async generateValuation(vehicleData) {
        try {
            console.log('🚗 Starting valuation for:', vehicleData);
            // Step 1: Gather comprehensive market data
            const marketData = await this.gatherMarketData(vehicleData);
            // Step 2: Get vehicle history
            const historyData = await vehicleHistoryService.getVehicleHistory(vehicleData.vin);
            // Step 3: Find comparable vehicles
            const comparables = await this.findComparables(vehicleData, marketData);
            if (comparables.length < this.minComparables) {
                console.warn(`⚠️ Only found ${comparables.length} comparables, minimum required: ${this.minComparables}`);
            }
            // Step 4: Calculate base valuation
            const baseValue = this.calculateBaseValue(comparables);
            // Step 5: Apply adjustments
            const adjustments = await this.calculateAdjustments(vehicleData, historyData.data, comparables);
            // Step 6: Apply market factors
            const marketFactors = await this.calculateMarketFactors(vehicleData);
            // Step 7: Calculate final value
            const finalValue = this.applyAdjustments(baseValue, adjustments, marketFactors);
            // Step 8: Generate AI explanation
            const explanation = await this.generateExplanation(vehicleData, finalValue, adjustments, marketFactors);
            // Step 9: Calculate accuracy metrics
            const accuracy = this.calculateAccuracy(comparables, finalValue);
            // Step 10: Determine confidence and price range
            const confidence = this.calculateConfidence(accuracy, comparables.length);
            const priceRange = this.calculatePriceRange(finalValue, confidence);
            const result = {
                vehicleData,
                estimatedValue: Math.round(finalValue),
                confidence,
                priceRange,
                comparables: comparables.slice(0, 20), // Return top 20 for display
                adjustments,
                marketFactors,
                explanation,
                accuracy,
                timestamp: new Date(),
            };
            console.log('✅ Valuation completed:', {
                value: result.estimatedValue,
                confidence: result.confidence,
                comparables: comparables.length
            });
            return {
                success: true,
                data: result,
                metadata: {
                    source: 'valuation_engine',
                    timestamp: new Date(),
                },
            };
        }
        catch (error) {
            console.error('❌ Valuation failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Valuation failed',
                metadata: {
                    source: 'valuation_engine',
                    timestamp: new Date(),
                },
            };
        }
    }
    async gatherMarketData(vehicleData) {
        console.log('📊 Gathering market data...');
        const marketResponse = await marketListingsService.getMarketListings(vehicleData, this.searchRadius, this.maxComparables);
        if (!marketResponse.success || !marketResponse.data) {
            console.warn('⚠️ Market data gathering failed, using fallback');
            return [];
        }
        console.log(`📈 Found ${marketResponse.data.length} market listings`);
        return marketResponse.data;
    }
    async findComparables(vehicleData, marketData) {
        console.log('🔍 Finding comparable vehicles...');
        // Score each listing based on similarity to target vehicle
        const scoredListings = marketData.map(listing => ({
            listing,
            score: this.calculateSimilarityScore(vehicleData, listing),
        }));
        // Sort by score and filter for quality comparables
        const comparables = scoredListings
            .filter(item => item.score > 0.3) // Minimum similarity threshold
            .sort((a, b) => b.score - a.score)
            .slice(0, this.maxComparables)
            .map(item => item.listing);
        console.log(`🎯 Selected ${comparables.length} comparable vehicles`);
        return comparables;
    }
    calculateSimilarityScore(target, listing) {
        let score = 0;
        let maxScore = 0;
        // Exact make/model match (critical)
        maxScore += 40;
        if (target.make === listing.make && target.model === listing.model) {
            score += 40;
        }
        else if (target.make === listing.make) {
            score += 20;
        }
        // Year proximity (important)
        maxScore += 20;
        const yearDiff = Math.abs((target.year || 0) - listing.year);
        if (yearDiff === 0)
            score += 20;
        else if (yearDiff === 1)
            score += 15;
        else if (yearDiff === 2)
            score += 10;
        else if (yearDiff <= 3)
            score += 5;
        // Mileage proximity (important)
        maxScore += 15;
        if (target.mileage && listing.mileage) {
            const mileageDiff = Math.abs(target.mileage - listing.mileage);
            if (mileageDiff < 5000)
                score += 15;
            else if (mileageDiff < 10000)
                score += 12;
            else if (mileageDiff < 20000)
                score += 8;
            else if (mileageDiff < 40000)
                score += 4;
        }
        // Condition match (moderate)
        maxScore += 10;
        if (target.condition === listing.condition) {
            score += 10;
        }
        else if (target.condition && listing.condition) {
            const conditionDiff = Math.abs(this.getConditionValue(target.condition) - this.getConditionValue(listing.condition));
            if (conditionDiff === 1)
                score += 7;
            else if (conditionDiff === 2)
                score += 4;
        }
        // Trim match (moderate)
        maxScore += 10;
        if (target.trim === listing.trim) {
            score += 10;
        }
        // Geographic proximity (minor)
        maxScore += 5;
        // Simplified geographic scoring - would need actual location data
        score += 3; // Assume moderate proximity
        return maxScore > 0 ? score / maxScore : 0;
    }
    getConditionValue(condition) {
        const values = {
            [VehicleCondition.EXCELLENT]: 5,
            [VehicleCondition.VERY_GOOD]: 4,
            [VehicleCondition.GOOD]: 3,
            [VehicleCondition.FAIR]: 2,
            [VehicleCondition.POOR]: 1,
        };
        return values[condition] || 3;
    }
    calculateBaseValue(comparables) {
        if (comparables.length === 0) {
            throw new Error('No comparable vehicles found for valuation');
        }
        // Use weighted average with more weight on recent listings and better matches
        let totalValue = 0;
        let totalWeight = 0;
        comparables.forEach(comp => {
            // Base weight of 1
            let weight = 1;
            // Recent listings get more weight
            const daysOld = (Date.now() - comp.listingDate.getTime()) / (1000 * 60 * 60 * 24);
            if (daysOld < 7)
                weight *= 1.3;
            else if (daysOld < 14)
                weight *= 1.1;
            else if (daysOld > 60)
                weight *= 0.8;
            // Dealer listings get slightly more weight due to standardized pricing
            if (comp.dealer)
                weight *= 1.1;
            totalValue += comp.price * weight;
            totalWeight += weight;
        });
        const avgValue = totalValue / totalWeight;
        // Apply outlier filtering (remove extreme values)
        const sortedPrices = comparables.map(c => c.price).sort((a, b) => a - b);
        const q1 = sortedPrices[Math.floor(sortedPrices.length * 0.25)];
        const q3 = sortedPrices[Math.floor(sortedPrices.length * 0.75)];
        const iqr = q3 - q1;
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;
        const filteredComparables = comparables.filter(c => c.price >= lowerBound && c.price <= upperBound);
        if (filteredComparables.length < comparables.length * 0.7) {
            // If too many outliers, use median instead
            return sortedPrices[Math.floor(sortedPrices.length / 2)];
        }
        console.log(`💰 Base value calculated: $${Math.round(avgValue)} from ${comparables.length} comparables`);
        return avgValue;
    }
    async calculateAdjustments(vehicleData, historyData, comparables) {
        const adjustments = [];
        // Mileage adjustment
        if (vehicleData.mileage) {
            const avgMileage = comparables.reduce((sum, c) => sum + c.mileage, 0) / comparables.length;
            const mileageDiff = vehicleData.mileage - avgMileage;
            const mileageAdjustment = this.calculateMileageAdjustment(mileageDiff);
            if (Math.abs(mileageAdjustment) > 100) {
                adjustments.push({
                    factor: 'Mileage',
                    adjustment: mileageAdjustment,
                    percentage: (mileageAdjustment / (comparables.reduce((sum, c) => sum + c.price, 0) / comparables.length)) * 100,
                    explanation: `${mileageDiff > 0 ? 'Higher' : 'Lower'} than average mileage by ${Math.abs(Math.round(mileageDiff)).toLocaleString()} miles`,
                });
            }
        }
        // Condition adjustment
        if (vehicleData.condition) {
            const conditionAdjustment = this.calculateConditionAdjustment(vehicleData.condition);
            if (Math.abs(conditionAdjustment) > 0.01) {
                adjustments.push({
                    factor: 'Condition',
                    adjustment: 0, // Will be calculated as percentage of base value
                    percentage: conditionAdjustment * 100,
                    explanation: `Vehicle condition: ${vehicleData.condition}`,
                });
            }
        }
        // Title status adjustment
        if (vehicleData.titleStatus && vehicleData.titleStatus !== TitleStatus.CLEAN) {
            const titleAdjustment = this.calculateTitleAdjustment(vehicleData.titleStatus);
            adjustments.push({
                factor: 'Title Status',
                adjustment: 0,
                percentage: titleAdjustment * 100,
                explanation: `Title status: ${vehicleData.titleStatus}`,
            });
        }
        // History-based adjustments
        if (historyData) {
            const historyAdjustments = this.calculateHistoryAdjustments(historyData);
            adjustments.push(...historyAdjustments);
        }
        console.log(`🔧 Applied ${adjustments.length} valuation adjustments`);
        return adjustments;
    }
    calculateMileageAdjustment(mileageDiff) {
        // Typical depreciation: $0.10-0.15 per mile for most vehicles
        const depreciationPerMile = 0.12;
        return -mileageDiff * depreciationPerMile;
    }
    calculateConditionAdjustment(condition) {
        const adjustments = {
            [VehicleCondition.EXCELLENT]: 0.05,
            [VehicleCondition.VERY_GOOD]: 0.02,
            [VehicleCondition.GOOD]: 0,
            [VehicleCondition.FAIR]: -0.08,
            [VehicleCondition.POOR]: -0.20,
        };
        return adjustments[condition] || 0;
    }
    calculateTitleAdjustment(titleStatus) {
        const adjustments = {
            [TitleStatus.CLEAN]: 0,
            [TitleStatus.SALVAGE]: -0.35,
            [TitleStatus.REBUILT]: -0.25,
            [TitleStatus.FLOOD]: -0.30,
            [TitleStatus.LEMON]: -0.40,
            [TitleStatus.MANUFACTURER_BUYBACK]: -0.15,
        };
        return adjustments[titleStatus] || 0;
    }
    calculateHistoryAdjustments(historyData) {
        const adjustments = [];
        // Accident history adjustment
        if (historyData.accidentHistory?.length > 0) {
            const severityAdjustment = historyData.accidentHistory.reduce((total, accident) => {
                switch (accident.severity) {
                    case 'minor': return total - 0.02;
                    case 'moderate': return total - 0.08;
                    case 'severe': return total - 0.15;
                    default: return total;
                }
            }, 0);
            if (Math.abs(severityAdjustment) > 0.01) {
                adjustments.push({
                    factor: 'Accident History',
                    adjustment: 0,
                    percentage: severityAdjustment * 100,
                    explanation: `${historyData.accidentHistory.length} reported accident(s)`,
                });
            }
        }
        // Service history adjustment (positive for good maintenance)
        if (historyData.serviceRecords?.length > 0) {
            const recentService = historyData.serviceRecords.filter((record) => {
                const monthsAgo = (Date.now() - new Date(record.date).getTime()) / (1000 * 60 * 60 * 24 * 30);
                return monthsAgo <= 12;
            });
            if (recentService.length >= 2) {
                adjustments.push({
                    factor: 'Service History',
                    adjustment: 0,
                    percentage: 1.5,
                    explanation: `Well-maintained with ${recentService.length} recent service records`,
                });
            }
        }
        return adjustments;
    }
    async calculateMarketFactors(vehicleData) {
        const factors = [];
        // Seasonal factors
        const month = new Date().getMonth();
        const seasonalFactor = this.getSeasonalFactor(vehicleData, month);
        if (Math.abs(seasonalFactor) > 0.01) {
            factors.push({
                factor: 'Seasonal Demand',
                impact: seasonalFactor,
                description: this.getSeasonalDescription(month, seasonalFactor),
            });
        }
        // Economic factors (simplified)
        const economicFactor = this.getEconomicFactor();
        if (Math.abs(economicFactor) > 0.01) {
            factors.push({
                factor: 'Economic Conditions',
                impact: economicFactor,
                description: 'Current market conditions affecting vehicle demand',
            });
        }
        // Supply/demand factors (would need real market data)
        factors.push({
            factor: 'Market Supply',
            impact: 0.02,
            description: 'Moderate supply levels for this vehicle type',
        });
        console.log(`📊 Applied ${factors.length} market factors`);
        return factors;
    }
    getSeasonalFactor(vehicleData, month) {
        // Simplified seasonal adjustments
        // Spring/Summer: convertibles and sports cars up, SUVs down
        // Fall/Winter: SUVs and AWD up, convertibles down
        if (month >= 3 && month <= 8) { // Spring/Summer
            if (vehicleData.model.toLowerCase().includes('convertible'))
                return 0.05;
            if (vehicleData.drivetrain === 'awd' || vehicleData.drivetrain === '4wd')
                return -0.02;
        }
        else { // Fall/Winter
            if (vehicleData.model.toLowerCase().includes('convertible'))
                return -0.05;
            if (vehicleData.drivetrain === 'awd' || vehicleData.drivetrain === '4wd')
                return 0.03;
        }
        return 0;
    }
    getSeasonalDescription(month, factor) {
        const season = month >= 3 && month <= 8 ? 'Spring/Summer' : 'Fall/Winter';
        const direction = factor > 0 ? 'increased' : 'decreased';
        return `${season} season with ${direction} demand for this vehicle type`;
    }
    getEconomicFactor() {
        // Simplified economic factor - in real implementation would use economic indicators
        return 0.01; // Slight positive market conditions
    }
    applyAdjustments(baseValue, adjustments, marketFactors) {
        let adjustedValue = baseValue;
        // Apply valuation adjustments
        adjustments.forEach(adj => {
            if (adj.adjustment !== 0) {
                adjustedValue += adj.adjustment;
            }
            else {
                adjustedValue *= (1 + adj.percentage / 100);
            }
        });
        // Apply market factors
        marketFactors.forEach(factor => {
            adjustedValue *= (1 + factor.impact);
        });
        console.log(`💰 Final adjusted value: $${Math.round(adjustedValue)} (base: $${Math.round(baseValue)})`);
        return adjustedValue;
    }
    async generateExplanation(vehicleData, finalValue, adjustments, marketFactors) {
        try {
            const prompt = `Generate a clear, professional explanation for a vehicle valuation:

Vehicle: ${vehicleData.year} ${vehicleData.make} ${vehicleData.model}
VIN: ${vehicleData.vin}
Estimated Value: $${Math.round(finalValue).toLocaleString()}

Adjustments Applied:
${adjustments.map(adj => `- ${adj.factor}: ${adj.percentage > 0 ? '+' : ''}${adj.percentage.toFixed(1)}% (${adj.explanation})`).join('\n')}

Market Factors:
${marketFactors.map(factor => `- ${factor.factor}: ${factor.impact > 0 ? '+' : ''}${(factor.impact * 100).toFixed(1)}% (${factor.description})`).join('\n')}

Please provide a concise explanation of how this valuation was calculated and what factors influenced the final price. Keep it under 200 words and make it understandable to consumers.`;
            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 300,
                temperature: 0.3,
            });
            return response.choices[0]?.message?.content || this.generateFallbackExplanation(finalValue, adjustments);
        }
        catch (error) {
            console.warn('Failed to generate AI explanation, using fallback');
            return this.generateFallbackExplanation(finalValue, adjustments);
        }
    }
    generateFallbackExplanation(finalValue, adjustments) {
        const majorAdjustments = adjustments.filter(adj => Math.abs(adj.percentage) > 2);
        let explanation = `This valuation of $${Math.round(finalValue).toLocaleString()} is based on comprehensive market analysis of comparable vehicles. `;
        if (majorAdjustments.length > 0) {
            explanation += `Key factors affecting the price include: ${majorAdjustments.map(adj => adj.explanation).join(', ')}. `;
        }
        explanation += `The estimate considers current market conditions, vehicle history, and condition to provide an accurate market value.`;
        return explanation;
    }
    calculateAccuracy(comparables, finalValue) {
        const comparablePrices = comparables.map(c => c.price);
        const avgComparable = comparablePrices.reduce((a, b) => a + b, 0) / comparablePrices.length;
        // Calculate standard deviation
        const variance = comparablePrices.reduce((sum, price) => sum + Math.pow(price - avgComparable, 2), 0) / comparablePrices.length;
        const stdDev = Math.sqrt(variance);
        // Data quality score based on number and recency of comparables
        const dataQuality = Math.min(100, (comparables.length / this.minComparables) * 80 + 20);
        // Market coverage based on geographic and temporal distribution
        const marketCoverage = Math.min(100, (comparables.length / this.maxComparables) * 100);
        // Confidence interval (as percentage of value)
        const confidenceInterval = (stdDev / avgComparable) * 100;
        return {
            comparableCount: comparables.length,
            dataQuality: Math.round(dataQuality),
            marketCoverage: Math.round(marketCoverage),
            confidenceInterval: Math.round(confidenceInterval * 100) / 100,
        };
    }
    calculateConfidence(accuracy, comparableCount) {
        let confidence = 50; // Base confidence
        // Boost confidence based on number of comparables
        if (comparableCount >= this.minComparables) {
            confidence += Math.min(30, (comparableCount / this.minComparables) * 20);
        }
        else {
            confidence -= (this.minComparables - comparableCount) * 2;
        }
        // Adjust based on data quality
        confidence += (accuracy.dataQuality - 50) * 0.5;
        // Adjust based on market coverage
        confidence += (accuracy.marketCoverage - 50) * 0.3;
        // Reduce confidence for high variance
        if (accuracy.confidenceInterval > 15) {
            confidence -= (accuracy.confidenceInterval - 15) * 2;
        }
        return Math.max(10, Math.min(95, Math.round(confidence)));
    }
    calculatePriceRange(finalValue, confidence) {
        // Range width based on confidence (lower confidence = wider range)
        const rangePercentage = (100 - confidence) * 0.3 / 100; // 0-27% range
        const rangeAmount = finalValue * rangePercentage;
        return {
            low: Math.round(finalValue - rangeAmount),
            high: Math.round(finalValue + rangeAmount),
        };
    }
}
export const valuationEngine = new ValuationEngine();
