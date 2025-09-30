# AIN Listings & Data Fetch Audit Report
Scanned: /workspaces/car-detective-mvp
When: 2025-09-27T05:37:20.256Z
Total files: 732

## Summary Signals
- make: 885
- model: 862
- year: 870
- price: 528
- mileage: 869
- vin: 1391
- photos: 441
- dealer: 302
- zip: 212
- url: 232
- fetch: 30
- retry: 68
- openai: 55
- schema: 65
- dedupe: 21
- storage: 772
- valuation: 1169
- env: 50

## Files (top signals)
### /workspaces/car-detective-mvp/src/App.routes.tsx  (LOC 181)
functions: GetValuationPage, ValuationPage, routes
- **dealer** (3)
  - L72: path: "dealer-dashboard",
  - L158: path: "login-dealer",
  - L162: path: "dealer-signup",
- **valuation** (7)
  - L22: import PlateValuationPage from './pages/valuation/plate/PlateValuationPage';
  - L48: path: "get-valuation",
  - L56: path: "valuation",
  - L102: path: "valuation-result/:id",
  - L110: path: "valuation/followup",

### /workspaces/car-detective-mvp/src/__archive__/auction-utils.ts  (LOC 21)
exports: ArchivedAuctionResult
- **price** (1)
  - L13: price: string;
- **vin** (1)
  - L11: vin: string;
- **storage** (1)
  - L3: // These auction utilities have been centralized into getEnrichedVehicleData.ts

### /workspaces/car-detective-mvp/src/__tests__/acceptance/HomeAndPremium.test.tsx  (LOC 112)
functions: queryClient
- **vin** (2)
  - L63: if (name === 'vin') {
  - L64: return 'testVin'; // Example VIN value
- **retry** (1)
  - L28: retry: 1,

### /workspaces/car-detective-mvp/src/__tests__/followUpFormFixTests.test.ts  (LOC 182)
functions: invalidConditions, result, validData, result, invalidData, result, constraintError, classified, fkError, classified, networkError, classified, unsafeData, safeData, incompleteData, validation, completeData, summary, incompleteData, summary, invalidFormData, validation, undefinedVehicleData, safeData
- **make** (4)
  - L101: make: null,
  - L109: expect(safeData.make).toBe('Unknown');
  - L117: const incompleteData = { make: 'Ford' }; // Missing model and year
  - L178: expect(safeData.make).toBe('Unknown');
- **model** (5)
  - L102: model: undefined,
  - L110: expect(safeData.model).toBe('Unknown');
  - L117: const incompleteData = { make: 'Ford' }; // Missing model and year
  - L121: expect(validation.missing).toContain('model');
  - L179: expect(safeData.model).toBe('Unknown');
- **year** (4)
  - L103: year: 'invalid',
  - L111: expect(safeData.year).toBe(new Date().getFullYear());
  - L117: const incompleteData = { make: 'Ford' }; // Missing model and year
  - L122: expect(validation.missing).toContain('year');
- **mileage** (6)
  - L45: mileage: 50000,
  - L57: mileage: 0,
  - L64: expect(result.errors).toContain('Mileage must be greater than 0');
  - L130: mileage: 50000,
  - L143: mileage: 0, // Invalid
- **vin** (3)
  - L104: vin: null
  - L112: expect(safeData.vin).toBe('');
  - L159: vin: 'TEST123',
- **zip** (1)
  - L63: expect(result.errors).toContain('ZIP code is required');

### /workspaces/car-detective-mvp/src/__tests__/generateValuationPdf.test.ts  (LOC 93)
functions: pdfBuffer, pdfBuffer
- **make** (2)
  - L31: make: "Toyota",
  - L71: make: "Honda",
- **model** (2)
  - L32: model: "Camry",
  - L72: model: "Civic",
- **year** (2)
  - L33: year: 2020,
  - L73: year: 2019,
- **price** (2)
  - L38: price: 25000,
  - L77: price: 18000,
- **mileage** (4)
  - L35: mileage: 15000,
  - L42: factor: "Mileage",
  - L44: description: "Lower than average mileage",
  - L74: mileage: 20000,
- **vin** (1)
  - L34: vin: "ABC123456DEF78901",

### /workspaces/car-detective-mvp/src/__tests__/rls-access.test.ts  (LOC 188)
functions: USER_A, USER_B, userAClient, userAClient, attemptDownloadPremiumReport, result
- **make** (2)
  - L56: make: "Toyota",
  - L78: make: "Honda",
- **model** (2)
  - L57: model: "Corolla",
  - L79: model: "Civic",
- **year** (2)
  - L58: year: 2019,
  - L80: year: 2020,
- **mileage** (2)
  - L59: mileage: 45000,
  - L81: mileage: 30000,
- **storage** (17)
  - L1: import { supabase } from "@/integrations/supabase/client";
  - L3: // This test suite assumes you have at least two test users set up in your Supabase auth
  - L27: const { data: userAData, error: userAError } = await supabase.auth
  - L39: const { data: userBData, error: userBError } = await supabase.auth
  - L52: const { data: userAValuation, error: userAValuationError } = await supabase
- **valuation** (13)
  - L68: `Failed to create valuation for User A: ${userAValuationError.message}`,
  - L90: `Failed to create valuation for User B: ${userBValuationError.message}`,
  - L98: // Delete User A's valuation
  - L104: // Delete User B's valuation
  - L119: // Try to fetch User A's valuation

### /workspaces/car-detective-mvp/src/agents/marketPriceEstimator.ts  (LOC 120)
exports: estimateMarketPrice
functions: estimateMarketPrice, cleaned, price, prices, count, avg, median, min, max, stdDev, weightedSum, sourceKey, trust, totalWeight, sourceKey, trust, weightedAvg, filteredPrices, filteredCount, finalPrices, finalAvg, confidence, coefficientOfVariation, consistencyScore, avgSourceTrust
- **price** (6)
  - L22: const price = l.price;
  - L23: if (!price || price < 1000 || price > 200000) return false;
  - L31: const prices = cleaned.map((l) => l.price).sort((a, b) => a - b);
  - L74: return sum + l.price * trust;
  - L86: const filteredPrices = prices.filter(price => Math.abs(price - avg) <= 2 * stdDev);
- **valuation** (4)
  - L13: median: null,
  - L39: median: null,
  - L47: const median = count % 2 === 0
  - L113: median: Math.round(median),

### /workspaces/car-detective-mvp/src/agents/marketSearchAgent.ts  (LOC 243)
exports: MarketSearchInput, MarketSearchResult
functions: fetchMarketComps, startTime, listings, processingTime, liveListings, dbListings, exactVinMatches, qualityScore, trust, confidence, notes, metadata, searchMarketListings, liveListings, validatedListings, dbListings, validatedDbListings, validateListing, attemptLiveSearch, fallbackDatabaseSearch, query
- **make** (10)
  - L10: make: string;
  - L90: searchQuery: `${input.year} ${input.make} ${input.model}${input.trim ? ` ${input.trim}` : ''}`,
  - L105: const { make, model, year, zipCode } = input;
  - L107: logger.log('🎯 UNIFIED Market Search Agent - Starting search:', { make, model, year, zipCode });
  - L110: const liveListings = await attemptLiveSearch({ make, model, year, zipCode });
- **model** (10)
  - L11: model: string;
  - L90: searchQuery: `${input.year} ${input.make} ${input.model}${input.trim ? ` ${input.trim}` : ''}`,
  - L105: const { make, model, year, zipCode } = input;
  - L107: logger.log('🎯 UNIFIED Market Search Agent - Starting search:', { make, model, year, zipCode });
  - L110: const liveListings = await attemptLiveSearch({ make, model, year, zipCode });
- **year** (10)
  - L12: year: number;
  - L90: searchQuery: `${input.year} ${input.make} ${input.model}${input.trim ? ` ${input.trim}` : ''}`,
  - L105: const { make, model, year, zipCode } = input;
  - L107: logger.log('🎯 UNIFIED Market Search Agent - Starting search:', { make, model, year, zipCode });
  - L110: const liveListings = await attemptLiveSearch({ make, model, year, zipCode });
- **price** (5)
  - L136: if (!listing.price || listing.price <= 0) {
  - L144: // Price sanity check (between $1,000 and $200,000)
  - L145: if (listing.price < 1000 || listing.price > 200000) {
  - L180: .gt('price', 1000)
  - L199: price: Number(listing.price) || 0,
- **mileage** (4)
  - L14: mileage?: number;
  - L149: // Mileage sanity check if provided
  - L150: if (listing.mileage !== undefined && (listing.mileage < 0 || listing.mileage > 500000)) {
  - L200: mileage: Number(listing.mileage) || undefined,
- **vin** (4)
  - L9: vin?: string;
  - L46: const exactVinMatches = input.vin ? listings.filter(l => l.vin === input.vin).length : 0;
  - L71: if (exactVinMatches > 0) notes.push(`${exactVinMatches} exact VIN matches`);
  - L206: vin: listing.vin || undefined,
- **photos** (1)
  - L221: photos: listing.photos || undefined,
- **dealer** (1)
  - L216: dealerName: listing.dealer_name || undefined,
- **storage** (3)
  - L5: import { supabase } from '@/integrations/supabase/client';
  - L83: searchSources: Array.from(new Set(listings.map(l => l.source))),
  - L173: let query = supabase
- **valuation** (2)
  - L38: logger.log('🎯 Starting market comp search for:', input);
  - L75: notes.push('Consider expanding search criteria or using depreciation-based valuation');

### /workspaces/car-detective-mvp/src/agents/marketSearchHelpers.ts  (LOC 65)
functions: removeDuplicateListings, seen, key, sortListingsByRelevance, aCompleteness, bCompleteness, aConfidence, bConfidence, calculateDataCompleteness, score
- **price** (7)
  - L6: // Remove duplicate listings based on price, mileage, and source similarity
  - L12: // Create a unique key based on price, mileage, and normalized source
  - L13: const key = `${listing.price}-${listing.mileage || 0}-${listing.source?.toLowerCase().replace(/[^a-z]/g, '')}`;
  - L19: logger.log('🗑️ Removed duplicate listing:', { price: listing.price, source: listing.source });
  - L46: // Finally, sort by price (ascending)
- **mileage** (4)
  - L6: // Remove duplicate listings based on price, mileage, and source similarity
  - L12: // Create a unique key based on price, mileage, and normalized source
  - L13: const key = `${listing.price}-${listing.mileage || 0}-${listing.source?.toLowerCase().replace(/[^a-z]/g, '')}`;
  - L56: if (listing.mileage) score += 15;
- **vin** (5)
  - L30: // Prioritize exact VIN matches
  - L31: if (input.vin) {
  - L32: if (a.vin === input.vin && b.vin !== input.vin) return -1;
  - L33: if (b.vin === input.vin && a.vin !== input.vin) return 1;
  - L57: if (listing.vin) score += 20;
- **photos** (1)
  - L58: if (listing.photos && listing.photos.length > 0) score += 10;
- **dealer** (1)
  - L59: if (listing.dealerName) score += 10;
- **dedupe** (1)
  - L12: // Create a unique key based on price, mileage, and normalized source

### /workspaces/car-detective-mvp/src/api/sources/carmax.ts  (LOC 203)
exports: CarMaxSearchQuery, CarMaxListing, CarMaxSource
functions: searchInventory, listings, errorMessage, searchTerms, locationFilter, priceFilter, getSourceStatus, successfulSearches, totalSearches, successRate
- **make** (5)
  - L6: make: string;
  - L27: make: string;
  - L53: message: `Starting CarMax search for ${query.year} ${query.make} ${query.model}`,
  - L114: let searchTerms = `${query.year} ${query.make} ${query.model}`;
  - L151: make: query.make,
- **model** (5)
  - L7: model: string;
  - L28: model: string;
  - L53: message: `Starting CarMax search for ${query.year} ${query.make} ${query.model}`,
  - L114: let searchTerms = `${query.year} ${query.make} ${query.model}`;
  - L152: model: query.model,
- **year** (5)
  - L5: year: number;
  - L26: year: number;
  - L53: message: `Starting CarMax search for ${query.year} ${query.make} ${query.model}`,
  - L114: let searchTerms = `${query.year} ${query.make} ${query.model}`;
  - L150: year: query.year,
- **price** (4)
  - L16: price: number;
  - L130: return `Find listings for a ${searchTerms}${locationFilter}${priceFilter} on site:carmax.com. Return price, VIN, mileage, dealer, link, CPO status.`;
  - L138: .filter(comp => comp.price && parseFloat(comp.price.toString().replace(/[^\d.]/g, '')) > 0)
  - L140: price: parseFloat(comp.price.toString().replace(/[^\d.]/g, '')),
- **mileage** (4)
  - L10: mileage?: number;
  - L18: mileage?: number;
  - L130: return `Find listings for a ${searchTerms}${locationFilter}${priceFilter} on site:carmax.com. Return price, VIN, mileage, dealer, link, CPO status.`;
  - L142: mileage: comp.mileage ? parseInt(comp.mileage.toString().replace(/[^\d]/g, '')) : undefined,
- **vin** (3)
  - L17: vin?: string;
  - L130: return `Find listings for a ${searchTerms}${locationFilter}${priceFilter} on site:carmax.com. Return price, VIN, mileage, dealer, link, CPO status.`;
  - L141: vin: comp.vin,
- **dealer** (3)
  - L19: dealer: string;
  - L130: return `Find listings for a ${searchTerms}${locationFilter}${priceFilter} on site:carmax.com. Return price, VIN, mileage, dealer, link, CPO status.`;
  - L143: dealer: comp.dealer_name || 'CarMax',
- **zip** (3)
  - L9: zip?: string;
  - L121: if (query.zip) {
  - L122: locationFilter = ` near ${query.zip}`;
- **openai** (3)
  - L38: * Search CarMax inventory using OpenAI API for web search
  - L111: * Build the search query string for OpenAI
  - L134: * Parse OpenAI response into structured CarMax listings
- **storage** (10)
  - L1: import { supabase } from '@/integrations/supabase/client';
  - L48: await supabase
  - L50: .insert({
  - L58: const { data, error } = await supabase.functions.invoke('valuation-aggregate', {
  - L74: await supabase
- **valuation** (15)
  - L57: // Call the valuation-aggregate function with CarMax-specific parameters
  - L58: const { data, error } = await supabase.functions.invoke('valuation-aggregate', {
  - L71: const listings = this.parseListings(data?.comps || [], query);
  - L138: .filter(comp => comp.price && parseFloat(comp.price.toString().replace(/[^\d.]/g, '')) > 0)
  - L139: .map(comp => ({

### /workspaces/car-detective-mvp/src/api/vehicleApi.ts  (LOC 144)
exports: supabase, VehicleCatalog
functions: supabase, API_BASE_URL, fetchVehicleData, makesResponse, modelsResponse, fetchVehicleDetails, response, data, getModelsByMakeId, response, data, fetchAverageMarketValue, url, response, data, fetchFuelEfficiency, response, data, fetchSafetyRatings, response, fetchRecalls, response
- **make** (12)
  - L3: import { Make, Model } from "@/hooks/types/vehicle";
  - L14: make: string;
  - L25: makes: Make[];
  - L41: const makes: Make[] = await makesResponse.json();
  - L77: make: string,
- **model** (14)
  - L3: import { Make, Model } from "@/hooks/types/vehicle";
  - L15: model: string;
  - L26: models: Model[];
  - L42: const models: Model[] = await modelsResponse.json();
  - L64: export async function getModelsByMakeId(makeId: string): Promise<Model[]> {
- **year** (9)
  - L13: year: number;
  - L76: year: number,
  - L83: url.searchParams.append("year", year.toString());
  - L98: year: number,
  - L104: `${API_BASE_URL}/fuel-efficiency?year=${year}&make=${make}&model=${model}`,
- **vin** (2)
  - L51: vin: string,
  - L54: const response = await fetch(`${API_BASE_URL}/vehicle-details?vin=${vin}`);
- **zip** (2)
  - L79: zip?: string,
  - L86: if (zip) url.searchParams.append("zip", zip);
- **url** (6)
  - L82: const url = new URL(`${API_BASE_URL}/market-value`);
  - L83: url.searchParams.append("year", year.toString());
  - L84: url.searchParams.append("make", make);
  - L85: url.searchParams.append("model", model);
  - L86: if (zip) url.searchParams.append("zip", zip);
- **fetch** (8)
  - L32: const makesResponse = await fetch(`${API_BASE_URL}/makes`);
  - L33: const modelsResponse = await fetch(`${API_BASE_URL}/models`);
  - L54: const response = await fetch(`${API_BASE_URL}/vehicle-details?vin=${vin}`);
  - L66: const response = await fetch(`${API_BASE_URL}/models?make_id=${makeId}`);
  - L88: const response = await fetch(url.toString());
- **storage** (2)
  - L5: import { createClient } from "@supabase/supabase-js";
  - L8: export const supabase = createClient(appConfig.SUPABASE_URL, appConfig.SUPABASE_ANON_KEY);

### /workspaces/car-detective-mvp/src/components/AinRouteBadge.tsx  (LOC 34)
exports: AinRouteBadge
functions: AinRouteBadge, showTraceInfo, isAin
- **env** (1)
  - L11: const showTraceInfo = import.meta.env.DEV || import.meta.env.DEBUG_HEADERS === 'true';

### /workspaces/car-detective-mvp/src/components/SimilarListingsSection.tsx  (LOC 123)
exports: SimilarListingsSection
functions: SimilarListingsSection
- **make** (2)
  - L44: alt={`${listing.year} ${listing.make} ${listing.model}`}
  - L55: {listing.year} {listing.make} {listing.model}
- **model** (2)
  - L44: alt={`${listing.year} ${listing.make} ${listing.model}`}
  - L55: {listing.year} {listing.make} {listing.model}
- **year** (2)
  - L44: alt={`${listing.year} ${listing.make} ${listing.model}`}
  - L55: {listing.year} {listing.make} {listing.model}
- **price** (2)
  - L59: {/* Price */}
  - L61: ${listing.price.toLocaleString()}
- **mileage** (2)
  - L64: {/* Mileage and condition */}
  - L66: {listing.mileage?.toLocaleString() || 'Unknown'} miles
- **vin** (2)
  - L96: {listing.vin && (
  - L98: VIN Match
- **photos** (4)
  - L39: {/* Image placeholder or actual image */}
  - L41: {listing.photos && listing.photos.length > 0 ? (
  - L43: src={listing.photos[0]}
  - L48: <div className="text-muted-foreground text-sm">No Image</div>
- **dealer** (1)
  - L78: {/* Dealer */}

### /workspaces/car-detective-mvp/src/components/admin/DataAggregationDashboard.tsx  (LOC 328)
exports: DataAggregationDashboard
functions: DataAggregationDashboard, loadDashboardData, pricingCount, todayCount, toggleSourceStatus, runTestAggregation, getSourceTypeColor
- **make** (4)
  - L50: make: 'Toyota',
  - L264: <label className="text-sm font-medium">Make</label>
  - L266: value={testVehicle.make}
  - L267: onChange={(e) => setTestVehicle(prev => ({ ...prev, make: e.target.value }))}
- **model** (4)
  - L51: model: 'Camry',
  - L271: <label className="text-sm font-medium">Model</label>
  - L273: value={testVehicle.model}
  - L274: onChange={(e) => setTestVehicle(prev => ({ ...prev, model: e.target.value }))}
- **year** (4)
  - L49: year: 2022,
  - L256: <label className="text-sm font-medium">Year</label>
  - L259: value={testVehicle.year}
  - L260: onChange={(e) => setTestVehicle(prev => ({ ...prev, year: parseInt(e.target.value) || 2022 }))}
- **price** (1)
  - L318: <li>Price trend analysis</li>
- **zip** (1)
  - L286: <label className="text-sm font-medium">ZIP Code</label>
- **storage** (3)
  - L22: import { supabase } from '@/integrations/supabase/client';
  - L64: const { data: sources, error: sourcesError } = await supabase
  - L93: const { error } = await supabase

### /workspaces/car-detective-mvp/src/components/admin/FANGOrchestrationDashboard.tsx  (LOC 475)
exports: FANGOrchestrationDashboard
functions: FANGOrchestrationDashboard, interval, loadDashboardData, executeOrchestrator, getStatusColor, getTaskTypeIcon
- **make** (1)
  - L193: make: 'Ford',
- **model** (1)
  - L194: model: 'F-150',
- **year** (1)
  - L192: year: 2022,
- **mileage** (1)
  - L197: mileage: 9534,
- **vin** (1)
  - L198: vin: '1FTFW1E82NFB42108'
- **dealer** (1)
  - L127: case 'dealer': return '🚗';
- **storage** (6)
  - L21: import { supabase } from '@/integrations/supabase/client';
  - L75: supabase.from('data_fetch_tasks').select('*').order('priority', { ascending: false }),
  - L76: supabase.from('qa_reports').select('*').order('created_at', { ascending: false }).limit(10),
  - L77: supabase.from('source_intelligence').select('*').order('success_rate', { ascending: false })
  - L93: const { data, error } = await supabase.functions.invoke('fang-task-orchestrator', {
- **valuation** (4)
  - L103: toast.success(`Orchestration completed: ${data.execution_summary.total_comps} comps collected`);
  - L233: <div className="text-sm text-muted-foreground">Comps Collected</div>
  - L298: Last: {task.provenance.last_execution.comps_found} comps,
  - L371: <div className="font-medium">Comps Ingested</div>

### /workspaces/car-detective-mvp/src/components/admin/MsrpPopulationPanel.tsx  (LOC 98)
exports: MsrpPopulationPanel
functions: MsrpPopulationPanel, handleRunPopulation
- **openai** (3)
  - L39: Use OpenAI to populate real MSRP values from web sources
  - L50: GPT-4o with Browsing
  - L91: ⚠️ This process uses OpenAI API and may take several minutes.

### /workspaces/car-detective-mvp/src/components/admin/PersistenceHealthDashboard.tsx  (LOC 217)
exports: PersistenceHealthDashboard
functions: loadHealth, healthData, runTests, results, getHealthColor, getStatusIcon
- **valuation** (3)
  - L145: {/* Valuation Requests Status */}
  - L149: Valuation Requests
  - L198: Valuation Request Test

### /workspaces/car-detective-mvp/src/components/admin/SystemHealthDashboard.tsx  (LOC 220)
exports: SystemHealthDashboard
functions: SystemHealthDashboard, getStatusIcon, getStatusBadge, runSystemTest
- **price** (1)
  - L71: { name: 'Price Calculation', status: 'healthy', value: '< 500ms', lastUpdated: '2025-01-07T12:00:00Z' },
- **vin** (1)
  - L69: { name: 'VIN Decode', status: 'healthy', value: '99.8% success', lastUpdated: '2025-01-07T12:00:00Z' },
- **openai** (1)
  - L36: { name: 'OpenAI API Key', status: 'healthy', value: 'Configured', lastUpdated: '2025-01-07T12:00:00Z' },
- **storage** (4)
  - L45: description: 'Supabase PostgreSQL',
  - L134: href="https://supabase.com/dashboard/project/xltxqqzattxogxtqrggt/functions"
  - L195: href="https://supabase.com/dashboard/project/xltxqqzattxogxtqrggt/editor"
  - L205: href="https://supabase.com/dashboard/project/xltxqqzattxogxtqrggt/settings/functions"
- **valuation** (4)
  - L49: { name: 'Market Comps Table', status: 'healthy', value: '1.2M records', lastUpdated: '2025-01-07T12:00:00Z' },
  - L65: name: 'Valuation Pipeline',
  - L67: description: 'End-to-end valuation flow',
  - L70: { name: 'Market Aggregation', status: 'healthy', value: '15.2 avg comps', lastUpdated: '2025-01-07T12:00:00Z' },

### /workspaces/car-detective-mvp/src/components/admin/ValuationDebugDashboard.tsx  (LOC 323)
exports: ValuationDebugDashboard
functions: ValuationDebugDashboard, fetchDebugStats, getHealthColor, getHealthBadge
- **price** (1)
  - L226: <div><strong>Price:</strong> ${stats.lastMarketListing.price?.toLocaleString() || 'N/A'}</div>
- **vin** (3)
  - L205: <div><strong>VIN:</strong> {stats.lastValuation.vin}</div>
  - L225: <div><strong>VIN:</strong> {stats.lastMarketListing.vin || 'N/A'}</div>
  - L245: <div><strong>VIN:</strong> {stats.lastAuditLog.vin}</div>
- **zip** (2)
  - L206: <div><strong>ZIP:</strong> {stats.lastValuation.zip_code}</div>
  - L228: <div><strong>ZIP:</strong> {stats.lastMarketListing.zip_code || 'N/A'}</div>
- **openai** (1)
  - L305: No market listings found. Check if saveMarketListings() is being called after OpenAI search.
- **storage** (9)
  - L10: import { supabase } from '@/integrations/supabase/client';
  - L39: supabase.from('valuation_requests').select('*', { count: 'exact', head: true }),
  - L40: supabase.from('market_listings').select('*', { count: 'exact', head: true }),
  - L41: supabase.from('valuation_audit_logs').select('*', { count: 'exact', head: true }),
  - L42: supabase.from('user_valuation_feedback').select('*', { count: 'exact', head: true })
- **valuation** (8)
  - L1: // Debug Dashboard for Valuation Pipeline Monitoring
  - L121: Valuation Pipeline Debug Dashboard
  - L136: {/* Valuation Requests */}
  - L140: <span className="text-sm font-medium">Valuation Requests</span>
  - L197: {/* Latest Valuation Request */}

### /workspaces/car-detective-mvp/src/components/admin/heatmap/AdjustmentHeatmap.tsx  (LOC 257)
exports: AdjustmentHeatmap
functions: AdjustmentCell, range, normalizedValue, getColor, AdjustmentHeatmap, loadHeatmapData, heatmapData, getTopZipCodes, zipCounts, getAdjustmentStats, values, topZipCodes, conditionStats, fuelStats, marketStats, renderHeatmapTable, filteredData
- **zip** (3)
  - L79: .map(([zip]) => zip);
  - L120: <th className="text-left p-2 font-medium">ZIP Code</th>
  - L165: Top ZIP codes showing average adjustment impacts across {data.length} valuation data points
- **storage** (1)
  - L6: import { getAdjustmentBreakdownHeatmap, HeatmapData } from '@/services/supabase/heatmapService';
- **valuation** (1)
  - L165: Top ZIP codes showing average adjustment impacts across {data.length} valuation data points

### /workspaces/car-detective-mvp/src/components/animations/index.ts  (LOC 6)
- **valuation** (1)
  - L6: export { default as ValuePresenter } from "@/modules/valuation-result/ValuePresenter";

### /workspaces/car-detective-mvp/src/components/audit/AuditChecklist.tsx  (LOC 596)
exports: AuditChecklist
functions: AuditChecklist, currentDate, updateItemStatus, newSections, updateItemNotes, newSections, totalItems, checkedItems, progress, passedCount, totalCount, percent
- **year** (1)
  - L35: year: "numeric",
- **price** (1)
  - L358: text: "Can explain price and guide user",
- **mileage** (1)
  - L82: text: "Includes mileage, condition, feature logic",
- **vin** (3)
  - L48: id: "vin-flow",
  - L49: text: "VIN Lookup → Valuation → Result",
  - L285: text: "E2E tests cover VIN / Plate / Manual entry flows",
- **photos** (8)
  - L96: text: "AI photo condition overrides if confidence > 70%",
  - L104: title: "PHOTO AI SYSTEM",
  - L107: id: "photo-upload",
  - L108: text: "Upload up to 5 vehicle photos",
  - L114: id: "photo-scoring",
- **dealer** (2)
  - L239: id: "dealer-access",
  - L240: text: "Dealer dashboard properly restricted",
- **zip** (2)
  - L88: id: "zip-multipliers",
  - L89: text: "Pulls ZIP-based market multipliers from Supabase",
- **openai** (2)
  - L140: id: "gpt-explanation",
  - L141: text: "GPT-based valuation explanation displays properly",
- **storage** (2)
  - L89: text: "Pulls ZIP-based market multipliers from Supabase",
  - L155: text: "Injected into downloadable PDF",
- **valuation** (13)
  - L49: text: "VIN Lookup → Valuation → Result",
  - L56: text: "Plate Lookup → Valuation → Result",
  - L63: text: "Manual Entry → Valuation → Result",
  - L78: title: "VALUATION LOGIC",
  - L81: id: "valuation-factors",

### /workspaces/car-detective-mvp/src/components/auth/GoogleAuthButton.tsx  (LOC 74)
exports: GoogleAuthButton
functions: GoogleAuthButton, handleGoogleSignIn
- **storage** (2)
  - L1: import { supabase } from "@/integrations/supabase/client";
  - L23: const { data, error } = await supabase.auth.signInWithOAuth({

### /workspaces/car-detective-mvp/src/components/auth/forms/SharedLoginForm.tsx  (LOC 121)
exports: SharedLoginForm
functions: loginSchema, navigate, form, onSubmit
- **dealer** (1)
  - L23: expectedRole: 'individual' | 'dealer';
- **schema** (2)
  - L4: import { zodResolver } from '@hookform/resolvers/zod';
  - L5: import { z } from 'zod';

### /workspaces/car-detective-mvp/src/components/chat/AIChatBubble.tsx  (LOC 27)
exports: AIChatBubble
- **valuation** (1)
  - L11: message = "Hello! I'm here to help you with your vehicle valuation."

### /workspaces/car-detective-mvp/src/components/common/EnhancedErrorBoundary.tsx  (LOC 133)
exports: EnhancedErrorBoundary
functions: context
- **env** (1)
  - L89: {import.meta.env.NODE_ENV !== "production" && this.state.error && (

### /workspaces/car-detective-mvp/src/components/common/SEO.tsx  (LOC 53)
exports: SEO
functions: fullTitle, currentUrl, canonicalUrl
- **price** (1)
  - L18: keywords = 'car valuation, used car price, AI car pricing, car value tool, car appraisal, auction value, carfax alternative',
- **photos** (4)
  - L10: image?: string;
  - L20: image = '/images/hero-car.png',
  - L41: {image && <meta property="og:image" content={image} />}
  - L48: {image && <meta name="twitter:image" content={image} />}
- **dealer** (1)
  - L17: description = 'Get instant, AI-backed vehicle values with real auction insights, market listings, and premium dealer tools.',
- **url** (1)
  - L40: {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
- **valuation** (2)
  - L16: title = 'Car Detective — AI-Powered Vehicle Valuation',
  - L18: keywords = 'car valuation, used car price, AI car pricing, car value tool, car appraisal, auction value, carfax alternative',

### /workspaces/car-detective-mvp/src/components/common/ZipCodeInput.tsx  (LOC 98)
exports: ZipCodeInput
functions: handleChange, inputValue, sanitizedValue, handleFocus, handleBlur, inputClasses
- **zip** (2)
  - L30: placeholder = "Enter ZIP code",
  - L31: label = "ZIP Code",

### /workspaces/car-detective-mvp/src/components/common/__tests__/ZipCodeInput.test.tsx  (LOC 117)
functions: mockOnChange, input, input, input, input, input, input, input
- **zip** (5)
  - L52: it("validates the ZIP code when 5 digits are entered", async () => {
  - L63: it("validates the ZIP code on blur", async () => {
  - L86: it("shows error for invalid ZIP codes", async () => {
  - L96: expect(screen.getByText(/invalid zip code/i)).toBeInTheDocument();
  - L100: it("shows city and state for valid ZIP codes", async () => {

### /workspaces/car-detective-mvp/src/components/comprehensive/ComprehensiveValuationReport.tsx  (LOC 134)
exports: ComprehensiveValuationReport
functions: ComprehensiveValuationReport
- **make** (2)
  - L32: <p className="text-sm font-medium text-gray-500">Make</p>
  - L33: <p className="text-lg">{valuationData.vehicle.make}</p>
- **model** (2)
  - L36: <p className="text-sm font-medium text-gray-500">Model</p>
  - L37: <p className="text-lg">{valuationData.vehicle.model}</p>
- **year** (2)
  - L40: <p className="text-sm font-medium text-gray-500">Year</p>
  - L41: <p className="text-lg">{valuationData.vehicle.year}</p>
- **price** (1)
  - L79: <p className="text-sm text-gray-500">Price Range</p>
- **mileage** (2)
  - L44: <p className="text-sm font-medium text-gray-500">Mileage</p>
  - L45: <p className="text-lg">{valuationData.vehicle.mileage.toLocaleString()} miles</p>
- **vin** (3)
  - L51: {valuationData.vehicle.vin && (
  - L53: <p className="text-sm font-medium text-gray-500">VIN</p>
  - L54: <p className="text-sm font-mono">{valuationData.vehicle.vin}</p>
- **valuation** (2)
  - L61: {/* Valuation Summary Section */}
  - L64: <CardTitle>Valuation Summary</CardTitle>

### /workspaces/car-detective-mvp/src/components/comprehensive/IndustryLeaderDataSection.tsx  (LOC 131)
exports: IndustryLeaderDataSection
functions: IndustryLeaderDataSection, loadIndustryData, data, getComparisonIcon, diff, percentage, formatPrice, numPrice, industryLeaders, price, numPrice
- **make** (5)
  - L10: make: string;
  - L18: make,
  - L28: if (!vin || !make || !model || !year) return;
  - L32: const data = await fetchIndustryLeaderData(vin, make, model, year);
  - L41: }, [vin, make, model, year]);
- **model** (5)
  - L11: model: string;
  - L19: model,
  - L28: if (!vin || !make || !model || !year) return;
  - L32: const data = await fetchIndustryLeaderData(vin, make, model, year);
  - L41: }, [vin, make, model, year]);
- **year** (5)
  - L12: year: string;
  - L20: year,
  - L28: if (!vin || !make || !model || !year) return;
  - L32: const data = await fetchIndustryLeaderData(vin, make, model, year);
  - L41: }, [vin, make, model, year]);
- **price** (6)
  - L52: const formatPrice = (price: string | null) => {
  - L53: if (!price || price === '0') return 'N/A';
  - L54: const numPrice = parseInt(price.replace(/[^0-9]/g, ''));
  - L104: const price = formatPrice(leader.value);
  - L113: {price !== 'N/A' && estimatedValue > 0 && getComparisonIcon(numPrice)}
- **vin** (5)
  - L9: vin: string;
  - L17: vin,
  - L28: if (!vin || !make || !model || !year) return;
  - L32: const data = await fetchIndustryLeaderData(vin, make, model, year);
  - L41: }, [vin, make, model, year]);

### /workspaces/car-detective-mvp/src/components/comprehensive/MarketplaceDataSection.tsx  (LOC 79)
exports: MarketplaceDataSection
functions: MarketplaceDataSection, loadMarketplaceData, data
- **make** (6)
  - L10: make: string;
  - L16: export function MarketplaceDataSection({ make, model, year, zipCode }: MarketplaceDataSectionProps) {
  - L21: if (!make || !model || !year || !zipCode) return;
  - L25: const data = await fetchMarketplaceListings(make, model, year, zipCode);
  - L35: }, [make, model, year, zipCode]);
- **model** (6)
  - L11: model: string;
  - L16: export function MarketplaceDataSection({ make, model, year, zipCode }: MarketplaceDataSectionProps) {
  - L21: if (!make || !model || !year || !zipCode) return;
  - L25: const data = await fetchMarketplaceListings(make, model, year, zipCode);
  - L35: }, [make, model, year, zipCode]);
- **year** (6)
  - L12: year: number;
  - L16: export function MarketplaceDataSection({ make, model, year, zipCode }: MarketplaceDataSectionProps) {
  - L21: if (!make || !model || !year || !zipCode) return;
  - L25: const data = await fetchMarketplaceListings(make, model, year, zipCode);
  - L35: }, [make, model, year, zipCode]);

### /workspaces/car-detective-mvp/src/components/dashboard/DashboardRouter.tsx  (LOC 158)
functions: DashboardRouter, quickActions, features
- **make** (1)
  - L121: description="Everything you need to manage your vehicle portfolio and make informed decisions."
- **valuation** (5)
  - L22: title: 'New Valuation',
  - L23: description: 'Start a new vehicle valuation',
  - L54: description: 'Access all your previous valuation reports and download them anytime.',
  - L131: Create your first valuation or explore our premium features for advanced insights.
  - L140: New Valuation

### /workspaces/car-detective-mvp/src/components/dealer/AcceptedOfferCard.tsx  (LOC 60)
exports: AcceptedOfferCardProps, AcceptedOfferCard
- **dealer** (3)
  - L25: Dealer Offer
  - L41: <p className="text-sm font-medium text-green-700 mb-1">Message from dealer:</p>
  - L52: Contact Dealer

### /workspaces/car-detective-mvp/src/components/dealer/DealerOfferForm.tsx  (LOC 39)
exports: DealerOfferForm
functions: DealerOfferForm
- **dealer** (3)
  - L18: <CardTitle>Submit Dealer Offer</CardTitle>
  - L22: <Label htmlFor="dealerName">Dealer Name</Label>
  - L23: <Input id="dealerName" placeholder="Enter dealer name" />

### /workspaces/car-detective-mvp/src/components/dealer/DealerOffersList.tsx  (LOC 85)
exports: DealerOffersListProps, DealerOffersList
functions: offers
- **dealer** (4)
  - L32: <CardTitle>Dealer Offers</CardTitle>
  - L45: <CardTitle>Dealer Offers</CardTitle>
  - L58: <CardTitle>Dealer Offers</CardTitle>
  - L70: <CardTitle>Dealer Offers ({offers.length})</CardTitle>
- **valuation** (1)
  - L4: import { DealerOfferCard } from '@/components/valuation/offers/DealerOfferCard';

### /workspaces/car-detective-mvp/src/components/dealer/DealerSidebar.tsx  (LOC 23)
exports: DealerSidebar
- **dealer** (1)
  - L7: <h2 className="text-lg font-semibold mb-4">Dealer Dashboard</h2>

### /workspaces/car-detective-mvp/src/components/dealer/DealerSignupForm.tsx  (LOC 121)
exports: DealerSignupForm
functions: navigate, handleChange, handleSubmit
- **dealer** (3)
  - L32: role: 'dealer',
  - L43: toast.success("Dealer account created successfully! Please check your email.");
  - L117: {isLoading ? "Creating Account..." : "Create Dealer Account"}

### /workspaces/car-detective-mvp/src/components/dealer/OfferAcceptanceModal.tsx  (LOC 65)
exports: OfferAcceptanceModalProps, OfferAcceptanceModal
- **dealer** (1)
  - L33: <DialogTitle>Accept Dealer Offer</DialogTitle>

### /workspaces/car-detective-mvp/src/components/dealer/index.ts  (LOC 20)
exports: DealerModule
functions: DealerModule
- **dealer** (2)
  - L2: // Dealer Components - Consolidated Export
  - L15: export const DealerModule = 'dealer-components';

### /workspaces/car-detective-mvp/src/components/dealer-messages/DealerMessagesLayout.tsx  (LOC 20)
exports: DealerMessagesLayout
- **dealer** (2)
  - L10: <CardTitle>Dealer Messages</CardTitle>
  - L14: Your dealer messages will appear here. This feature is currently under development.

### /workspaces/car-detective-mvp/src/components/debug/MakesModelsDisplay.tsx  (LOC 78)
exports: MakesModelsDisplay
functions: fetchData, data, totalModels
- **make** (4)
  - L8: make: string;
  - L50: const totalModels = makesData.reduce((sum, make) => sum + make.models.length, 0);
  - L62: <Card key={makeData.make} className="p-4">
  - L64: {index + 1}. {makeData.make} ({makeData.models.length} models)
- **model** (3)
  - L67: {makeData.models.map((model, modelIndex) => (
  - L68: <div key={model} className="bg-gray-100 p-2 rounded">
  - L69: {modelIndex + 1}. {model}

### /workspaces/car-detective-mvp/src/components/debug/VehicleDataDebug.tsx  (LOC 271)
exports: VehicleDataDebug
functions: VehicleDataDebug, runDiagnostics, result, testConnection
- **make** (4)
  - L172: {connectionTest.sampleMakes.map((make, index) => (
  - L174: {make.make_name}
  - L221: {diagnostics.makesWithoutModels.slice(0, 10).map((make, index) => (
  - L223: {make}
- **model** (4)
  - L185: {connectionTest.sampleModels.map((model, index) => (
  - L187: {model.model_name}
  - L239: {diagnostics.orphanedModels.slice(0, 10).map((model, index) => (
  - L241: {model}
- **storage** (4)
  - L8: import { supabase } from '@/integrations/supabase/client';
  - L44: const { data: makes, error: makesError, count: makesCount } = await supabase
  - L52: const { data: models, error: modelsError, count: modelsCount } = await supabase
  - L60: const { data: relationship } = await supabase

### /workspaces/car-detective-mvp/src/components/enriched/EnrichedDataCard.tsx  (LOC 88)
exports: EnrichedDataCard
functions: EnrichedDataCard, formatDate
- **price** (3)
  - L14: price?: number;
  - L49: {data.price && (
  - L52: {formatCurrency(data.price)}
- **url** (3)
  - L18: url?: string;
  - L72: {data.url && (
  - L77: onClick={() => window.open(data.url, '_blank')}

### /workspaces/car-detective-mvp/src/components/enriched/PremiumEnrichmentGate.tsx  (LOC 111)
exports: PremiumEnrichmentGate
functions: navigate, handleUpgrade, upgradeUrl
- **vin** (4)
  - L9: vin?: string;
  - L14: vin,
  - L103: {vin && (
  - L105: VIN: {vin} • Secure encryption • Instant access

### /workspaces/car-detective-mvp/src/components/followup/QuickOverviewCard.tsx  (LOC 115)
exports: QuickOverviewCard
functions: QuickOverviewCard
- **mileage** (6)
  - L49: <Label htmlFor="mileage">Mileage *</Label>
  - L51: id="mileage"
  - L53: value={formData.mileage || ''}
  - L54: onChange={(e) => updateFormData({ mileage: parseInt(e.target.value) || 0 })}
  - L55: placeholder="Current mileage"
- **zip** (2)
  - L38: <Label htmlFor="zip_code">ZIP Code *</Label>
  - L44: placeholder="Your ZIP code"
- **valuation** (2)
  - L106: {isLoading ? 'Processing...' : 'Complete Valuation with Basic Info'}
  - L109: You can complete your valuation with just this basic information, or use the detailed form for a more accurate assessment.

### /workspaces/car-detective-mvp/src/components/followup/TabNavigation.tsx  (LOC 131)
exports: TabNavigation
functions: TabNavigation, currentIndex, canGoBack, canGoNext, handleNext, handleBack, handleSave, handleSubmit, handleSkipToEnd
- **valuation** (2)
  - L55: toast.error('Unable to complete valuation. Please check your internet connection and try again.');
  - L125: {isLoading ? 'Completing Valuation...' : 'Complete Valuation'}

### /workspaces/car-detective-mvp/src/components/followup/TabProgressHeader.tsx  (LOC 43)
exports: TabProgressHeader
functions: TabProgressHeader
- **valuation** (1)
  - L20: <h3 className="text-lg font-semibold text-gray-900">Complete Your Valuation</h3>

### /workspaces/car-detective-mvp/src/components/followup/TabValidationAlerts.tsx  (LOC 94)
exports: TabValidationAlerts
functions: TabValidationAlerts, currentIndex
- **retry** (1)
  - L49: Retry

### /workspaces/car-detective-mvp/src/components/followup/TabbedFollowUpForm.tsx  (LOC 276)
exports: TabbedFollowUpForm
functions: tabs, TabbedFollowUpForm, handleTabChange, getTabCompletion, hasValidZip, hasValidMileage, hasValidCondition, hasAllConditions, progressData, requiredTabs, completedRequired, progressPercentage, getTabStatus, completion, currentTabIndex, isFirstTab, isLastTab, goToPreviousTab, previousTab, goToNextTab, nextTab, skipToFinalTab, handleSubmit, result, steps
- **make** (2)
  - L26: make?: string;
  - L112: make: vehicleData.make,
- **model** (2)
  - L27: model?: string;
  - L113: model: vehicleData.model
- **year** (2)
  - L25: year?: number;
  - L111: year: vehicleData.year,
- **mileage** (2)
  - L39: description: 'Location and mileage'
  - L128: const hasValidMileage = Boolean(formData.mileage && formData.mileage > 0);
- **vin** (2)
  - L24: vin: string;
  - L109: vin: vehicleData.vin,
- **valuation** (4)
  - L11: import { LinearProgressStepper } from '../valuation/redesign/LinearProgressStepper';
  - L209: // FIXED: Call parent's onSubmit when valuation creation is needed
  - L210: // This allows the parent (ValuationFollowUpPage) to create the valuation
  - L213: // Only show error for actual failures, not when valuation creation is needed

### /workspaces/car-detective-mvp/src/components/followup/UnifiedFollowUpForm.tsx  (LOC 337)
exports: UnifiedFollowUpForm
functions: UnifiedFollowUpForm, steps, handleNext, handlePrevious, handleSubmit, currentFormData, success, renderStep, lights, updated, features, updated
- **mileage** (5)
  - L76: <Label htmlFor="mileage">Current Mileage *</Label>
  - L78: id="mileage"
  - L80: value={formData.mileage || ''}
  - L81: onChange={(e) => updateFormData({ mileage: parseInt(e.target.value) })}
  - L82: placeholder="Enter current mileage"
- **vin** (1)
  - L21: const { formData, updateFormData, submitForm, isLoading, formMethods } = useFollowUpForm(vehicleData.vin);
- **zip** (2)
  - L87: <Label htmlFor="zip_code">ZIP Code *</Label>
  - L92: placeholder="Enter your ZIP code"
- **valuation** (1)
  - L326: {isLoading ? "Submitting..." : "Complete Valuation"}

### /workspaces/car-detective-mvp/src/components/followup/inputs/EnhancedZipCodeInput.tsx  (LOC 124)
exports: EnhancedZipCodeInput
functions: EnhancedZipCodeInput, handleChange, sanitized, validateZip, response, data, timer, getValidationIcon, getInputClasses, baseClasses
- **zip** (3)
  - L18: label = "ZIP Code",
  - L32: // Validate ZIP code with debouncing
  - L120: <p className="mt-1 text-sm text-red-600">Please enter a valid US ZIP code</p>
- **fetch** (1)
  - L40: const response = await fetch(`https://api.zippopotam.us/us/${value}`);

### /workspaces/car-detective-mvp/src/components/followup/inputs/MileageInput.tsx  (LOC 43)
exports: MileageInput
functions: MileageInput, handleChange, inputValue, numValue
- **mileage** (4)
  - L17: label = "Current Mileage",
  - L29: <Label htmlFor="mileage" className="text-sm font-medium">
  - L34: id="mileage"
  - L36: placeholder="Enter mileage"

### /workspaces/car-detective-mvp/src/components/followup/inputs/SimpleMileageInput.tsx  (LOC 46)
exports: SimpleMileageInput
functions: SimpleMileageInput, handleChange, numericValue, parsedValue, displayValue
- **mileage** (4)
  - L17: label = "Current Mileage",
  - L32: <Label htmlFor="mileage" className="text-sm font-medium">
  - L37: id="mileage"
  - L39: placeholder="Enter mileage"

### /workspaces/car-detective-mvp/src/components/followup/inputs/SimpleZipCodeInput.tsx  (LOC 45)
exports: SimpleZipCodeInput
functions: SimpleZipCodeInput, handleChange, sanitized
- **zip** (1)
  - L17: label = "ZIP Code",

### /workspaces/car-detective-mvp/src/components/followup/inputs/ZipCodeInput.tsx  (LOC 43)
exports: ZipCodeInput
functions: ZipCodeInput, handleChange, newValue
- **zip** (2)
  - L17: label = "ZIP Code",
  - L35: placeholder="Enter ZIP code"

### /workspaces/car-detective-mvp/src/components/followup/tabs/AccidentsTab.tsx  (LOC 301)
exports: AccidentsTab
functions: accidentTypes, repairShopTypes, AccidentsTab, accidents, updateAccidents, handleAccidentStatusChange, hasAccident, handleAccidentTypeChange, currentTypes, updatedTypes, handleRepairShopChange, currentShops, updatedShops
- **dealer** (1)
  - L31: 'Authorized dealer',

### /workspaces/car-detective-mvp/src/components/followup/tabs/BasicInfoTab.tsx  (LOC 248)
exports: BasicInfoTab
functions: conditionOptions, BasicInfoTab, handleZipCodeChange, handleMileageChange, handleConditionChange, handleLoanBalanceChange, value, numValue, handlePayoffAmountChange, value, numValue, handlePreviousOwnersChange, value, handlePreviousUseChange
- **mileage** (4)
  - L59: updateFormData({ mileage: value });
  - L107: {/* Current Mileage */}
  - L110: <CardTitle className="text-lg">Current Mileage</CardTitle>
  - L115: value={formData.mileage || 0}

### /workspaces/car-detective-mvp/src/components/followup/tabs/DashboardLightsTab.tsx  (LOC 251)
exports: DashboardLightsTab
functions: dashboardLights, DashboardLightsTab, dashboardLightsList, handleLightChange, getSeverityColor, getSeverityBadge, IconComponent, isChecked, light
- **valuation** (1)
  - L228: Consider having these issues diagnosed and repaired for the most accurate valuation.

### /workspaces/car-detective-mvp/src/components/followup/tabs/FeaturesTab.tsx  (LOC 210)
exports: FeaturesTab
functions: featureCategories, FeaturesTab, features, additionalNotes, handleFeatureChange, updatedFeatures, handleNotesChange, isChecked, feature
- **mileage** (1)
  - L199: <div>Mileage: {formData.mileage || 'Not entered'}</div>
- **zip** (1)
  - L198: <div>Zip Code: {formData.zip_code || 'Not entered'}</div>

### /workspaces/car-detective-mvp/src/components/followup/tabs/FinalReviewTab.tsx  (LOC 189)
exports: FinalReviewTab
functions: FinalReviewTab, getAccidentData, getServiceData, accidentData, serviceData
- **mileage** (2)
  - L63: <span className="text-gray-600">Mileage:</span>
  - L64: <span className="font-medium">{formData.mileage?.toLocaleString() || 'Not provided'}</span>
- **dealer** (1)
  - L128: Dealer Maintained: {serviceData.dealerMaintained ? 'Yes' : 'No'}
- **zip** (1)
  - L59: <span className="text-gray-600">ZIP Code:</span>
- **valuation** (1)
  - L184: Your vehicle information has been reviewed. Click "Submit Valuation" to get your detailed vehicle valuation report.

### /workspaces/car-detective-mvp/src/components/followup/tabs/ReviewTab.tsx  (LOC 182)
exports: ReviewTab
functions: ReviewTab, getAccidentData, getModificationData, accidentData, modificationData, hasAccident, hasModifications
- **mileage** (2)
  - L70: <span className="text-gray-600">Mileage:</span>
  - L71: <span className="font-medium">{formData.mileage?.toLocaleString() || 'Not provided'}</span>
- **zip** (1)
  - L66: <span className="text-gray-600">ZIP Code:</span>
- **valuation** (1)
  - L177: Your vehicle information has been reviewed. Click "Submit Valuation" to get your detailed vehicle valuation report.

### /workspaces/car-detective-mvp/src/components/followup/tabs/ServiceHistoryTab.tsx  (LOC 349)
exports: ServiceHistoryTab
functions: maintenanceTypes, majorRepairTypes, ServiceHistoryTab, serviceHistory, updateServiceHistory, updatedData, handleRecordsStatusChange, hasServiceRecords, addService, updatedServices, removeService, updatedServices
- **mileage** (8)
  - L49: const [newService, setNewService] = useState({ type: '', date: '', mileage: '', description: '' });
  - L80: setNewService({ type: '', date: '', mileage: '', description: '' });
  - L218: <Label htmlFor="service-mileage">Mileage</Label>
  - L220: id="service-mileage"
  - L223: value={newService.mileage}
- **dealer** (1)
  - L154: <Label className="font-medium">Dealer Maintained</Label>

### /workspaces/car-detective-mvp/src/components/followup/tabs/ServiceMaintenanceTab.tsx  (LOC 284)
exports: ServiceMaintenanceTab
functions: ServiceMaintenanceTab, serviceHistory, handleServiceChange, handleHasRecordsChange
- **dealer** (5)
  - L164: {/* Dealer Maintained */}
  - L167: <Label className="text-base font-medium">Dealer Maintained</Label>
  - L188: Dealer Serviced
  - L191: Authorized dealer maintenance
  - L269: {serviceHistory.dealerMaintained ? 'Dealer' : 'Independent'}

### /workspaces/car-detective-mvp/src/components/followup/tabs/SimplifiedBasicInfoTab.tsx  (LOC 96)
exports: SimplifiedBasicInfoTab
functions: conditionOptions, SimplifiedBasicInfoTab
- **mileage** (4)
  - L47: {/* Current Mileage */}
  - L50: <CardTitle className="text-lg">Current Mileage</CardTitle>
  - L55: value={formData.mileage || 0}
  - L56: onChange={(value) => updateFormData({ mileage: value })}
- **zip** (1)
  - L42: Enter your ZIP code for accurate local market pricing

### /workspaces/car-detective-mvp/src/components/followup/tabs/VehicleBasicsTab.tsx  (LOC 126)
exports: VehicleBasicsTab
functions: VehicleBasicsTab
- **mileage** (5)
  - L34: <Label htmlFor="mileage">Mileage</Label>
  - L36: id="mileage"
  - L38: value={formData.mileage || ''}
  - L39: onChange={(e) => updateFormData({ mileage: parseInt(e.target.value) || undefined })}
  - L40: placeholder="Enter current mileage"
- **zip** (3)
  - L24: <Label htmlFor="zip-code">ZIP Code</Label>
  - L26: id="zip-code"
  - L29: placeholder="Enter ZIP code"

### /workspaces/car-detective-mvp/src/components/followup/validation/TabValidation.ts  (LOC 224)
exports: TabValidationResult, TabValidation
functions: conditionFields, modCount, validator, validations, validTabs, totalTabs
- **mileage** (4)
  - L20: if (!formData.mileage || formData.mileage <= 0) {
  - L21: errors.push('Current mileage is required');
  - L29: if (formData.mileage && formData.mileage > 300000) {
  - L30: warnings.push('Mileage seems unusually high - please verify');
- **zip** (1)
  - L17: errors.push('Valid 5-digit ZIP code is required');
- **valuation** (1)
  - L102: warnings.push('Service frequency information helps improve valuation accuracy');

### /workspaces/car-detective-mvp/src/components/form/index.ts  (LOC 4)
- **valuation** (1)
  - L3: export * from "../valuation/free/FreeValuationForm";

### /workspaces/car-detective-mvp/src/components/form/validation.ts  (LOC 82)
exports: vinSchema, plateSchema, manualEntrySchema, ValidationResult, validateForm
functions: currentYear, vinSchema, plateSchema, manualEntrySchema, validData, path
- **make** (1)
  - L32: make: z.string().min(1, { message: "Make is required" }),
- **model** (1)
  - L33: model: z.string().min(1, { message: "Model is required" }),
- **year** (4)
  - L3: // Current year for validation
  - L34: year: z.coerce.number()
  - L35: .min(1900, { message: "Year must be at least 1900" })
  - L37: message: `Year cannot be greater than ${currentYear + 1}`,
- **mileage** (3)
  - L39: mileage: z.coerce.number()
  - L40: .min(0, { message: "Mileage cannot be negative" })
  - L41: .max(1000000, { message: "Mileage seems too high" }),
- **vin** (5)
  - L6: // VIN validation schema
  - L8: vin: z.string()
  - L9: .min(17, { message: "VIN must be 17 characters" })
  - L10: .max(17, { message: "VIN must be 17 characters" })
  - L12: message: "VIN contains invalid characters (no I, O, or Q allowed)",
- **zip** (6)
  - L15: .min(5, { message: "ZIP code must be at least 5 characters" })
  - L16: .max(10, { message: "ZIP code cannot exceed 10 characters" }),
  - L26: .min(5, { message: "ZIP code must be at least 5 characters" })
  - L27: .max(10, { message: "ZIP code cannot exceed 10 characters" }),
  - L43: .min(5, { message: "ZIP code must be at least 5 characters" })
- **schema** (6)
  - L1: import { z } from "zod";
  - L6: // VIN validation schema
  - L19: // Plate validation schema
  - L30: // Manual entry validation schema
  - L63: schema: z.ZodType<T>,

### /workspaces/car-detective-mvp/src/components/home/AiAssistantPreview.tsx  (LOC 64)
exports: AiAssistantPreview
functions: AiAssistantPreview, sampleQuestions, handleQuestionClick
- **valuation** (1)
  - L27: AI Valuation Assistant

### /workspaces/car-detective-mvp/src/components/home/CarCard.tsx  (LOC 36)
exports: CarCard
- **make** (2)
  - L8: make: string;
  - L24: {car.year} {car.make} {car.model}
- **model** (2)
  - L9: model: string;
  - L24: {car.year} {car.make} {car.model}
- **year** (2)
  - L10: year: number;
  - L24: {car.year} {car.make} {car.model}
- **photos** (2)
  - L11: image: string;
  - L29: <span className="text-gray-500">Vehicle Image</span>

### /workspaces/car-detective-mvp/src/components/home/ComparisonTable.tsx  (LOC 171)
exports: ComparisonTable
functions: ComparisonTable, navigate, features
- **vin** (1)
  - L11: { name: "VIN/Plate/Manual Lookup", free: true, premium: true },
- **photos** (2)
  - L13: { name: "Single Photo AI Scoring", free: true, premium: true },
  - L14: { name: "Multi-Photo AI Analysis", free: false, premium: true },
- **dealer** (2)
  - L18: { name: "Dealer-Beat Offers", free: false, premium: true },
  - L38: valuation data available anywhere—combining CARFAX®, dealer offers,
- **valuation** (2)
  - L38: valuation data available anywhere—combining CARFAX®, dealer offers,
  - L153: Get Premium Valuation Now

### /workspaces/car-detective-mvp/src/components/home/EnhancedFeatures.tsx  (LOC 63)
exports: EnhancedFeatures
functions: features, EnhancedFeatures
- **valuation** (2)
  - L7: title: 'Instant Valuation',
  - L8: description: 'Get an accurate vehicle valuation in seconds.',

### /workspaces/car-detective-mvp/src/components/home/EnhancedTestimonialsCarousel.tsx  (LOC 96)
exports: EnhancedTestimonialsCarousel
functions: EnhancedTestimonialsCarousel, goToPrevious, goToNext, currentTestimonial
- **make** (1)
  - L28: testimonial: 'I was skeptical at first, but the premium report provided valuable insights that helped me make an informed decision.',
- **valuation** (1)
  - L21: testimonial: 'This valuation tool is incredibly accurate and easy to use. It saved me so much time!',

### /workspaces/car-detective-mvp/src/components/home/EnterpriseHeroSection.tsx  (LOC 176)
exports: EnterpriseHeroSection
functions: scrollToLookup, lookupSection
- **valuation** (2)
  - L104: Start Professional Valuation
  - L149: <span className="text-slate-300">Market Valuation</span>

### /workspaces/car-detective-mvp/src/components/home/EnterpriseTestimonialsSection.tsx  (LOC 102)
exports: EnterpriseTestimonialsSection
functions: testimonials
- **dealer** (1)
  - L20: company: "Auto Dealer Group",
- **valuation** (1)
  - L17: quote: "Their enterprise API integration was seamless and the real-time market data has enhanced our inventory valuation process considerably.",

### /workspaces/car-detective-mvp/src/components/home/FangHeroSection.tsx  (LOC 116)
exports: FangHeroSection
functions: scrollToValuation, section
- **photos** (1)
  - L18: backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h
- **url** (1)
  - L18: backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h
- **valuation** (2)
  - L8: const section = document.querySelector('[data-section="valuation"]');
  - L75: Get Instant Valuation

### /workspaces/car-detective-mvp/src/components/home/FeaturesOverview.tsx  (LOC 45)
exports: FeaturesOverview
functions: features, FeaturesOverview
- **vin** (1)
  - L7: "Instantly estimate your vehicle's worth using VIN, plate, or manual entry — powered by real-time market analytics.",
- **dealer** (2)
  - L13: "Includes CARFAX® history, 12-month trend forecast, dealer offers, confidence score, and branded PDF export.",
  - L17: title: "Dealer Tools",
- **valuation** (1)
  - L5: title: "Basic Valuation (Free)",

### /workspaces/car-detective-mvp/src/components/home/FinalCTA.tsx  (LOC 37)
exports: FinalCTA
functions: scrollToValuation, section
- **valuation** (2)
  - L8: const section = document.querySelector('[data-section="valuation"]');
  - L30: Start Free Valuation

### /workspaces/car-detective-mvp/src/components/home/IndustryProof.tsx  (LOC 69)
exports: IndustryProof
functions: testimonials
- **dealer** (1)
  - L16: title: "Operations Director, Auto Dealer Group",
- **valuation** (1)
  - L14: quote: "Seamless integration and real-time data has enhanced our inventory management significantly. Best valuation tool we've used.",

### /workspaces/car-detective-mvp/src/components/home/LookupTabs.tsx  (LOC 16)
exports: LookupTabs
functions: LookupTabs
- **vin** (1)
  - L14: // UnifiedLookupTabs doesn't accept these props, so we'll handle the VIN submission internally

### /workspaces/car-detective-mvp/src/components/home/MarketSnapshot.tsx  (LOC 286)
exports: MarketSnapshot
functions: isValidZipCode, MarketSnapshot, handleZipChange, newZip, fetchMarketData, response, zipSum, trend, percentage, formatCurrency, minValue, maxValue, range, normalizedHeight, heightPercent
- **make** (1)
  - L66: make: "Toyota",
- **model** (1)
  - L67: model: "Camry",
- **year** (1)
  - L68: year: 2020,
- **price** (1)
  - L236: <p className="text-xs font-medium mb-2">6-Month Price Trend</p>
- **zip** (8)
  - L13: // Simple ZIP validation function
  - L14: const isValidZipCode = (zip: string): boolean => {
  - L15: return /^\d{5}(-\d{4})?$/.test(zip);
  - L136: <label htmlFor="zip-code" className="block text-sm font-medium mb-1">
  - L137: Enter ZIP Code for Local Pricing
- **storage** (2)
  - L11: import { supabase } from "@/integrations/supabase/client";
  - L61: const response = await supabase.functions.invoke(

### /workspaces/car-detective-mvp/src/components/home/OnboardingTour.tsx  (LOC 78)
exports: OnboardingTour
functions: OnboardingTour, closeOnboarding
- **vin** (1)
  - L39: "Enter VIN, plate, or manual details to get started",
- **dealer** (1)
  - L53: title: "Dealer Network",

### /workspaces/car-detective-mvp/src/components/home/PdfPreview.tsx  (LOC 35)
exports: PdfPreview
- **valuation** (1)
  - L24: Preview your vehicle valuation report before downloading.

### /workspaces/car-detective-mvp/src/components/home/PhotoScoringWidget.tsx  (LOC 204)
exports: PhotoScoringWidget
functions: PhotoScoringWidget, handleFileSelect, files, url, analyzePhotos, scoredPhotos, score, avgScore, getScoreColor, getConditionText
- **photos** (20)
  - L16: const [photos, setPhotos] = useState<PhotoScore[]>([]);
  - L27: const files = Array.from(event.target.files).slice(0, 3); // Limit to 3 photos for demo
  - L44: // Simulate API call to analyze photos
  - L48: const scoredPhotos = photosList.map((photo, index) => {
  - L52: ...photo,
- **url** (4)
  - L10: url: string;
  - L30: const url = URL.createObjectURL(file);
  - L32: url,
  - L153: src={photo.url}
- **storage** (1)
  - L27: const files = Array.from(event.target.files).slice(0, 3); // Limit to 3 photos for demo

### /workspaces/car-detective-mvp/src/components/home/PremiumFeatures.tsx  (LOC 76)
exports: PremiumFeatures
functions: features
- **dealer** (1)
  - L33: "Automotive dealer integrated",

### /workspaces/car-detective-mvp/src/components/home/PremiumHeroSection.tsx  (LOC 124)
exports: PremiumHeroSection
functions: handleMouseMove, scrollToValuation, section
- **valuation** (3)
  - L23: const section = document.querySelector('[data-section="valuation"]');
  - L53: Professional-Grade Valuation Engine
  - L78: Get Instant Valuation

### /workspaces/car-detective-mvp/src/components/home/PremiumServicesGrid.tsx  (LOC 59)
exports: PremiumServicesGrid
functions: services
- **valuation** (2)
  - L9: title: "Premium Valuation",
  - L10: description: "Get the most accurate vehicle valuation with our premium service."

### /workspaces/car-detective-mvp/src/components/home/ProofPointsSection.tsx  (LOC 65)
exports: ProofPointsSection
functions: proofPoints
- **dealer** (1)
  - L28: "Automotive dealer integrated"

### /workspaces/car-detective-mvp/src/components/home/SocialProofSection.tsx  (LOC 76)
exports: SocialProofSection
functions: testimonials
- **dealer** (1)
  - L18: company: "Auto Dealer Group",

### /workspaces/car-detective-mvp/src/components/home/TestimonialsSection.tsx  (LOC 99)
exports: TestimonialsSection
functions: TestimonialsSection, intervalId, goToPrevious, goToNext, currentTestimonial
- **valuation** (2)
  - L20: content: 'I was impressed with the accuracy and speed of the valuation. Highly recommended!',
  - L34: content: 'I found the valuation to be very close to the actual market value. A great tool for sellers.',

### /workspaces/car-detective-mvp/src/components/home/ValuePropositionSection.tsx  (LOC 57)
exports: ValuePropositionSection
functions: features
- **valuation** (1)
  - L9: title: "Free Basic Valuation",

### /workspaces/car-detective-mvp/src/components/home/WelcomeBanner.tsx  (LOC 25)
exports: WelcomeBanner
functions: WelcomeBanner, name
- **valuation** (1)
  - L20: Ready to find your next valuation?

### /workspaces/car-detective-mvp/src/components/index.ts  (LOC 83)
- **dealer** (1)
  - L60: export * from './dealer';
- **dedupe** (2)
  - L48: // Custom UI Components with unique names
  - L81: // Resolve specific conflicts by explicitly importing and re-exporting with unique names
- **valuation** (3)
  - L57: export * from './valuation';
  - L82: export { ValuationEmptyState } from './valuation/ValuationEmptyState';
  - L83: export { PhotoUploadAndScore as ValuationPhotoUpload } from './valuation/PhotoUploadAndScore';

### /workspaces/car-detective-mvp/src/components/layout/Footer.tsx  (LOC 47)
- **vin** (1)
  - L20: <li><a href="/vin-lookup" className="hover:text-gray-900">VIN Lookup</a></li>
- **valuation** (2)
  - L12: AI-powered vehicle valuation platform providing accurate market insights.
  - L18: <li><a href="/valuation" className="hover:text-gray-900">Free Valuation</a></li>

### /workspaces/car-detective-mvp/src/components/layout/Header.tsx  (LOC 100)
exports: Header
functions: handleLogout, goToDashboard
- **dealer** (2)
  - L35: if (userDetails?.role === 'dealer') return navigate('/dealer-dashboard');
  - L39: if (userDetails?.role === 'dealer') window.location.href = '/dealer-dashboard';
- **valuation** (1)
  - L56: <Link to="/valuation" className="hover:text-primary">Valuation</Link>

### /workspaces/car-detective-mvp/src/components/layout/MobileMenu.tsx  (LOC 63)
exports: MobileMenu
functions: menuItems
- **valuation** (1)
  - L12: { label: 'Valuation', href: '/valuation' },

### /workspaces/car-detective-mvp/src/components/layout/seo/index.tsx  (LOC 42)
exports: SEO
- **price** (1)
  - L16: keywords = 'vehicle valuation, car appraisal, auto value, car price, vehicle worth',
- **photos** (4)
  - L9: image?: string;
  - L17: image = '/images/hero-car.png',
  - L29: <meta property="og:image" content={image} />
  - L37: <meta name="twitter:image" content={image} />
- **url** (3)
  - L10: url?: string;
  - L18: url = window.location.href,
  - L30: <meta property="og:url" content={url} />
- **valuation** (2)
  - L14: title = 'Car Detective - AI-Powered Vehicle Valuation',
  - L16: keywords = 'vehicle valuation, car appraisal, auto value, car price, vehicle worth',

### /workspaces/car-detective-mvp/src/components/lookup/UnifiedLookupTabs.tsx  (LOC 271)
exports: UnifiedLookupTabs
functions: UnifiedLookupTabs, navigate, validateVin, handleVinSubmit, vehicleInfo, params, errorMessage, handlePlateSubmit, result, params, states
- **make** (2)
  - L66: make: vehicleInfo.make,
  - L115: make: result.vehicle.make,
- **model** (2)
  - L67: model: vehicleInfo.model,
  - L116: model: result.vehicle.model,
- **year** (2)
  - L65: year: vehicleInfo.year.toString(),
  - L114: year: result.vehicle.year.toString(),
- **vin** (33)
  - L19: const [vin, setVin] = useState('');
  - L29: // Use the real unified lookup service for plates only, direct service for VIN
  - L37: const validateVin = (vin: string) => {
  - L38: return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
  - L44: if (!validateVin(vin)) {
- **valuation** (3)
  - L60: navigateTo: '/valuation/followup'
  - L79: navigate(`/valuation/followup?${params.toString()}`);
  - L130: navigate(`/valuation/followup?${params.toString()}`);

### /workspaces/car-detective-mvp/src/components/lookup/VehicleDetailsGrid.tsx  (LOC 44)
exports: VehicleDetailsGrid
functions: VehicleDetailsGrid, details, nonEmptyDetails
- **make** (1)
  - L13: { label: 'Make', value: vehicle.make },
- **model** (1)
  - L14: { label: 'Model', value: vehicle.model },
- **year** (1)
  - L12: { label: 'Year', value: vehicle.year },
- **vin** (1)
  - L15: { label: 'VIN', value: vehicle.vin },

### /workspaces/car-detective-mvp/src/components/lookup/VehicleHistory.tsx  (LOC 83)
exports: VehicleHistory
functions: VehicleHistory, handleFetchHistory, historyData
- **vin** (3)
  - L9: vin: string;
  - L13: export function VehicleHistory({ vin, carfaxData }: VehicleHistoryProps) {
  - L20: const historyData = await carfaxService.getCarfaxData(vin);

### /workspaces/car-detective-mvp/src/components/lookup/VehicleInfoCard.tsx  (LOC 81)
exports: VehicleInfoCard
functions: formatCurrency
- **make** (2)
  - L7: make: string;
  - L38: {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
- **model** (2)
  - L8: model: string;
  - L38: {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
- **year** (2)
  - L9: year: number;
  - L38: {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
- **vin** (4)
  - L13: vin?: string;
  - L67: {vehicleInfo.vin && (
  - L69: <span className="font-medium">VIN:</span>
  - L71: {vehicleInfo.vin}

### /workspaces/car-detective-mvp/src/components/lookup/followup/FollowupStep.tsx  (LOC 211)
exports: FollowupStep
functions: handleSubmit, renderStepContent
- **make** (1)
  - L50: Average for {vehicle.year} {vehicle.make} {vehicle.model}: ~{((new Date().getFullYear() - (vehicle.year || 2020)) * 12000).toLocaleString()} miles
- **model** (1)
  - L50: Average for {vehicle.year} {vehicle.make} {vehicle.model}: ~{((new Date().getFullYear() - (vehicle.year || 2020)) * 12000).toLocaleString()} miles
- **year** (1)
  - L50: Average for {vehicle.year} {vehicle.make} {vehicle.model}: ~{((new Date().getFullYear() - (vehicle.year || 2020)) * 12000).toLocaleString()} miles
- **mileage** (4)
  - L38: case 'mileage':
  - L41: <Label htmlFor="mileage">Current Mileage</Label>
  - L43: id="mileage"
  - L45: placeholder="Enter current mileage"
- **photos** (4)
  - L165: case 'photos':
  - L168: <Label>Vehicle Photos</Label>
  - L171: <p className="text-gray-600 mb-2">Upload photos of your vehicle</p>
  - L177: Choose Photos
- **zip** (2)
  - L150: <Label htmlFor="zipcode">ZIP Code</Label>
  - L154: placeholder="Enter ZIP code"

### /workspaces/car-detective-mvp/src/components/lookup/followup/FollowupStepManager.tsx  (LOC 80)
exports: FollowupStepManager
- **valuation** (1)
  - L32: <CardTitle className="text-lg">Valuation Progress</CardTitle>

### /workspaces/car-detective-mvp/src/components/lookup/form-parts/EnhancedVehicleSelector.tsx  (LOC 453)
exports: EnhancedVehicleSelector
functions: EnhancedVehicleSelector, popularMakes, nonPopularMakes, handleMakeChange, selectedMake, handleModelChange, selectedModel, handleYearChange, currentYear, years, gridClass, getModelSelectStatus, getModelSelectPlaceholder, getTrimSelectStatus, getTrimSelectPlaceholder, StatusIndicator, icons
- **make** (17)
  - L60: // Handle make selection and fetch models
  - L117: if (!selectedMakeId) return "Select make first";
  - L156: <SkeletonSelect label="Make" />
  - L176: Make: {findMakeById(selectedMakeId)?.make_name || 'Unknown'} (ID: {selectedMakeId})
  - L199: {/* Enhanced Make Selection */}
- **model** (15)
  - L75: // Handle model selection and fetch trims
  - L122: return "Select model";
  - L133: if (!selectedModelId) return "Select model first";
  - L157: <SkeletonSelect label="Model" />
  - L261: {/* Enhanced Model Selection */}
- **year** (17)
  - L19: onYearChange: (year: number) => void;
  - L86: // Handle year change and refetch trims
  - L87: const handleYearChange = (year: number) => {
  - L88: onYearChange(year);
  - L92: fetchTrimsByModelId(selectedModelId, year);
- **env** (1)
  - L432: {import.meta.env.NODE_ENV === 'development' && (

### /workspaces/car-detective-mvp/src/components/lookup/form-parts/EnhancedVehicleSelectorWithLogos.tsx  (LOC 79)
exports: EnhancedVehicleSelectorWithLogos
functions: EnhancedVehicleSelectorWithLogos, formattedMakes, formattedModels, formattedYears
- **make** (6)
  - L32: const formattedMakes = makes.map(make => ({
  - L33: value: make.value,
  - L34: label: make.label,
  - L35: icon: make.icon || undefined
  - L51: <Label htmlFor="make">Make</Label>
- **model** (5)
  - L38: const formattedModels = models.map(model => ({
  - L39: value: model.value,
  - L40: label: model.label
  - L60: <Label htmlFor="model">Model</Label>
  - L65: placeholder="Select model..."
- **year** (5)
  - L43: const formattedYears = years.map(year => ({
  - L44: value: year.value,
  - L45: label: year.label
  - L69: <Label htmlFor="year">Year</Label>
  - L74: placeholder="Select year..."

### /workspaces/car-detective-mvp/src/components/lookup/form-parts/MakeAndModelSelector.tsx  (LOC 108)
functions: fetchMakes, fetchModels, handleMakeChange
- **make** (10)
  - L7: interface Make {
  - L27: const [makes, setMakes] = useState<Make[]>([]);
  - L65: setModelId(''); // Reset model when make changes
  - L71: <Label>Select Make</Label>
  - L74: <SelectValue placeholder="Select a make" />
- **model** (9)
  - L12: interface Model {
  - L28: const [models, setModels] = useState<Model[]>([]);
  - L65: setModelId(''); // Reset model when make changes
  - L88: <Label>Select Model</Label>
  - L91: <SelectValue placeholder={models.length ? "Select a model" : "Select make first"} />
- **storage** (3)
  - L3: import { supabase } from "@/integrations/supabase/client";
  - L33: const { data, error } = await supabase.from("makes").select("id, make_name");
  - L50: const { data, error } = await supabase

### /workspaces/car-detective-mvp/src/components/lookup/form-parts/UnifiedFollowUpQuestions.tsx  (LOC 203)
exports: UnifiedFollowUpQuestions
functions: UnifiedFollowUpQuestions, setTitleStatus, setPreviousOwners, setPreviousUse, getExistingAccidentDetails, existing, setHasAccident, existingDetails, setAccidentDescription, existingDetails, setTireCondition, setDashboardLights, setHasModifications, setModificationTypes, currentAccidentDetails, existingDetails
- **make** (1)
  - L7: make: string;
- **model** (1)
  - L8: model: string;
- **year** (1)
  - L6: year: string;
- **mileage** (1)
  - L10: mileage: string;
- **dealer** (1)
  - L19: serviceHistory?: 'dealer' | 'independent' | 'owner' | 'unknown';

### /workspaces/car-detective-mvp/src/components/lookup/form-parts/ValuationFormActions.tsx  (LOC 101)
exports: ValuationFormActions
functions: ValuationFormActions, navigate, handleContinueToFollowUp, params, handleFreeValuation, handlePremiumValuation
- **make** (5)
  - L17: make?: string;
  - L37: if (!formComplete || !vehicleData?.make || !vehicleData?.model || !vehicleData?.year) {
  - L43: make: vehicleData.make,
  - L59: if (formComplete && vehicleData?.make && vehicleData?.model && vehicleData?.year) {
  - L67: if (formComplete && vehicleData?.make && vehicleData?.model && vehicleData?.year) {
- **model** (5)
  - L18: model?: string;
  - L37: if (!formComplete || !vehicleData?.make || !vehicleData?.model || !vehicleData?.year) {
  - L44: model: vehicleData.model,
  - L59: if (formComplete && vehicleData?.make && vehicleData?.model && vehicleData?.year) {
  - L67: if (formComplete && vehicleData?.make && vehicleData?.model && vehicleData?.year) {
- **year** (5)
  - L16: year?: number;
  - L37: if (!formComplete || !vehicleData?.make || !vehicleData?.model || !vehicleData?.year) {
  - L45: year: vehicleData.year.toString(),
  - L59: if (formComplete && vehicleData?.make && vehicleData?.model && vehicleData?.year) {
  - L67: if (formComplete && vehicleData?.make && vehicleData?.model && vehicleData?.year) {
- **vin** (1)
  - L47: ...(vehicleData.vin && { vin: vehicleData.vin }),
- **url** (1)
  - L41: // Create URL params with vehicle data
- **valuation** (1)
  - L55: navigate(`/valuation/followup?${params.toString()}`);

### /workspaces/car-detective-mvp/src/components/lookup/form-parts/VehicleDetailsInputs.tsx  (LOC 112)
exports: VehicleDetailsInputs
- **mileage** (6)
  - L15: mileage: string;
  - L28: mileage,
  - L43: <Label htmlFor="mileage">Mileage</Label>
  - L45: id="mileage"
  - L47: placeholder="Enter mileage"
- **zip** (1)
  - L56: placeholder="Enter ZIP code"

### /workspaces/car-detective-mvp/src/components/lookup/photo/PhotoLookupForm.tsx  (LOC 102)
exports: PhotoLookupForm
functions: handleFileChange, files, newPreviewUrls, handleRemoveFile, handleSubmit
- **photos** (9)
  - L4: import { Camera, Image, Upload, X } from "lucide-react";
  - L49: Upload photos of your vehicle for AI-powered valuation
  - L53: id="photo-upload"
  - L55: accept="image/*"
  - L59: <label htmlFor="photo-upload">
- **url** (5)
  - L22: const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
  - L30: // Revoke the URL to prevent memory leaks
  - L31: URL.revokeObjectURL(prev[index]);
  - L69: {previewUrls.map((url, index) => (
  - L73: src={url}
- **storage** (1)
  - L18: const files = Array.from(e.target.files);
- **valuation** (1)
  - L49: Upload photos of your vehicle for AI-powered valuation

### /workspaces/car-detective-mvp/src/components/lookup/plate/PlateInfoCard.tsx  (LOC 104)
exports: PlateInfoCard
functions: PlateInfoCard, displayField
- **make** (2)
  - L58: <p className="text-sm font-medium text-muted-foreground">Make</p>
  - L60: {displayField(vehicleInfo.make)}
- **model** (2)
  - L64: <p className="text-sm font-medium text-muted-foreground">Model</p>
  - L66: {displayField(vehicleInfo.model)}
- **year** (2)
  - L70: <p className="text-sm font-medium text-muted-foreground">Year</p>
  - L72: {displayField(vehicleInfo.year)}

### /workspaces/car-detective-mvp/src/components/lookup/scoring/BreakdownList.tsx  (LOC 22)
exports: BreakdownList
functions: BreakdownList
- **valuation** (1)
  - L15: <h4 className="font-medium">Valuation Breakdown</h4>

### /workspaces/car-detective-mvp/src/components/lookup/scoring/ConfidenceScore.tsx  (LOC 46)
exports: ConfidenceScore
functions: ConfidenceScore, getScoreColor, getScoreLabel
- **valuation** (1)
  - L41: {score}% confidence in valuation accuracy

### /workspaces/car-detective-mvp/src/components/lookup/types/valuation.ts  (LOC 29)
exports: ValuationFormProps, ManualValuationData
- **make** (1)
  - L10: make: string;
- **model** (1)
  - L11: model: string;
- **year** (1)
  - L12: year: number;
- **mileage** (1)
  - L13: mileage?: number;
- **vin** (1)
  - L26: vin?: string;

### /workspaces/car-detective-mvp/src/components/market/GoogleStyleListings.tsx  (LOC 240)
exports: GoogleStyleListings
functions: displayedListings, sortedListings, getSourceTypeColor, formatPrice, formatMileage
- **make** (4)
  - L13: make: string;
  - L71: We couldn't find any active listings for {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model} in your area.
  - L85: {listings.length} active listings for {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
  - L119: {listing.year} {listing.make} {listing.model}
- **model** (4)
  - L14: model: string;
  - L71: We couldn't find any active listings for {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model} in your area.
  - L85: {listings.length} active listings for {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
  - L119: {listing.year} {listing.make} {listing.model}
- **year** (4)
  - L12: year: number;
  - L71: We couldn't find any active listings for {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model} in your area.
  - L85: {listings.length} active listings for {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
  - L119: {listing.year} {listing.make} {listing.model}
- **price** (11)
  - L25: const [sortBy, setSortBy] = useState<'price' | 'mileage' | 'distance' | 'days_on_market'>('price');
  - L32: case 'price':
  - L33: return a.price - b.price;
  - L52: const formatPrice = (price: number) => {
  - L57: }).format(price);
- **mileage** (8)
  - L25: const [sortBy, setSortBy] = useState<'price' | 'mileage' | 'distance' | 'days_on_market'>('price');
  - L34: case 'mileage':
  - L35: return (a.mileage || 0) - (b.mileage || 0);
  - L60: const formatMileage = (mileage?: number) => {
  - L61: if (!mileage) return 'N/A';
- **dealer** (3)
  - L45: case 'dealer': return 'bg-blue-100 text-blue-800';
  - L123: <Badge className={getSourceTypeColor(listing.source_type || 'dealer')}>
  - L161: {/* Dealer Info */}

### /workspaces/car-detective-mvp/src/components/marketing/AnnouncementBar.tsx  (LOC 42)
exports: AnnouncementBar
functions: AnnouncementBar, dismissed, handleDismiss
- **price** (1)
  - L29: New! Dealer-beat Offers & Marketplace Price Averages now live in
- **dealer** (1)
  - L29: New! Dealer-beat Offers & Marketplace Price Averages now live in
- **valuation** (1)
  - L30: Premium Valuation.

### /workspaces/car-detective-mvp/src/components/modals/ConfirmOfferModal.tsx  (LOC 201)
exports: ConfirmOfferModal
functions: ConfirmOfferModal, steps, handleSubmit
- **make** (2)
  - L13: make: string;
  - L84: {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
- **model** (2)
  - L14: model: string;
  - L84: {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
- **year** (2)
  - L12: year: string;
  - L84: {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
- **vin** (5)
  - L36: const [activeTab, setActiveTab] = useState<'vin' | 'plate'>('vin');
  - L113: Enter your VIN OR License Plate Number
  - L118: { label: 'VIN #', value: 'vin' },
  - L122: onChange={(value) => setActiveTab(value as 'vin' | 'plate')}
  - L137: How do I find my VIN?
- **photos** (2)
  - L16: image: string;
  - L76: src={vehicleInfo.image}

### /workspaces/car-detective-mvp/src/components/modals/PhotoToolModal.tsx  (LOC 119)
exports: PhotoToolModal
functions: PhotoToolModal, steps
- **photos** (4)
  - L38: title="Use our awesome photo tool!"
  - L42: onClick={() => onPhotoToolSelect('photo-tool')}
  - L59: Access our photo tool via email or text
  - L99: Can't take the photos right now?

### /workspaces/car-detective-mvp/src/components/modals/ValuationStepsModal.tsx  (LOC 200)
exports: ValuationStepsModal
functions: ValuationStepsModal, steps
- **vin** (1)
  - L149: <p className="text-xs text-muted-foreground">VIN or license plate</p>
- **photos** (2)
  - L62: <span className="text-sm text-muted-foreground">Single-photo AI demo</span>
  - L113: <span className="text-sm font-medium text-foreground">Multi-photo AI analysis</span>
- **dealer** (1)
  - L125: <span className="text-sm font-medium text-foreground">Dealer offers</span>
- **valuation** (4)
  - L30: title="Get Your Vehicle Valuation"
  - L31: subtitle="Choose your valuation type and we'll guide you through the process"
  - L52: <h3 className="text-xl font-bold text-foreground mb-2">Basic Valuation</h3>
  - L184: Start Basic Valuation (FREE)

### /workspaces/car-detective-mvp/src/components/notifications/DealerOfferNotification.tsx  (LOC 95)
exports: DealerOfferNotification, showDealerOfferNotification
functions: DealerOfferNotification, vehicleText, handleDismiss, showDealerOfferNotification
- **make** (2)
  - L20: make: string;
  - L36: ? `your ${vehicle.year} ${vehicle.make} ${vehicle.model}`
- **model** (2)
  - L21: model: string;
  - L36: ? `your ${vehicle.year} ${vehicle.make} ${vehicle.model}`
- **year** (2)
  - L19: year: number;
  - L36: ? `your ${vehicle.year} ${vehicle.make} ${vehicle.model}`
- **dealer** (4)
  - L17: dealerName?: string;
  - L30: dealerName = "A dealer",
  - L52: New Dealer Offer
  - L57: <span className="font-semibold">{dealerName}</span>{" "}

### /workspaces/car-detective-mvp/src/components/pdf/PDFPreview.tsx  (LOC 127)
exports: PDFPreview
functions: handleDownloadSample, reportData
- **price** (1)
  - L99: Unlock the full valuation report with detailed condition assessment, market analysis, and price adjustments.
- **mileage** (1)
  - L15: mileage: number;
- **vin** (1)
  - L107: <li>• VIN history verification</li>
- **valuation** (2)
  - L62: PDF Valuation Report
  - L99: Unlock the full valuation report with detailed condition assessment, market analysis, and price adjustments.

### /workspaces/car-detective-mvp/src/components/premium/BuyCreditsModal.tsx  (LOC 122)
exports: BuyCreditsModal
functions: creditPackages, BuyCreditsModal, handlePurchase
- **price** (5)
  - L28: price: 49,
  - L36: price: 99,
  - L44: price: 299,
  - L90: <div className="text-3xl font-bold">${pkg.price}</div>
  - L95: ${(pkg.price / pkg.credits).toFixed(2)} per credit

### /workspaces/car-detective-mvp/src/components/premium/ComparisonSection.tsx  (LOC 135)
exports: ComparisonSectionProps, ComparisonSection
functions: ComparisonSection, features
- **vin** (1)
  - L11: { name: "VIN/Plate/Manual Lookup", free: true, premium: true },
- **photos** (2)
  - L13: { name: "Single Photo AI Scoring", free: true, premium: true },
  - L14: { name: "Multi-Photo AI Analysis", free: false, premium: true },
- **dealer** (2)
  - L18: { name: "Dealer-Beat Offers", free: false, premium: true },
  - L38: valuation data available anywhere—combining CARFAX®, dealer offers,
- **valuation** (2)
  - L38: valuation data available anywhere—combining CARFAX®, dealer offers,
  - L125: Get Premium Valuation Now

### /workspaces/car-detective-mvp/src/components/premium/FeaturesSection.tsx  (LOC 152)
exports: FeaturesSection
functions: FeaturesSection, features, getColorClass
- **year** (1)
  - L56: "Predictive analysis of your vehicle's value over the next year with optimal selling time",
- **photos** (2)
  - L30: title: "AI Photo Analysis",
  - L32: "Upload up to 5 photos for AI to analyze condition, damage, and wear patterns",
- **dealer** (1)
  - L38: title: "Dealer-Beat Offers",
- **zip** (1)
  - L70: title: "ZIP Market Analysis",
- **valuation** (4)
  - L72: "Location-adjusted valuation based on supply and demand in your specific region",
  - L105: Premium Valuation Features
  - L108: Our premium valuation service combines multiple data sources, AI
  - L110: comprehensive vehicle valuation available.

### /workspaces/car-detective-mvp/src/components/premium/MarketOffersTab.tsx  (LOC 202)
exports: MarketOffersTab
functions: MarketOffersTab, prices, sum, average, median, sortedOffers
- **make** (1)
  - L33: make: string;
- **model** (1)
  - L34: model: string;
- **year** (1)
  - L35: year: number;
- **price** (13)
  - L12: price: number;
  - L48: const [sortBy, setSortBy] = useState<'price' | 'distance' | 'date'>('price');
  - L56: const prices = offers.map((offer: MarketOffer) => offer.price).sort((a: number, b: number) => a - b);
  - L57: const sum = prices.reduce((sum: number, price: number) => sum + price, 0);
  - L75: case 'price':
- **mileage** (2)
  - L14: mileage: number;
  - L184: <span>{offer.mileage.toLocaleString()} miles</span>
- **photos** (1)
  - L18: photos?: string[];
- **dealer** (2)
  - L11: dealerName: string;
  - L174: <h4 className="font-semibold">{offer.dealerName}</h4>
- **valuation** (6)
  - L24: median: number;
  - L53: return { average: 0, median: 0, min: 0, max: 0, count: 0 };
  - L59: const median = prices.length % 2 === 0
  - L65: median,
  - L114: <p className="text-2xl font-bold">{formatCurrency(marketStats.median)}</p>

### /workspaces/car-detective-mvp/src/components/premium/MarketTrends.tsx  (LOC 174)
exports: MarketTrends
functions: MarketTrends, generateMockData, startPrice, months, variance, depreciation, marketData, firstPrice, lastPrice, priceDifference, percentChange, trendDirection, formatCurrency
- **make** (2)
  - L16: make: string;
  - L85: {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
- **model** (2)
  - L17: model: string;
  - L85: {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
- **year** (3)
  - L18: year: number;
  - L85: {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
  - L110: : "This vehicle has maintained stable value over the past year."}
- **url** (1)
  - L136: fill="url(#colorValue)"

### /workspaces/car-detective-mvp/src/components/premium/PremiumAccessGate.tsx  (LOC 128)
exports: PremiumAccessGate
functions: PremiumAccessGate, navigate, handleUnlock, success
- **valuation** (2)
  - L40: navigate(`/pricing?valuation=${valuationId}`);
  - L66: Unlock this premium valuation to get detailed analytics, market comparison, and more.

### /workspaces/car-detective-mvp/src/components/premium/PremiumAccessRequired.tsx  (LOC 71)
exports: PremiumAccessRequired
functions: PremiumAccessRequired, navigate, handleGetPremium
- **dealer** (1)
  - L47: with comprehensive vehicle valuation reports, CARFAX history, dealer
- **valuation** (2)
  - L46: Upgrade to our premium valuation package to unlock this feature along
  - L47: with comprehensive vehicle valuation reports, CARFAX history, dealer

### /workspaces/car-detective-mvp/src/components/premium/PremiumCard.tsx  (LOC 69)
exports: PremiumCard
functions: PremiumCard
- **price** (3)
  - L11: price: string;
  - L20: price,
  - L46: <div className="text-3xl font-bold">{price}</div>

### /workspaces/car-detective-mvp/src/components/premium/PremiumHero.tsx  (LOC 71)
exports: PremiumHero
functions: PremiumHero
- **dealer** (1)
  - L29: Get dealer-competitive offers, full vehicle history, and pricing
- **valuation** (2)
  - L25: Advanced Vehicle Valuation & Analytics
  - L30: forecasts with our comprehensive premium valuation tools.

### /workspaces/car-detective-mvp/src/components/premium/PremiumSuccessPage.tsx  (LOC 98)
exports: PremiumSuccessPage
functions: navigate, valuationId, handleDownloadReport, handleViewDashboard
- **dealer** (1)
  - L66: Dealer offers and recommendations
- **valuation** (3)
  - L23: navigate(`/valuation/${valuationId}/download`);
  - L44: Thank you for upgrading to premium. Your premium valuation report is now ready.
  - L54: Comprehensive valuation report

### /workspaces/car-detective-mvp/src/components/premium/PremiumValuationSection.tsx  (LOC 54)
functions: PremiumValuationSection, isPremium
- **dealer** (1)
  - L12: ['admin', 'dealer'].includes(userDetails?.role || '') ||
- **valuation** (3)
  - L20: <h3 className="text-lg font-semibold mb-2">Premium Valuation</h3>
  - L22: Upgrade to access advanced valuation features
  - L35: Premium Valuation Features

### /workspaces/car-detective-mvp/src/components/premium/ValuationBreakdown.tsx  (LOC 76)
exports: ValuationBreakdown
functions: ValuationBreakdown, getAdjustmentIcon, formatAdjustment, sign
- **make** (1)
  - L30: Detailed breakdown of factors affecting your {valuation.vehicle_info.year} {valuation.vehicle_info.make} {valuation.vehicle_info.model} valuation
- **model** (1)
  - L30: Detailed breakdown of factors affecting your {valuation.vehicle_info.year} {valuation.vehicle_info.make} {valuation.vehicle_info.model} valuation
- **year** (1)
  - L30: Detailed breakdown of factors affecting your {valuation.vehicle_info.year} {valuation.vehicle_info.make} {valuation.vehicle_info.model} valuation
- **valuation** (8)
  - L4: import { ValuationHistory, ValuationBreakdownItem } from "@/types/valuation-history";
  - L8: valuation: ValuationHistory;
  - L12: export const ValuationBreakdown = ({ valuation, breakdown = [] }: ValuationBreakdownProps) => {
  - L28: <CardTitle>Valuation Breakdown</CardTitle>
  - L30: Detailed breakdown of factors affecting your {valuation.vehicle_info.year} {valuation.vehicle_info.make} {valuation.vehicle_info.model} valuation

### /workspaces/car-detective-mvp/src/components/premium/VehicleDataInfo.tsx  (LOC 56)
exports: VehicleDataInfo
functions: VehicleDataInfo, handleRefreshData, currentYear, yearOptions
- **year** (1)
  - L31: <h4 className="font-medium">Current Year</h4>

### /workspaces/car-detective-mvp/src/components/premium/account/index.ts  (LOC 3)
- **storage** (1)
  - L2: // Account components consolidated into main premium index

### /workspaces/car-detective-mvp/src/components/premium/checkout/CheckoutSummary.tsx  (LOC 51)
exports: CheckoutSummary
functions: CheckoutSummary
- **valuation** (1)
  - L22: <CardTitle className="text-amber-800">Premium Valuation</CardTitle>

### /workspaces/car-detective-mvp/src/components/premium/checkout/PremiumCheckoutButton.tsx  (LOC 25)
exports: PremiumCheckoutButton
functions: PremiumCheckoutButton
- **valuation** (1)
  - L20: Get Premium Valuation <ArrowRight className="ml-2 h-4 w-4" />

### /workspaces/car-detective-mvp/src/components/premium/dashboard/index.ts  (LOC 3)
- **storage** (1)
  - L2: // Premium dashboard components consolidated into main premium index

### /workspaces/car-detective-mvp/src/components/premium/features/ComprehensiveFeatureSelector.tsx  (LOC 216)
exports: ComprehensiveFeatureSelector
functions: ComprehensiveFeatureSelector, toggleFeature, isFeatureSelected
- **price** (2)
  - L96: name: "Price Comparison Tool",
  - L98: "See how your vehicle's price stacks up against the competition.",
- **mileage** (2)
  - L119: name: "Mileage Impact Assessment",
  - L120: description: "See how mileage affects your vehicle's value.",
- **valuation** (4)
  - L41: name: "Valuation Insights",
  - L126: "Adjust the valuation based on your vehicle's specific condition.",
  - L136: name: "Full Valuation Report",
  - L137: description: "Download a detailed report with all valuation data.",

### /workspaces/car-detective-mvp/src/components/premium/features/EnhancedPremiumFeaturesTabs.tsx  (LOC 69)
exports: EnhancedPremiumFeaturesTabs
functions: EnhancedPremiumFeaturesTabs, features
- **photos** (1)
  - L17: title: "AI Photo Analysis",
- **storage** (1)
  - L42: comprehensive insights into your vehicle's value and market position.
- **valuation** (1)
  - L41: Our premium valuation includes advanced features that provide

### /workspaces/car-detective-mvp/src/components/premium/features/PremiumFeaturesTabs.tsx  (LOC 54)
exports: PremiumFeaturesTabs
functions: PremiumFeaturesTabs
- **dealer** (1)
  - L28: <li>• Dealer network access</li>

### /workspaces/car-detective-mvp/src/components/premium/features/PremiumInfoCards.tsx  (LOC 37)
exports: PremiumInfoCards
functions: PremiumInfoCards
- **dealer** (1)
  - L29: <h3 className="text-lg font-semibold mb-2">Dealer Network</h3>

### /workspaces/car-detective-mvp/src/components/premium/features/data/premium-features.ts  (LOC 88)
exports: getCategoryFeatures
functions: getCategoryFeatures
- **price** (2)
  - L30: "Price projections for the next 12 months to help you decide the best time to sell",
  - L54: "In-depth analysis of similar vehicles in your market with price comparisons",
- **photos** (1)
  - L62: "AI-powered verification of vehicle condition from your photos to ensure accuracy",
- **dealer** (1)
  - L20: title: "Dealer Offers",
- **valuation** (2)
  - L38: "Detailed confidence analysis showing how certain we are about your valuation",
  - L46: "Downloadable, shareable PDF report with all valuation details and insights",

### /workspaces/car-detective-mvp/src/components/premium/form/AccuracyMeter.tsx  (LOC 97)
exports: AccuracyMeter
functions: AccuracyMeter, validStepsCount, calculatedAccuracy, getColorClass, getStatusIcon, getStatusMessage
- **valuation** (3)
  - L51: return "Please complete more fields for an accurate valuation.";
  - L58: <span className="font-medium">Valuation Accuracy</span>
  - L67: Higher accuracy leads to more precise valuation estimates.

### /workspaces/car-detective-mvp/src/components/premium/form/PremiumValuationForm.tsx  (LOC 175)
exports: PremiumValuationForm
functions: premiumValuationSchema, conditionOptions, PremiumValuationForm, form, onSubmit
- **make** (3)
  - L16: make: z.string().min(1, "Make is required"),
  - L47: make: "",
  - L81: setValue("make", makeId);
- **model** (3)
  - L17: model: z.string().min(1, "Model is required"),
  - L48: model: "",
  - L86: setValue("model", modelId);
- **year** (4)
  - L18: year: z.number().min(1900).max(new Date().getFullYear() + 1),
  - L49: year: new Date().getFullYear(),
  - L93: name="year"
  - L96: <FormLabel>Year</FormLabel>
- **mileage** (5)
  - L19: mileage: z.number().min(0),
  - L50: mileage: 0,
  - L111: name="mileage"
  - L114: <FormLabel>Mileage</FormLabel>
  - L119: {...register("mileage", { valueAsNumber: true })}
- **vin** (5)
  - L26: vin: z.string().optional(),
  - L57: vin: "",
  - L149: name="vin"
  - L152: <FormLabel>VIN (Optional)</FormLabel>
  - L156: placeholder="Enter VIN"
- **zip** (4)
  - L21: zipCode: z.string().min(5, "Valid ZIP code required"),
  - L133: <FormLabel>ZIP Code</FormLabel>
  - L137: placeholder="Enter ZIP code"
  - L139: {...register("zipCode", { required: "ZIP code is required" })}
- **schema** (2)
  - L4: import { zodResolver } from "@hookform/resolvers/zod";
  - L5: import { z } from "zod";
- **valuation** (3)
  - L66: toast.success("Valuation request submitted successfully!");
  - L68: toast.error("Failed to submit valuation request");
  - L170: {isSubmitting ? "Submitting..." : "Get Premium Valuation"}

### /workspaces/car-detective-mvp/src/components/premium/form/StepProgressIndicator.tsx  (LOC 94)
exports: StepProgressIndicator
functions: StepProgressIndicator, steps, stepNumber, StepIcon, isActive, isCompleted
- **photos** (2)
  - L8: Image,
  - L34: { icon: Image, label: "Photos" },

### /workspaces/car-detective-mvp/src/components/premium/form/initialization/FormInitializer.tsx  (LOC 55)
exports: FormInitializer
functions: FormInitializer, savedFormData, savedVehicleData, vehicleData
- **valuation** (1)
  - L3: import { FormData } from "@/types/premium-valuation";

### /workspaces/car-detective-mvp/src/components/premium/form/steps/ConditionStep.tsx  (LOC 55)
exports: ConditionStep
functions: ConditionStep, isValid, handleConditionChange
- **valuation** (1)
  - L3: import { FormData } from "@/types/premium-valuation";

### /workspaces/car-detective-mvp/src/components/premium/form/steps/DrivingBehaviorStep.tsx  (LOC 95)
exports: DrivingBehaviorStep
functions: DrivingBehaviorStep, handleDrivingBehaviorChange, handleAnnualMileageChange
- **year** (1)
  - L67: How many miles do you drive per year on average?
- **mileage** (1)
  - L65: <h3 className="text-lg font-medium">Annual Mileage</h3>
- **valuation** (1)
  - L4: import { FormData } from "@/types/premium-valuation";

### /workspaces/car-detective-mvp/src/components/premium/form/steps/FeatureSelectionStep.tsx  (LOC 57)
exports: FeatureSelectionStep
functions: FeatureSelectionStep, handlePackageLevelChange, packageOptions
- **valuation** (1)
  - L4: import { FormData } from "@/types/premium-valuation";

### /workspaces/car-detective-mvp/src/components/premium/form/steps/FuelTypeStep.tsx  (LOC 156)
exports: FuelTypeStep
functions: FUEL_TYPES, FuelTypeStep, handleFuelTypeChange, selectedFuelType
- **valuation** (2)
  - L3: import { FormData } from "@/types/premium-valuation";
  - L92: Select the fuel type for your vehicle to ensure an accurate valuation.

### /workspaces/car-detective-mvp/src/components/premium/form/steps/MaintenanceHistoryStep.tsx  (LOC 113)
exports: MaintenanceHistoryStep
functions: MaintenanceHistoryStep, handleHistoryChange, handleMaintenanceChange, handleNotesChange, addMaintenanceRecord
- **dealer** (3)
  - L24: const handleHistoryChange = (newHistory: 'dealer' | 'independent' | 'owner' | 'unknown') => {
  - L59: onChange={(e) => handleHistoryChange(e.target.value as 'dealer' | 'independent' | 'owner' | 'unknown')}
  - L63: <option value="dealer">Dealer</option>
- **valuation** (1)
  - L7: import { FormData } from "@/types/premium-valuation";

### /workspaces/car-detective-mvp/src/components/premium/form/steps/MileageStep.tsx  (LOC 109)
exports: MileageStep
functions: MileageStep, handleBlur, mileage, handleFocus, handleMileageChange, value, mileage, isValid
- **mileage** (19)
  - L19: formData.mileage ? formData.mileage.toString() : "",
  - L25: const mileage = parseInt(inputValue.replace(/,/g, ""), 10);
  - L26: setInputValue(mileage.toLocaleString());
  - L41: setFormData((prev: FormData) => ({ ...prev, mileage: 0 }));
  - L45: const mileage = parseInt(value, 10);
- **valuation** (3)
  - L6: import { FormData } from "@/types/premium-valuation";
  - L75: valuation.
  - L99: a more precise valuation.

### /workspaces/car-detective-mvp/src/components/premium/form/steps/PredictionReviewStep.tsx  (LOC 245)
exports: PredictionReviewStep
functions: useValuation, fetchValuationPrediction, result, PredictionReviewStep, handleGeneratePrediction, valuationData, result
- **make** (4)
  - L39: make: data.make,
  - L126: make: formData.make,
  - L202: Year, Make, Model:
  - L204: <div>{formData.year} {formData.make} {formData.model}</div>
- **model** (4)
  - L40: model: data.model,
  - L127: model: formData.model,
  - L202: Year, Make, Model:
  - L204: <div>{formData.year} {formData.make} {formData.model}</div>
- **year** (4)
  - L41: year: data.year,
  - L125: year: formData.year,
  - L202: Year, Make, Model:
  - L204: <div>{formData.year} {formData.make} {formData.model}</div>
- **mileage** (4)
  - L42: mileage: data.mileage,
  - L129: mileage: formData.mileage || 0,
  - L209: <div className="text-muted-foreground">Mileage:</div>
  - L210: <div>{formData.mileage?.toLocaleString() || "N/A"} miles</div>
- **storage** (4)
  - L6: import { supabase } from '@/integrations/supabase/client';
  - L36: const { data: valuationRequest, error: requestError } = await supabase
  - L38: .insert({
  - L55: const { data: resultData, error: resultError } = await supabase.functions.invoke('valuation-result', {
- **valuation** (11)
  - L16: // Define a type for valuation result
  - L24: // Real valuation hook that connects to actual valuation engine
  - L35: // Create valuation request using actual form data
  - L54: // Get valuation result using the actual valuation-result edge function
  - L55: const { data: resultData, error: resultError } = await supabase.functions.invoke('valuation-result', {

### /workspaces/car-detective-mvp/src/components/premium/form/steps/VehicleDetailsStep.tsx  (LOC 113)
exports: VehicleDetailsStep
functions: VehicleDetailsStep, isValid, handleTransmissionChange, handleFuelTypeChange, handleTrimChange, handleColorChange
- **valuation** (2)
  - L3: import { FormData } from "@/types/premium-valuation";
  - L50: Additional vehicle specifications help provide a more accurate valuation.

### /workspaces/car-detective-mvp/src/components/premium/form/steps/VehicleIdentificationStep.tsx  (LOC 200)
exports: VehicleIdentificationStep
functions: VehicleIdentificationStep, isValid, handleVinChange, vin, handlePlateChange, plate, handleStateChange, handleMakeChange, handleModelChange, handleYearChange, yearValue, year, states
- **make** (5)
  - L36: isValid = Boolean(formData.make && formData.model && formData.year);
  - L58: setFormData((prev: FormData) => ({ ...prev, make: e.target.value }));
  - L165: <Label htmlFor="make">Make</Label>
  - L167: id="make"
  - L168: value={formData.make || ""}
- **model** (5)
  - L36: isValid = Boolean(formData.make && formData.model && formData.year);
  - L62: setFormData((prev: FormData) => ({ ...prev, model: e.target.value }));
  - L174: <Label htmlFor="model">Model</Label>
  - L176: id="model"
  - L177: value={formData.model || ""}
- **year** (6)
  - L36: isValid = Boolean(formData.make && formData.model && formData.year);
  - L67: const year = yearValue ? parseInt(yearValue, 10) : new Date().getFullYear();
  - L68: setFormData((prev: FormData) => ({ ...prev, year }));
  - L183: <Label htmlFor="year">Year</Label>
  - L185: id="year"
- **vin** (14)
  - L23: const [lookupMethod, setLookupMethod] = useState<"vin" | "plate" | "manual">("vin");
  - L29: case "vin":
  - L30: isValid = Boolean(formData.vin && formData.vin.length === 17);
  - L44: const vin = e.target.value.toUpperCase();
  - L45: setFormData((prev: FormData) => ({ ...prev, vin }));
- **valuation** (2)
  - L3: import { FormData } from "@/types/premium-valuation";
  - L86: Choose how you'd like to identify your vehicle for valuation.

### /workspaces/car-detective-mvp/src/components/premium/form/steps/accident-history/AccidentHistoryForm.tsx  (LOC 113)
exports: AccidentHistoryForm
functions: AccidentHistoryForm, hasAccidentBool, isValid, handleAccidentChange, value, handleDetailsChange, hasAccidentStr
- **valuation** (2)
  - L3: import { FormData } from "@/types/premium-valuation";
  - L62: valuation.

### /workspaces/car-detective-mvp/src/components/premium/form/steps/prediction-review/GetValuationButton.tsx  (LOC 34)
exports: GetValuationButton
functions: GetValuationButton
- **valuation** (2)
  - L27: Getting Valuation...
  - L30: "Get My Valuation"

### /workspaces/car-detective-mvp/src/components/premium/form/steps/prediction-review/VehicleSummaryCard.tsx  (LOC 40)
exports: VehicleSummaryCard
functions: VehicleSummaryCard
- **make** (1)
  - L19: <span className="font-medium">Make:</span> {formData.make}
- **model** (1)
  - L22: <span className="font-medium">Model:</span> {formData.model}
- **year** (1)
  - L25: <span className="font-medium">Year:</span> {formData.year}
- **mileage** (1)
  - L28: <span className="font-medium">Mileage:</span> {formData.mileage?.toLocaleString()} miles
- **valuation** (1)
  - L4: import { FormData } from "@/types/premium-valuation";

### /workspaces/car-detective-mvp/src/components/premium/form/steps/review/DrivingBehaviorSummary.tsx  (LOC 46)
exports: DrivingBehaviorSummary
functions: DrivingBehaviorSummary, hasDrivingData
- **year** (1)
  - L40: <span className="font-medium">{formData.annualMileage.toLocaleString()} miles/year</span>
- **mileage** (1)
  - L39: <span className="text-gray-500 block">Annual Mileage</span>
- **valuation** (1)
  - L3: import { FormData } from "@/types/premium-valuation";

### /workspaces/car-detective-mvp/src/components/premium/form/steps/review/FeaturesSummary.tsx  (LOC 36)
exports: FeaturesSummary
functions: FeaturesSummary, features
- **valuation** (1)
  - L3: import { FormData } from "@/types/premium-valuation";

### /workspaces/car-detective-mvp/src/components/premium/form/steps/review/PhotosSummary.tsx  (LOC 45)
exports: PhotosSummary
functions: PhotosSummary, photos
- **photos** (11)
  - L10: const photos = formData.photos || [];
  - L12: if (photos.length === 0) {
  - L15: <h3 className="text-md font-medium mb-2">Vehicle Photos</h3>
  - L16: <p className="text-sm text-gray-500">No photos uploaded</p>
  - L23: <h3 className="text-md font-medium mb-2">Vehicle Photos</h3>
- **url** (1)
  - L31: src={photo instanceof File ? URL.createObjectURL(photo) : photo}
- **valuation** (1)
  - L3: import { FormData } from "@/types/premium-valuation";

### /workspaces/car-detective-mvp/src/components/premium/form/steps/review/ReviewActions.tsx  (LOC 35)
exports: ReviewActions
functions: ReviewActions
- **valuation** (1)
  - L22: Get Premium Valuation

### /workspaces/car-detective-mvp/src/components/premium/form/steps/review/VehicleDetailsSummary.tsx  (LOC 47)
exports: VehicleDetailsSummary
functions: VehicleDetailsSummary
- **valuation** (1)
  - L3: import { FormData } from "@/types/premium-valuation";

### /workspaces/car-detective-mvp/src/components/premium/form/steps/review/VehicleSummary.tsx  (LOC 43)
exports: VehicleSummary
functions: VehicleSummary
- **make** (2)
  - L15: <span className="text-gray-500 block">Year, Make, Model</span>
  - L17: {formData.year} {formData.make} {formData.model}
- **model** (2)
  - L15: <span className="text-gray-500 block">Year, Make, Model</span>
  - L17: {formData.year} {formData.make} {formData.model}
- **year** (2)
  - L15: <span className="text-gray-500 block">Year, Make, Model</span>
  - L17: {formData.year} {formData.make} {formData.model}
- **mileage** (2)
  - L21: <span className="text-gray-500 block">Mileage</span>
  - L23: {formData.mileage?.toLocaleString() || "N/A"} miles
- **vin** (3)
  - L34: {formData.vin && (
  - L36: <span className="text-gray-500 block">VIN</span>
  - L37: <span className="font-medium font-mono">{formData.vin}</span>
- **zip** (1)
  - L31: <span className="text-gray-500 block">ZIP Code</span>
- **valuation** (1)
  - L3: import { FormData } from "@/types/premium-valuation";

### /workspaces/car-detective-mvp/src/components/premium/form/steps/vehicle-details/AccidentHistorySection.tsx  (LOC 68)
exports: AccidentHistorySection
functions: AccidentHistorySection, handleAccidentHistoryChange, handleAccidentDescriptionChange
- **valuation** (1)
  - L3: import { FormData } from "@/types/premium-valuation";

### /workspaces/car-detective-mvp/src/components/premium/form/steps/vehicle-details/VehicleDetailsFields.tsx  (LOC 82)
exports: VehicleDetailsFields
functions: VehicleDetailsFields, handleTrimChange, handleTransmissionChange, handleFuelTypeChange, handleColorChange
- **valuation** (1)
  - L3: import { FormData } from "@/types/premium-valuation";

### /workspaces/car-detective-mvp/src/components/premium/form/vehicle-details/TransmissionSelect.tsx  (LOC 111)
exports: TransmissionSelect
functions: TransmissionSelect
- **valuation** (1)
  - L66: The transmission type affects your vehicle's valuation

### /workspaces/car-detective-mvp/src/components/premium/hero/FeatureCards.tsx  (LOC 49)
exports: FeatureCards
functions: FeatureCards, features
- **price** (1)
  - L22: "12-month price forecast with ideal selling time and market trend analysis.",
- **dealer** (1)
  - L14: title: "Dealer Offers",

### /workspaces/car-detective-mvp/src/components/premium/hero/PremiumValuationCard.tsx  (LOC 85)
exports: PremiumValuationCard
functions: PremiumValuationCard, estimatedValue, confidenceScore
- **vin** (2)
  - L8: vin?: string;
  - L19: vin,

### /workspaces/car-detective-mvp/src/components/premium/index.ts  (LOC 42)
- **vin** (2)
  - L41: // VIN Lookup
  - L42: export { CarfaxErrorAlert } from "./lookup/vin/CarfaxErrorAlert";
- **valuation** (3)
  - L32: // Valuation Tabs
  - L33: export { TabHeader } from "./sections/valuation-tabs/TabHeader";
  - L34: export { TabContentWrapper } from "./sections/valuation-tabs/TabContentWrapper";

### /workspaces/car-detective-mvp/src/components/premium/insights/AINSummary.tsx  (LOC 142)
exports: AINSummary
functions: AINSummary, generateAINSummary, context, prompt
- **make** (2)
  - L12: make?: string;
  - L38: Vehicle Details: ${vehicleData?.year} ${vehicleData?.make} ${vehicleData?.model}
- **model** (2)
  - L13: model?: string;
  - L38: Vehicle Details: ${vehicleData?.year} ${vehicleData?.make} ${vehicleData?.model}
- **year** (2)
  - L11: year?: number;
  - L38: Vehicle Details: ${vehicleData?.year} ${vehicleData?.make} ${vehicleData?.model}
- **mileage** (2)
  - L14: mileage?: number;
  - L39: Mileage: ${vehicleData?.mileage || 'Unknown'}
- **vin** (6)
  - L9: vin: string;
  - L19: export function AINSummary({ vin, vehicleData }: AINSummaryProps) {
  - L32: vin,
  - L37: const prompt = `Analyze this vehicle valuation data for VIN ${vin}.
  - L72: if (vin) {
- **storage** (2)
  - L6: import { supabase } from '@/integrations/supabase/client';
  - L51: const { data, error } = await supabase.functions.invoke('ask-ai', {
- **valuation** (3)
  - L37: const prompt = `Analyze this vehicle valuation data for VIN ${vin}.
  - L49: Format as professional insights suitable for a premium valuation report.`;
  - L55: systemPrompt: `You are AIN — Auto Intelligence Network™, providing premium vehicle valuation insights.

### /workspaces/car-detective-mvp/src/components/premium/lookup/PhotoUpload.tsx  (LOC 95)
exports: PhotoUpload
functions: handleFileChange, files, newPreviews, handleSubmit
- **photos** (5)
  - L41: <CardTitle>Photo Upload</CardTitle>
  - L46: <Label htmlFor="photo-upload">Upload Vehicle Photos</Label>
  - L48: <Label htmlFor="photo-upload" className="cursor-pointer">
  - L54: id="photo-upload"
  - L56: accept="image/png, image/jpeg, image/webp"
- **url** (1)
  - L27: const newPreviews = files.map(file => URL.createObjectURL(file));
- **storage** (1)
  - L24: const files = Array.from(e.target.files);

### /workspaces/car-detective-mvp/src/components/premium/lookup/VinSubmitButton.tsx  (LOC 37)
exports: VinSubmitButton
functions: VinSubmitButton
- **vin** (1)
  - L26: Looking up VIN...

### /workspaces/car-detective-mvp/src/components/premium/lookup/form-parts/BasicVehicleInfo.tsx  (LOC 62)
exports: BasicVehicleInfo
functions: BasicVehicleInfo
- **model** (1)
  - L11: setSelectedModel: (model: string) => void;
- **year** (1)
  - L13: setSelectedYear: (year: number | "") => void;
- **mileage** (4)
  - L14: mileage: string;
  - L15: setMileage: (mileage: string) => void;
  - L27: mileage,
  - L53: mileage={mileage}

### /workspaces/car-detective-mvp/src/components/premium/lookup/form-parts/FormHeader.tsx  (LOC 51)
exports: FormHeader
functions: FormHeader
- **valuation** (1)
  - L23: "Enter your vehicle details manually for the most accurate valuation. More details = better results.",

### /workspaces/car-detective-mvp/src/components/premium/lookup/form-parts/fields/YearMileageInputs.tsx  (LOC 73)
exports: YearMileageInputs
functions: YearMileageInputs
- **year** (6)
  - L9: setSelectedYear: (year: number | "") => void;
  - L28: htmlFor="year"
  - L31: Year
  - L34: id="year"
  - L41: errors.year
- **mileage** (9)
  - L10: mileage: string;
  - L11: setMileage: (mileage: string) => void;
  - L19: mileage,
  - L51: htmlFor="mileage"
  - L54: Mileage

### /workspaces/car-detective-mvp/src/components/premium/lookup/plate/VehicleFoundCard.tsx  (LOC 73)
exports: VehicleFoundCard
functions: VehicleFoundCard
- **make** (1)
  - L28: {vehicle.year} {vehicle.make} {vehicle.model}
- **model** (1)
  - L28: {vehicle.year} {vehicle.make} {vehicle.model}
- **year** (1)
  - L28: {vehicle.year} {vehicle.make} {vehicle.model}
- **vin** (3)
  - L38: {vehicle.vin && (
  - L40: <p className="text-xs text-gray-500 uppercase tracking-wide">VIN</p>
  - L41: <p className="font-mono text-sm">{vehicle.vin}</p>
- **valuation** (1)
  - L68: Ready for Valuation

### /workspaces/car-detective-mvp/src/components/premium/lookup/shared/ValuationErrorState.tsx  (LOC 60)
exports: ValuationErrorState
- **make** (1)
  - L40: <li>• Make sure you've entered the correct information</li>
- **valuation** (1)
  - L21: title = "Valuation Error",

### /workspaces/car-detective-mvp/src/components/premium/lookup/shared/ValuationStages.tsx  (LOC 106)
exports: ValuationStage, ValuationStages
functions: stages, currentStageIndex, isActive, isPast, isComplete, isError
- **valuation** (7)
  - L7: | "valuation"
  - L22: { id: "valuation", label: "Generating Report", icon: Loader2 },
  - L23: { id: "complete", label: "Valuation Complete", icon: CheckCircle },
  - L84: {isActive && s.id === "valuation" && (
  - L86: Creating your customized valuation...

### /workspaces/car-detective-mvp/src/components/premium/lookup/vin/VinDecoderResults.tsx  (LOC 148)
- **make** (2)
  - L63: {result.year && result.make && result.model && (
  - L67: {result.year} {result.make} {result.model}
- **model** (2)
  - L63: {result.year && result.make && result.model && (
  - L67: {result.year} {result.make} {result.model}
- **year** (2)
  - L63: {result.year && result.make && result.model && (
  - L67: {result.year} {result.make} {result.model}
- **vin** (3)
  - L17: vin: string;
  - L31: vin,
  - L46: Unable to decode vehicle information from the provided VIN.
- **valuation** (2)
  - L105: <CardTitle>Valuation Results</CardTitle>
  - L136: Valuation Error

### /workspaces/car-detective-mvp/src/components/premium/sections/ConditionAssessmentSection.tsx  (LOC 19)
exports: ConditionAssessmentSection
functions: ConditionAssessmentSection
- **dealer** (1)
  - L9: Our platform provides a detailed, transparent assessment of your vehicle’s condition—factoring in everything from mechanical health to cosmetic details, just like a real dealer inspection.

### /workspaces/car-detective-mvp/src/components/premium/sections/FreeVsPremiumComparison.tsx  (LOC 46)
exports: FreeVsPremiumComparison
functions: FreeVsPremiumComparison
- **price** (1)
  - L23: <td className="py-2 px-4 border">AI-Powered Price</td>
- **valuation** (1)
  - L18: <td className="py-2 px-4 border">Base Valuation</td>

### /workspaces/car-detective-mvp/src/components/premium/sections/PremiumFaq.tsx  (LOC 61)
exports: PremiumFaq
functions: faqItems
- **vin** (1)
  - L26: answer: "No, our system integrates with CARFAX and automatically retrieves the relevant history when you enter your VIN. This history is factored into your valuation without any additional steps required."
- **dealer** (1)
  - L21: question: "Can I use the premium valuation report when selling to a dealer?",
- **storage** (1)
  - L26: answer: "No, our system integrates with CARFAX and automatically retrieves the relevant history when you enter your VIN. This history is factored into your valuation without any additional steps required."
- **valuation** (9)
  - L13: question: "What makes the premium valuation different from the free version?",
  - L14: answer: "Our premium valuation offers a comprehensive analysis that includes feature-by-feature value impact, CARFAX report integration, detailed condition assessment, market trend analysis, and a professional PDF report. The free valuation
  - L17: question: "How accurate is the premium valuation?",
  - L21: question: "Can I use the premium valuation report when selling to a dealer?",
  - L25: question: "Do I need a CARFAX report before getting a premium valuation?",

### /workspaces/car-detective-mvp/src/components/premium/sections/PremiumFeaturesSection.tsx  (LOC 37)
exports: PremiumFeaturesSection
functions: features
- **price** (1)
  - L8: "Auction Price History (Manheim, Copart, IAAI)",
- **vin** (1)
  - L11: "AI-Powered VIN/Photo/Service Analysis",
- **photos** (1)
  - L11: "AI-Powered VIN/Photo/Service Analysis",
- **dealer** (2)
  - L7: "Dealer Market Offers & Counteroffers",
  - L13: "Priority Dealer Support",

### /workspaces/car-detective-mvp/src/components/premium/sections/PremiumPricing.tsx  (LOC 132)
exports: PremiumPricing
- **dealer** (1)
  - L109: 'Dealer dashboard',
- **valuation** (4)
  - L18: Get the insights you need with our affordable premium valuation options
  - L25: <CardTitle>Single Valuation</CardTitle>
  - L32: 'One premium vehicle valuation',
  - L63: <p className="text-sm text-muted-foreground">$6.66 per valuation</p>

### /workspaces/car-detective-mvp/src/components/premium/sections/PremiumTestimonials.tsx  (LOC 66)
exports: PremiumTestimonials
functions: testimonials
- **valuation** (2)
  - L11: content: 'The premium valuation helped me negotiate a much better deal with the dealership. The detailed breakdown of features and condition assessment was invaluable.',
  - L34: Discover how our premium valuation service has helped thousands of vehicle owners

### /workspaces/car-detective-mvp/src/components/premium/sections/valuation-tabs/CarfaxReportTab.tsx  (LOC 78)
exports: CarfaxReportTab
functions: CarfaxReportTab, downloadReport
- **vin** (7)
  - L7: vin?: string;
  - L10: export function CarfaxReportTab({ vin }: CarfaxReportTabProps) {
  - L14: if (vin) {
  - L21: }, [vin]);
  - L26: if (!vin) {

### /workspaces/car-detective-mvp/src/components/premium/sections/valuation-tabs/DealerOffersTab.tsx  (LOC 176)
exports: DealerOffersTab
functions: DealerOffersTab, handleSubmitOffer, handleAcceptOffer, handleDeclineOffer
- **make** (3)
  - L11: make?: string;
  - L88: <p className="text-muted-foreground">Make</p>
  - L89: <p className="font-medium">{vehicleData?.make || "N/A"}</p>
- **model** (3)
  - L12: model?: string;
  - L92: <p className="text-muted-foreground">Model</p>
  - L93: <p className="font-medium">{vehicleData?.model || "N/A"}</p>
- **year** (3)
  - L13: year?: number;
  - L96: <p className="text-muted-foreground">Year</p>
  - L97: <p className="font-medium">{vehicleData?.year || "N/A"}</p>
- **mileage** (3)
  - L14: mileage?: number;
  - L100: <p className="text-muted-foreground">Mileage</p>
  - L102: {vehicleData?.mileage?.toLocaleString() || "N/A"}
- **vin** (1)
  - L16: vin?: string;
- **dealer** (7)
  - L6: import { DealerOfferForm } from "@/components/dealer/DealerOfferForm";
  - L7: import { DealerOffersList } from "@/components/dealer/DealerOffersList";
  - L37: dealerName: data.dealerName || "Sample Dealer",
  - L66: title="Dealer Network Offers"
  - L109: {/* Dealer Network Status */}
- **valuation** (2)
  - L70: {/* Current Valuation Summary */}
  - L75: <h3 className="text-lg font-semibold">Current Valuation</h3>

### /workspaces/car-detective-mvp/src/components/premium/sections/valuation-tabs/PhotoLookupTab.tsx  (LOC 97)
exports: PhotoLookupTab
functions: PhotoLookupTab, handleFileChange, handleUpload
- **make** (1)
  - L89: <p className="font-medium">Identified: {vehicle.year} {vehicle.make} {vehicle.model}</p>
- **model** (1)
  - L89: <p className="font-medium">Identified: {vehicle.year} {vehicle.make} {vehicle.model}</p>
- **year** (1)
  - L89: <p className="font-medium">Identified: {vehicle.year} {vehicle.make} {vehicle.model}</p>
- **photos** (7)
  - L39: <h3 className="text-lg font-medium mb-2">Upload Vehicle Photo</h3>
  - L41: Take a clear photo of your vehicle's front, side, or rear view
  - L46: htmlFor="photo-upload"
  - L49: Select Photo
  - L52: id="photo-upload"

### /workspaces/car-detective-mvp/src/components/premium/sections/valuation-tabs/PhotoUploadTab.tsx  (LOC 53)
exports: PhotoUploadTab
functions: PhotoUploadTab, handleFileUpload, files
- **photos** (7)
  - L3: import { PhotoUploadProps } from "@/types/photo";
  - L19: <CardTitle>Vehicle Photos</CardTitle>
  - L25: <label htmlFor="photo-upload" className="cursor-pointer">
  - L27: Upload vehicle photos
  - L30: id="photo-upload"
- **storage** (1)
  - L12: onPhotoUpload(Array.from(files));

### /workspaces/car-detective-mvp/src/components/premium/sections/valuation-tabs/TabContent.tsx  (LOC 59)
exports: TabContent
functions: handleConditionOverrideChange
- **photos** (2)
  - L6: import { AICondition } from "@/types/photo";
  - L43: <Label>Upload Photos</Label>

### /workspaces/car-detective-mvp/src/components/premium/sections/valuation-tabs/TabHeader.tsx  (LOC 24)
exports: TabHeader
functions: TabHeader
- **vin** (1)
  - L18: accurate valuation, we recommend using the VIN lookup which provides
- **valuation** (2)
  - L10: Premium Vehicle Valuation
  - L18: accurate valuation, we recommend using the VIN lookup which provides

### /workspaces/car-detective-mvp/src/components/premium/sections/valuation-tabs/TwelveMonthForecastTab.tsx  (LOC 56)
exports: TwelveMonthForecastTabProps, TwelveMonthForecastTab
functions: TwelveMonthForecastTab, forecastData
- **make** (2)
  - L8: make: string;
  - L39: {vehicleData.year} {vehicleData.make} {vehicleData.model}
- **model** (2)
  - L9: model: string;
  - L39: {vehicleData.year} {vehicleData.make} {vehicleData.model}
- **year** (2)
  - L10: year: number;
  - L39: {vehicleData.year} {vehicleData.make} {vehicleData.model}
- **vin** (1)
  - L12: vin?: string;

### /workspaces/car-detective-mvp/src/components/premium/sections/valuation-tabs/form-parts/VehicleDetailsForm.tsx  (LOC 135)
exports: VehicleDetailsForm
functions: VehicleDetailsForm, handleChange, currentYear, years
- **make** (6)
  - L10: make: string;
  - L19: make: string;
  - L44: <Label htmlFor="make">Make <span className="text-red-500">*</span></Label>
  - L46: id="make"
  - L48: value={vehicleDetails.make}
- **model** (6)
  - L11: model: string;
  - L20: model: string;
  - L54: <Label htmlFor="model">Model <span className="text-red-500">*</span></Label>
  - L56: id="model"
  - L58: value={vehicleDetails.model}
- **year** (8)
  - L12: year: string;
  - L21: year: string;
  - L66: <Label htmlFor="year">Year <span className="text-red-500">*</span></Label>
  - L68: value={vehicleDetails.year}
  - L69: onValueChange={(value) => handleChange('year', value)}
- **mileage** (6)
  - L13: mileage: string;
  - L22: mileage: string;
  - L83: <Label htmlFor="mileage">Mileage</Label>
  - L85: id="mileage"
  - L88: value={vehicleDetails.mileage}
- **zip** (1)
  - L106: <Label htmlFor="zipCode">ZIP Code <span className="text-red-500">*</span></Label>

### /workspaces/car-detective-mvp/src/components/premium/sections/valuation-tabs/hooks/useValuationState.ts  (LOC 66)
exports: useValuationState
functions: useValuationState, handleVinLookup, handlePlateLookup, handleManualSubmit
- **make** (2)
  - L9: make: string;
  - L22: make: "",
- **model** (2)
  - L10: model: string;
  - L23: model: "",
- **year** (2)
  - L11: year: string;
  - L24: year: new Date().getFullYear().toString(),
- **mileage** (2)
  - L12: mileage: string;
  - L25: mileage: "0",
- **vin** (2)
  - L18: const [activeTab, setActiveTab] = useState("vin");
  - L35: await lookupVehicle("vin", vinData);

### /workspaces/car-detective-mvp/src/components/premium/sections/valuation-tabs/market-analysis/ComparableListingsTable.tsx  (LOC 81)
exports: ComparableListing, ComparableListingsTable
functions: ComparableListingsTable
- **price** (3)
  - L10: price: number;
  - L44: <TableHead>Price</TableHead>
  - L54: <TableCell>{formatCurrency(listing.price)}</TableCell>
- **mileage** (3)
  - L12: mileage?: number;
  - L46: <TableHead>Mileage</TableHead>
  - L59: {listing.mileage ? `${listing.mileage.toLocaleString()} mi` : 'Unknown'}
- **url** (3)
  - L13: url?: string;
  - L62: {listing.url ? (
  - L66: onClick={() => window.open(listing.url, '_blank')}

### /workspaces/car-detective-mvp/src/components/premium/sections/valuation-tabs/market-analysis/MarketAnalysisTab.tsx  (LOC 149)
exports: MarketAnalysisTab
functions: MarketAnalysisTab, mockData
- **make** (6)
  - L14: make?: string;
  - L24: make = 'Unknown',
  - L51: title: `${year} ${make} ${model}`,
  - L61: title: `${year} ${make} ${model}`,
  - L71: title: `${year} ${make} ${model}`,
- **model** (6)
  - L15: model?: string;
  - L25: model = 'Vehicle',
  - L51: title: `${year} ${make} ${model}`,
  - L61: title: `${year} ${make} ${model}`,
  - L71: title: `${year} ${make} ${model}`,
- **year** (8)
  - L16: year?: number;
  - L26: year = new Date().getFullYear(),
  - L51: title: `${year} ${make} ${model}`,
  - L61: title: `${year} ${make} ${model}`,
  - L71: title: `${year} ${make} ${model}`,
- **price** (3)
  - L52: price: 24500,
  - L62: price: 25900,
  - L72: price: 23200,
- **mileage** (3)
  - L53: mileage: 35000,
  - L63: mileage: 28000,
  - L73: mileage: 41000,
- **valuation** (1)
  - L8: import { PremiumFeatureLock } from '@/components/valuation/market-trend/PremiumLockSection';

### /workspaces/car-detective-mvp/src/components/premium/sections/valuation-tabs/market-analysis/MarketInsightsTab.tsx  (LOC 177)
exports: MarketInsightsTab
functions: MarketInsightsTab, comparableVehicles, mapTrendDirection
- **make** (4)
  - L16: make?: string;
  - L40: make = 'Unknown',
  - L60: make,
  - L142: make,
- **model** (4)
  - L17: model?: string;
  - L41: model = 'Vehicle',
  - L61: model,
  - L143: model,
- **year** (4)
  - L18: year?: number;
  - L42: year = new Date().getFullYear(),
  - L62: year,
  - L144: year,
- **price** (2)
  - L28: price: number;
  - L162: price: listing.price,
- **mileage** (4)
  - L19: mileage?: number;
  - L29: mileage: number;
  - L43: mileage = 0,
  - L163: mileage: listing.mileage,
- **vin** (2)
  - L21: vin?: string;
  - L45: vin = '',
- **valuation** (1)
  - L8: import { PremiumFeatureLock } from '@/components/valuation/market-trend/PremiumLockSection';

### /workspaces/car-detective-mvp/src/components/premium/sections/valuation-tabs/market-analysis/MarketPriceRange.tsx  (LOC 70)
exports: MarketPriceRange
functions: MarketPriceRange, range, avgPosition
- **price** (2)
  - L20: <DollarSign className="h-4 w-4" /> Market Price Range
  - L27: <p className="text-sm text-slate-500 mb-3">Average Market Price</p>

### /workspaces/car-detective-mvp/src/components/premium/sections/valuation-tabs/market-analysis/MarketTrendCard.tsx  (LOC 60)
exports: MarketTrendCard
functions: MarketTrendCard, isIncreasing, trendColor, trendBgColor, TrendIcon
- **price** (2)
  - L28: Price Trend
  - L43: <p className="text-sm text-slate-500 mb-4">30-day price trend</p>

### /workspaces/car-detective-mvp/src/components/premium/sections/valuation-tabs/market-analysis/PriceComparisonChart.tsx  (LOC 128)
exports: PriceComparisonChart
functions: PriceComparisonChart, data, min, max, CustomTooltip
- **make** (2)
  - L9: make: string;
  - L80: {vehicleData.year} {vehicleData.make} {vehicleData.model} in {vehicleData.zipCode || 'your area'}
- **model** (2)
  - L10: model: string;
  - L80: {vehicleData.year} {vehicleData.make} {vehicleData.model} in {vehicleData.zipCode || 'your area'}
- **year** (2)
  - L11: year: number;
  - L80: {vehicleData.year} {vehicleData.make} {vehicleData.model} in {vehicleData.zipCode || 'your area'}
- **price** (1)
  - L77: Price Comparison

### /workspaces/car-detective-mvp/src/components/premium/sections/valuation-tabs/market-analysis/PriceDistributionChart.tsx  (LOC 264)
exports: PriceDistributionChart
functions: PriceDistributionChart, priceStep, chartData, minPrice, maxPrice, label, mostCommonRange, totalListings, valuePercentile, yourValueIndex, listingsBelowValue
- **make** (2)
  - L23: make: string;
  - L93: {vehicleInfo.make} {vehicleInfo.model} {vehicleInfo.trim || ""}{" "}
- **model** (2)
  - L24: model: string;
  - L93: {vehicleInfo.make} {vehicleInfo.model} {vehicleInfo.trim || ""}{" "}
- **year** (2)
  - L25: year: number;
  - L92: Based on {listingCount} similar {vehicleInfo.year}{" "}
- **price** (11)
  - L44: // Calculate price ranges for the chart
  - L67: // Find most common price range
  - L70: // Calculate where your price falls as a percentile
  - L90: <h3 className="text-lg font-semibold">Market Price Distribution</h3>
  - L135: labelFormatter={(range) => `Price Range: ${range}`}
- **dedupe** (1)
  - L252: ? "Your vehicle is priced above the most common range. Consider highlighting unique features to justify the premium."

### /workspaces/car-detective-mvp/src/components/premium/sections/valuation-tabs/services.ts  (LOC 82)
exports: ValuationServiceId, ValuationService, valuationServices
- **vin** (4)
  - L14: | "vin"
  - L32: id: "vin",
  - L33: title: "VIN Lookup",
  - L36: "Enter your Vehicle Identification Number (VIN) for the most accurate identification.",
- **photos** (4)
  - L17: | "photo"
  - L52: id: "photo",
  - L53: title: "Photo Analysis",
  - L56: "Upload a photo of your vehicle for AI-powered identification.",
- **dealer** (1)
  - L60: title: "Dealer Offers",

### /workspaces/car-detective-mvp/src/components/premium/sections/valuation-tabs/services.tsx  (LOC 41)
exports: ValuationServiceId, ValuationService, services
- **vin** (3)
  - L5: export type ValuationServiceId = 'vin' | 'plate' | 'manual' | 'photo';
  - L17: id: 'vin',
  - L18: title: 'VIN Lookup',
- **photos** (4)
  - L5: export type ValuationServiceId = 'vin' | 'plate' | 'manual' | 'photo';
  - L35: id: 'photo',
  - L36: title: 'Photo Lookup',
  - L37: description: 'Upload a photo of your vehicle for identification',

### /workspaces/car-detective-mvp/src/components/premium/types.ts  (LOC 11)
exports: ValuationSummaryProps
- **valuation** (2)
  - L2: import { ValuationResult } from '@/components/valuation/valuation-core/ValuationResult';
  - L5: valuation?: ValuationResult;

### /workspaces/car-detective-mvp/src/components/professional/ProfessionalResultsPage.tsx  (LOC 392)
exports: ProfessionalResultsPage
functions: ProfessionalResultsPage, loadData, identifier, valuationData, fetchError, isVin, ainResult, ainData, finalValue, confidence, priceRange, confidenceLevel, insights
- **make** (4)
  - L28: make: string;
  - L121: make: valuationData.make,
  - L190: make: valuationData.make || 'Unknown',
  - L293: {valuationData.year} {valuationData.make} {valuationData.model}
- **model** (4)
  - L29: model: string;
  - L122: model: valuationData.model,
  - L191: model: valuationData.model || 'Unknown',
  - L293: {valuationData.year} {valuationData.make} {valuationData.model}
- **year** (7)
  - L30: year: number;
  - L123: year: valuationData.year,
  - L192: year: valuationData.year || new Date().getFullYear(),
  - L276: description: 'Year, mileage, condition, and market demand all contribute to your vehicle\'s estimated value.',
  - L293: {valuationData.year} {valuationData.make} {valuationData.model}
- **price** (2)
  - L182: listing.price > 5000 &&
  - L183: listing.price < 200000
- **mileage** (6)
  - L31: mileage: number;
  - L124: mileage: valuationData.mileage || 60000,
  - L193: mileage: valuationData.mileage || 0,
  - L276: description: 'Year, mileage, condition, and market demand all contribute to your vehicle\'s estimated value.',
  - L334: <p className="text-sm text-muted-foreground">Mileage</p>
- **vin** (6)
  - L27: vin: string;
  - L76: .eq('vin', identifier)
  - L84: fetchError = new Error(`No valuation found for VIN: ${identifier}`);
  - L120: vin: valuationData.vin,
  - L170: .eq('vin', valuationData.vin)
- **dealer** (1)
  - L377: Upgrade to premium for comprehensive CARFAX reports, dealer offers, and professional PDF exports.
- **storage** (6)
  - L3: import { supabase } from '@/integrations/supabase/client';
  - L73: const { data: vinData, error: vinError } = await supabase
  - L87: const { data: uuidData, error: uuidError } = await supabase
  - L96: const { data: regData, error: regError } = await supabase
  - L137: const { error: updateError } = await supabase
- **valuation** (17)
  - L46: // No fake valuation generation - rely only on real data
  - L57: setError('No valuation ID provided');
  - L84: fetchError = new Error(`No valuation found for VIN: ${identifier}`);
  - L105: fetchError = new Error(`No valuation found for ID: ${identifier}`);
  - L111: throw fetchError || new Error('Valuation data not found');

### /workspaces/car-detective-mvp/src/components/profile/AvatarUpload.tsx  (LOC 74)
exports: AvatarUpload
functions: AvatarUpload, handleAvatarChange, file, validTypes
- **photos** (3)
  - L31: const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  - L33: toast.error("Please upload a JPEG, PNG, GIF, or WebP image");
  - L46: accept="image/*"

### /workspaces/car-detective-mvp/src/components/referrals/ReferralModal.tsx  (LOC 74)
exports: ReferralModal
functions: ReferralModal, inputRef, referralLink, copyToClipboard, shareLink
- **url** (1)
  - L33: url: referralLink,

### /workspaces/car-detective-mvp/src/components/result/ResultHeader.tsx  (LOC 27)
exports: ResultHeader
- **valuation** (2)
  - L14: <h1 className="text-3xl font-bold">Valuation Results</h1>
  - L22: New Valuation

### /workspaces/car-detective-mvp/src/components/result/VehicleDetailsCard.tsx  (LOC 111)
exports: VehicleDetailsCard
functions: VehicleDetailsCard, formattedMileage, DetailItem, classes
- **make** (3)
  - L6: make?: string;
  - L21: make,
  - L45: <DetailItem label="Make" value={make} />
- **model** (3)
  - L7: model?: string;
  - L22: model,
  - L46: <DetailItem label="Model" value={model} />
- **year** (3)
  - L8: year?: number;
  - L23: year,
  - L47: <DetailItem label="Year" value={year?.toString()} />
- **mileage** (6)
  - L9: mileage?: number;
  - L24: mileage,
  - L34: // Format mileage with commas
  - L35: const formattedMileage = mileage ? mileage.toLocaleString() : "N/A";
  - L49: label="Mileage"
- **vin** (4)
  - L11: vin?: string;
  - L26: vin,
  - L70: {vin && (
  - L73: <DetailItem label="VIN" value={vin} fullWidth />
- **zip** (1)
  - L80: <DetailItem label="ZIP Code" value={zipCode} />

### /workspaces/car-detective-mvp/src/components/result/useValuationId.ts  (LOC 55)
exports: useValuationId
functions: useValuationId, getValuationId, storedId, manualData, parsedData, tempData, parsedTempData, id
- **url** (1)
  - L12: // First check URL query param (highest priority)
- **valuation** (1)
  - L23: // Check if manual valuation data exists

### /workspaces/car-detective-mvp/src/components/results/SimilarListingsSection.tsx  (LOC 158)
exports: SimilarListingsSection
functions: SimilarListingsSection, hasRealData, dataQuality
- **make** (2)
  - L68: alt={`${listing.year} ${listing.make} ${listing.model}`}
  - L84: {listing.year} {listing.make} {listing.model}
- **model** (2)
  - L68: alt={`${listing.year} ${listing.make} ${listing.model}`}
  - L84: {listing.year} {listing.make} {listing.model}
- **year** (2)
  - L68: alt={`${listing.year} ${listing.make} ${listing.model}`}
  - L84: {listing.year} {listing.make} {listing.model}
- **price** (1)
  - L90: ${listing.price?.toLocaleString() || 'N/A'}
- **mileage** (2)
  - L100: {listing.mileage && (
  - L102: <span>{listing.mileage.toLocaleString()} miles</span>
- **photos** (3)
  - L63: {/* Image */}
  - L65: {listing.photos?.[0] ? (
  - L67: src={listing.photos[0]}
- **dealer** (2)
  - L113: {(listing.dealer || listing.dealerName || listing.dealer_name) && (
  - L116: {listing.dealer || listing.dealerName || listing.dealer_name}

### /workspaces/car-detective-mvp/src/components/saved/SavedValuationsList.tsx  (LOC 163)
exports: SavedValuationsList
functions: SavedValuationsList, formatCurrency, formatDate, handleDelete
- **make** (1)
  - L117: {item.valuationDetails.make}{" "}
- **model** (1)
  - L118: {item.valuationDetails.model}
- **year** (1)
  - L116: {item.valuationDetails.year}{" "}
- **valuation** (3)
  - L64: <Button variant="outline">Start a New Valuation</Button>
  - L88: if (confirm("Are you sure you want to delete this saved valuation?")) {
  - L103: <TableHead>Valuation</TableHead>

### /workspaces/car-detective-mvp/src/components/service-history/AddServiceForm.tsx  (LOC 142)
exports: AddServiceForm
functions: handleChange, handleSubmit
- **mileage** (7)
  - L27: mileage: "",
  - L81: <label htmlFor="mileage" className="text-sm font-medium">
  - L82: Mileage
  - L85: id="mileage"
  - L86: name="mileage"

### /workspaces/car-detective-mvp/src/components/service-history/FileDropzone.tsx  (LOC 62)
exports: FileDropzone
functions: FileDropzone, onDrop
- **photos** (1)
  - L23: "image/*": [".jpeg", ".jpg", ".png"],

### /workspaces/car-detective-mvp/src/components/service-history/ServiceDetailsForm.tsx  (LOC 66)
exports: ServiceDetailsForm
functions: ServiceDetailsForm
- **mileage** (7)
  - L9: mileage: number | null;
  - L10: setMileage: (mileage: number | null) => void;
  - L19: mileage,
  - L40: <Label htmlFor="mileage">Mileage</Label>
  - L42: id="mileage"

### /workspaces/car-detective-mvp/src/components/service-history/ServiceHistoryDisplay.tsx  (LOC 107)
exports: ServiceHistoryDisplayProps, ServiceHistoryDisplay
functions: handleAddRecord, handleCancelAdd, handleSaveRecord, handleDeleteRecord
- **mileage** (1)
  - L86: <div>Mileage: {record.mileage}</div>
- **vin** (2)
  - L8: vin?: string;
  - L12: { vin },

### /workspaces/car-detective-mvp/src/components/service-history/ServiceHistoryUploader.tsx  (LOC 208)
exports: ServiceHistoryUploader
functions: ServiceHistoryUploader, handleFileSelect, resetForm, validateForm, handleSubmit, receiptUrl, fileExt, fileName, filePath
- **mileage** (3)
  - L25: const [mileage, setMileage] = useState<number | null>(null);
  - L125: mileage,
  - L183: mileage={mileage}
- **vin** (13)
  - L22: const [vin, setVin] = useState(initialVin || "");
  - L43: if (!vin || vin.length !== 17) {
  - L44: toast.error("Please enter a valid 17-character VIN");
  - L73: .select("vin")
  - L74: .eq("vin", vin)
- **url** (1)
  - L109: // Get public URL
- **storage** (9)
  - L10: import { supabase } from "@/integrations/supabase/client";
  - L71: const { data: vehicleData, error: vehicleError } = await supabase
  - L81: const { error: createVehicleError } = await supabase
  - L83: .insert({
  - L103: const { error: uploadError } = await supabase.storage

### /workspaces/car-detective-mvp/src/components/service-history/ServiceRecordsList.tsx  (LOC 91)
exports: ServiceRecord, ServiceRecordsListProps, ServiceRecordsList
functions: sortedRecords
- **mileage** (3)
  - L14: mileage: number;
  - L65: <p className="text-sm text-muted-foreground">Mileage</p>
  - L66: <p>{record.mileage.toLocaleString()} miles</p>

### /workspaces/car-detective-mvp/src/components/sharing/SocialShareButtons.tsx  (LOC 235)
exports: SocialShareButtons
functions: SocialShareButtons, shareUrl, shareText, handleGenerateToken, newToken, handleCopyLink, handleTwitterShare, tweetText, handleFacebookShare, fbUrl, handleLinkedInShare, linkedInUrl, title, summary, handleEmailShare, subject, body, handleSMSShare, message, handleJSONExport, response, blob, url, a
- **make** (4)
  - L21: make: string;
  - L42: const shareText = `Check out my ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model} valuation: $${vehicleInfo.estimatedValue.toLocaleString()}`;
  - L103: const subject = encodeURIComponent(`Vehicle Valuation Report - ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`);
  - L140: a.download = `valuation_${vehicleInfo.year}_${vehicleInfo.make}_${vehicleInfo.model}.json`;
- **model** (4)
  - L22: model: string;
  - L42: const shareText = `Check out my ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model} valuation: $${vehicleInfo.estimatedValue.toLocaleString()}`;
  - L103: const subject = encodeURIComponent(`Vehicle Valuation Report - ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`);
  - L140: a.download = `valuation_${vehicleInfo.year}_${vehicleInfo.make}_${vehicleInfo.model}.json`;
- **year** (4)
  - L20: year: number;
  - L42: const shareText = `Check out my ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model} valuation: $${vehicleInfo.estimatedValue.toLocaleString()}`;
  - L103: const subject = encodeURIComponent(`Vehicle Valuation Report - ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`);
  - L140: a.download = `valuation_${vehicleInfo.year}_${vehicleInfo.make}_${vehicleInfo.model}.json`;
- **url** (4)
  - L97: `https://www.linkedin.com/sharing/share-offsite/?url=${linkedInUrl}&title=${title}&summary=${summary}`,
  - L137: const url = window.URL.createObjectURL(blob);
  - L139: a.href = url;
  - L143: window.URL.revokeObjectURL(url);
- **fetch** (1)
  - L124: const response = await fetch('/functions/v1/export-valuation-json', {
- **valuation** (7)
  - L42: const shareText = `Check out my ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model} valuation: $${vehicleInfo.estimatedValue.toLocaleString()}`;
  - L53: description: "Your valuation is now ready to share!",
  - L94: const title = encodeURIComponent(`Vehicle Valuation Report`);
  - L103: const subject = encodeURIComponent(`Vehicle Valuation Report - ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`);
  - L124: const response = await fetch('/functions/v1/export-valuation-json', {

### /workspaces/car-detective-mvp/src/components/steps/VehicleLookup.tsx  (LOC 95)
exports: VehicleLookup
functions: VehicleLookup, validateVin, handleSubmit, validationError, handleVinChange, value
- **make** (1)
  - L39: make: "Toyota",
- **model** (1)
  - L40: model: "Camry",
- **year** (1)
  - L41: year: 2020,
- **vin** (12)
  - L15: const [vin, setVin] = useState("");
  - L19: if (!vinValue) return "VIN is required";
  - L20: if (vinValue.length !== 17) return "VIN must be exactly 17 characters";
  - L22: return "VIN contains invalid characters";
  - L29: const validationError = validateVin(vin);

### /workspaces/car-detective-mvp/src/components/test/PDFShareValidationComponent.tsx  (LOC 413)
exports: PDFShareValidationComponent
functions: PDFShareValidationComponent, runSingleTest, result, runAllTests, allResults, getStatusIcon, getScoreColor, overallPassed, averageScore
- **vin** (7)
  - L36: const runSingleTest = async (vin: string) => {
  - L39: const result = await validatePDFShareFunctionality(vin);
  - L41: setSelectedVin(vin);
  - L97: <Card key={testCase.vin} className="border-2">
  - L128: onClick={() => runSingleTest(testCase.vin)}
- **url** (3)
  - L285: <span>Share URL Constructed</span>
  - L317: <span>Uses Share URL</span>
  - L339: <span>Share URL Persistent</span>
- **valuation** (5)
  - L5: * in the valuation results pipeline.
  - L18: } from '@/utils/valuation/validatePDFShareFunctionality';
  - L90: in the valuation results pipeline.
  - L204: <span>PDF renders valuation clearly and professionally</span>
  - L216: <span>Valuation data consistent across UI, PDF, and share</span>

### /workspaces/car-detective-mvp/src/components/test/UIResultsDisplayValidationComponent.tsx  (LOC 319)
exports: UIResultsDisplayValidationComponent
functions: UIResultsDisplayValidationComponent, runSingleTest, result, runAllTests, allResults, getStatusIcon, getScoreColor, overallPassed, averageScore
- **vin** (8)
  - L31: const runSingleTest = async (vin: string) => {
  - L34: const result = await validateUIResultsDisplay(vin);
  - L36: setSelectedVin(vin);
  - L92: <Card key={testCase.vin} className="border-2">
  - L113: onClick={() => runSingleTest(testCase.vin)}
- **valuation** (5)
  - L6: * - Estimated value from valuation engine
  - L23: } from '@/utils/valuation/validateUIResultsDisplay';
  - L84: Validates that ResultsPage correctly renders valuation results, market listings,
  - L188: <span>UI fully reflects valuation engine output</span>
  - L242: <span>1. Valuation Output</span>

### /workspaces/car-detective-mvp/src/components/title-ownership/VehicleHistorySection.tsx  (LOC 172)
exports: VehicleHistorySection
functions: VehicleHistorySection, isValidVin, fetchVehicleHistory, typedData, saveVehicleHistory, handleServiceUploadComplete
- **vin** (19)
  - L12: vin: string;
  - L19: const [vin, setVin] = useState("");
  - L29: // Validate VIN format (17 characters, no I, O, Q)
  - L30: const isValidVin = (vin: string) => {
  - L31: return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
- **storage** (6)
  - L5: import { supabase } from "@/integrations/supabase/client";
  - L43: const { data, error } = await supabase
  - L58: await supabase.from("vehicles").insert({
  - L93: // Direct upsert operation
  - L94: const { error } = await supabase

### /workspaces/car-detective-mvp/src/components/title-ownership/VinInputSection.tsx  (LOC 70)
exports: VinInputSection
functions: VinInputSection, isValidVin, handleVinChange, handleFetchHistory
- **vin** (13)
  - L9: vin: string;
  - L17: vin,
  - L23: // Validate VIN format (17 characters, no I, O, Q)
  - L24: const isValidVin = (vin: string) => {
  - L25: return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);

### /workspaces/car-detective-mvp/src/components/ui/ColorSwatch.tsx  (LOC 195)
exports: ColorOption, ColorSwatch
functions: ColorSwatch, fetchColors, getColorByName, selectedColor, colorsByCategory, getColorStyle
- **storage** (2)
  - L10: import { supabase } from "@/integrations/supabase/client";
  - L39: const { data, error } = await supabase

### /workspaces/car-detective-mvp/src/components/ui/avatar.tsx  (LOC 48)
functions: Avatar, AvatarImage, AvatarFallback
- **photos** (4)
  - L22: React.ElementRef<typeof AvatarPrimitive.Image>,
  - L23: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
  - L25: <AvatarPrimitive.Image
  - L31: AvatarImage.displayName = AvatarPrimitive.Image.displayName;

### /workspaces/car-detective-mvp/src/components/ui/breadcrumb.tsx  (LOC 116)
functions: Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, Comp, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis
- **valuation** (2)
  - L49: const Comp = asChild ? Slot : "a";
  - L52: <Comp

### /workspaces/car-detective-mvp/src/components/ui/button-enhanced.tsx  (LOC 116)
exports: ButtonProps
functions: buttonVariants, ButtonEnhanced, Comp
- **valuation** (3)
  - L81: const Comp = asChild ? Slot : "button";
  - L84: <Comp
  - L110: </Comp>

### /workspaces/car-detective-mvp/src/components/ui/button.tsx  (LOC 57)
exports: ButtonProps
functions: buttonVariants, Button, Comp
- **valuation** (2)
  - L45: const Comp = asChild ? Slot : "button"
  - L47: <Comp

### /workspaces/car-detective-mvp/src/components/ui/condition-badge.tsx  (LOC 95)
exports: ConditionBadge
functions: ConditionBadge, isVerified, getVariant
- **photos** (2)
  - L88: ? "This condition has been verified by AI image analysis. Higher confidence scores indicate more reliable assessments."
  - L89: : "Our AI couldn't verify the condition with high confidence. Consider uploading clearer photos from multiple angles."}

### /workspaces/car-detective-mvp/src/components/ui/enhanced/PricingSection.tsx  (LOC 146)
exports: PricingSection
functions: PricingSection
- **price** (2)
  - L16: price: string;
  - L92: {plan.price}

### /workspaces/car-detective-mvp/src/components/ui/enhanced/ProfessionalButton.tsx  (LOC 101)
exports: ButtonProps
functions: buttonVariants, ProfessionalButton, Comp
- **valuation** (3)
  - L67: const Comp = asChild ? Slot : 'button';
  - L70: <Comp
  - L94: </Comp>

### /workspaces/car-detective-mvp/src/components/ui/enhanced/ProfessionalHero.tsx  (LOC 127)
exports: ProfessionalHero
functions: ProfessionalHero
- **photos** (1)
  - L45: <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />

### /workspaces/car-detective-mvp/src/components/ui/entity-card.tsx  (LOC 152)
exports: EntityStatus, EntityCardAction, EntityCard
functions: navigate, getStatusBadge
- **price** (4)
  - L35: price?: number | string;
  - L50: price,
  - L107: {price !== undefined && (
  - L109: {typeof price === "number" ? `$${price.toLocaleString()}` : price}
- **photos** (6)
  - L32: image?: string | null;
  - L47: image,
  - L48: imageAlt = "Item image",
  - L83: {/* Entity Image */}
  - L85: {image

### /workspaces/car-detective-mvp/src/components/valuation/AccidentImpactCard.tsx  (LOC 177)
exports: AccidentImpactCard
functions: AccidentImpactCard
- **vin** (3)
  - L15: vin?: string;
  - L25: vin,
  - L50: vin,

### /workspaces/car-detective-mvp/src/components/valuation/AuctionHistorySection.tsx  (LOC 116)
exports: AuctionHistorySectionProps, AuctionHistorySection
functions: fetchHistory, res, json
- **price** (2)
  - L12: price: string | null;
  - L92: <strong>Price:</strong> {history.price || "N/A"}
- **vin** (5)
  - L6: vin: string;
  - L10: vin: string;
  - L20: { vin },
  - L39: body: JSON.stringify({ vin }),
  - L57: }, [vin]);
- **photos** (1)
  - L106: alt={`Auction photo ${idx + 1}`}
- **url** (2)
  - L102: {history.photo_urls.map((url, idx) => (
  - L105: src={url}
- **fetch** (1)
  - L30: const res = await fetch(
- **storage** (1)
  - L31: "https://xltxqqzattxogxtqrggt.functions.supabase.co/fetch-auction-history",

### /workspaces/car-detective-mvp/src/components/valuation/AuctionInsightCard.tsx  (LOC 118)
exports: AuctionInsightCard
- **price** (1)
  - L63: <span className="font-medium">Price:</span> ${typeof auction.price === 'string' ? parseFloat(auction.price || '0').toLocaleString() : auction.price.toLocaleString()}
- **mileage** (2)
  - L65: {auction.mileage && (
  - L67: <span className="font-medium">Mileage:</span> {auction.mileage.toLocaleString()} mi
- **vin** (2)
  - L47: Past appearances in Copart, IAAI, and other auction sites for this VIN.
  - L53: <div key={`${auction.vin}-${idx}`} className="bg-gray-50 p-4 rounded-lg shadow-sm">
- **photos** (5)
  - L82: {auction.photos && auction.photos.length > 0 && (
  - L84: {auction.photos.slice(0, 4).map((url: string, index: number) => (
  - L88: alt={`Auction photo ${index + 1}`}
  - L93: {auction.photos.length > 4 && (
  - L96: +{auction.photos.length - 4}
- **dealer** (1)
  - L29: Upgrade to Premium to unlock auction history and dealer flip risk scores.
- **url** (2)
  - L84: {auction.photos.slice(0, 4).map((url: string, index: number) => (
  - L87: src={url}

### /workspaces/car-detective-mvp/src/components/valuation/AuctionIntelligenceCard.tsx  (LOC 219)
exports: AuctionIntelligenceCard
functions: AuctionIntelligenceCard, getRiskColor, getRiskLabel, getTrendIcon
- **price** (5)
  - L140: Latest Sale: ${parseFloat(data.latest_sale.price || '0').toLocaleString()}
  - L149: <span className="text-sm font-medium">Price Trend</span>
  - L164: {/* Price Chart */}
  - L167: <h4 className="text-sm font-medium">Price History</h4>
  - L212: {data.price_trend.direction === 'downward' && ' Price trend is declining.'}
- **vin** (6)
  - L13: vin: string;
  - L16: export function AuctionIntelligenceCard({ vin }: AuctionIntelligenceCardProps) {
  - L18: const { data, isLoading, error } = useAuctionIntelligence(vin);
  - L87: No auction intelligence data available for this VIN.
  - L125: Advanced auction analysis and flip detection for this VIN
- **dealer** (1)
  - L32: Upgrade to Premium or Dealer access to unlock advanced auction intelligence and flip detection.

### /workspaces/car-detective-mvp/src/components/valuation/AuctionIntelligencePriceChart.tsx  (LOC 81)
exports: AuctionIntelligencePriceChart
functions: AuctionIntelligencePriceChart, chartData, formatPrice, CustomTooltip, data
- **price** (5)
  - L6: price: number;
  - L19: No price data available
  - L29: price: point.price,
  - L43: <p className="text-sm text-blue-600">{formatPrice(data.price)}</p>
  - L71: dataKey="price"

### /workspaces/car-detective-mvp/src/components/valuation/AuctionResults.tsx  (LOC 123)
exports: AuctionResults
functions: AuctionResults, formatPrice, numericPrice, formatDate
- **make** (1)
  - L53: {result.year} {result.make} {result.model}
- **model** (1)
  - L53: {result.year} {result.make} {result.model}
- **year** (1)
  - L53: {result.year} {result.make} {result.model}
- **price** (4)
  - L26: const formatPrice = (price: string | number): string => {
  - L27: const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g, '')) : price;
  - L67: {formatPrice(typeof result.price === 'string' ? result.price : String(result.price))}
  - L69: <p className="text-xs text-gray-500">Sale Price</p>
- **mileage** (3)
  - L74: {result.mileage && (
  - L76: <p className="text-gray-500">Mileage</p>
  - L77: <p className="font-medium">{result.mileage.toLocaleString()} mi</p>
- **photos** (6)
  - L97: {result.photos && result.photos.length > 0 && (
  - L99: <p className="text-sm font-medium">Photos</p>
  - L101: {result.photos.map((url: string, photoIndex: number) => (
  - L105: alt={`Auction photo ${photoIndex + 1}`}
  - L113: {result.photos && result.photos.length > 3 && (
- **url** (2)
  - L101: {result.photos.map((url: string, photoIndex: number) => (
  - L104: src={url}

### /workspaces/car-detective-mvp/src/components/valuation/AuditAndSourcesAccordion.tsx  (LOC 44)
exports: AuditAndSourcesAccordion
functions: AuditAndSourcesAccordion, featureAuditEnabled
- **valuation** (1)
  - L5: import { EnhancedValuationResult } from '@/types/valuation';

### /workspaces/car-detective-mvp/src/components/valuation/AutoAuctionsResults.tsx  (LOC 171)
exports: AutoAuctionsResults
functions: AutoAuctionsResults, fetchData, data
- **make** (3)
  - L14: make?: string;
  - L110: {(record.year || record.make || record.model) && (
  - L112: {[record.year, record.make, record.model].filter(Boolean).join(' ')}
- **model** (3)
  - L15: model?: string;
  - L110: {(record.year || record.make || record.model) && (
  - L112: {[record.year, record.make, record.model].filter(Boolean).join(' ')}
- **year** (3)
  - L13: year?: string;
  - L110: {(record.year || record.make || record.model) && (
  - L112: {[record.year, record.make, record.model].filter(Boolean).join(' ')}
- **price** (4)
  - L11: price: string;
  - L116: {record.price && (
  - L118: <span className="font-medium">Price:</span>
  - L119: <span>${parseFloat(record.price || '0').toLocaleString()}</span>
- **vin** (7)
  - L10: vin: string;
  - L24: vin: string;
  - L27: export function AutoAuctionsResults({ vin }: AutoAuctionsResultsProps) {
  - L34: if (!vin) return;
  - L40: const data = await fetchAutoAuctionsByVin(vin);
- **photos** (3)
  - L19: image?: string;
  - L131: {record.image && (
  - L133: src={record.image}

### /workspaces/car-detective-mvp/src/components/valuation/BidCarsResults.tsx  (LOC 164)
exports: BidCarsResults
functions: BidCarsResults, fetchData, data
- **make** (3)
  - L14: make?: string;
  - L109: {(record.year || record.make || record.model) && (
  - L111: {[record.year, record.make, record.model].filter(Boolean).join(' ')}
- **model** (3)
  - L15: model?: string;
  - L109: {(record.year || record.make || record.model) && (
  - L111: {[record.year, record.make, record.model].filter(Boolean).join(' ')}
- **year** (3)
  - L13: year?: string;
  - L109: {(record.year || record.make || record.model) && (
  - L111: {[record.year, record.make, record.model].filter(Boolean).join(' ')}
- **price** (4)
  - L11: price: string;
  - L115: {record.price && (
  - L117: <span className="font-medium">Price:</span>
  - L118: <span>${parseFloat(record.price || '0').toLocaleString()}</span>
- **vin** (7)
  - L10: vin: string;
  - L23: vin: string;
  - L26: export function BidCarsResults({ vin }: BidCarsResultsProps) {
  - L33: if (!vin) return;
  - L39: const data = await fetchBidCarsByVin(vin);
- **photos** (3)
  - L18: image?: string;
  - L130: {record.image && (
  - L132: src={record.image}

### /workspaces/car-detective-mvp/src/components/valuation/CarFinderQaherCard.tsx  (LOC 146)
exports: CarFinderQaherCard
functions: isManualEntry
- **make** (2)
  - L9: make?: string;
  - L44: {vehicle.year} {vehicle.make} {vehicle.model}
- **model** (2)
  - L10: model?: string;
  - L44: {vehicle.year} {vehicle.make} {vehicle.model}
- **year** (2)
  - L8: year?: number;
  - L44: {vehicle.year} {vehicle.make} {vehicle.model}
- **mileage** (5)
  - L21: mileage?: number;
  - L104: {/* Only show mileage and condition for manual entry */}
  - L105: {isManualEntry && vehicle.mileage && (
  - L111: <p className="text-xs font-medium text-gray-500">Mileage</p>
  - L112: <p className="text-sm font-semibold text-gray-800">{vehicle.mileage.toLocaleString()} miles</p>
- **vin** (4)
  - L12: vin?: string;
  - L24: source?: 'vin' | 'plate' | 'manual';
  - L52: {vehicle.vin && (
  - L54: VIN: {vehicle.vin}

### /workspaces/car-detective-mvp/src/components/valuation/CensusIncomeTip.tsx  (LOC 122)
exports: CensusIncomeTip
functions: getIncomeImpact, medianIncome, impact, formatCurrency
- **zip** (3)
  - L7: zip: string;
  - L10: export const CensusIncomeTip: React.FC<CensusIncomeTipProps> = ({ zip }) => {
  - L11: const { data, isLoading, error } = useCensus(zip);
- **valuation** (2)
  - L22: // National median household income is around $70,000
  - L99: Median Income: {formatCurrency(data.data.medianIncome)}

### /workspaces/car-detective-mvp/src/components/valuation/CompetitorPriceCard.tsx  (LOC 140)
exports: CompetitorPriceCard
functions: competitorRows, averagePrice, comparison, difference, percentDiff
- **vin** (3)
  - L9: vin: string
  - L14: vin,
  - L17: const { data, isLoading, error } = useCompetitorPrices(vin)

### /workspaces/car-detective-mvp/src/components/valuation/CompetitorPriceComparison.tsx  (LOC 144)
exports: CompetitorPriceComparison
functions: fetchPrices, prices, averagePrice, priceDifference, percentageDifference, formatPrice, numPrice, getTrendIcon, getTrendBadgeVariant
- **price** (5)
  - L53: <h3 className="text-lg font-semibold mb-4">Competitor Price Comparison</h3>
  - L63: const formatPrice = (price: string | null | undefined) => {
  - L64: if (!price || price === '0') return 'N/A';
  - L65: const numPrice = parseInt(price, 10);
  - L85: <h3 className="text-lg font-semibold mb-4">Competitor Price Comparison</h3>
- **vin** (5)
  - L9: vin: string;
  - L15: vin,
  - L26: const prices = await getCachedCompetitorPrices(vin);
  - L34: if (vin) {
  - L37: }, [vin]);

### /workspaces/car-detective-mvp/src/components/valuation/ConfidenceExplanationBadge.tsx  (LOC 146)
exports: ConfidenceExplanationBadge
functions: ConfidenceExplanationBadge, getConfidenceLevel, generateExplanation
- **vin** (1)
  - L51: suggestions.push('VIN decoding may improve accuracy');
- **retry** (3)
  - L40: suggestions.push('Retry search for updated market data');
  - L64: if (!suggestions.includes('Retry search for updated market data')) {
  - L137: Retry Market Search

### /workspaces/car-detective-mvp/src/components/valuation/ConfidenceScore.tsx  (LOC 82)
exports: ConfidenceScore
functions: ConfidenceScore, getConfidenceLevel
- **valuation** (1)
  - L77: Valuation based on limited market data

### /workspaces/car-detective-mvp/src/components/valuation/CorrectionTrigger.tsx  (LOC 79)
exports: CorrectionTrigger
functions: CorrectionTrigger, handleCorrection, correctionResults
- **make** (3)
  - L9: make: string;
  - L20: make,
  - L34: make,
- **model** (3)
  - L10: model: string;
  - L21: model,
  - L35: model,
- **year** (3)
  - L11: year: number;
  - L22: year,
  - L36: year,
- **mileage** (3)
  - L12: mileage: number;
  - L23: mileage,
  - L37: mileage,
- **vin** (3)
  - L8: vin: string;
  - L19: vin,
  - L33: vin,
- **valuation** (2)
  - L53: <span className="text-sm font-medium">Valuation Corrected</span>
  - L74: Force Correct Valuation

### /workspaces/car-detective-mvp/src/components/valuation/DataIntegrityPanel.tsx  (LOC 180)
exports: DataIntegrityPanel
functions: getDataQualityIcon, getDataQualityColor, getMSRPSourceDescription
- **mileage** (1)
  - L150: <span>No actual mileage provided</span>

### /workspaces/car-detective-mvp/src/components/valuation/DealerOffersSection.tsx  (LOC 54)
exports: DealerOffersSection
functions: bestOffer, handleOfferCancelled
- **dealer** (3)
  - L4: import { AcceptedOfferCard } from '@/components/dealer/AcceptedOfferCard';
  - L20: <CardTitle>Dealer Offers</CardTitle>
  - L37: <CardTitle>Dealer Offers</CardTitle>

### /workspaces/car-detective-mvp/src/components/valuation/DrivingBehaviorInput.tsx  (LOC 109)
exports: DrivingBehaviorInput
functions: DrivingBehaviorInput, getValue, getLabel, handleSliderChange, currentValue
- **valuation** (1)
  - L93: <p className="font-medium">How This Affects Your Valuation</p>

### /workspaces/car-detective-mvp/src/components/valuation/EpaMpgTip.tsx  (LOC 125)
exports: EpaMpgTip
functions: getCombinedMpg, mpgMatch, combinedMpg, getPriceImpact, impact
- **make** (3)
  - L8: make: string;
  - L12: export const EpaMpgTip: React.FC<EpaMpgTipProps> = ({ year, make, model }) => {
  - L13: const { data, isLoading, error } = useEpaMpg(year, make, model);
- **model** (3)
  - L9: model: string;
  - L12: export const EpaMpgTip: React.FC<EpaMpgTipProps> = ({ year, make, model }) => {
  - L13: const { data, isLoading, error } = useEpaMpg(year, make, model);
- **year** (3)
  - L7: year: number;
  - L12: export const EpaMpgTip: React.FC<EpaMpgTipProps> = ({ year, make, model }) => {
  - L13: const { data, isLoading, error } = useEpaMpg(year, make, model);

### /workspaces/car-detective-mvp/src/components/valuation/FollowUpQuestions.tsx  (LOC 296)
exports: FollowUpQuestions
functions: handleSubmit, updateAnswer
- **mileage** (4)
  - L22: // 1. Mileage & Usage
  - L111: {/* 1. Mileage & Usage */}
  - L113: <h3 className="text-lg font-semibold border-b pb-2">1. Mileage & Usage</h3>
  - L115: <Label htmlFor="currentMileage">Current Mileage</Label>
- **valuation** (3)
  - L103: <CardTitle>Complete Your Accurate Valuation</CardTitle>
  - L105: Please answer the following questions to get a 100% accurate valuation of your vehicle.
  - L290: {isLoading ? 'Calculating Accurate Valuation...' : 'Get 100% Accurate Valuation'}

### /workspaces/car-detective-mvp/src/components/valuation/GeoMultiplier.tsx  (LOC 161)
exports: GeoMultiplier
functions: fetchMarketMultiplier, multiplier, getLocationImpact, location, isUrban, isSuburban, isLoading, impact, locationName
- **zip** (7)
  - L12: zip: string;
  - L15: export const GeoMultiplier: React.FC<GeoMultiplierProps> = ({ zip }) => {
  - L20: } = useOsmGeocode(zip);
  - L26: if (!zip) return;
  - L30: const multiplier = await getMarketMultiplier(zip);
- **storage** (1)
  - L5: import { supabase } from "@/integrations/supabase/client";
- **valuation** (1)
  - L9: } from "@/utils/valuation/marketData";

### /workspaces/car-detective-mvp/src/components/valuation/ListingProcessAuditForm.tsx  (LOC 597)
exports: ListingProcessAuditForm
functions: getStatusIcon, getStatusBadge, handleSave
- **make** (5)
  - L41: make?: string;
  - L273: <Label htmlFor="make">Make</Label>
  - L275: id="make"
  - L276: value={formData.vehicleInfo?.make || ''}
  - L279: vehicleInfo: {...formData.vehicleInfo!, make: e.target.value}
- **model** (5)
  - L42: model?: string;
  - L285: <Label htmlFor="model">Model</Label>
  - L287: id="model"
  - L288: value={formData.vehicleInfo?.model || ''}
  - L291: vehicleInfo: {...formData.vehicleInfo!, model: e.target.value}
- **year** (5)
  - L40: year?: number;
  - L260: <Label htmlFor="year">Year</Label>
  - L262: id="year"
  - L264: value={formData.vehicleInfo?.year || ''}
  - L267: vehicleInfo: {...formData.vehicleInfo!, year: parseInt(e.target.value)}
- **price** (3)
  - L333: {/* Section 3: Price & Fee Audit */}
  - L338: 3) Price & Fee Audit
  - L344: <Label htmlFor="advertisedPrice">Advertised Price</Label>
- **mileage** (3)
  - L390: {/* Section 4: Mileage & Condition */}
  - L395: 4) Mileage & Condition
  - L439: <Label htmlFor="mileagePresent">Mileage present?</Label>
- **vin** (7)
  - L38: vin?: string;
  - L238: <Label htmlFor="vin">VIN</Label>
  - L240: id="vin"
  - L241: value={formData.vin || ''}
  - L242: onChange={(e) => setFormData({...formData, vin: e.target.value})}
- **photos** (2)
  - L411: <Label htmlFor="photoCount">Photo Count</Label>
  - L448: <Label htmlFor="vinPlatePhoto">VIN plate photo?</Label>
- **dealer** (3)
  - L153: <Label htmlFor="source">Source (Dealer/Marketplace)</Label>
  - L375: <Label htmlFor="dealerFeesListed">Dealer fees listed?</Label>
  - L421: <Label htmlFor="dealerCondition">Dealer-Claimed Condition</Label>
- **url** (1)
  - L131: <Label htmlFor="listingUrl">Listing URL</Label>
- **retry** (3)
  - L532: {/* Section 10: Fallback & Retry */}
  - L537: 10) Fallback & Retry
  - L561: <Label htmlFor="retryAttempts">Retry Attempts</Label>
- **valuation** (5)
  - L454: {/* Section 9: Listing Quality & Comp Inclusion */}
  - L459: 9) Listing Quality & Comp Inclusion
  - L514: <Label htmlFor="includedInCompSet">Was listing included in comp set?</Label>
  - L525: placeholder="Reason why listing was excluded from comp set..."
  - L574: <Label htmlFor="finalMethod">Final Method for Valuation</Label>

### /workspaces/car-detective-mvp/src/components/valuation/MarketBreakdownPanel.tsx  (LOC 370)
exports: MarketBreakdownPanel
functions: MarketBreakdownPanel, groupListingsByTier, tier, computeTierAverages, tierListings, getTierBadgeColor, getTierLabel, listingsByTier, tierAverages, totalSourceCount, stats, trustPercentage, tierListings
- **make** (1)
  - L61: title: `${listing.year || result.vehicle.year} ${listing.make || result.vehicle.make} ${listing.model || result.vehicle.model}`,
- **model** (2)
  - L47: <p className="text-sm">This valuation was calculated using our base depreciation model.</p>
  - L61: title: `${listing.year || result.vehicle.year} ${listing.make || result.vehicle.make} ${listing.model || result.vehicle.model}`,
- **year** (1)
  - L61: title: `${listing.year || result.vehicle.year} ${listing.make || result.vehicle.make} ${listing.model || result.vehicle.model}`,
- **price** (5)
  - L15: price: number;
  - L62: price: listing.price || 0,
  - L86: ? tierListings.reduce((sum, l) => sum + (l.price || 0), 0) / tierListings.length
  - L195: <th className="text-right p-3 font-medium">Avg Price</th>
  - L273: ${listing.price.toLocaleString()}
- **mileage** (3)
  - L16: mileage: number;
  - L63: mileage: listing.mileage || 0,
  - L254: {listing.mileage > 0 && `${listing.mileage.toLocaleString()} mi • `}
- **dealer** (4)
  - L302: {/* Enhanced Source Contributions (25+ Dealer + P2P Sources) */}
  - L307: AIN searched <strong>{sourceContributions.length}</strong> individual dealer and P2P sources for maximum market coverage.
  - L351: ...and {sourceContributions.length - 9} more dealer sources analyzed
  - L361: verified dealer networks (Tier 2), and regional marketplaces (Tier 3). The final market value represents a
- **url** (4)
  - L19: url?: string;
  - L66: url: listing.url || listing.listing_url,
  - L275: {listing.url && (
  - L280: onClick={() => window.open(listing.url, '_blank')}
- **valuation** (4)
  - L7: import type { UnifiedValuationResult } from '@/types/valuation';
  - L40: 📊 Market Listings Used in Valuation
  - L47: <p className="text-sm">This valuation was calculated using our base depreciation model.</p>
  - L123: 📊 Market Listings Used in Valuation

### /workspaces/car-detective-mvp/src/components/valuation/MarketDataWarning.tsx  (LOC 125)
exports: MarketDataWarning
functions: getWarningLevel, warningLevel, getIcon, getVariant, getTitle, getDescription
- **dealer** (1)
  - L75: Consider checking additional sources like major dealer websites or expanding your search radius.`;
- **valuation** (3)
  - L68: return `⚠️ FALLBACK MODE: This valuation is based purely on MSRP depreciation models.
  - L74: return `⚠️ LIMITED DATA: Only 1 real market listing was found. This valuation has reduced accuracy.
  - L85: Valuation accuracy is good but could be improved with additional market data.`;

### /workspaces/car-detective-mvp/src/components/valuation/MarketForecastCard.tsx  (LOC 135)
exports: MarketForecastCard
functions: MarketForecastCard, loadForecast, forecastData, getTrendIcon, getTrendColor, getBadgeVariant, confidence, dataTooltip
- **vin** (5)
  - L10: vin: string;
  - L14: export function MarketForecastCard({ vin, estimatedValue }: MarketForecastCardProps) {
  - L20: if (!vin) return;
  - L24: const forecastData = await getOrCreateVinForecast(vin);
  - L33: }, [vin]);

### /workspaces/car-detective-mvp/src/components/valuation/MarketListingCard.tsx  (LOC 153)
exports: MarketListingCard
functions: sortedListings, averagePrice, priceRange
- **price** (6)
  - L32: return b.price - a.price; // Then by price descending
  - L35: const averagePrice = listings.reduce((sum, l) => sum + l.price, 0) / listings.length;
  - L37: min: Math.min(...listings.map(l => l.price)),
  - L38: max: Math.max(...listings.map(l => l.price))
  - L53: {/* Price Summary */}
- **mileage** (2)
  - L105: {listing.mileage && (
  - L106: <span>{listing.mileage.toLocaleString()} mi</span>
- **vin** (9)
  - L28: // Sort listings to show exact VIN match first
  - L30: if (a.vin === targetVin && b.vin !== targetVin) return -1;
  - L31: if (b.vin === targetVin && a.vin !== targetVin) return 1;
  - L48: VIN Match Found
  - L77: listing.vin === targetVin
- **dealer** (2)
  - L98: {(listing.dealer_name || listing.dealerName || listing.dealer) && (
  - L100: {listing.dealer_name || listing.dealerName || listing.dealer}
- **url** (3)
  - L124: {(listing.listing_url || listing.listingUrl || listing.link || listing.url) &&
  - L125: (listing.listing_url || listing.listingUrl || listing.link || listing.url) !== '#' && (
  - L127: href={listing.listing_url || listing.listingUrl || listing.link || listing.url}
- **valuation** (1)
  - L22: <p className="text-sm text-red-600">❌ No real market listings found - valuation not available</p>

### /workspaces/car-detective-mvp/src/components/valuation/MarketTrendSection.tsx  (LOC 66)
exports: MarketTrendSection
functions: MarketTrendSection
- **make** (4)
  - L13: make: string;
  - L23: make,
  - L32: make,
  - L60: make={make}
- **model** (4)
  - L14: model: string;
  - L24: model,
  - L33: model,
  - L61: model={model}
- **year** (4)
  - L15: year: number;
  - L25: year,
  - L34: year,
  - L59: year={year}
- **valuation** (1)
  - L9: import { PremiumFeatureLock } from "@/components/valuation/market-trend/PremiumLockSection";

### /workspaces/car-detective-mvp/src/components/valuation/MarketplaceComparisonCard.tsx  (LOC 148)
exports: MarketplaceComparisonCard
functions: MarketplaceComparisonCard, averageMarketPrice, bestDealerOffer, priceComparison, isAboveMarket
- **price** (5)
  - L12: price: number;
  - L38: ? Math.round(listings.reduce((sum, listing) => sum + listing.price, 0) / listings.length)
  - L63: {/* Price Comparison Summary */}
  - L78: <p className="text-sm text-gray-600">Price Delta</p>
  - L125: ${listing.price.toLocaleString()}
- **mileage** (3)
  - L16: mileage?: number;
  - L116: {listing.mileage && (
  - L118: {listing.mileage.toLocaleString()} miles
- **dealer** (1)
  - L72: <p className="text-sm text-gray-600">Best Dealer Offer</p>
- **url** (2)
  - L15: url: string;
  - L131: onClick={() => window.open(listing.url, '_blank')}

### /workspaces/car-detective-mvp/src/components/valuation/MarketplaceInsightCard.tsx  (LOC 151)
exports: MarketplaceInsightCard
functions: validListings, averagePrice, comparison, difference, percentDiff
- **price** (3)
  - L49: const validListings = listings.filter(listing => listing.price && listing.price > 0);
  - L51: ? Math.round(validListings.reduce((sum, listing) => sum + (listing.price || 0), 0) / validListings.length)
  - L112: ${listing.price?.toLocaleString()}
- **mileage** (2)
  - L105: {listing.mileage && (
  - L106: <span>{listing.mileage.toLocaleString()} mi</span>
- **vin** (3)
  - L8: vin: string;
  - L13: vin,
  - L16: const { data: listings, isLoading, error } = useScrapedListings(vin);
- **url** (1)
  - L87: href={listing.url}

### /workspaces/car-detective-mvp/src/components/valuation/MissingInfoPrompt.tsx  (LOC 159)
exports: MissingInfoPrompt
functions: getFieldDisplayName, getFieldExplanation, topFields, hasCarfaxIntegration
- **make** (1)
  - L10: make?: string;
- **model** (1)
  - L11: model?: string;
- **year** (1)
  - L12: year?: number;
- **price** (1)
  - L38: mileage: 'Mileage is one of the top 3 factors in market value; can shift price by thousands.',
- **mileage** (2)
  - L21: mileage: 'Current Mileage',
  - L38: mileage: 'Mileage is one of the top 3 factors in market value; can shift price by thousands.',
- **photos** (3)
  - L23: photos: 'Exterior Photos',
  - L40: photos: 'Our AI can detect wear, scratches, and dents to improve accuracy.',
  - L140: <strong>Tip:</strong> Uploading 3–8 clear photos enables our AI condition scoring for unmatched accuracy.
- **zip** (1)
  - L25: zip_code: 'ZIP Code Location',
- **valuation** (8)
  - L5: import { MissingDataAnalysis } from '@/utils/valuation/missingFieldAnalyzer';
  - L50: return explanations[fieldId] || 'This information helps improve valuation accuracy.';
  - L69: <p className="font-semibold text-success">Valuation Complete</p>
  - L71: Your valuation data is complete! We have everything needed for maximum accuracy.
  - L80: View Final Valuation

### /workspaces/car-detective-mvp/src/components/valuation/NhtsaRecalls.tsx  (LOC 144)
exports: NhtsaRecalls
functions: NhtsaRecalls, handleRefresh
- **make** (3)
  - L11: make: string;
  - L18: { make, model, year, className }: NhtsaRecallsProps,
  - L20: const { data, loading, error } = useNhtsaRecalls(make, model, year);
- **model** (3)
  - L12: model: string;
  - L18: { make, model, year, className }: NhtsaRecallsProps,
  - L20: const { data, loading, error } = useNhtsaRecalls(make, model, year);
- **year** (3)
  - L13: year: number;
  - L18: { make, model, year, className }: NhtsaRecallsProps,
  - L20: const { data, loading, error } = useNhtsaRecalls(make, model, year);
- **retry** (1)
  - L56: <Button size="sm" onClick={handleRefresh}>Retry</Button>
- **valuation** (1)
  - L129: {/* Valuation impact tip */}

### /workspaces/car-detective-mvp/src/components/valuation/NicbVinCheck.tsx  (LOC 145)
exports: NicbVinCheck
functions: VinInfoMessage, NicbVinCheck, handleSubmit, handleVinChange, value, renderResult, isClean
- **vin** (6)
  - L16: <p>A VIN (Vehicle Identification Number) is a unique 17-character code that identifies your vehicle.</p>
  - L105: <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
  - L107: id="vin"
  - L110: placeholder="Enter 17-character VIN"
  - L125: Checking VIN...
- **dedupe** (1)
  - L16: <p>A VIN (Vehicle Identification Number) is a unique 17-character code that identifies your vehicle.</p>

### /workspaces/car-detective-mvp/src/components/valuation/PhotoConditionScore.tsx  (LOC 119)
exports: PhotoConditionScore
functions: PhotoConditionScore, mockAnalysis
- **photos** (6)
  - L24: feature="photo condition analysis"
  - L25: ctaText="Unlock Photo Analysis"
  - L30: // If no photo URL is provided
  - L35: <CardTitle>Photo Analysis</CardTitle>
  - L39: No photos were provided for this valuation.
- **url** (1)
  - L30: // If no photo URL is provided
- **valuation** (2)
  - L3: import { PremiumFeatureLock } from '@/components/valuation/market-trend/PremiumLockSection';
  - L39: No photos were provided for this valuation.

### /workspaces/car-detective-mvp/src/components/valuation/PhotoUploadAndScore.tsx  (LOC 116)
exports: PhotoUploadAndScore
- **vin** (1)
  - L58: <li>• VIN plate/sticker</li>
- **photos** (8)
  - L7: import { AICondition } from '@/types/photo';
  - L31: AI Photo Analysis
  - L46: <p className="font-medium text-primary">Upload Photos for AI Analysis</p>
  - L54: <p className="font-medium">Recommended Photos:</p>
  - L62: <p className="font-medium">Additional Photos:</p>
- **valuation** (1)
  - L97: AI condition scoring has been applied to your valuation

### /workspaces/car-detective-mvp/src/components/valuation/PredictionResult.tsx  (LOC 59)
exports: PredictionResult
- **make** (2)
  - L46: <p>Vehicle: {vehicleInfo.make} {vehicleInfo.model} ({vehicleInfo.year})</p>
  - L52: <p>Vehicle: {vehicleData.make} {vehicleData.model}</p>
- **model** (2)
  - L46: <p>Vehicle: {vehicleInfo.make} {vehicleInfo.model} ({vehicleInfo.year})</p>
  - L52: <p>Vehicle: {vehicleData.make} {vehicleData.model}</p>
- **year** (1)
  - L46: <p>Vehicle: {vehicleInfo.make} {vehicleInfo.model} ({vehicleInfo.year})</p>

### /workspaces/car-detective-mvp/src/components/valuation/PremiumPdfSection.tsx  (LOC 166)
exports: PremiumPdfSection
functions: PremiumPdfSection, handleDownloadPdf, handleNotifyDealers
- **make** (2)
  - L25: make: valuationResult.make || 'Unknown',
  - L64: make: valuationResult.make || 'Unknown',
- **model** (2)
  - L26: model: valuationResult.model || 'Unknown',
  - L65: model: valuationResult.model || 'Unknown',
- **year** (2)
  - L27: year: valuationResult.year || 2020,
  - L66: year: valuationResult.year || 2020,
- **price** (2)
  - L31: price: valuationResult.estimatedValue || 0,
  - L70: price: valuationResult.estimatedValue || 0,
- **mileage** (2)
  - L28: mileage: valuationResult.mileage || 0,
  - L67: mileage: valuationResult.mileage || 0,
- **vin** (2)
  - L37: vin: valuationResult.vin,
  - L76: vin: valuationResult.vin,
- **dealer** (3)
  - L96: Upgrade to access detailed PDF reports with market analysis and dealer notifications.
  - L139: Dealer notifications are available for vehicles valued at $8,000+
  - L160: <p>• Local dealer network alerts</p>
- **zip** (1)
  - L58: toast.error('ZIP code is required to notify dealers');

### /workspaces/car-detective-mvp/src/components/valuation/ProcessAuditTrail.tsx  (LOC 49)
exports: ProcessAuditTrail
functions: ProcessAuditTrail
- **storage** (2)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L9: const { data } = await supabase

### /workspaces/car-detective-mvp/src/components/valuation/QrCodeDownload.tsx  (LOC 36)
exports: QrCodeDownload
functions: QrCodeDownload
- **url** (3)
  - L7: url: string;
  - L13: url,
  - L21: value={url}

### /workspaces/car-detective-mvp/src/components/valuation/RerunValuationButton.tsx  (LOC 43)
exports: RerunValuationButton
functions: RerunValuationButton, handleRerun, canRerun
- **valuation** (1)
  - L39: {isRerunning ? 'Rerunning...' : 'Update Valuation'}

### /workspaces/car-detective-mvp/src/components/valuation/SeasonalAdjustment.tsx  (LOC 311)
exports: SeasonalAdjustment
functions: BODY_STYLES, SeasonalAdjustment, handleDateChange, handleBodyStyleChange, fetchSeasonalTip, month, vehicleType, factor, percentChange, direction, handleRefreshSeasonalFactor, month, vehicleType, factors, factor, percentChange, direction
- **fetch** (1)
  - L89: const { data, error } = await fetch(

### /workspaces/car-detective-mvp/src/components/valuation/UnifiedValuationResult.tsx  (LOC 297)
exports: UnifiedValuationResult
functions: navigate, vehicleYear, vehicleMake, vehicleModel, vehicleTrim, vehicleMileage, estimatedValue, priceRange, confidenceFactors, recommendations, handleImproveClick
- **make** (2)
  - L30: const vehicleMake = result.vehicle?.make || '';
  - L216: {listing.year || vehicleYear} {listing.make || vehicleMake} {listing.model || vehicleModel}
- **model** (2)
  - L31: const vehicleModel = result.vehicle?.model || '';
  - L216: {listing.year || vehicleYear} {listing.make || vehicleMake} {listing.model || vehicleModel}
- **year** (2)
  - L29: const vehicleYear = result.vehicle?.year || 0;
  - L216: {listing.year || vehicleYear} {listing.make || vehicleMake} {listing.model || vehicleModel}
- **price** (2)
  - L40: // Create a price range if we have market listings
  - L222: <p className="font-bold">{formatCurrency(listing.price)}</p>
- **mileage** (3)
  - L33: const vehicleMileage = result.mileage || 0;
  - L60: recommendations.push('Enter your vehicle\'s actual mileage for a more accurate valuation');
  - L219: {listing.mileage ? `${listing.mileage.toLocaleString()} miles` : 'Unknown mileage'} • {listing.source}
- **vin** (4)
  - L48: vinAccuracy: result.vin ? 85 : 60,
  - L62: if (!result.vin || result.vin.length !== 17) {
  - L63: recommendations.push('Provide a valid 17-character VIN for the most accurate valuation');
  - L68: navigate(`/valuation/${result.vin || 'new'}`);
- **zip** (1)
  - L132: {result.zip ? ` • ${result.zip}` : ''}
- **retry** (1)
  - L107: Retry Valuation
- **valuation** (11)
  - L10: import type { UnifiedValuationResult as ValuationResultType } from '@/types/valuation';
  - L60: recommendations.push('Enter your vehicle\'s actual mileage for a more accurate valuation');
  - L63: recommendations.push('Provide a valid 17-character VIN for the most accurate valuation');
  - L68: navigate(`/valuation/${result.vin || 'new'}`);
  - L71: // Display error state if no valid valuation data

### /workspaces/car-detective-mvp/src/components/valuation/ValuationAuditTrail.tsx  (LOC 114)
exports: ValuationAuditTrail
functions: getStatusIcon, getStatusBadge, aiConfidenceScore
- **photos** (1)
  - L6: import { AICondition } from '@/types/photo';
- **valuation** (1)
  - L55: Valuation Audit Trail

### /workspaces/car-detective-mvp/src/components/valuation/ValuationDetailsForm.tsx  (LOC 201)
exports: ValuationDetailsForm
functions: ValuationDetailsForm, handleSubmit, handleInputChange
- **make** (6)
  - L20: make: string;
  - L35: make: '',
  - L78: <Label htmlFor="make">Make</Label>
  - L80: id="make"
  - L81: value={formData.make}
- **model** (6)
  - L21: model: string;
  - L36: model: '',
  - L88: <Label htmlFor="model">Model</Label>
  - L90: id="model"
  - L91: value={formData.model}
- **year** (6)
  - L19: year: string;
  - L34: year: '',
  - L68: <Label htmlFor="year">Year</Label>
  - L70: id="year"
  - L71: value={formData.year}
- **mileage** (6)
  - L22: mileage: string;
  - L37: mileage: '',
  - L98: <Label htmlFor="mileage">Mileage</Label>
  - L100: id="mileage"
  - L101: value={formData.mileage}
- **zip** (1)
  - L120: <Label htmlFor="zipCode">ZIP Code</Label>
- **valuation** (2)
  - L192: loadingText="Getting Valuation..."
  - L195: Get Valuation

### /workspaces/car-detective-mvp/src/components/valuation/ValuationEmptyState.tsx  (LOC 33)
exports: ValuationEmptyState
- **valuation** (1)
  - L22: <h3 className="text-lg font-medium mb-2">Valuation Error</h3>

### /workspaces/car-detective-mvp/src/components/valuation/ValuationProgressDisplay.tsx  (LOC 147)
exports: ValuationProgressDisplay
functions: ValuationProgressDisplay, getStepIcon, getStepColor, engineeringProgress
- **valuation** (3)
  - L6: import { ValuationStep, EngineeringPhase, ENGINEERING_PHASES, getOverallEngineeringProgress } from '@/utils/valuation/progressTracker';
  - L55: <CardTitle className="text-lg">Valuation Progress</CardTitle>
  - L83: <CardTitle className="text-base">Valuation Steps</CardTitle>

### /workspaces/car-detective-mvp/src/components/valuation/ValuationResultCard.tsx  (LOC 523)
exports: ValuationResultCard
functions: ValuationResultCard, handleDownloadPdf, errorMessage, getConfidenceColor, getConfidenceLabel, shareLink, copyToClipboard, errorMessage
- **model** (2)
  - L164: <strong>Fallback Pricing Method:</strong> Model-based estimate (no verified local comps yet).
  - L183: ±15% range due to model-based pricing
- **price** (2)
  - L406: <TableHead>Price</TableHead>
  - L417: <TableCell>${listing.price.toLocaleString()}</TableCell>
- **mileage** (6)
  - L272: {/* Mileage Penalty */}
  - L278: <span className="font-medium">Mileage Adjustment</span>
  - L284: <p>Value adjustment based on vehicle mileage vs. average</p>
  - L289: {mileagePenalty < 0 ? 'Above average mileage' : 'Below average mileage'}
  - L407: <TableHead>Mileage</TableHead>
- **vin** (9)
  - L51: vin?: string;
  - L54: export function ValuationResultCard({ result, onDownloadPdf, onShareReport, vin = 'unknown' }: ValuationResultCardProps) {
  - L76: valuationLogger.resultsDisplay(vin, 'display-results', {
  - L83: }, [finalValue, confidenceScore, marketListings, sourcesUsed, vin]);
  - L90: valuationLogger.resultsDisplay(vin, 'pdf-download-start', { finalValue }, true);
- **photos** (1)
  - L166: Add photos or retry live market search to tighten the range.
- **zip** (2)
  - L239: {/* ZIP Code Adjustment */}
  - L245: <span className="font-medium">ZIP Code Market Adjustment</span>
- **url** (2)
  - L426: {listing.url ? (
  - L428: <a href={listing.url} target="_blank" rel="noopener noreferrer">
- **retry** (1)
  - L166: Add photos or retry live market search to tighten the range.
- **openai** (3)
  - L81: usedOpenAIFallback: sourcesUsed?.includes('openai') || sourcesUsed?.includes('openai-web') || false
  - L132: {(marketListings.length === 0 || confidenceScore < 65 || sourcesUsed?.some((source: any) => source.includes('openai') || source.includes('fallback'))) && (
  - L139: {sourcesUsed?.some((source: any) => source.includes('openai') || source.includes('fallback')) && ' AI-generated or fallback data used. '}
- **valuation** (3)
  - L145: {/* Valuation Summary */}
  - L151: Valuation Summary
  - L164: <strong>Fallback Pricing Method:</strong> Model-based estimate (no verified local comps yet).

### /workspaces/car-detective-mvp/src/components/valuation/ValuationResultsProps.ts  (LOC 13)
exports: ValuationResultsProps
- **make** (1)
  - L6: make: string;
- **model** (1)
  - L7: model: string;
- **year** (1)
  - L8: year: number;
- **mileage** (1)
  - L9: mileage?: number;

### /workspaces/car-detective-mvp/src/components/valuation/ValueBreakdown.tsx  (LOC 156)
exports: ValueBreakdown
functions: ValueBreakdown, getAdjustmentIcon, getAdjustmentColor, totalAdjustments, realBaseMSRP, usedRealMSRP
- **model** (1)
  - L150: Based on data completeness, market conditions, and valuation model accuracy.
- **price** (1)
  - L85: ? 'Manufacturer\'s Suggested Retail Price from database'
- **valuation** (2)
  - L86: : 'Starting valuation for your vehicle'
  - L150: Based on data completeness, market conditions, and valuation model accuracy.

### /workspaces/car-detective-mvp/src/components/valuation/VehicleFoundCard.tsx  (LOC 138)
exports: VehicleFoundCard
- **make** (2)
  - L9: make?: string;
  - L41: {vehicle.year} {vehicle.make} {vehicle.model}
- **model** (2)
  - L10: model?: string;
  - L41: {vehicle.year} {vehicle.make} {vehicle.model}
- **year** (2)
  - L8: year?: number;
  - L41: {vehicle.year} {vehicle.make} {vehicle.model}
- **vin** (4)
  - L12: vin?: string;
  - L50: {vehicle.vin && (
  - L56: <span className="text-sm font-medium text-gray-500">VIN</span>
  - L57: <p className="font-mono text-sm text-gray-800">{vehicle.vin}</p>
- **valuation** (1)
  - L129: Continue to Enhanced Valuation

### /workspaces/car-detective-mvp/src/components/valuation/WhyNotCountedCard.tsx  (LOC 15)
exports: WhyNotCountedCard
functions: WhyNotCountedCard
- **url** (2)
  - L1: export function WhyNotCountedCard({ excluded }: { excluded: Array<{ source:string; url:string; reason:string }> }) {
  - L9: <span className="font-medium">{e.source}</span> — {e.reason} <a className="underline" href={e.url} target="_blank">view</a>

### /workspaces/car-detective-mvp/src/components/valuation/YearScroller.tsx  (LOC 52)
exports: YearScroller
functions: YearScroller, listRef, years, index, node
- **year** (6)
  - L7: onYearChange: (year: number) => void;
  - L37: {years.map((year) => (
  - L38: <li key={year} className="mb-1 last:mb-0">
  - L40: variant={year === selectedYear ? "default" : "ghost"}
  - L42: onClick={() => onYearChange(year)}

### /workspaces/car-detective-mvp/src/components/valuation/ZipMarketAnalysis.tsx  (LOC 176)
exports: ZipMarketAnalysis
functions: ZipMarketAnalysis, fetchMarketData, multiplier, getImpactDescription, getImpactColor, getPriceImpact, impact
- **price** (1)
  - L161: Price impact:{" "}
- **zip** (2)
  - L28: setError("No ZIP code provided");
  - L121: No market data available for this ZIP code
- **valuation** (1)
  - L9: } from "@/utils/valuation/marketData";

### /workspaces/car-detective-mvp/src/components/valuation/comprehensive/ComprehensiveValuationForm.tsx  (LOC 334)
exports: ComprehensiveValuationForm
functions: AVAILABLE_SOURCES, ComprehensiveValuationForm, interval, handleSubmit, valuationRequest, toggleSource
- **make** (8)
  - L34: make: '',
  - L69: if (!formData.year || !formData.make || !formData.model) {
  - L77: make: formData.make,
  - L131: <Label htmlFor="make">Make *</Label>
  - L133: id="make"
- **model** (8)
  - L35: model: '',
  - L69: if (!formData.year || !formData.make || !formData.model) {
  - L78: model: formData.model,
  - L142: <Label htmlFor="model">Model *</Label>
  - L144: id="model"
- **year** (8)
  - L33: year: '',
  - L69: if (!formData.year || !formData.make || !formData.model) {
  - L76: year: parseInt(formData.year),
  - L117: <Label htmlFor="year">Year *</Label>
  - L119: id="year"
- **price** (1)
  - L302: <p className="text-sm text-muted-foreground mb-2">Price Range</p>
- **mileage** (6)
  - L37: mileage: '',
  - L80: mileage: formData.mileage ? parseInt(formData.mileage) : undefined,
  - L165: <Label htmlFor="mileage">Mileage (Optional)</Label>
  - L167: id="mileage"
  - L170: value={formData.mileage}
- **zip** (1)
  - L177: <Label htmlFor="zip_code">ZIP Code (Optional)</Label>
- **valuation** (3)
  - L107: Comprehensive Market Valuation
  - L242: Get Comprehensive Valuation
  - L279: Valuation Complete

### /workspaces/car-detective-mvp/src/components/valuation/condition/conditionDescriptions.ts  (LOC 252)
exports: getConditionDescription
functions: getConditionDescription, conditionLevel, getConditionLevel
- **model** (1)
  - L248: "Matching brand and model on all corners. Very consistent wear patterns.",

### /workspaces/car-detective-mvp/src/components/valuation/condition/types.ts  (LOC 41)
exports: ConditionValues, ConditionRatingOption, ConditionTipsProps, ConditionRating
- **year** (1)
  - L11: year: number;
- **mileage** (1)
  - L10: mileage: number;

### /workspaces/car-detective-mvp/src/components/valuation/detail/VehicleDataTable.tsx  (LOC 97)
exports: VehicleDataTable
functions: VehicleDataTable, mergedData, formatValue, dataRows
- **make** (3)
  - L6: make?: string;
  - L19: make?: string;
  - L60: { label: "Make", value: formatValue("make", mergedData.make) },
- **model** (3)
  - L7: model?: string;
  - L20: model?: string;
  - L61: { label: "Model", value: formatValue("model", mergedData.model) },
- **year** (4)
  - L5: year?: number;
  - L21: year?: number;
  - L50: if (key === "year" && typeof value === "number") {
  - L59: { label: "Year", value: formatValue("year", mergedData.year) },
- **mileage** (4)
  - L8: mileage?: number;
  - L22: mileage?: number;
  - L46: if (key === "mileage" && typeof value === "number") {
  - L63: { label: "Mileage", value: formatValue("mileage", mergedData.mileage) },
- **vin** (1)
  - L25: vin?: string;
- **valuation** (1)
  - L2: // Removed manual valuation dependency - using inline interface

### /workspaces/car-detective-mvp/src/components/valuation/enhanced-followup/EnhancedVehicleCard.tsx  (LOC 193)
exports: EnhancedVehicleCard
functions: EnhancedVehicleCard, formatMileage
- **make** (2)
  - L41: alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
  - L62: {vehicle.year} {vehicle.make} {vehicle.model}
- **model** (2)
  - L41: alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
  - L62: {vehicle.year} {vehicle.make} {vehicle.model}
- **year** (2)
  - L41: alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
  - L62: {vehicle.year} {vehicle.make} {vehicle.model}
- **mileage** (7)
  - L19: const formatMileage = (mileage?: number) => {
  - L20: if (!mileage) return 'Unknown';
  - L21: return new Intl.NumberFormat().format(mileage) + ' miles';
  - L86: {/* Mileage */}
  - L87: {vehicle.mileage && (
- **vin** (4)
  - L73: {/* VIN */}
  - L74: {vehicle.vin && (
  - L80: <span className="text-sm font-medium text-gray-500">VIN</span>
  - L81: <p className="font-mono text-sm text-gray-800 break-all">{vehicle.vin}</p>
- **photos** (3)
  - L35: {/* Vehicle Photo */}
  - L46: {vehicle.photos?.length || 1} photo{(vehicle.photos?.length || 1) > 1 ? 's' : ''}
  - L54: <p>No photo available</p>
- **valuation** (1)
  - L186: Continue to Enhanced Valuation Assessment

### /workspaces/car-detective-mvp/src/components/valuation/enterprise/EnterpriseValuationPanel.tsx  (LOC 365)
exports: EnterpriseValuationPanel
functions: EnterpriseValuationPanel, handleStartAggregation, newRequestId, loadResults, response, resultData, getStatusIcon, getStatusText, formatCurrency
- **make** (1)
  - L14: make: string;
- **model** (1)
  - L15: model: string;
- **year** (1)
  - L17: year: number;
- **price** (4)
  - L234: <CardTitle className="text-lg">Price Range</CardTitle>
  - L284: <div className="text-xl font-bold">{formatCurrency(listing.price)}</div>
  - L314: <p className="text-sm text-muted-foreground">Average Price</p>
  - L318: <p className="text-sm text-muted-foreground">Price Range</p>
- **mileage** (2)
  - L18: mileage?: number;
  - L277: {listing.mileage && `${listing.mileage.toLocaleString()} miles`}
- **vin** (1)
  - L13: vin?: string;
- **dealer** (1)
  - L275: {(listing.dealer_name || listing.dealerName || listing.dealer) && `${listing.dealer_name || listing.dealerName || listing.dealer} • `}
- **url** (1)
  - L286: href={listing.listing_url || listing.listingUrl || listing.link || listing.url}
- **fetch** (1)
  - L108: const response = await fetch(`https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/valuation-result/${id}`, {
- **storage** (4)
  - L7: import { supabase } from '@/integrations/supabase/client';
  - L61: const { data: requestData, error: requestError } = await supabase.functions.invoke('valuation-request', {
  - L78: const { data: aggregateData, error: aggregateError } = await supabase.functions.invoke('valuation-aggregate', {
  - L108: const response = await fetch(`https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/valuation-result/${id}`, {
- **valuation** (10)
  - L60: // Step 1: Create valuation request
  - L61: const { data: requestData, error: requestError } = await supabase.functions.invoke('valuation-request', {
  - L78: const { data: aggregateData, error: aggregateError } = await supabase.functions.invoke('valuation-aggregate', {
  - L91: description: `Found ${aggregateData.comps_found} market comps from ${aggregateData.sources_processed} sources.`,
  - L107: // Use direct fetch to the valuation-result function with path parameter

### /workspaces/car-detective-mvp/src/components/valuation/equipment/EquipmentSelector.tsx  (LOC 160)
exports: EquipmentSelector
functions: EquipmentSelector, fetchEquipmentOptions, toggleEquipment, calculateTotalValueAdd, option, formatPercentage, percentage
- **storage** (2)
  - L11: import { supabase } from "@/integrations/supabase/client";
  - L38: const { data, error } = await supabase

### /workspaces/car-detective-mvp/src/components/valuation/equipment/EquipmentSummary.tsx  (LOC 117)
exports: EquipmentSummary
functions: EquipmentSummary, fetchEquipmentNames, formatPercentage, percentage
- **storage** (3)
  - L8: import { supabase } from "@/integrations/supabase/client";
  - L27: const { data, error } = await supabase
  - L96: These premium features and options are factored into your vehicle's valuation.
- **valuation** (1)
  - L96: These premium features and options are factored into your vehicle's valuation.

### /workspaces/car-detective-mvp/src/components/valuation/free/FeaturesIncluded.tsx  (LOC 28)
exports: FeaturesIncluded
functions: FeaturesIncluded
- **photos** (1)
  - L16: "Single-photo AI scoring demo",
- **valuation** (1)
  - L9: What's included in the free valuation

### /workspaces/car-detective-mvp/src/components/valuation/free/FreeValuationForm.tsx  (LOC 271)
exports: FreeValuationForm
functions: currentYear, valuationSchema, FreeValuationForm, navigate, onSubmit, handleConditionChange
- **make** (10)
  - L33: make: z.string().min(1, "Make is required"),
  - L64: make: "",
  - L79: vin: `MANUAL_${data.make}_${data.model}_${data.year}`,
  - L80: make: data.make,
  - L126: <Label htmlFor="make">Make</Label>
- **model** (10)
  - L34: model: z.string().min(1, "Model is required"),
  - L65: model: "",
  - L79: vin: `MANUAL_${data.make}_${data.model}_${data.year}`,
  - L81: model: data.model,
  - L139: <Label htmlFor="model">Model</Label>
- **year** (12)
  - L35: year: z.coerce.number()
  - L36: .min(1900, "Year must be at least 1900")
  - L37: .max(currentYear + 1, `Year cannot be greater than ${currentYear + 1}`),
  - L66: year: currentYear,
  - L79: vin: `MANUAL_${data.make}_${data.model}_${data.year}`,
- **mileage** (13)
  - L38: mileage: z.coerce.number()
  - L39: .min(0, "Mileage cannot be negative")
  - L40: .max(1000000, "Mileage seems too high"),
  - L67: mileage: 0,
  - L83: mileage: data.mileage,
- **vin** (1)
  - L79: vin: `MANUAL_${data.make}_${data.model}_${data.year}`,
- **zip** (3)
  - L42: .min(5, "ZIP code must be at least 5 characters")
  - L43: .max(10, "ZIP code cannot exceed 10 characters"),
  - L193: ZIP Code
- **schema** (2)
  - L3: import { zodResolver } from "@hookform/resolvers/zod";
  - L4: import { z } from "zod";
- **valuation** (8)
  - L90: toast.success("Valuation completed successfully!");
  - L91: navigate('/valuation');
  - L110: Free Basic Valuation
  - L115: I'm AIN, your valuation assistant. Hover over any ⓘ icon to understand how each field affects your vehicle's value.
  - L121: id="valuation-form"

### /workspaces/car-detective-mvp/src/components/valuation/free/UpsellBanner.tsx  (LOC 16)
exports: UpsellBanner
functions: UpsellBanner
- **photos** (1)
  - L8: Upgrade to Premium for full CARFAX report, multi-photo AI scoring &
- **dealer** (1)
  - L9: dealer offers

### /workspaces/car-detective-mvp/src/components/valuation/header/UnifiedValuationHeader.tsx  (LOC 187)
exports: VehicleInfoProps, UnifiedValuationHeader
functions: UnifiedValuationHeader, mileage
- **make** (4)
  - L10: make: string;
  - L20: make: string;
  - L63: {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
  - L176: alt={`${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`}
- **model** (4)
  - L11: model: string;
  - L21: model: string;
  - L63: {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
  - L176: alt={`${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`}
- **year** (4)
  - L12: year: number;
  - L22: year: number;
  - L63: {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
  - L176: alt={`${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`}
- **mileage** (5)
  - L13: mileage: number;
  - L23: mileage?: number;
  - L54: // Ensure mileage is a valid number
  - L55: const mileage = vehicleInfo.mileage || 0;
  - L74: {mileage.toLocaleString()} miles
- **photos** (3)
  - L6: import { AICondition } from "@/types/photo";
  - L84: : "Photos submitted"}
  - L170: {/* Optional: Best photo preview */}

### /workspaces/car-detective-mvp/src/components/valuation/header/index.ts  (LOC 4)
- **valuation** (1)
  - L1: // Export unified valuation header components

### /workspaces/car-detective-mvp/src/components/valuation/header/types.ts  (LOC 15)
exports: ValuationHeaderProps, VehicleInfoProps
- **make** (1)
  - L9: make?: string;
- **model** (1)
  - L10: model?: string;
- **year** (1)
  - L11: year?: number;
- **mileage** (1)
  - L12: mileage?: number;

### /workspaces/car-detective-mvp/src/components/valuation/hooks/useValuationData.ts  (LOC 77)
exports: useValuationData
functions: useValuationData, fetchValuationData, result, request
- **make** (2)
  - L6: make?: string;
  - L42: make: request.make,
- **model** (2)
  - L7: model?: string;
  - L43: model: request.model,
- **year** (2)
  - L8: year?: number;
  - L44: year: request.year,
- **mileage** (2)
  - L9: mileage?: number;
  - L45: mileage: result.follow_up_data?.mileage || request.mileage,
- **vin** (2)
  - L14: vin?: string;
  - L50: vin: request.vin,
- **storage** (2)
  - L3: import { supabase } from '@/integrations/supabase/client';
  - L29: const { data, error } = await supabase.functions.invoke('valuation-result', {
- **valuation** (4)
  - L28: // Fetch real valuation data from the valuation-result edge function
  - L29: const { data, error } = await supabase.functions.invoke('valuation-result', {
  - L57: throw new Error('No valuation result found');
  - L60: setError('Failed to load valuation data');

### /workspaces/car-detective-mvp/src/components/valuation/index.ts  (LOC 13)
- **dedupe** (1)
  - L4: // Note: PhotoUpload is now only exported from the main components index with unique naming
- **valuation** (1)
  - L2: // Valuation Components - Consolidated Export

### /workspaces/car-detective-mvp/src/components/valuation/market-trend/MarketTrendContent.tsx  (LOC 81)
exports: MarketTrendContent
functions: MarketTrendContent
- **make** (4)
  - L17: make: string;
  - L22: { trend, forecastData, year, make, model }: MarketTrendContentProps,
  - L37: We don't have enough recent market listings for the {year} {make} {model} to generate an accurate forecast.
  - L61: fallbackAnalysis={`Based on market data, your ${year} ${make} ${model} is projected to
- **model** (4)
  - L18: model: string;
  - L22: { trend, forecastData, year, make, model }: MarketTrendContentProps,
  - L37: We don't have enough recent market listings for the {year} {make} {model} to generate an accurate forecast.
  - L61: fallbackAnalysis={`Based on market data, your ${year} ${make} ${model} is projected to
- **year** (4)
  - L16: year: number;
  - L22: { trend, forecastData, year, make, model }: MarketTrendContentProps,
  - L37: We don't have enough recent market listings for the {year} {make} {model} to generate an accurate forecast.
  - L61: fallbackAnalysis={`Based on market data, your ${year} ${make} ${model} is projected to

### /workspaces/car-detective-mvp/src/components/valuation/market-trend/hooks/useForecastData.ts  (LOC 131)
exports: useForecastData
functions: useForecastData, fetchForecastData, calculatedTrend, startValue, endValue, percentage
- **make** (2)
  - L6: make: string;
  - L38: make,
- **model** (2)
  - L7: model: string;
  - L39: model,
- **year** (2)
  - L8: year: number;
  - L40: year,
- **storage** (3)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L59: const { data, error } = await supabase.functions.invoke(
  - L79: // Transform the data into a more structured format
- **valuation** (1)
  - L60: "valuation-forecast",

### /workspaces/car-detective-mvp/src/components/valuation/offers/DealerOfferCard.tsx  (LOC 92)
exports: DealerOfferCard
functions: score
- **dealer** (3)
  - L9: import { OfferScoreBadge } from "@/components/dealer/OfferScoreBadge";
  - L72: Message from dealer
  - L83: This dealer has submitted an offer based on your vehicle

### /workspaces/car-detective-mvp/src/components/valuation/offers/DealerOfferList.tsx  (LOC 97)
exports: DealerOfferList
functions: bestOffer
- **dealer** (4)
  - L31: <CardTitle>Dealer Offers</CardTitle>
  - L47: Failed to load dealer offers. Please try refreshing the page.
  - L57: <CardTitle>Dealer Offers</CardTitle>
  - L77: <CardTitle>Dealer Offers</CardTitle>

### /workspaces/car-detective-mvp/src/components/valuation/photo-upload/PhotoGrid.tsx  (LOC 32)
exports: PhotoGrid
functions: PhotoGrid
- **photos** (10)
  - L2: import { Photo } from "@/types/photo";
  - L5: photos: Photo[];
  - L6: onSelectPhoto?: (photo: Photo) => void;
  - L11: { photos, onSelectPhoto, className = "" }: PhotoGridProps,
  - L13: if (!photos.length) return null;
- **url** (1)
  - L24: src={photo.url}

### /workspaces/car-detective-mvp/src/components/valuation/photo-upload/PhotoGuidance.tsx  (LOC 20)
exports: PhotoGuidance
functions: PhotoGuidance
- **photos** (6)
  - L3: import { MAX_FILES, MIN_FILES } from "@/types/photo";
  - L9: <h3 className="font-medium text-slate-900">Photo Guidelines</h3>
  - L11: <li>Upload {MIN_FILES}-{MAX_FILES} clear photos of your vehicle</li>
  - L13: <li>Add clear photos of any damage or issues</li>
  - L14: <li>Include at least one interior photo</li>

### /workspaces/car-detective-mvp/src/components/valuation/photo-upload/PhotoHeader.tsx  (LOC 17)
exports: PhotoHeader
functions: PhotoHeader
- **photos** (1)
  - L11: <h3 className="text-lg font-medium">Vehicle Photo Analysis</h3>

### /workspaces/car-detective-mvp/src/components/valuation/photo-upload/PhotoPreview.tsx  (LOC 47)
exports: PhotoPreview
functions: PhotoPreview
- **photos** (6)
  - L3: import { Photo } from "@/types/photo";
  - L6: photo: Photo;
  - L12: { photo, onRemove, isSelected }: PhotoPreviewProps,
  - L20: {photo.uploading
  - L29: src={photo.url || URL.createObjectURL(photo.file as File)}
- **url** (1)
  - L29: src={photo.url || URL.createObjectURL(photo.file as File)}

### /workspaces/car-detective-mvp/src/components/valuation/photo-upload/PhotoUploadDropzone.tsx  (LOC 62)
exports: PhotoUploadDropzone
functions: PhotoUploadDropzone, handleDrop
- **photos** (4)
  - L4: import { MAX_FILES } from "@/types/photo";
  - L26: "image/*": [".jpeg", ".jpg", ".png", ".webp", ".heic"],
  - L54: : "Drag & drop your vehicle photos here"}
  - L57: Or click to browse (max {maxFiles} photos, 10MB each)

### /workspaces/car-detective-mvp/src/components/valuation/photo-upload/PhotoUploadList.tsx  (LOC 83)
exports: PhotoUploadList
functions: PhotoUploadList
- **photos** (15)
  - L2: import { Photo } from "@/types/photo";
  - L13: photos: Photo[];
  - L17: export function PhotoUploadList({ photos, onRemove }: PhotoUploadListProps) {
  - L20: {photos.map((photo) => (
  - L21: <div key={photo.id} className="relative group">

### /workspaces/car-detective-mvp/src/components/valuation/photo-upload/PhotoUploader.tsx  (LOC 113)
exports: PhotoUploader
functions: PhotoUploader, handleFileSelect, files, newPhotos, newPreviews, removePhoto, newPhotos, newPreviews
- **photos** (15)
  - L8: onPhotosUploaded: (photos: File[]) => void;
  - L18: const [photos, setPhotos] = useState<File[]>([]);
  - L25: const newPhotos = [...photos, ...files].slice(0, maxPhotos);
  - L33: }, [photos, maxPhotos, onPhotosUploaded]);
  - L36: const newPhotos = photos.filter((_, i) => i !== index);
- **url** (1)
  - L29: const newPreviews = newPhotos.map(file => URL.createObjectURL(file));
- **storage** (1)
  - L22: const files = Array.from(e.target.files || []);

### /workspaces/car-detective-mvp/src/components/valuation/photo-upload/usePhotoUpload.ts  (LOC 53)
exports: usePhotoUpload
functions: usePhotoUpload, addPhotos, removePhoto, clearPhotos
- **photos** (6)
  - L3: import { Photo, PhotoScore } from "@/types/photo";
  - L7: photos: Photo[];
  - L16: const [photos, setPhotos] = useState<Photo[]>([]);
  - L21: const newPhotos: Photo[] = files.map(file => ({
  - L37: setPhotos(prev => prev.filter(photo => photo.id !== id));
- **url** (2)
  - L23: url: URL.createObjectURL(file), // Add required url property
  - L26: preview: URL.createObjectURL(file),

### /workspaces/car-detective-mvp/src/components/valuation/premium/DealerOffers.tsx  (LOC 26)
- **dealer** (2)
  - L15: <CardTitle>Dealer Offers</CardTitle>
  - L19: {offers.length} dealer offers available

### /workspaces/car-detective-mvp/src/components/valuation/redesign/ConfidenceRing.tsx  (LOC 145)
exports: ConfidenceRing
functions: factorList, getConfidenceColor, confidenceColor, Icon
- **vin** (1)
  - L28: { name: 'VIN Accuracy', score: factors.vinAccuracy, icon: CheckCircle },

### /workspaces/car-detective-mvp/src/components/valuation/redesign/InteractiveValueBreakdown.tsx  (LOC 310)
exports: InteractiveValueBreakdown
functions: InteractiveValueBreakdown, toggleSection, newExpanded, getAdjustmentIcon, key, getAdjustmentColor, totalAdjustments, calculatedBaseValue, displayedAdjustments, colors, IconComponent, TrendIcon
- **mileage** (1)
  - L59: 'mileage': Gauge,
- **valuation** (2)
  - L149: <p>Starting valuation before adjustments</p>
  - L293: <p className="font-medium">About This Valuation</p>

### /workspaces/car-detective-mvp/src/components/valuation/redesign/LinearProgressStepper.tsx  (LOC 300)
exports: LinearProgressStepper
functions: LinearProgressStepper, currentStepIndex, currentStepData, getStepStatus, getStepIcon, getStepColors, goToPrevious, goToNext, isFirstStep, isLastStep, status, colors, StepIcon
- **valuation** (3)
  - L129: <h2 className="text-xl font-semibold">Improve Your Valuation Accuracy</h2>
  - L270: Complete Valuation
  - L290: Please fill in the required information in the Basic Info and Condition steps to enable the Complete Valuation button.

### /workspaces/car-detective-mvp/src/components/valuation/redesign/MarketListingsGrid.tsx  (LOC 336)
exports: MarketListingsGrid
functions: MarketListingsGrid, displayedListings, sortedListings, getStatusDisplay, status, StatusIcon, ListingCard, ListingRow
- **model** (1)
  - L109: Valuation based on depreciation model and regional market adjustments.
- **price** (7)
  - L34: const [sortBy, setSortBy] = useState<'price' | 'mileage' | 'distance'>('price');
  - L40: case 'price':
  - L41: return a.price - b.price;
  - L164: <option value="price">Sort by Price</option>
  - L226: {/* Price */}
- **mileage** (8)
  - L34: const [sortBy, setSortBy] = useState<'price' | 'mileage' | 'distance'>('price');
  - L42: case 'mileage':
  - L43: return (a.mileage || 0) - (b.mileage || 0);
  - L165: <option value="mileage">Sort by Mileage</option>
  - L240: {listing.mileage && (
- **dealer** (5)
  - L257: {(listing.dealer || listing.dealerName || listing.dealer_name) && (
  - L258: <div className="text-xs font-medium truncate" title={listing.dealer || listing.dealerName || listing.dealer_name}>
  - L259: {listing.dealer || listing.dealerName || listing.dealer_name}
  - L307: {(listing.dealer || listing.dealerName || listing.dealer_name) && (
  - L309: {listing.dealer || listing.dealerName || listing.dealer_name}
- **url** (4)
  - L265: {(listing.url || listing.link || listing.listingUrl || listing.listing_url) && (
  - L270: onClick={() => window.open(listing.url || listing.link || listing.listingUrl || listing.listing_url, '_blank')}
  - L322: {(listing.url || listing.link || listing.listingUrl || listing.listing_url) && (
  - L326: onClick={() => window.open(listing.url || listing.link || listing.listingUrl || listing.listing_url, '_blank')}
- **valuation** (1)
  - L109: Valuation based on depreciation model and regional market adjustments.

### /workspaces/car-detective-mvp/src/components/valuation/redesign/PremiumFeatureOverlay.tsx  (LOC 235)
exports: PremiumFeatureOverlay
functions: PremiumFeatureOverlay, displayFeatures, IconComponent, IconComponent
- **price** (1)
  - L59: description: 'Deep market insights and price predictions',
- **valuation** (1)
  - L45: description: 'Download detailed valuation reports with market analysis',

### /workspaces/car-detective-mvp/src/components/valuation/redesign/TabbedResultsPanels.tsx  (LOC 503)
exports: TabbedResultsPanels
functions: TabbedResultsPanels, tabs, getTabBadge, IconComponent, OverviewTab, AnalysisTab, MarketTab, mappedStatus, valuationId, SourcesTab, ForecastTab, EnhancedListingsTab, enhancedListings, platformGroups, platform
- **make** (4)
  - L218: {result.vehicle.year} {result.vehicle.make} {result.vehicle.model}
  - L293: make={result.vehicle.make}
  - L365: make={result.vehicle.make}
  - L449: {result.vehicle.year} {result.vehicle.make} {result.vehicle.model}
- **model** (4)
  - L218: {result.vehicle.year} {result.vehicle.make} {result.vehicle.model}
  - L294: model={result.vehicle.model}
  - L366: model={result.vehicle.model}
  - L449: {result.vehicle.year} {result.vehicle.make} {result.vehicle.model}
- **year** (4)
  - L218: {result.vehicle.year} {result.vehicle.make} {result.vehicle.model}
  - L295: year={result.vehicle.year}
  - L367: year={result.vehicle.year}
  - L449: {result.vehicle.year} {result.vehicle.make} {result.vehicle.model}
- **price** (4)
  - L69: description: 'Price trends and predictions'
  - L304: price: listing.price,
  - L404: Real-time listings from Facebook, Craigslist, OfferUp, eBay Motors, and Amazon Autos for comprehensive price validation.
  - L466: ${listing.price.toLocaleString()}
- **mileage** (3)
  - L305: mileage: listing.mileage,
  - L453: {listing.mileage && (
  - L454: <span>{listing.mileage.toLocaleString()} miles</span>
- **vin** (1)
  - L280: (result as any).vin ||
- **dealer** (1)
  - L307: dealer: listing.dealer_name,
- **url** (1)
  - L309: url: listing.listing_url && listing.listing_url !== '#' ? listing.listing_url : undefined,
- **valuation** (4)
  - L15: import type { UnifiedValuationResult } from '@/types/valuation';
  - L213: <h3 className="font-semibold mb-4">Valuation Summary</h3>
  - L277: // Extract valuation ID from result
  - L496: The valuation is based on standard market data sources.

### /workspaces/car-detective-mvp/src/components/valuation/redesign/VehicleHeroCard.tsx  (LOC 122)
exports: VehicleHeroCard
functions: confidenceColor, formatTimestamp, date
- **make** (2)
  - L11: make: string;
  - L63: {vehicle.year} {vehicle.make} {vehicle.model}
- **model** (2)
  - L12: model: string;
  - L63: {vehicle.year} {vehicle.make} {vehicle.model}
- **year** (4)
  - L10: year: number;
  - L46: year: 'numeric',
  - L63: {vehicle.year} {vehicle.make} {vehicle.model}
  - L73: <span>{vehicle.year}</span>
- **mileage** (2)
  - L16: mileage: number;
  - L78: <span>{vehicle.mileage.toLocaleString()} miles</span>
- **zip** (1)
  - L90: <span>ZIP {vehicle.zipCode}</span>
- **valuation** (2)
  - L100: Premium Valuation
  - L106: {/* Valuation Summary */}

### /workspaces/car-detective-mvp/src/components/valuation/report/ValuationReport.tsx  (LOC 17)
exports: ValuationReport
- **valuation** (2)
  - L11: <h3 className="text-lg font-semibold mb-2">Valuation Report</h3>
  - L12: <p className="text-gray-600">Detailed valuation report will be displayed here</p>

### /workspaces/car-detective-mvp/src/components/valuation/report/index.ts  (LOC 3)
- **valuation** (1)
  - L1: // Export valuation report components

### /workspaces/car-detective-mvp/src/components/valuation/result/AdjustmentTransparency.tsx  (LOC 169)
exports: AdjustmentTransparency
functions: getAdjustmentIcon, getAdjustmentColor, realAdjustments, syntheticAdjustments, hasRealAdjustments, hasSyntheticAdjustments
- **model** (1)
  - L49: ? "⚠️ No market-based adjustments applied. Synthetic model includes built-in depreciation and mileage factors."
- **mileage** (1)
  - L49: ? "⚠️ No market-based adjustments applied. Synthetic model includes built-in depreciation and mileage factors."
- **valuation** (1)
  - L159: <strong>Fallback Method Active:</strong> This valuation uses synthetic pricing models due to lack of

### /workspaces/car-detective-mvp/src/components/valuation/result/EnhancedValuationResult.tsx  (LOC 75)
exports: EnhancedValuationResult
functions: handleGenerateToken, token
- **make** (2)
  - L42: <p>{vehicleInfo?.year} {vehicleInfo?.make} {vehicleInfo?.model}</p>
  - L65: make: vehicleInfo?.make || '',
- **model** (2)
  - L42: <p>{vehicleInfo?.year} {vehicleInfo?.make} {vehicleInfo?.model}</p>
  - L66: model: vehicleInfo?.model || '',
- **year** (2)
  - L42: <p>{vehicleInfo?.year} {vehicleInfo?.make} {vehicleInfo?.model}</p>
  - L64: year: vehicleInfo?.year || 0,
- **valuation** (1)
  - L36: <CardTitle>Enhanced Valuation Result</CardTitle>

### /workspaces/car-detective-mvp/src/components/valuation/result/FallbackMethodDisclosure.tsx  (LOC 31)
exports: FallbackMethodDisclosure
functions: FallbackMethodDisclosure
- **valuation** (1)
  - L26: <p>This valuation is based on MSRP-adjusted depreciation modeling rather than current market data.</p>

### /workspaces/car-detective-mvp/src/components/valuation/result/MarketComparison.tsx  (LOC 81)
exports: MarketComparisonProps, MarketComparison
- **make** (2)
  - L9: make: string;
  - L31: See how this {vehicleData?.year} {vehicleData?.make} {vehicleData?.model}
- **model** (2)
  - L10: model: string;
  - L31: See how this {vehicleData?.year} {vehicleData?.make} {vehicleData?.model}
- **year** (2)
  - L11: year: number;
  - L31: See how this {vehicleData?.year} {vehicleData?.make} {vehicleData?.model}
- **dealer** (3)
  - L32: compares to others on the market, including dealer and private sale prices.
  - L54: <p className="text-sm font-medium">Dealer Listings</p>
  - L59: Average of {Math.floor(Math.random() * 20) + 5} dealer listings

### /workspaces/car-detective-mvp/src/components/valuation/result/MarketDataStatus.tsx  (LOC 57)
exports: MarketDataStatus
functions: MarketDataStatus, getStatusIcon, getStatusMessage, getSearchMethodLabel
- **openai** (2)
  - L8: searchMethod: 'openai' | 'database' | 'fallback';
  - L27: case 'openai': return 'AI Web Search';

### /workspaces/car-detective-mvp/src/components/valuation/result/PremiumFeatures.tsx  (LOC 65)
exports: PremiumFeaturesProps, PremiumFeatures
- **price** (1)
  - L34: See price trends and market demand in your area.
- **valuation** (2)
  - L24: Get a comprehensive report with all valuation details.
  - L54: Fine-tune your valuation with custom options.

### /workspaces/car-detective-mvp/src/components/valuation/result/PriceRangeChart.tsx  (LOC 66)
exports: PriceRangeChartProps, PriceRangeChart
functions: lowPrice, highPrice, rangeWidth, valuePosition
- **price** (5)
  - L14: // Normalize price range format
  - L26: {/* Low Price Marker */}
  - L34: {/* High Price Marker */}
  - L42: {/* Price Range Bar */}
  - L60: This price range represents what similar vehicles are selling for in your area.

### /workspaces/car-detective-mvp/src/components/valuation/result/ValuationSummary.tsx  (LOC 208)
exports: ValuationSummaryProps, ValuationSummary
functions: listingsCount, confidenceLevel, confidenceColor, confidenceContext, confidenceExplanation, showVinMatchBadge
- **make** (3)
  - L14: make: string;
  - L133: <p className="text-xs text-muted-foreground">Make</p>
  - L134: <p className="font-medium">{vehicleInfo.make}</p>
- **model** (4)
  - L15: model: string;
  - L137: <p className="text-xs text-muted-foreground">Model</p>
  - L138: <p className="font-medium">{vehicleInfo.model}</p>
  - L183: Valuation based on fallback MSRP model.
- **year** (3)
  - L13: year: number;
  - L129: <p className="text-xs text-muted-foreground">Year</p>
  - L130: <p className="font-medium">{vehicleInfo.year}</p>
- **mileage** (4)
  - L16: mileage?: number;
  - L140: {vehicleInfo.mileage && (
  - L142: <p className="text-xs text-muted-foreground">Mileage</p>
  - L143: <p className="font-medium">{vehicleInfo.mileage.toLocaleString()} mi</p>
- **vin** (2)
  - L75: // HONEST badge logic - only show VIN Match if we actually have market data
  - L110: VIN Match
- **valuation** (4)
  - L6: import { generateConfidenceExplanation } from '@/utils/valuation/calculateUnifiedConfidence';
  - L169: {confidenceLevel} Confidence Valuation
  - L183: Valuation based on fallback MSRP model.
  - L200: <h4 className="text-sm font-medium text-blue-800 mb-2">AI Valuation Insight</h4>

### /workspaces/car-detective-mvp/src/components/valuation/result/ValuationTransparency.tsx  (LOC 171)
exports: ValuationTransparency
functions: getAdjustmentIcon, getAdjustmentColor
- **model** (3)
  - L73: Synthetic Model
  - L84: This valuation uses an MSRP-adjusted model with industry-standard depreciation curves and regional factors.
  - L130: ? `Synthetic model result (confidence: ${confidenceScore}%)`
- **price** (2)
  - L93: {/* Base Price Calculation - HONEST SOURCE IDENTIFICATION */}
  - L96: <h4 className="font-medium text-sm">Price Foundation</h4>
- **vin** (4)
  - L23: vin?: string;
  - L35: vin
  - L150: {/* Location and VIN Info */}
  - L154: {vin && ` • VIN: ${vin.substring(0, 8)}...`}
- **valuation** (3)
  - L54: Valuation Transparency
  - L84: This valuation uses an MSRP-adjusted model with industry-standard depreciation curves and regional factors.
  - L162: <strong>Data Quality Notice:</strong> This valuation is based on synthetic calculations, not real market transactions.

### /workspaces/car-detective-mvp/src/components/valuation/result/sections/Explanation.tsx  (LOC 66)
exports: Explanation
functions: showPremiumContent
- **model** (1)
  - L42: The used vehicle market has shown strong demand for this model in recent months, with average selling prices trending slightly upward compared to the previous quarter. Your specific vehicle has several positive factors contributing to its v
- **mileage** (2)
  - L40: {explanation || `This vehicle is currently valued at approximately $24,500 based on recent market trends and specific vehicle conditions. The valuation takes into account several factors including current mileage, overall condition, and mar
  - L42: The used vehicle market has shown strong demand for this model in recent months, with average selling prices trending slightly upward compared to the previous quarter. Your specific vehicle has several positive factors contributing to its v
- **storage** (1)
  - L40: {explanation || `This vehicle is currently valued at approximately $24,500 based on recent market trends and specific vehicle conditions. The valuation takes into account several factors including current mileage, overall condition, and mar
- **valuation** (2)
  - L40: {explanation || `This vehicle is currently valued at approximately $24,500 based on recent market trends and specific vehicle conditions. The valuation takes into account several factors including current mileage, overall condition, and mar
  - L53: Unlock detailed market analysis and expert valuation insights

### /workspaces/car-detective-mvp/src/components/valuation/result/sections/PDFActions.tsx  (LOC 96)
exports: PDFActions
functions: showPremiumContent
- **valuation** (1)
  - L36: <CardTitle className="text-lg">Valuation Report</CardTitle>

### /workspaces/car-detective-mvp/src/components/valuation/result/useValuationPdf.ts  (LOC 188)
exports: useValuationPdf
functions: useValuationPdf, generatePdf, priceObj, emailPdf, downloadSamplePdf
- **make** (2)
  - L29: make: valuationData.make,
  - L134: make: 'Toyota',
- **model** (2)
  - L30: model: valuationData.model,
  - L135: model: 'Camry',
- **year** (2)
  - L31: year: valuationData.year,
  - L136: year: 2022,
- **price** (4)
  - L35: price: valuationData.estimatedValue,
  - L75: // If no price range provided or it's in an invalid format, calculate one based on estimated value
  - L82: // If no price range provided, calculate one based on estimated value
  - L140: price: 26500,
- **mileage** (4)
  - L32: mileage: valuationData.mileage,
  - L137: mileage: 25000,
  - L147: factor: 'Mileage',
  - L149: description: 'Lower than average mileage'
- **vin** (2)
  - L37: vin: valuationData.vin,
  - L142: vin: 'SAMPLE1234567890',
- **valuation** (4)
  - L20: toast.error('No valuation data available');
  - L102: toast.success('Valuation report downloaded successfully');
  - L105: toast.error('Failed to generate valuation report');
  - L121: toast.error('Failed to email valuation report');

### /workspaces/car-detective-mvp/src/components/valuation/types.ts  (LOC 22)
exports: ValuationResultProps, ValuationData
- **make** (1)
  - L10: make: string;
- **model** (1)
  - L11: model: string;
- **year** (1)
  - L12: year: number;
- **mileage** (1)
  - L13: mileage?: number;
- **vin** (1)
  - L18: vin?: string;

### /workspaces/car-detective-mvp/src/components/valuation/valuation-complete/ValuationComplete.tsx  (LOC 22)
exports: ValuationComplete
- **valuation** (1)
  - L13: <h2 className="text-2xl font-bold mb-4">Valuation Complete!</h2>

### /workspaces/car-detective-mvp/src/components/valuation/valuation-core/ValuationFactorsGrid.tsx  (LOC 63)
exports: ValuationFactors, ValuationFactorsGridProps, ValuationFactorsGrid
- **year** (5)
  - L8: year: number;
  - L42: <Label htmlFor="year">Year</Label>
  - L44: id="year"
  - L46: value={values.year}
  - L47: onChange={(e) => onChange("year", parseInt(e.target.value))}
- **mileage** (5)
  - L7: mileage: number;
  - L33: <Label htmlFor="mileage">Mileage</Label>
  - L35: id="mileage"
  - L37: value={values.mileage}
  - L38: onChange={(e) => onChange("mileage", parseInt(e.target.value))}

### /workspaces/car-detective-mvp/src/components/valuation/valuation-core/ValuationReport.tsx  (LOC 12)
functions: ValuationReport
- **valuation** (1)
  - L6: <h2>Valuation Report</h2>

### /workspaces/car-detective-mvp/src/components/valuation/valuation-core/ValuationReportHeader.tsx  (LOC 12)
functions: ValuationReportHeader
- **valuation** (1)
  - L6: <h1>Vehicle Valuation Report</h1>

### /workspaces/car-detective-mvp/src/components/valuation/valuation-core/ValuationResult.tsx  (LOC 239)
exports: ValuationResult, ValuationRequest, SourceStatus, AuditLog, ValuationApiService, EnhancedValuationParams, FinalValuationResult, ValuationParams
functions: requestValuation, isValidVin, getCachedValuation, createValuationRequest, triggerAggregation, getValuationResult, getSourcesStatus, pollValuationProgress
- **make** (6)
  - L8: make: string;
  - L38: {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
  - L99: make: string;
  - L117: make?: string;
  - L205: make: string;
- **model** (6)
  - L9: model: string;
  - L38: {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
  - L100: model: string;
  - L118: model?: string;
  - L206: model: string;
- **year** (6)
  - L10: year: number;
  - L38: {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
  - L101: year: number;
  - L119: year?: number;
  - L207: year: number;
- **mileage** (6)
  - L11: mileage: number;
  - L40: <p>Mileage: {vehicleInfo.mileage.toLocaleString()} miles</p>
  - L102: mileage: number;
  - L120: mileage?: number;
  - L208: mileage: number;
- **vin** (5)
  - L116: vin?: string;
  - L157: static async isValidVin(vin: string): Promise<boolean> {
  - L158: return vin.length === 17;
  - L161: static async getCachedValuation(vin: string): Promise<ValuationResult | null> {
  - L204: vin?: string;
- **valuation** (2)
  - L32: <CardTitle>Vehicle Valuation</CardTitle>
  - L91: median: number;

### /workspaces/car-detective-mvp/src/components/vehicle/EpaMpgDisplay.tsx  (LOC 68)
exports: EpaMpgDisplay
functions: EpaMpgDisplay
- **make** (3)
  - L8: make: string;
  - L12: export function EpaMpgDisplay({ year, make, model }: EpaMpgDisplayProps) {
  - L13: const { data, isLoading, isError } = useEpaMpg(year, make, model);
- **model** (3)
  - L9: model: string;
  - L12: export function EpaMpgDisplay({ year, make, model }: EpaMpgDisplayProps) {
  - L13: const { data, isLoading, isError } = useEpaMpg(year, make, model);
- **year** (3)
  - L7: year: number;
  - L12: export function EpaMpgDisplay({ year, make, model }: EpaMpgDisplayProps) {
  - L13: const { data, isLoading, isError } = useEpaMpg(year, make, model);

### /workspaces/car-detective-mvp/src/config/index.ts  (LOC 93)
exports: Config, appConfig
functions: ConfigSchema, getConfigValue, processKey, appConfig
- **url** (4)
  - L24: SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  - L26: VEHICLE_API_URL: z.string().url().optional(),
  - L27: PUBLIC_API_BASE_URL: z.string().url().optional(),
  - L28: EDGE_FUNCTION_BASE_URL: z.string().url().optional(),
- **schema** (2)
  - L8: import { z } from 'zod';
  - L22: // Configuration schema for validation
- **storage** (1)
  - L56: SUPABASE_URL: 'https://xltxqqzattxogxtqrggt.supabase.co',
- **env** (5)
  - L5: * Reads from process.env first, then window.__APP_CONFIG__ fallback.
  - L38: // Try process.env first (build time / SSR only)
  - L39: if (typeof window === 'undefined' && typeof process !== 'undefined' && process.env) {
  - L41: if (process.env[processKey]) {
  - L42: return process.env[processKey];

### /workspaces/car-detective-mvp/src/contexts/ValuationContext.tsx  (LOC 312)
exports: ValuationContext, ValuationProvider, useValuationContext
functions: GLOBAL_KEY, g, ValuationProvider, loadValuationData, data, estimatedValue, adjustments, rerunValuation, t0, finalValue, confidenceScore, adjustments, marketData, userId, errorMessage, onUpgrade, onDownloadPdf, onEmailPdf, useValuationContext, context
- **make** (3)
  - L25: make?: string;
  - L155: make: input.make,
  - L208: make: input.make || 'Unknown',
- **model** (3)
  - L26: model?: string;
  - L156: model: input.model,
  - L209: model: input.model || 'Unknown',
- **year** (3)
  - L24: year?: number;
  - L154: year: input.year,
  - L210: year: input.year || new Date().getFullYear(),
- **mileage** (3)
  - L28: mileage?: number;
  - L158: mileage: input.mileage ?? 0,
  - L211: mileage: input.mileage ?? null,
- **vin** (7)
  - L23: vin?: string;
  - L80: // First try to get valuation by VIN
  - L84: .eq('vin', id)
  - L89: console.error('❌ Error fetching valuation by VIN:', vinError);
  - L95: // If not found by VIN, try by ID
- **url** (2)
  - L306: // Include module URL to catch mismatched imports fast
  - L307: throw new Error(`useValuationContext must be used within a ValuationProvider (module: ${import.meta.url})`);
- **storage** (7)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L81: const { data: valuationByVin, error: vinError } = await supabase
  - L97: const { data: valuationById, error: idError } = await supabase
  - L200: const { data: authData } = await supabase.auth.getUser();
  - L203: const { data: savedValuation, error: insertError } = await supabase
- **valuation** (10)
  - L80: // First try to get valuation by VIN
  - L89: console.error('❌ Error fetching valuation by VIN:', vinError);
  - L104: console.error('❌ Error fetching valuation by ID:', idError);
  - L129: explanation: 'Legacy valuation data from database',
  - L138: console.error('❌ Error loading valuation:', err);

### /workspaces/car-detective-mvp/src/data/vehicle-data.ts  (LOC 56)
exports: VEHICLE_MAKES, VEHICLE_MODELS, getModelsForMake, CURRENT_YEAR, VEHICLE_YEARS, CONDITION_OPTIONS
functions: VEHICLE_MAKES, getModelsForMake, CURRENT_YEAR, VEHICLE_YEARS, CONDITION_OPTIONS
- **make** (2)
  - L41: export const getModelsForMake = (make: string): string[] => {
  - L42: return VEHICLE_MODELS[make] || [];
- **model** (1)
  - L35: "Tesla": ["Model S", "Model 3", "Model X", "Model Y"],

### /workspaces/car-detective-mvp/src/e2e/dealer-inventory.spec.ts  (LOC 87)
functions: dealerEmail, dealerPassword, vehicleCount, vehicleRow
- **make** (3)
  - L40: await page.fill('input[id="make"]', "Test Make");
  - L54: await expect(page.getByText("Test Make Test Model")).toBeVisible();
  - L60: await page.fill('input[id="make"]', "Delete Test");
- **model** (6)
  - L41: await page.fill('input[id="model"]', "Test Model");
  - L54: await expect(page.getByText("Test Make Test Model")).toBeVisible();
  - L61: await page.fill('input[id="model"]', "Delete Model");
  - L68: await expect(page.getByText("Delete Test Delete Model")).toBeVisible();
  - L72: hasText: "Delete Test Delete Model",
- **year** (2)
  - L42: await page.fill('input[id="year"]', "2022");
  - L62: await page.fill('input[id="year"]', "2020");
- **price** (2)
  - L44: await page.fill('input[id="price"]', "25000");
  - L64: await page.fill('input[id="price"]', "18000");
- **mileage** (2)
  - L43: await page.fill('input[id="mileage"]', "15000");
  - L63: await page.fill('input[id="mileage"]', "25000");
- **dealer** (6)
  - L3: test.describe("Dealer Inventory Management", () => {
  - L4: const dealerEmail = "test-dealer@example.com";
  - L8: // Login as a dealer
  - L14: // Wait for redirection to dealer dashboard
  - L15: await page.waitForURL("**/dealer**");

### /workspaces/car-detective-mvp/src/e2e/free-valuation.spec.ts  (LOC 135)
functions: conditionSelect, priceElement, conditionSelect, makeValue
- **make** (5)
  - L23: await page.getByLabel(/make/i).fill("Toyota");
  - L76: await page.getByLabel(/make/i).fill("Toyota");
  - L95: await page.getByLabel(/make/i).fill("Honda");
  - L127: const makeValue = await page.getByLabel(/make/i).inputValue();
  - L128: console.log("Saved make value:", makeValue);
- **model** (3)
  - L24: await page.getByLabel(/model/i).fill("Camry");
  - L77: await page.getByLabel(/model/i).fill("Camry");
  - L96: await page.getByLabel(/model/i).fill("Accord");
- **year** (3)
  - L25: await page.getByLabel(/year/i).fill("2020");
  - L78: // Intentionally skip year
  - L97: await page.getByLabel(/year/i).fill("2021");
- **price** (1)
  - L52: // Check for price data
- **mileage** (2)
  - L26: await page.getByLabel(/mileage/i).fill("42000");
  - L98: await page.getByLabel(/mileage/i).fill("15000");
- **zip** (2)
  - L27: await page.getByLabel(/zip code/i).fill("90210");
  - L99: await page.getByLabel(/zip code/i).fill("94102");
- **url** (2)
  - L10: // Alternatively, if there's a direct URL:
  - L42: // If the URL pattern doesn't match, we may already be on a results page
- **retry** (4)
  - L15: timeout: 2000,
  - L40: await page.waitForURL(/.*\/valuation-result\/.*/, { timeout: 30000 })
  - L46: ).toBeVisible({ timeout: 30000 });
  - L112: timeout: 30000,
- **valuation** (21)
  - L3: test.describe("Free Valuation Flow", () => {
  - L4: test("Complete Free Valuation Flow as Guest", async ({ page }) => {
  - L8: // Navigate to free valuation section
  - L9: await page.getByRole("link", { name: /free valuation/i }).click();
  - L35: // Submit the valuation form

### /workspaces/car-detective-mvp/src/e2e/photo-upload-flow.spec.ts  (LOC 160)
functions: testFiles, savedConditionData
- **vin** (4)
  - L48: // await page.fill('[data-test="vin-input"]', 'JH4DA9380PS000111');
  - L49: // await page.click('[data-test="lookup-vin-button"]');
  - L95: // await page.fill('[data-test="vin-input"]', 'JH4DA9380PS000111');
  - L96: // await page.click('[data-test="lookup-vin-button"]');
- **photos** (23)
  - L2: * E2E tests for the photo upload and AI scoring flow
  - L9: describe("Photo Upload and AI Scoring Flow", () => {
  - L13: // await page.route('**/functions/analyze-photos', route => {
  - L43: test("should upload multiple photos and show loading state", async () => {
  - L47: // Get to the photo upload section
- **url** (3)
  - L27: //         { url: 'https://example.com/uploads/photo1.jpg', score: 0.9 },
  - L28: //         { url: 'https://example.com/uploads/photo2.jpg', score: 0.8 },
  - L29: //         { url: 'https://example.com/uploads/photo3.jpg', score: 0.75 }
- **storage** (1)
  - L153: * 3. Mock the Supabase file storage or use a test bucket
- **valuation** (10)
  - L44: // Navigate to valuation page
  - L45: // await page.goto('/valuation/create');
  - L70: // Navigate to valuation page with existing photos
  - L71: // await page.goto('/valuation/123e4567-e89b-12d3-a456-426614174000');
  - L91: // Navigate to valuation page

### /workspaces/car-detective-mvp/src/e2e/valuation-flow.test.ts  (LOC 151)
functions: testEmail, testPassword, valueElement, premiumButton, offersSection, hasOffers, hasCta, adjustmentsSection, adjustmentItem, shareButton, isButtonDisabled, hasError, isLoading, hasRedirected
- **make** (1)
  - L25: await page.selectOption('select[name="make"]', "Honda");
- **model** (1)
  - L26: await page.selectOption('select[name="model"]', "Accord");
- **year** (1)
  - L27: await page.fill('input[name="year"]', "2019");
- **mileage** (1)
  - L28: await page.fill('input[name="mileage"]', "45000");
- **vin** (8)
  - L93: test("VIN lookup should validate and process valid input", async ({ page }) => {
  - L94: // Go to VIN lookup page
  - L95: await page.goto("/valuation/vin");
  - L97: // Test validation: Empty VIN
  - L101: // Test validation: Invalid VIN format
- **dealer** (3)
  - L59: // Step 5: Check dealer offers section
  - L60: const offersSection = page.locator('h2:has-text("Dealer Offers")').first();
  - L65: const hasCta = await page.locator('button:has-text("Get Dealer Offers")')
- **url** (1)
  - L147: const hasRedirected = page.url().includes("/results");
- **retry** (2)
  - L19: await page.waitForURL("**/dashboard", { timeout: 10000 });
  - L36: await page.waitForSelector("text=Estimated Value", { timeout: 15000 });
- **valuation** (9)
  - L4: test.describe("Valuation Flow", () => {
  - L9: // Test user registration and valuation flow
  - L10: test("should complete full valuation flow and premium purchase", async ({ page }) => {
  - L21: // Step 2: Go to manual valuation page
  - L22: await page.goto("/valuation/manual");

### /workspaces/car-detective-mvp/src/emails/sendValuationPdfToDealer.ts  (LOC 102)
exports: DealerEmailData
functions: sendValuationPdfToDealer, sendPdfToVerifiedDealers, emailPromises, results, sent, failed, logEmailDelivery
- **make** (2)
  - L9: make: string;
  - L26: subject: `New Premium Valuation Report for ${data.vehicleInfo.year} ${data.vehicleInfo.make} ${data.vehicleInfo.model}`
- **model** (2)
  - L10: model: string;
  - L26: subject: `New Premium Valuation Report for ${data.vehicleInfo.year} ${data.vehicleInfo.make} ${data.vehicleInfo.model}`
- **year** (2)
  - L8: year: number;
  - L26: subject: `New Premium Valuation Report for ${data.vehicleInfo.year} ${data.vehicleInfo.make} ${data.vehicleInfo.model}`
- **vin** (1)
  - L11: vin?: string;
- **dealer** (9)
  - L6: dealerName: string;
  - L19: const { data: result, error } = await supabase.functions.invoke('send-valuation-to-dealer', {
  - L22: dealerName: data.dealerName,
  - L49: // Get verified dealers from the profiles table with dealer role
  - L53: .eq('role', 'dealer')
- **storage** (5)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L19: const { data: result, error } = await supabase.functions.invoke('send-valuation-to-dealer', {
  - L50: const { data: dealers, error } = await supabase
  - L91: await supabase
  - L93: .insert({
- **valuation** (2)
  - L19: const { data: result, error } = await supabase.functions.invoke('send-valuation-to-dealer', {
  - L26: subject: `New Premium Valuation Report for ${data.vehicleInfo.year} ${data.vehicleInfo.make} ${data.vehicleInfo.model}`

### /workspaces/car-detective-mvp/src/enrichment/getEnrichedVehicleData.ts  (LOC 22)
functions: getEnrichedVehicleData, statvinData
- **make** (1)
  - L13: make: 'Toyota',
- **model** (1)
  - L14: model: 'Camry',
- **year** (1)
  - L15: year: 2020,
- **mileage** (1)
  - L16: mileage: 50000,
- **vin** (4)
  - L5: export async function getEnrichedVehicleData(vin: string): Promise<Vehicle | null> {
  - L7: const statvinData = await getStatvinData(vin);
  - L11: id: vin,
  - L12: vin,

### /workspaces/car-detective-mvp/src/enrichment/parsers/normalizeAuction.ts  (LOC 64)
exports: NormalizedAuctionData, normalizeStatVinData, normalizeAuctionData
functions: normalizeStatVinData, normalizeAuctionData
- **make** (2)
  - L16: make?: string;
  - L42: make: data.make,
- **model** (2)
  - L17: model?: string;
  - L43: model: data.model,
- **year** (2)
  - L18: year?: number;
  - L44: year: data.year ? parseInt(data.year) : undefined,
- **mileage** (2)
  - L19: mileage?: number;
  - L45: mileage: data.mileage ? parseInt(data.mileage.replace(/[^0-9]/g, '')) : undefined,
- **vin** (3)
  - L6: vin: string;
  - L31: source: 'STAT.vin',
  - L32: vin: data.vin,

### /workspaces/car-detective-mvp/src/enrichment/sources/fetchStatVinData.ts  (LOC 156)
functions: fetchStatVinData, brightDataEndpoint, response, data, fallbackStatVinScraping, url, response, html, auctionData, parseStatVinHTML, salePriceMatch, damageMatch, dateMatch, locationMatch, extractImageUrls, imageRegex, matches, extractMake, makeMatch, extractModel, modelMatch, extractYear, yearMatch, extractMileage, mileageMatch
- **make** (3)
  - L40: make: data.vehicle.make,
  - L115: make: extractMake(html),
  - L139: const makeMatch = html.match(/Make[:\s]*([^<\n]+)/i);
- **model** (3)
  - L41: model: data.vehicle.model,
  - L116: model: extractModel(html),
  - L144: const modelMatch = html.match(/Model[:\s]*([^<\n]+)/i);
- **year** (3)
  - L42: year: data.vehicle.year,
  - L117: year: extractYear(html),
  - L149: const yearMatch = html.match(/Year[:\s]*(\d{4})/i);
- **price** (1)
  - L99: const salePriceMatch = html.match(/Sale Price[:\s]*\$?([\d,]+)/i);
- **mileage** (3)
  - L43: mileage: data.vehicle.odometer,
  - L118: mileage: extractMileage(html),
  - L154: const mileageMatch = html.match(/Mileage[:\s]*([\d,]+)/i);
- **vin** (11)
  - L4: export async function fetchStatVinData(vin: string): Promise<StatVinData | null> {
  - L15: vin: vin.toUpperCase(),
  - L23: return await fallbackStatVinScraping(vin);
  - L33: vin: data.vehicle.vin || vin,
  - L65: return await fallbackStatVinScraping(vin);
- **photos** (1)
  - L39: images: data.vehicle.photos || [],
- **url** (2)
  - L71: const url = `https://stat.vin/vin-decoder/${vin}`;
  - L73: const response = await fetch(url, {
- **fetch** (2)
  - L8: const response = await fetch(brightDataEndpoint, {
  - L73: const response = await fetch(url, {
- **env** (1)
  - L12: 'Authorization': `Bearer ${import.meta.env.BRIGHTDATA_API_KEY}`,

### /workspaces/car-detective-mvp/src/enrichment/sources/statvin.ts  (LOC 72)
exports: AuctionData
functions: getStatvinData, response, result
- **make** (1)
  - L15: make?: string;
- **model** (1)
  - L16: model?: string;
- **year** (1)
  - L17: year?: number;
- **mileage** (1)
  - L18: mileage?: number;
- **vin** (7)
  - L3: vin: string;
  - L29: export async function getStatvinData(vin: string): Promise<{ vin: string; data: AuctionData | null; error: string | null }> {
  - L38: body: JSON.stringify({ vin })
  - L43: vin,
  - L53: vin,
- **fetch** (1)
  - L32: const response = await fetch(`https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/fetch-auction-data`, {
- **storage** (1)
  - L32: const response = await fetch(`https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/fetch-auction-data`, {

### /workspaces/car-detective-mvp/src/enrichment/types.ts  (LOC 116)
exports: StatVinData, FacebookListing, CraigslistListing, EbayListing, EnrichedVehicleData
- **make** (2)
  - L11: make?: string;
  - L34: make: string;
- **model** (2)
  - L12: model?: string;
  - L35: model: string;
- **year** (2)
  - L13: year?: string;
  - L36: year: string;
- **price** (4)
  - L42: price: string;
  - L73: price: number;
  - L84: price: number;
  - L95: price: number;
- **mileage** (3)
  - L14: mileage?: string;
  - L37: mileage: string;
  - L60: mileage: string;
- **vin** (2)
  - L3: vin: string;
  - L106: vin: string;
- **photos** (1)
  - L39: photos?: string[];
- **url** (3)
  - L76: url: string;
  - L87: url: string;
  - L98: url: string;

### /workspaces/car-detective-mvp/src/guards/DealerGuard.tsx  (LOC 24)
exports: DealerGuard
- **dealer** (2)
  - L17: if (!user || userDetails?.role !== 'dealer') {
  - L18: return <Navigate to="/login-dealer" replace />;

### /workspaces/car-detective-mvp/src/hooks/types/savedValuation.ts  (LOC 22)
exports: SavedValuation
- **make** (2)
  - L4: make: string;
  - L16: make: string;
- **model** (2)
  - L5: model: string;
  - L17: model: string;
- **year** (2)
  - L6: year: number;
  - L15: year: number;
- **vin** (1)
  - L7: vin?: string;
- **valuation** (1)
  - L13: // The nested valuation object that provides access to the data in the format used by components

### /workspaces/car-detective-mvp/src/hooks/types/vehicle.ts  (LOC 17)
exports: Make, Model
- **make** (1)
  - L2: export interface Make {
- **model** (1)
  - L11: export interface Model {

### /workspaces/car-detective-mvp/src/hooks/useAccidentImpact.ts  (LOC 114)
exports: AccidentImpact, AccidentHistory, useAccidentImpact
functions: useAccidentImpact, calculateImpact, totalImpact, percentImpact, dollarImpact, errorMessage
- **vin** (1)
  - L22: vin?: string,

### /workspaces/car-detective-mvp/src/hooks/useAdminAnalytics.ts  (LOC 195)
exports: AdminAnalytics, useAdminAnalytics
functions: useAdminAnalytics, fetchData, thirtyDaysAgo, thirtyDaysAgoStr, vinCount, plateCount, manualCount, valuationsByMethod, date, dailyValuations, aiPhotoUploads, aiConfidence, metadata, confidenceScore, aiOverridePercentage, revenueTotal, conversionRate, topZipCodes
- **vin** (1)
  - L68: { name: "VIN", value: vinCount },
- **photos** (1)
  - L93: // Fetch AI stats - photo scores
- **zip** (4)
  - L21: topZipCodes: { zip: string; count: number }[];
  - L148: // Fetch top ZIP codes
  - L157: // Count occurrences of each ZIP
  - L167: .map(([zip, count]) => ({ zip, count }))
- **storage** (8)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L41: const { count: totalValuations, error: valuationError } = await supabase
  - L49: const { data: methodData, error: methodError } = await supabase
  - L74: const { data: dailyData, error: dailyError } = await supabase
  - L94: const { data: photoData, error: photoError } = await supabase

### /workspaces/car-detective-mvp/src/hooks/useAuctionIndex.ts  (LOC 47)
exports: AuctionIndexEntry, useAuctionIndex
functions: useAuctionIndex, errorMsg
- **storage** (2)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L23: const { data, error } = await supabase.functions.invoke(

### /workspaces/car-detective-mvp/src/hooks/useAuctionIntelligence.ts  (LOC 86)
exports: useAuctionIntelligence
functions: useAuctionIntelligence, fetchIntelligence, shouldGenerate
- **vin** (6)
  - L6: export function useAuctionIntelligence(vin: string) {
  - L12: if (!vin) {
  - L26: .eq('vin', vin)
  - L42: body: { vin }
  - L60: .eq('vin', vin)
- **storage** (4)
  - L3: import { supabase } from '@/integrations/supabase/client';
  - L23: const { data: existingData, error: fetchError } = await supabase
  - L41: const { error: functionError } = await supabase.functions.invoke('generate-auction-intelligence', {
  - L57: const { data: newData, error: refetchError } = await supabase

### /workspaces/car-detective-mvp/src/hooks/useAuth.tsx  (LOC 237)
exports: UserDetails, AuthContextType, AuthProvider, useAuth
functions: AuthContext, AuthProvider, fetchUserDetails, refreshUser, mounted, signIn, signUp, redirectUrl, signInWithGoogle, signOut, resetPassword, redirectUrl, useAuth, context
- **dealer** (1)
  - L10: role?: 'individual' | 'dealer' | 'admin';
- **storage** (11)
  - L3: import { User, Session } from '@supabase/supabase-js';
  - L4: import { supabase } from '@/integrations/supabase/client';
  - L42: const { data: profile } = await supabase
  - L48: const { data: userRole } = await supabase
  - L79: const { data: { subscription } } = supabase.auth.onAuthStateChange(

### /workspaces/car-detective-mvp/src/hooks/useCensus.ts  (LOC 49)
exports: CensusData, CensusResult, useCensus
functions: useCensus, errorMsg
- **zip** (7)
  - L8: zip: string;
  - L16: export function useCensus(zip: string) {
  - L18: queryKey: ["census", zip],
  - L21: // Only run the query if we have a valid ZIP
  - L22: if (!zip || !/^\d{5}$/.test(zip)) {
- **storage** (2)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L26: const { data, error } = await supabase.functions.invoke(

### /workspaces/car-detective-mvp/src/hooks/useCompetitorPrices.ts  (LOC 13)
exports: useCompetitorPrices
functions: useCompetitorPrices
- **vin** (4)
  - L5: export function useCompetitorPrices(vin: string) {
  - L7: queryKey: ['competitor-prices', vin],
  - L8: queryFn: () => getCachedCompetitorPrices(vin),
  - L9: enabled: !!vin && vin.length === 17,
- **retry** (1)
  - L11: retry: 1

### /workspaces/car-detective-mvp/src/hooks/useConsolidatedForecast.ts  (LOC 92)
exports: ConsolidatedForecastData, ConsolidatedForecastResult, useConsolidatedForecast
functions: useConsolidatedForecast, fetchForecast, errorMessage
- **storage** (2)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L47: const { data, error: invokeError } = await supabase.functions.invoke(
- **valuation** (2)
  - L38: setError("Valuation ID is required");
  - L48: "valuation-forecast",

### /workspaces/car-detective-mvp/src/hooks/useCorrectedValuation.ts  (LOC 94)
exports: useCorrectedValuation
functions: useCorrectedValuation, runCorrection, t0, finalValue, confidenceScore
- **make** (2)
  - L8: make: string;
  - L45: make: params.make,
- **model** (2)
  - L9: model: string;
  - L46: model: params.model,
- **year** (2)
  - L10: year: number;
  - L47: year: params.year,
- **mileage** (2)
  - L12: mileage: number;
  - L48: mileage: params.mileage,
- **vin** (2)
  - L7: vin: string;
  - L44: vin: params.vin,
- **valuation** (5)
  - L20: valuation: {
  - L40: toast.info('Recalculating valuation with corrected data...');
  - L64: valuation: {
  - L78: toast.success('Valuation corrected and updated successfully!');
  - L82: toast.error('Failed to correct valuation');

### /workspaces/car-detective-mvp/src/hooks/useDealerInsights.ts  (LOC 35)
exports: useDealerInsights
functions: useDealerInsights
- **valuation** (1)
  - L4: import { DealerInsights } from '@/types/valuation';

### /workspaces/car-detective-mvp/src/hooks/useDealerNotifications.ts  (LOC 48)
exports: useDealerNotifications
functions: useDealerNotifications, triggerDealerNotifications
- **make** (1)
  - L25: message: `Dealers in ${zipCode} have been notified about your ${reportData.year} ${reportData.make} ${reportData.model}`
- **model** (1)
  - L25: message: `Dealers in ${zipCode} have been notified about your ${reportData.year} ${reportData.make} ${reportData.model}`
- **year** (1)
  - L25: message: `Dealers in ${zipCode} have been notified about your ${reportData.year} ${reportData.make} ${reportData.model}`
- **dealer** (2)
  - L19: // Mock dealer notification logic
  - L30: message: 'Vehicle value too low for dealer notifications'

### /workspaces/car-detective-mvp/src/hooks/useDealerOfferActions.ts  (LOC 165)
exports: OfferActionOptions, useDealerOfferActions
functions: useDealerOfferActions, acceptOffer, rejectOffer, cancelAcceptedOffer
- **vin** (3)
  - L12: vin?: string;
  - L79: if (options.dealerEmail && options.userEmail && options.vin) {
  - L83: vin: options.vin,
- **dealer** (3)
  - L78: // Send notification to dealer if email information is available
  - L88: toast.success('Offer accepted successfully! The dealer has been notified and will contact you soon.');
  - L135: // Reset the original dealer offer status back to sent
- **storage** (12)
  - L3: import { supabase } from '@/integrations/supabase/client';
  - L25: const { data: { user }, error: userError } = await supabase.auth.getUser();
  - L31: const { error: updateError } = await supabase
  - L41: const { data: acceptedOffer, error: acceptedError } = await supabase
  - L43: .insert({

### /workspaces/car-detective-mvp/src/hooks/useDealerValuations.ts  (LOC 108)
exports: ValuationWithVehicle, ConditionFilterOption, useDealerValuations
functions: useDealerValuations, fetchDealerValuations, query, effectiveDealerId, from, to, handlePageChange, handleConditionFilterChange, handleDownloadReport
- **dealer** (2)
  - L4: import { ValuationWithCondition } from "@/types/dealer";
  - L42: // Filter by dealer ID (use provided dealerId or user.id)
- **storage** (2)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L38: let query = supabase
- **valuation** (1)
  - L91: const handleDownloadReport = (valuation: ValuationWithCondition) => {

### /workspaces/car-detective-mvp/src/hooks/useDealerVehicles.ts  (LOC 36)
exports: useDealerVehicles
functions: useDealerVehicles, addVehicle
- **make** (1)
  - L18: `Vehicle Added: ${data.year} ${data.make} ${data.model} added to inventory`,
- **model** (1)
  - L18: `Vehicle Added: ${data.year} ${data.make} ${data.model} added to inventory`,
- **year** (1)
  - L18: `Vehicle Added: ${data.year} ${data.make} ${data.model} added to inventory`,

### /workspaces/car-detective-mvp/src/hooks/useDownloadPdf.ts  (LOC 36)
exports: useDownloadPdf
functions: useDownloadPdf, downloadPdf
- **url** (1)
  - L19: // Return a mock URL
- **valuation** (1)
  - L10: setError('No valuation ID provided');

### /workspaces/car-detective-mvp/src/hooks/useEpaMpg.ts  (LOC 44)
exports: EpaMpgResult, useEpaMpg
functions: useEpaMpg
- **make** (5)
  - L14: export function useEpaMpg(year: number, make: string, model: string) {
  - L16: queryKey: ["epaMpg", year, make, model],
  - L19: if (!year || !make || !model) {
  - L27: body: { year, make, model },
  - L41: enabled: Boolean(year && make && model),
- **model** (5)
  - L14: export function useEpaMpg(year: number, make: string, model: string) {
  - L16: queryKey: ["epaMpg", year, make, model],
  - L19: if (!year || !make || !model) {
  - L27: body: { year, make, model },
  - L41: enabled: Boolean(year && make && model),
- **year** (5)
  - L14: export function useEpaMpg(year: number, make: string, model: string) {
  - L16: queryKey: ["epaMpg", year, make, model],
  - L19: if (!year || !make || !model) {
  - L27: body: { year, make, model },
  - L41: enabled: Boolean(year && make && model),
- **storage** (2)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L24: const { data, error } = await supabase.functions.invoke(

### /workspaces/car-detective-mvp/src/hooks/useFeatureFlags.ts  (LOC 83)
exports: useFeatureFlags
functions: defaultFlags, useFeatureFlags, user, auth, fetchFeatureFlags, flagsObject
- **storage** (3)
  - L3: import { supabase } from '@/integrations/supabase/client';
  - L36: const { data: userFlags, error: userError } = await supabase
  - L53: const { data: globalFlags, error: globalError } = await supabase

### /workspaces/car-detective-mvp/src/hooks/useFollowUpAutoSave.ts  (LOC 125)
exports: useFollowUpAutoSave
functions: useFollowUpAutoSave, saveTimeoutRef, abortControllerRef, isSavingRef, lastSavedDataRef, saveFormData, currentDataString, saveData, debouncedSave
- **vin** (1)
  - L60: onConflict: 'vin,user_id'
- **retry** (3)
  - L75: setSaveError('Network issue - will retry automatically');
  - L104: // Cancel any existing timeout
  - L115: // Set new timeout with stable 500ms delay
- **storage** (4)
  - L3: import { supabase } from '@/integrations/supabase/client';
  - L49: const { data: { user } } = await supabase.auth.getUser();
  - L57: const { error } = await supabase
  - L59: .upsert(saveData, {

### /workspaces/car-detective-mvp/src/hooks/useFollowUpDataLoader.ts  (LOC 145)
exports: useFollowUpDataLoader
functions: useFollowUpDataLoader, loadFollowUpData, resolvedValuationId
- **year** (2)
  - L114: .select('id, year, mileage, condition, zip_code')
  - L124: year: valuationData.year || prev.year,
- **mileage** (3)
  - L14: mileage: 0,
  - L114: .select('id, year, mileage, condition, zip_code')
  - L125: mileage: valuationData.mileage || prev.mileage,
- **vin** (10)
  - L7: vin: string;
  - L11: export function useFollowUpDataLoader({ vin, initialData }: UseFollowUpDataLoaderProps) {
  - L13: vin,
  - L60: if (!vin) {
  - L70: .eq('vin', vin)
- **storage** (5)
  - L3: import { supabase } from '@/integrations/supabase/client';
  - L67: const { data: existingAnswers } = await supabase
  - L78: const { data: valuationData } = await supabase
  - L89: await supabase
  - L112: const { data: valuationData } = await supabase
- **valuation** (1)
  - L111: // Try to link with an existing valuation even if no follow-up answers exist

### /workspaces/car-detective-mvp/src/hooks/useFollowUpForm.ts  (LOC 262)
exports: useFollowUpForm
functions: useFollowUpForm, formMethods, watchedData, saveForm, currentFormData, errorMessage, submitCompleteForm, currentFormData, t0, finalValue, confidenceScore, priceRange, adjustments, valuationResult, errorMessage, getValidationState, currentData, progressPercentage, currentData, allTabs, completedTabs
- **make** (1)
  - L129: make: decodedVehicle.make || 'Unknown',
- **model** (1)
  - L130: model: decodedVehicle.model || 'Unknown',
- **year** (1)
  - L131: year: decodedVehicle.year || currentFormData.year || new Date().getFullYear(),
- **mileage** (1)
  - L132: mileage: currentFormData.mileage,
- **vin** (13)
  - L12: export function useFollowUpForm(vin: string, initialData?: Partial<FollowUpAnswers>) {
  - L22: vin,
  - L68: const currentFormData = { ...formData, vin };
  - L74: onConflict: 'vin'
  - L94: }, [vin, setFormData]);
- **storage** (10)
  - L3: import { supabase } from '@/integrations/supabase/client';
  - L71: const { error } = await supabase
  - L73: .upsert(currentFormData, {
  - L105: const { error: saveError } = await supabase
  - L107: .upsert(currentFormData, {
- **valuation** (7)
  - L96: // Complete form submission with valuation recalculation
  - L117: // Now run enhanced valuation with complete follow-up data
  - L125: // Run valuation with complete follow-up data via AIN API
  - L153: explanation: ainResult.explanation || 'Professional valuation from AIN API',
  - L161: // Update the valuation result in database
- **env** (1)
  - L18: if (import.meta.env.NODE_ENV !== 'production') {

### /workspaces/car-detective-mvp/src/hooks/useForecast.ts  (LOC 16)
exports: useForecast
functions: useForecast
- **valuation** (1)
  - L2: import type { ForecastResult } from "@/utils/forecasting/valuation-forecast";

### /workspaces/car-detective-mvp/src/hooks/useFormAutosave.ts  (LOC 54)
exports: useFormAutosave
functions: useFormAutosave, loadSavedData, savedData, saveFormData, clearSavedForm
- **make** (1)
  - L37: if (!formData.make && !formData.model && !formData.year) {
- **model** (1)
  - L37: if (!formData.make && !formData.model && !formData.year) {
- **year** (1)
  - L37: if (!formData.make && !formData.model && !formData.year) {
- **valuation** (2)
  - L2: import { FormData } from "@/types/premium-valuation";
  - L41: // Don't save if we have a valuation ID (form is submitted)

### /workspaces/car-detective-mvp/src/hooks/useFormValidation.ts  (LOC 31)
exports: useFormValidation
functions: useFormValidation, updateStepValidity, isFormValid
- **make** (1)
  - L15: // Modify isFormValid to make it less restrictive

### /workspaces/car-detective-mvp/src/hooks/useFullValuationPipeline.ts  (LOC 139)
exports: useFullValuationPipeline
functions: useFullValuationPipeline, currentStep, stage, vehicle, requiredInputs, valuationResult, isLoading, error, runLookup, vehicleData, submitValuation, resultData, resultStepIndex
- **make** (1)
  - L47: make: type === "vin" ? "Toyota" : "Honda",
- **model** (1)
  - L48: model: type === "vin" ? "Camry" : "Accord",
- **year** (2)
  - L49: year: 2020,
  - L85: year: data.year || vehicle.year || 2020,
- **mileage** (2)
  - L81: if (data.mileage || data.accidents || data.titleStatus) {
  - L83: mileage: data.mileage || requiredInputs.mileage || 50000,
- **vin** (3)
  - L47: make: type === "vin" ? "Toyota" : "Honda",
  - L48: model: type === "vin" ? "Camry" : "Accord",
  - L51: vin: type === "vin" ? identifier : undefined,
- **valuation** (4)
  - L2: import { useValuationPipeline } from "./valuation-pipeline";
  - L75: // Helper function to simulate valuation submission
  - L110: // Auto advance to result step when valuation is complete
  - L122: err instanceof Error ? err.message : "Unknown error during valuation",

### /workspaces/car-detective-mvp/src/hooks/useMakeModels.ts  (LOC 266)
exports: useMakeModels
functions: useMakeModels, fetchModelsByMakeId, selectedMake, fetchTrimsByModelId, query, uniqueTrimsMap, hasNonStandardTrims, trimKey, filteredTrims, standardTrims, hasMultipleTrims, uniqueTrimNames, findMakeById, findModelById, searchMakes, lowerQuery, getPopularMakes, popularMakeNames, getNonPopularMakes, popularMakeNames
- **make** (20)
  - L3: import { Make, Model } from '@/hooks/types/vehicle';
  - L17: makes: Make[];
  - L24: findMakeById: (makeId: string) => Make | undefined;
  - L26: searchMakes: (query: string) => Make[];
  - L27: getPopularMakes: () => Make[];
- **model** (10)
  - L3: import { Make, Model } from '@/hooks/types/vehicle';
  - L18: models: Model[];
  - L25: findModelById: (modelId: string) => Model | undefined;
  - L34: const [models, setModels] = useState<Model[]>([]);
  - L111: const formattedModels: Model[] = data.map(model => ({
- **year** (9)
  - L9: year: number;
  - L23: fetchTrimsByModelId: (modelId: string, year?: number) => Promise<void>;
  - L131: const fetchTrimsByModelId = async (modelId: string, year?: number): Promise<void> => {
  - L137: console.log('🔍 Fetching trims for modelId:', modelId, 'year:', year);
  - L144: .select('id, trim_name, model_id, year, msrp, engine_type, transmission, fuel_type')
- **storage** (7)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L64: const { data, error: fetchError } = await supabase
  - L71: console.error('❌ Supabase models fetch error:', fetchError);
  - L142: let query = supabase
  - L155: console.error('❌ Supabase trims fetch error:', fetchError);

### /workspaces/car-detective-mvp/src/hooks/useMarketInsights.ts  (LOC 80)
exports: useMarketInsights
functions: useMarketInsights
- **make** (5)
  - L5: make: string;
  - L37: queryKey: ['marketInsights', params.make, params.model, params.year, params.zipCode],
  - L57: title: `${params.year} ${params.make} ${params.model}`,
  - L67: title: `${params.year} ${params.make} ${params.model}`,
  - L78: enabled: Boolean(params.make && params.model && params.year),
- **model** (5)
  - L6: model: string;
  - L37: queryKey: ['marketInsights', params.make, params.model, params.year, params.zipCode],
  - L57: title: `${params.year} ${params.make} ${params.model}`,
  - L67: title: `${params.year} ${params.make} ${params.model}`,
  - L78: enabled: Boolean(params.make && params.model && params.year),
- **year** (5)
  - L7: year: number;
  - L37: queryKey: ['marketInsights', params.make, params.model, params.year, params.zipCode],
  - L57: title: `${params.year} ${params.make} ${params.model}`,
  - L67: title: `${params.year} ${params.make} ${params.model}`,
  - L78: enabled: Boolean(params.make && params.model && params.year),
- **price** (3)
  - L26: price: number;
  - L58: price: 24500,
  - L68: price: 25900,
- **mileage** (3)
  - L27: mileage: number;
  - L59: mileage: 35000,
  - L69: mileage: 28000,

### /workspaces/car-detective-mvp/src/hooks/useMarketListings.ts  (LOC 115)
exports: useMarketListings
functions: useMarketListings, fetchListings, query, broadQuery
- **make** (7)
  - L7: make?: string;
  - L16: make,
  - L29: if (!make && !model && !vin) {
  - L54: // Build query for make/model/year
  - L60: if (make) query = query.ilike('make', `%${make}%`);
- **model** (6)
  - L8: model?: string;
  - L17: model,
  - L29: if (!make && !model && !vin) {
  - L54: // Build query for make/model/year
  - L61: if (model) query = query.ilike('model', `%${model}%`);
- **year** (11)
  - L9: year?: number;
  - L18: year,
  - L54: // Build query for make/model/year
  - L63: // For year, use exact match if requested, otherwise use a range
  - L64: if (year) {
- **vin** (7)
  - L11: vin?: string;
  - L20: vin,
  - L29: if (!make && !model && !vin) {
  - L39: // Try to fetch exact VIN match first if provided
  - L40: if (vin) {
- **zip** (1)
  - L75: // Add zip code filter if provided
- **storage** (4)
  - L3: import { supabase } from '@/integrations/supabase/client';
  - L41: const { data: vinMatches, error: vinError } = await supabase
  - L55: let query = supabase
  - L88: let broadQuery = supabase

### /workspaces/car-detective-mvp/src/hooks/useMarketplaceComparison.ts  (LOC 196)
exports: useMarketplaceComparison
functions: useMarketplaceComparison, searchQuery, generateRecommendation, validListings, targetMileage, mileageFilteredListings, listingsToAnalyze, averagePrice, lowestPrice, highestPrice, mileages, avgMileage, mileageRange, platforms, platformText, recommendation, valuationVsAverage, percentageDiff
- **make** (10)
  - L21: make?: string;
  - L30: make,
  - L40: queryKey: ['marketplace-listings', vin, make, model, year],
  - L49: ? `vin.eq.${vin},and(make.eq.${make},model.eq.${model},year.eq.${year})`
  - L50: : `and(make.eq.${make},model.eq.${model},year.eq.${year})`
- **model** (10)
  - L22: model?: string;
  - L31: model,
  - L40: queryKey: ['marketplace-listings', vin, make, model, year],
  - L49: ? `vin.eq.${vin},and(make.eq.${make},model.eq.${model},year.eq.${year})`
  - L50: : `and(make.eq.${make},model.eq.${model},year.eq.${year})`
- **year** (10)
  - L23: year?: number;
  - L32: year,
  - L40: queryKey: ['marketplace-listings', vin, make, model, year],
  - L49: ? `vin.eq.${vin},and(make.eq.${make},model.eq.${model},year.eq.${year})`
  - L50: : `and(make.eq.${make},model.eq.${model},year.eq.${year})`
- **price** (9)
  - L10: price: number;
  - L59: price: listing.price,
  - L114: const validListings = listings.filter(l => l.price && l.price > 0);
  - L128: const averagePrice = listingsToAnalyze.reduce((sum, l) => sum + l.price, 0) / listingsToAnalyze.length;
  - L129: const lowestPrice = Math.min(...listingsToAnalyze.map(l => l.price));
- **mileage** (12)
  - L14: mileage?: number;
  - L63: mileage: listing.mileage,
  - L120: // Filter by mileage similarity (within 25K miles for better comparison)
  - L121: const targetMileage = validListings[0]?.mileage || 0;
  - L123: l.mileage && Math.abs(l.mileage - targetMileage) <= 25000
- **vin** (10)
  - L16: vin?: string;
  - L20: vin?: string;
  - L29: vin,
  - L40: queryKey: ['marketplace-listings', vin, make, model, year],
  - L48: vin
- **url** (2)
  - L13: url: string;
  - L60: url: listing.listing_url,
- **storage** (4)
  - L4: import { supabase } from '@/integrations/supabase/client';
  - L44: const { data: enhancedListings, error: enhancedError } = await supabase
  - L71: const { data: vinData, error: vinError } = await supabase
  - L86: const { data, error } = await supabase
- **valuation** (3)
  - L153: recommendation += `Your valuation is ${percentageDiff.toFixed(1)}% above market average, `;
  - L156: recommendation += `Your valuation is ${percentageDiff.toFixed(1)}% below market average, `;
  - L160: recommendation += 'Your valuation aligns well with current market pricing.';

### /workspaces/car-detective-mvp/src/hooks/useMissingFieldAnalysis.ts  (LOC 54)
exports: useMissingFieldAnalysis
functions: useMissingFieldAnalysis, analysis, derived, isComplete, hasHighPriorityMissing, completionScore, needsAttention
- **valuation** (1)
  - L3: import { analyzeMissingFields, MissingDataAnalysis } from '@/utils/valuation/missingFieldAnalyzer';

### /workspaces/car-detective-mvp/src/hooks/useNhtsaRecalls.ts  (LOC 69)
exports: RecallRecord, UseNhtsaRecallsResult, useNhtsaRecalls
functions: useNhtsaRecalls, errorMsg
- **make** (6)
  - L12: Make: string;
  - L23: make: string,
  - L32: queryKey: ["nhtsaRecalls", make, model, year],
  - L35: if (!make || !model || !year) {
  - L43: body: { make, model, year },
- **model** (6)
  - L13: Model: string;
  - L24: model: string,
  - L32: queryKey: ["nhtsaRecalls", make, model, year],
  - L35: if (!make || !model || !year) {
  - L43: body: { make, model, year },
- **year** (5)
  - L25: year: number,
  - L32: queryKey: ["nhtsaRecalls", make, model, year],
  - L35: if (!make || !model || !year) {
  - L43: body: { make, model, year },
  - L60: enabled: Boolean(make) && Boolean(model) && Boolean(year),
- **storage** (2)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L40: const { data, error } = await supabase.functions.invoke(

### /workspaces/car-detective-mvp/src/hooks/useNicbVinCheck.ts  (LOC 33)
exports: useNicbVinCheck
functions: useNicbVinCheck, checkVin
- **vin** (3)
  - L10: const checkVin = async (vin: string) => {
  - L21: vin: vin
  - L26: setError('Failed to check VIN with NICB');

### /workspaces/car-detective-mvp/src/hooks/useOsmGeocode.ts  (LOC 57)
exports: OsmGeocodeFeature, OsmGeocodeResult, useOsmGeocode
functions: useOsmGeocode, errorMsg
- **zip** (6)
  - L24: export function useOsmGeocode(zip: string) {
  - L26: queryKey: ["osmGeocode", zip],
  - L29: // Only run the query if we have a valid ZIP
  - L30: if (!zip || !/^\d{5}$/.test(zip)) {
  - L37: body: { zip },
- **storage** (2)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L34: const { data, error } = await supabase.functions.invoke(

### /workspaces/car-detective-mvp/src/hooks/usePlateLookup.ts  (LOC 59)
exports: usePlateLookup
functions: usePlateLookup, lookupVehicle, errorMessage, lookupPlate
- **make** (2)
  - L8: make: string;
  - L30: make: 'Honda',
- **model** (2)
  - L9: model: string;
  - L31: model: 'Civic',
- **year** (2)
  - L7: year: number;
  - L29: year: 2020,
- **mileage** (2)
  - L11: mileage: number;
  - L33: mileage: 45000,
- **vin** (2)
  - L6: vin: string;
  - L28: vin: `MOCK${plate}${state}`,

### /workspaces/car-detective-mvp/src/hooks/usePrediction.ts  (LOC 78)
exports: usePrediction
functions: usePrediction, fetchPrediction, response, data, mockPrediction, errorMessage
- **mileage** (2)
  - L32: { name: "Mileage", value: -500, percentage: -0.02 },
  - L52: { name: "Mileage", value: -500, percentage: -0.02 },
- **fetch** (1)
  - L43: // const response = await fetch(`/api/predictions/${valuationId}`);
- **storage** (2)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L15: const { data: existingPrediction, error: fetchError } = await supabase

### /workspaces/car-detective-mvp/src/hooks/usePremiumAccess.ts  (LOC 38)
exports: usePremiumAccess
functions: usePremiumAccess, premiumAccess
- **dealer** (1)
  - L21: ['admin', 'dealer'].includes(userDetails.role || '') ||

### /workspaces/car-detective-mvp/src/hooks/usePremiumDealer.ts  (LOC 55)
exports: usePremiumDealer
functions: usePremiumDealer, checkPremiumStatus, isPremiumActive
- **storage** (2)
  - L3: import { supabase } from "@/integrations/supabase/client";
  - L28: const { data, error } = await supabase

### /workspaces/car-detective-mvp/src/hooks/usePremiumPayment.ts  (LOC 82)
exports: usePremiumPayment
functions: usePremiumPayment, navigate, createPaymentSession, mockUrl, verifyPaymentSession, mockResponse
- **storage** (3)
  - L3: // import { supabase } from "@/integrations/supabase/client";
  - L25: // In a real implementation, this would call a Supabase function to create a Stripe checkout
  - L48: // In a real implementation, this would call a Supabase function to verify the Stripe session

### /workspaces/car-detective-mvp/src/hooks/usePremiumStatus.ts  (LOC 85)
exports: usePremiumStatus
functions: usePremiumStatus, checkPremiumStatus, premiumIds, isPremiumValuation, createCheckoutSession, isPremiumValuation
- **url** (2)
  - L6: url?: string;
  - L61: url:
- **storage** (2)
  - L2: // import { supabase } from "@/integrations/supabase/client";
  - L55: // In production, this would call the Supabase function to create a Stripe checkout

### /workspaces/car-detective-mvp/src/hooks/useProfile.ts  (LOC 121)
exports: useProfile
functions: useProfile, fetchProfile, profileData, updateProfile, user, profileToUpdate, data, uploadAvatar, user, fileExt, fileName, filePath, updatedProfile
- **url** (1)
  - L99: // Update profile with new avatar URL
- **storage** (7)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L5: import { User } from "@supabase/supabase-js";
  - L39: const user = await supabase.auth.getUser();
  - L73: const user = await supabase.auth.getUser();
  - L84: const { error: uploadError } = await supabase.storage

### /workspaces/car-detective-mvp/src/hooks/usePublicShare.ts  (LOC 77)
exports: usePublicShare
functions: usePublicShare, generatePublicToken, errorMessage, getValuationByToken, errorMessage
- **make** (1)
  - L41: make,
- **model** (1)
  - L42: model,
- **year** (1)
  - L40: year,
- **mileage** (1)
  - L45: mileage,
- **vin** (1)
  - L44: vin,
- **storage** (3)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L13: const { data, error } = await supabase.functions.invoke('create-public-token', {
  - L33: const { data, error } = await supabase
- **valuation** (1)
  - L65: const errorMessage = err.message || 'Failed to load valuation';

### /workspaces/car-detective-mvp/src/hooks/useScrapedListings.ts  (LOC 43)
exports: ScrapedListing, useScrapedListings
functions: useScrapedListings
- **price** (1)
  - L8: price: number | null;
- **mileage** (1)
  - L12: mileage: number | null;
- **vin** (6)
  - L13: vin: string | null;
  - L18: export function useScrapedListings(vin: string) {
  - L20: queryKey: ['scraped-listings', vin],
  - L22: if (!vin || vin.length !== 17) {
  - L29: .eq('vin', vin)
- **url** (1)
  - L9: url: string;
- **retry** (1)
  - L41: retry: 1
- **storage** (2)
  - L3: import { supabase } from '@/integrations/supabase/client'
  - L26: const { data, error } = await supabase

### /workspaces/car-detective-mvp/src/hooks/useServiceHistory.ts  (LOC 123)
exports: ServiceRecord, UseServiceHistoryProps, useServiceHistory
functions: useServiceHistory, fetchRecords, formattedRecords, addServiceRecord, deleteServiceRecord, refreshRecords
- **mileage** (1)
  - L10: mileage: number;
- **vin** (7)
  - L8: vin: string;
  - L17: vin: string;
  - L20: export function useServiceHistory({ vin }: UseServiceHistoryProps) {
  - L33: .eq("vin", vin)
  - L56: }, [vin]);
- **storage** (5)
  - L3: import { supabase } from "@/integrations/supabase/client";
  - L30: const { data, error: fetchError } = await supabase
  - L62: const { data, error: insertError } = await supabase
  - L64: .insert([record])
  - L83: const { error: deleteError } = await supabase

### /workspaces/car-detective-mvp/src/hooks/useShareReport.ts  (LOC 53)
exports: useShareReport
functions: useShareReport, shareReport, shareViaEmail
- **url** (1)
  - L24: url: `${window.location.origin}/report/${valuationId}`
- **valuation** (3)
  - L10: setError('No valuation ID provided');
  - L22: title: 'Vehicle Valuation Report',
  - L23: text: 'Check out my vehicle valuation report!',

### /workspaces/car-detective-mvp/src/hooks/useSimpleFollowUpForm.ts  (LOC 414)
exports: useSimpleFollowUpForm
functions: useSimpleFollowUpForm, loadData, mappedData, saveFormData, validConditions, saveData, timer, updateFormData, saveProgress, isFormValid, hasValidZip, hasValidMileage, hasValidCondition, submitFollowUpAndStartValuation, decodeResult, decodedVehicle, userId, completeFormData, saveResult, currentValuation, finalValue
- **make** (3)
  - L314: make: decodedVehicle?.make || formData.make || 'Unknown',
  - L349: make: decodedVehicle?.make || formData.make,
  - L370: make: decodedVehicle?.make || formData.make || 'Unknown',
- **model** (3)
  - L315: model: decodedVehicle?.model || formData.model || 'Unknown',
  - L350: model: decodedVehicle?.model || formData.model,
  - L371: model: decodedVehicle?.model || formData.model || 'Unknown',
- **year** (4)
  - L18: year: initialData?.year || new Date().getFullYear(),
  - L316: year: decodedVehicle?.year || formData.year || new Date().getFullYear(),
  - L351: year: decodedVehicle?.year || formData.year,
  - L372: year: decodedVehicle?.year || formData.year || new Date().getFullYear(),
- **mileage** (8)
  - L16: mileage: 0,
  - L145: [dataToSave.zip_code, dataToSave.mileage && dataToSave.mileage > 0, dataToSave.condition].filter(Boolean).length / 3
  - L147: is_complete: Boolean(dataToSave.zip_code && dataToSave.mileage && dataToSave.mileage > 0 && dataToSave.condition),
  - L265: const hasValidMileage = formData.mileage && formData.mileage > 0;
  - L279: if (!formData.zip_code || !formData.mileage || !formData.condition) {
- **vin** (37)
  - L8: vin: string;
  - L12: export function useSimpleFollowUpForm({ vin, initialData }: UseSimpleFollowUpFormProps) {
  - L14: vin,
  - L68: // First try to load by VIN
  - L72: .eq('vin', vin)
- **retry** (1)
  - L234: // Auto-save with retry logic (every 10 seconds)
- **storage** (10)
  - L4: import { supabase } from '@/integrations/supabase/client';
  - L69: let { data, error } = await supabase
  - L85: const { data: valuationData } = await supabase
  - L173: const { data: valuationData } = await supabase
  - L190: const { error } = await supabase
- **valuation** (13)
  - L84: // If no data by VIN, try to link to existing valuation
  - L100: // Still preserve the VIN even if no valuation exists
  - L271: // PHASE 2 FIX: Enhanced submission function with proper VIN decode validation and valuation creation
  - L275: return { success: false, message: 'VIN required for valuation' };
  - L283: const { needsDecoding, decodeVin, getDecodedVehicle } = await import('@/services/valuation/vehicleDecodeService');
- **env** (1)
  - L64: if (import.meta.env.NODE_ENV !== 'production') {

### /workspaces/car-detective-mvp/src/hooks/useStepNavigation.ts  (LOC 65)
exports: useStepNavigation
functions: useStepNavigation, handleLookup, nextStep, previousStep, goToStep
- **make** (1)
  - L5: make: string;
- **model** (1)
  - L6: model: string;
- **year** (1)
  - L7: year: string;
- **mileage** (1)
  - L8: mileage: string;
- **vin** (1)
  - L14: type LookupType = "vin" | "plate" | "manual" | "photo";
- **photos** (1)
  - L14: type LookupType = "vin" | "plate" | "manual" | "photo";

### /workspaces/car-detective-mvp/src/hooks/useUnifiedDecoder.ts  (LOC 48)
exports: useUnifiedDecoder
functions: useUnifiedDecoder, decodeVehicle, result, errorMessage
- **vin** (3)
  - L13: const decodeVehicle = useCallback(async (identifier: string, type: 'vin' | 'plate') => {
  - L18: if (type === 'vin') {
  - L24: throw new Error(result?.error || 'Failed to decode VIN');

### /workspaces/car-detective-mvp/src/hooks/useUnifiedLookup.ts  (LOC 98)
exports: useUnifiedLookup
functions: useUnifiedLookup, lookupByVin, lookupResult, sourceName, errorMessage, lookupByPlate, lookupResult, errorMessage, clearData
- **vin** (5)
  - L18: const lookupByVin = useCallback(async (vin: string): Promise<UnifiedVehicleLookupResult | null> => {
  - L30: const lookupResult = await UnifiedLookupService.lookupByVin(vin, options);
  - L37: setError(lookupResult.error || 'VIN lookup failed');
  - L38: toast.error(lookupResult.error || 'VIN lookup failed');
  - L43: const errorMessage = err instanceof Error ? err.message : 'VIN lookup failed';

### /workspaces/car-detective-mvp/src/hooks/useUserPlan.ts  (LOC 32)
exports: UserPlan, useUserPlan
functions: useUserPlan, isLoading, planType, hasFeature
- **dealer** (1)
  - L8: planType: 'free' | 'premium' | 'dealer' | 'admin';

### /workspaces/car-detective-mvp/src/hooks/useUserRole.ts  (LOC 26)
exports: useUserRole
functions: useUserRole, userRole, hasPermiumAccess
- **dealer** (2)
  - L15: ['admin', 'dealer'].includes(userRole) ||
  - L23: isDealer: userRole === 'dealer',

### /workspaces/car-detective-mvp/src/hooks/useValidation.ts  (LOC 113)
exports: useValidation
functions: validateField, partialSchema, newErrors, fieldError, result, newErrors, validateForm, newErrors, field, getFieldError, clearErrors, getErrorDetails
- **schema** (8)
  - L2: import { z, ZodSchema } from "zod";
  - L10: export function useValidation<T>(schema: ZodSchema<T>) {
  - L18: // Create a partial schema for the specific field
  - L19: // We need to use a different approach instead of accessing schema.shape
  - L20: const partialSchema = z.object({ [fieldName]: schema as any });

### /workspaces/car-detective-mvp/src/hooks/useValuationApi.ts  (LOC 233)
exports: UseValuationApiReturn, useValuationApi
functions: useValuationApi, createValuation, isValid, cached, response, triggerAggregation, response, getResult, resultData, errorMessage, loadSources, sourcesData, startFullValuation, requestId, aggregationStarted, finalResult, errorMessage, reset
- **vin** (4)
  - L41: // Check for cached valuation first if VIN is provided
  - L42: if (request.vin) {
  - L43: const isValid = await ValuationApiService.isValidVin(request.vin);
  - L45: const cached = await ValuationApiService.getCachedValuation(request.vin);
- **valuation** (18)
  - L2: import { ValuationApiService, ValuationRequest, ValuationResult, SourceStatus } from '@/components/valuation/valuation-core/ValuationResult';
  - L23: * React hook for AIN Valuation API integration
  - L24: * Provides a clean interface for all valuation operations
  - L34: * Step 1: Create valuation request
  - L41: // Check for cached valuation first if VIN is provided

### /workspaces/car-detective-mvp/src/hooks/useValuationChat.ts  (LOC 27)
exports: useValuationChat
functions: useValuationChat, sendMessage
- **valuation** (1)
  - L4: import { ChatMessage } from '@/types/valuation';

### /workspaces/car-detective-mvp/src/hooks/useValuationData.ts  (LOC 122)
exports: UseValuationDataOptions, UseValuationDataReturn, useValuationData, testDeduplication, useValuationHistory, useSavedValuations
functions: useValuationData, refreshData, deleteValuation, testDeduplication, deduped, existing, currentDate, existingDate, useValuationHistory, result, useSavedValuations, result
- **storage** (1)
  - L100: return Array.from(deduped.values());
- **valuation** (10)
  - L3: import { LegacyValuationResult, SavedValuation } from '@/types/valuation';
  - L52: setError('Failed to delete valuation');
  - L80: valuations.forEach(valuation => {
  - L81: const existing = deduped.get(valuation.id);
  - L84: deduped.set(valuation.id, valuation);

### /workspaces/car-detective-mvp/src/hooks/useValuationFactors.ts  (LOC 89)
exports: ValuationFactor, ConditionOption, CategoryFactors, useValuationFactors
functions: useValuationFactors, fetchFactors, value
- **storage** (3)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L38: const { data, error } = await supabase
  - L47: // Transform the data into the format we need for the UI
- **valuation** (1)
  - L78: : "Failed to fetch valuation factors",

### /workspaces/car-detective-mvp/src/hooks/useValuationFallback.ts  (LOC 45)
exports: FallbackState, useValuationFallback
functions: useValuationFallback, setFallbackForVin, setFallbackForPlate, resetFallback, shouldShowManualEntry
- **vin** (2)
  - L18: // Set fallback when VIN lookup fails
  - L21: toast.error("VIN lookup failed. Please try manual entry.");

### /workspaces/car-detective-mvp/src/hooks/useValuationIntegration.ts  (LOC 189)
exports: useValuationIntegration
functions: useValuationIntegration, updateProgress, processVinToValuation, validation, cached, pipelineResult, stages, stageIndex, progressValue, errorMessage, getCachedValuation, cached, clearResults
- **vin** (16)
  - L18: processVinToValuation: (vin: string, additionalData?: Partial<ValuationRequest>) => Promise<ValuationPipelineResult | null>;
  - L19: getCachedValuation: (vin: string) => Promise<void>;
  - L24: * Hook for managing the complete VIN to valuation pipeline
  - L48: vin: string
  - L56: // Validate VIN first
- **valuation** (16)
  - L3: import { ValuationRequest } from '@/components/valuation/valuation-core/ValuationResult';
  - L24: * Hook for managing the complete VIN to valuation pipeline
  - L66: // Check for cached valuation if enabled
  - L68: updateProgress('Checking for cached valuation...', 10);
  - L72: updateProgress('Found cached valuation', 100);

### /workspaces/car-detective-mvp/src/hooks/useValuationResult.ts  (LOC 72)
exports: useValuationResult
functions: useValuationResult, fetchValuation, data, calculateValuation, result
- **make** (1)
  - L26: make: data.make,
- **model** (1)
  - L27: model: data.model,
- **year** (1)
  - L28: year: data.year,
- **mileage** (1)
  - L29: mileage: data.mileage,
- **valuation** (6)
  - L3: import { LegacyValuationResult } from '@/types/valuation';
  - L4: import { getValuationById } from '@/utils/valuation';
  - L42: setError('Failed to fetch valuation');
  - L53: // This would integrate with actual valuation service
  - L57: setError('Failed to calculate valuation');

### /workspaces/car-detective-mvp/src/hooks/useVehicleDBData.ts  (LOC 136)
exports: MakeModel, useVehicleDBData
functions: useVehicleDBData, fetchMakes, getModelsByMakeId, getYears, currentYear, yearsList, year, getMakeName, getModelName
- **make** (8)
  - L30: const formattedMakes: MakeModel[] = (data || []).map((make) => ({
  - L31: id: make.id,
  - L32: name: make.make_name,
  - L46: // Function to fetch models by make ID
  - L81: // Generate years (this could be based on make/model or static range)
- **model** (7)
  - L66: const formattedModels: MakeModel[] = (data || []).map((model) => ({
  - L67: id: model.id,
  - L68: name: model.model_name,
  - L81: // Generate years (this could be based on make/model or static range)
  - L108: // Function to get model name by ID
- **year** (2)
  - L85: for (let year = currentYear; year >= currentYear - 20; year--) {
  - L86: yearsList.push(year);
- **storage** (5)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L22: const { data, error } = await supabase
  - L57: const { data, error } = await supabase
  - L94: const { data, error } = await supabase
  - L111: const { data, error } = await supabase

### /workspaces/car-detective-mvp/src/hooks/useVehicleData.ts  (LOC 24)
exports: UseVehicleDataReturn, useVehicleData
functions: useVehicleData, getCurrentYear, getYearOptions, currentYear, year
- **year** (2)
  - L14: for (let year = currentYear + 1; year >= startYear; year--) {
  - L15: years.push(year);

### /workspaces/car-detective-mvp/src/hooks/useVehicleHistory.ts  (LOC 64)
exports: useVehicleHistory
functions: useVehicleHistory, fetchVehicleHistory, errorMessage
- **vin** (4)
  - L18: export function useVehicleHistory(vin: string, valuationId: string) {
  - L27: if (!vin || !valuationId) return;
  - L37: body: { vin, valuationId },
  - L61: }, [vin, valuationId]);
- **storage** (3)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L33: // Call the Supabase Edge Function
  - L34: const { data, error: fnError } = await supabase.functions.invoke(

### /workspaces/car-detective-mvp/src/hooks/useVehicleLookup.ts  (LOC 64)
exports: useVehicleLookup
functions: useVehicleLookup, lookupVehicle
- **make** (2)
  - L7: make: string;
  - L36: make: manualData.make,
- **model** (2)
  - L8: model: string;
  - L37: model: manualData.model,
- **year** (2)
  - L9: year: string;
  - L38: year: parseInt(manualData.year),
- **mileage** (2)
  - L10: mileage: string;
  - L39: mileage: parseInt(manualData.mileage),
- **zip** (1)
  - L41: zip: manualData.zipCode,

### /workspaces/car-detective-mvp/src/hooks/useVehicleSelector.ts  (LOC 91)
exports: UseVehicleSelectorReturn, useVehicleSelector
functions: useVehicleSelector, filteredMakes, filteredModels
- **make** (3)
  - L45: const filteredMakes = makes.filter(make =>
  - L46: make.make_name?.toLowerCase().includes(searchTerm.toLowerCase())
  - L58: setValidationError('Make is required');
- **model** (3)
  - L50: const filteredModels = models.filter(model =>
  - L51: model.model_name?.toLowerCase().includes(modelSearchTerm.toLowerCase())
  - L61: setValidationError('Model is required');

### /workspaces/car-detective-mvp/src/hooks/useVehicleSelectors.ts  (LOC 98)
exports: useVehicleSelectors
functions: useVehicleSelectors, fetchMakes, fetchModels, getYearOptions, currentYear, year
- **make** (3)
  - L4: type Make = {
  - L16: const [makes, setMakes] = useState<Make[]>([]);
  - L47: // Fetch models when make is selected
- **model** (2)
  - L9: type Model = {
  - L17: const [models, setModels] = useState<Model[]>([]);
- **year** (3)
  - L79: const currentYear = new Date().getFullYear() + 1; // Include next year for new models
  - L82: for (let year = currentYear; year >= startYear; year--) {
  - L83: years.push(year);
- **storage** (3)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L29: const { data, error } = await supabase
  - L58: const { data, error } = await supabase

### /workspaces/car-detective-mvp/src/hooks/useVinForecast.ts  (LOC 47)
exports: useVinForecast
functions: useVinForecast, mounted, loadForecast, forecastData
- **vin** (4)
  - L5: export function useVinForecast(vin: string) {
  - L14: if (!vin) {
  - L23: const forecastData = await getOrCreateVinForecast(vin);
  - L44: }, [vin]);

### /workspaces/car-detective-mvp/src/hooks/useVinInput.ts  (LOC 57)
exports: useVinInput
functions: useVinInput, validateVin, cleanVin, isValidLength, hasValidChars, handleVinChange, cleanVin, isValidNow, errorMsg, handleInputChange
- **vin** (4)
  - L11: const [vin, setVin] = useState<string>(props?.initialValue || '');
  - L19: // Basic VIN validation
  - L33: const errorMsg = isValidNow ? null : 'Invalid VIN format';
  - L49: vin,

### /workspaces/car-detective-mvp/src/hooks/useVinLookup.ts  (LOC 46)
exports: useVinLookup
functions: useVinLookup, lookupVin, result, errorMessage, errorMessage
- **vin** (4)
  - L13: const lookupVin = useCallback(async (vin: string): Promise<DecodedVehicleInfo | null> => {
  - L18: const result = await lookupByVin(vin);
  - L23: const errorMessage = result?.error || 'VIN lookup failed';
  - L28: const errorMessage = err instanceof Error ? err.message : 'VIN lookup failed';

### /workspaces/car-detective-mvp/src/hooks/useVpicVinLookup.ts  (LOC 29)
exports: useVinLookup
functions: useVinLookup, lookupVin, res, json
- **vin** (2)
  - L8: async function lookupVin(vin: string) {
  - L16: body: JSON.stringify({ vin }),
- **fetch** (1)
  - L13: const res = await fetch("/functions/v1/unified-decode", {

### /workspaces/car-detective-mvp/src/hooks/useZipValidation.ts  (LOC 49)
exports: ZipLocation, useZipValidation
functions: useZipValidation, validateZipCode, response, data, useZipQuery
- **zip** (3)
  - L16: return { isValid: false, error: 'ZIP code must be 5 digits' };
  - L28: return { isValid: false, error: 'Invalid ZIP code' };
  - L30: return { isValid: false, error: 'Unable to validate ZIP code' };
- **fetch** (1)
  - L20: const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
- **retry** (1)
  - L43: retry: 2,

### /workspaces/car-detective-mvp/src/hooks/valuation-pipeline/index.ts  (LOC 5)
- **valuation** (1)
  - L2: // Main export for valuation pipeline functionality

### /workspaces/car-detective-mvp/src/hooks/valuation-pipeline/service.ts  (LOC 201)
exports: initialValuationPipelineState, valuationPipelineReducer
functions: valuationPipelineReducer, nextIndex, updatedSteps, prevIndex, updatedSteps, updatedSteps, updatedSteps
- **price** (1)
  - L42: description: "Provide your location for regional price adjustments",
- **vin** (1)
  - L13: "Identify your vehicle using VIN, license plate, or manual entry",
- **photos** (4)
  - L32: id: "photos",
  - L33: title: "Photos",
  - L35: "Upload photos of your vehicle for a more accurate valuation",
  - L163: photos: action.payload,
- **valuation** (5)
  - L6: // Initial state for the valuation pipeline
  - L35: "Upload photos of your vehicle for a more accurate valuation",
  - L48: title: "Valuation Result",
  - L49: description: "View your vehicle valuation results",
  - L60: // Reducer for the valuation pipeline

### /workspaces/car-detective-mvp/src/hooks/valuation-pipeline/types.ts  (LOC 64)
exports: ValuationConditionData, ValuationPipelineStep, ValuationPipelineData, ValuationPipelineState, ValuationPipelineReducerAction, ValuationPipelineAction, PipelineActions
- **year** (1)
  - L4: year?: number;
- **mileage** (1)
  - L2: mileage?: number;
- **photos** (1)
  - L26: photos?: File[];

### /workspaces/car-detective-mvp/src/hooks/valuation-pipeline/useValuationPipeline.ts  (LOC 260)
exports: useValuationPipeline
functions: useValuationPipeline, currentStep, stage, vehicle, requiredInputs, valuationResult, nextStep, previousStep, goToStep, setStepCompleted, setVehicleData, setConditionData, setFeaturesData, setLocationData, setPhotosData, setResultData, resetPipeline, startLoading, stopLoading, setError, runLookup, vehicleData, submitValuation, resultData, resultStepIndex, reset, actions
- **make** (1)
  - L129: make: type === "vin" ? "Toyota" : "Honda",
- **model** (1)
  - L130: model: type === "vin" ? "Camry" : "Accord",
- **year** (2)
  - L131: year: 2020,
  - L175: year: data.year || vehicle.year || 2020,
- **mileage** (2)
  - L169: if (data.mileage || data.accidents || data.titleStatus) {
  - L173: mileage: data.mileage || requiredInputs.mileage || 50000,
- **vin** (3)
  - L129: make: type === "vin" ? "Toyota" : "Honda",
  - L130: model: type === "vin" ? "Camry" : "Accord",
  - L133: vin: type === "vin" ? identifier : undefined,
- **valuation** (3)
  - L163: // Helper function to simulate valuation submission
  - L204: // Auto advance to result step when valuation is complete
  - L219: : "Unknown error during valuation",

### /workspaces/car-detective-mvp/src/index.ts  (LOC 7)
- **valuation** (1)
  - L7: export type { ValuationResult, LegacyValuationResult } from './types/valuation';

### /workspaces/car-detective-mvp/src/integrations/ai/serverClient.ts  (LOC 74)
exports: AICompletionRequest, AICompletionResponse, ServerAIClient, serverAI
functions: createCompletion, generateValuationExplanation, messages, response, serverAI
- **make** (2)
  - L53: vehicleInfo: { make: string; model: string; year: number; mileage: number },
  - L64: content: `Explain the valuation for a ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model} with ${vehicleInfo.mileage.toLocaleString()} miles, valued at $${estimatedValue.toLocaleString()}. Key factors: ${adjustments.map(a => `${a.f
- **model** (4)
  - L9: model?: string;
  - L29: model: request.model || 'gpt-3.5-turbo',
  - L53: vehicleInfo: { make: string; model: string; year: number; mileage: number },
  - L64: content: `Explain the valuation for a ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model} with ${vehicleInfo.mileage.toLocaleString()} miles, valued at $${estimatedValue.toLocaleString()}. Key factors: ${adjustments.map(a => `${a.f
- **year** (2)
  - L53: vehicleInfo: { make: string; model: string; year: number; mileage: number },
  - L64: content: `Explain the valuation for a ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model} with ${vehicleInfo.mileage.toLocaleString()} miles, valued at $${estimatedValue.toLocaleString()}. Key factors: ${adjustments.map(a => `${a.f
- **mileage** (2)
  - L53: vehicleInfo: { make: string; model: string; year: number; mileage: number },
  - L64: content: `Explain the valuation for a ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model} with ${vehicleInfo.mileage.toLocaleString()} miles, valued at $${estimatedValue.toLocaleString()}. Key factors: ${adjustments.map(a => `${a.f
- **openai** (2)
  - L1: // Server-side OpenAI integration via Edge Function
  - L29: model: request.model || 'gpt-3.5-turbo',
- **storage** (2)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L26: const { data, error } = await supabase.functions.invoke('ask-ain', {
- **valuation** (2)
  - L60: content: 'You are a vehicle valuation expert. Explain valuations clearly and professionally.'
  - L64: content: `Explain the valuation for a ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model} with ${vehicleInfo.mileage.toLocaleString()} miles, valued at $${estimatedValue.toLocaleString()}. Key factors: ${adjustments.map(a => `${a.f

### /workspaces/car-detective-mvp/src/integrations/openai/client.ts  (LOC 55)
exports: openai
functions: createChatCompletion, response, openai
- **model** (1)
  - L20: model: string;
- **fetch** (1)
  - L34: const response = await fetch(`${this.baseURL}/chat/completions`, {
- **openai** (7)
  - L15: this.baseURL = config.baseURL || 'https://api.openai.com/v1';
  - L31: headers['OpenAI-Organization'] = this.organization;
  - L41: throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  - L48: // SECURITY: Removed client-side OpenAI API key exposure
  - L49: // OpenAI functionality moved to server-side Edge Functions
- **env** (1)
  - L52: if (import.meta.env.NODE_ENV !== 'production') {

### /workspaces/car-detective-mvp/src/integrations/supabase/auditLogClient.ts  (LOC 84)
functions: saveAuditLog, getAuditLog, getValuationAuditHistory
- **mileage** (1)
  - L16: mileage: audit.mileage,
- **vin** (4)
  - L10: vin: audit.vin,
  - L14: vin: audit.vin,
  - L66: export async function getValuationAuditHistory(vin: string): Promise<EnhancedAuditLog[]> {
  - L71: .eq('vin', vin)
- **zip** (1)
  - L15: zip: audit.zip,
- **storage** (6)
  - L1: // Supabase Audit Log Client - Handles audit trail persistence
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L7: const { data, error } = await supabase
  - L9: .insert({
  - L49: const { data, error } = await supabase
- **valuation** (2)
  - L3: import { EnhancedAuditLog } from "@/types/valuation";
  - L42: // Return a placeholder ID rather than failing the entire valuation

### /workspaces/car-detective-mvp/src/integrations/supabase/client.ts  (LOC 15)
exports: supabase, getSupabaseClient
functions: supabaseUrl, supabaseAnonKey, supabase, getSupabaseClient
- **storage** (4)
  - L2: import { createClient } from '@supabase/supabase-js';
  - L4: const supabaseUrl = 'https://xltxqqzattxogxtqrggt.supabase.co';
  - L7: export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  - L15: export const getSupabaseClient = () => supabase;

### /workspaces/car-detective-mvp/src/integrations/supabase/types.ts  (LOC 4810)
exports: Json, Database, Tables, TablesInsert, TablesUpdate, Enums, CompositeTypes, Constants
functions: Constants
- **make** (70)
  - L415: make: string | null
  - L425: make?: string | null
  - L435: make?: string | null
  - L817: make: string
  - L834: make: string
- **model** (70)
  - L416: model: string | null
  - L426: model?: string | null
  - L436: model?: string | null
  - L819: model: string
  - L836: model: string
- **year** (64)
  - L418: year: string | null
  - L428: year?: string | null
  - L438: year?: string | null
  - L825: year: number
  - L842: year: number
- **price** (24)
  - L256: price: string
  - L270: price: string
  - L284: price?: string
  - L821: price: number
  - L838: price: number
- **mileage** (39)
  - L818: mileage: number | null
  - L835: mileage?: number | null
  - L852: mileage?: number | null
  - L1078: mileage: number | null
  - L1124: mileage?: number | null
- **vin** (114)
  - L117: vin: string | null
  - L130: vin?: string | null
  - L143: vin?: string | null
  - L193: vin: string
  - L201: vin: string
- **photos** (6)
  - L820: photos: Json | null
  - L837: photos?: Json | null
  - L854: photos?: Json | null
  - L1080: photos: Json | null
  - L1126: photos?: Json | null
- **dealer** (5)
  - L1777: dealer: string | null
  - L1809: dealer?: string | null
  - L1841: dealer?: string | null
  - L4663: user_role: "user" | "dealer"
  - L4807: user_role: ["user", "dealer"],
- **zip** (6)
  - L4424: zip: string
  - L4429: zip: string
  - L4434: zip?: string
  - L4445: zip: string
  - L4453: zip: string
- **url** (7)
  - L11: // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  - L1797: url: string | null
  - L1829: url?: string | null
  - L1861: url?: string | null
  - L2919: url: string
- **schema** (27)
  - L4694: | { schema: keyof DatabaseWithoutInternals },
  - L4696: schema: keyof DatabaseWithoutInternals
  - L4698: ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
  - L4699: DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  - L4702: schema: keyof DatabaseWithoutInternals
- **storage** (111)
  - L29: Insert: {
  - L73: Insert: {
  - L119: Insert: {
  - L160: Insert: {
  - L195: Insert: {
- **valuation** (3)
  - L2879: valuation: number | null
  - L2891: valuation?: number | null
  - L2903: valuation?: number | null

### /workspaces/car-detective-mvp/src/lib/ainClient.ts  (LOC 107)
exports: AinMeta, AinResponse
functions: supabaseUrl, supabaseAnonKey, supabase, mapToLegacyResponse, finalValue, priceRange, confidenceScore, adjustments, runValuation, corrId
- **make** (1)
  - L82: make?: string;
- **model** (1)
  - L83: model?: string;
- **year** (1)
  - L81: year?: number;
- **mileage** (1)
  - L85: mileage: number;
- **vin** (1)
  - L80: vin?: string;
- **storage** (4)
  - L1: import { createClient } from '@supabase/supabase-js';
  - L33: const supabaseUrl = 'https://xltxqqzattxogxtqrggt.supabase.co';
  - L36: const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  - L91: const { data, error } = await supabase.functions.invoke<NormalizedValuationResponse>('ain-valuation', {
- **valuation** (2)
  - L91: const { data, error } = await supabase.functions.invoke<NormalizedValuationResponse>('ain-valuation', {
  - L97: route: 'ain-valuation',

### /workspaces/car-detective-mvp/src/lib/constants.ts  (LOC 102)
exports: SHOW_ALL_COMPONENTS, US_STATES, VEHICLE_CONDITIONS, FUEL_TYPES, TRANSMISSION_TYPES, BODY_TYPES, DRIVETRAIN_TYPES
functions: SHOW_ALL_COMPONENTS, US_STATES, VEHICLE_CONDITIONS, FUEL_TYPES, TRANSMISSION_TYPES, BODY_TYPES, DRIVETRAIN_TYPES
- **env** (1)
  - L3: export const SHOW_ALL_COMPONENTS = import.meta.env.NODE_ENV === 'development' && false;

### /workspaces/car-detective-mvp/src/lib/initPlatform.ts  (LOC 121)
exports: initPlatform
functions: disablePuppeteerCompletely, preventionVars, preventionProps, puppeteerShim, originalRequire, initPlatform
- **url** (1)
  - L57: revisionInfo: () => ({ local: false, url: '', revision: '', folderPath: '' })
- **env** (2)
  - L10: if (typeof process !== 'undefined' && process.env) {
  - L24: process.env[varName] = varName.includes('PATH') ? '/bin/false' : 'true';

### /workspaces/car-detective-mvp/src/lib/logger.ts  (LOC 40)
exports: logger
functions: isDevelopment, logger
- **env** (3)
  - L8: const isDevelopment = (typeof import.meta !== 'undefined' && import.meta.env && typeof import.meta.env.DEV !== 'undefined')
  - L9: ? import.meta.env.DEV
  - L10: : (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development');

### /workspaces/car-detective-mvp/src/lib/monitoring.ts  (LOC 234)
exports: monitoring, useMonitoring, withErrorMonitoring
functions: startTime, result, duration, duration, navigation, metrics, paintEntries, monitoring, useMonitoring, MonitoredComponent, startTime, renderTime
- **env** (1)
  - L33: private isDevelopment = import.meta.env.NODE_ENV === 'development';

### /workspaces/car-detective-mvp/src/lib/notifications/DealerNotification.ts  (LOC 14)
functions: notifyDealersOfNewValuation
- **dealer** (1)
  - L9: // Mock dealer notification logic

### /workspaces/car-detective-mvp/src/lib/notifications/UserValuationAlert.ts  (LOC 72)
functions: notifyUserOfDealerOffer, notifyDealerOfAcceptedOffer
- **vin** (8)
  - L6: vin,
  - L11: vin: string;
  - L21: vin,
  - L25: message: `${dealerName} has submitted an offer of $${offerPrice.toLocaleString()} for your vehicle (VIN: ${vin}). Log in to review and potentially accept the offer.`
  - L42: vin,
- **dealer** (5)
  - L8: dealerName = 'A dealer'
  - L13: dealerName?: string;
  - L23: dealerName,
  - L24: subject: `🚘 New Dealer Offer for Your Vehicle`,
  - L25: message: `${dealerName} has submitted an offer of $${offerPrice.toLocaleString()} for your vehicle (VIN: ${vin}). Log in to review and potentially accept the offer.`
- **storage** (3)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L16: const { data, error } = await supabase.functions.invoke('trigger-email-campaign', {
  - L51: const { data, error } = await supabase.functions.invoke('trigger-email-campaign', {

### /workspaces/car-detective-mvp/src/lib/supabase/dealer.ts  (LOC 85)
exports: VerifiedDealer
functions: getVerifiedDealersInZip, dealerIds, dealerInfo, markDealerAsNotified
- **dealer** (1)
  - L22: .eq('role', 'dealer')
- **zip** (2)
  - L14: // Query profiles table for verified dealers in the given ZIP code
  - L56: coverage_zip_codes: [zipCode], // For now, we'll notify all dealers regardless of ZIP
- **storage** (5)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L15: const { data, error } = await supabase
  - L36: const { data: dealersData, error: dealersError } = await supabase
  - L73: const { error } = await supabase
  - L75: .insert({

### /workspaces/car-detective-mvp/src/lib/valuation/extractVehicleContext.ts  (LOC 131)
exports: extractVehicleContext, extractLocationContext
functions: extractVehicleContext, text, currentYear, yearRegex, yearMatches, validYears, makes, models, mileageRegex, mileageMatches, mileageText, numericPart, mileage, zipRegex, zipMatches, vinRegex, vinMatch, accidentTerms, conditionTerms, extractLocationContext, text, zipRegex, zipMatches, states
- **make** (7)
  - L18: for (const make of makes) {
  - L19: if (text.includes(make)) {
  - L20: context.make = make.charAt(0).toUpperCase() + make.slice(1);
  - L21: if (make === 'chevy') context.make = 'Chevrolet';
  - L22: if (make === 'vw') context.make = 'Volkswagen';
- **model** (3)
  - L36: for (const model of models) {
  - L37: if (text.includes(model)) {
  - L38: context.model = model.charAt(0).toUpperCase() + model.slice(1);
- **year** (1)
  - L14: if (validYears.length > 0) context.year = validYears[validYears.length - 1];
- **mileage** (3)
  - L50: let mileage = parseInt(numericPart);
  - L51: if (mileage < 1000 && /\bk\b/i.test(mileageText)) mileage *= 1000;
  - L52: context.mileage = mileage;
- **vin** (1)
  - L62: if (vinMatch) context.vin = vinMatch[0].toUpperCase();
- **zip** (1)
  - L99: // Extract ZIP code

### /workspaces/car-detective-mvp/src/modules/auth/MagicLinkPage.tsx  (LOC 161)
exports: MagicLinkPage
functions: formSchema, MagicLinkPage, navigate, form, onSubmit, handleGoBack
- **schema** (2)
  - L4: import { z } from "zod";
  - L6: import { zodResolver } from "@hookform/resolvers/zod";
- **storage** (2)
  - L26: import { supabase } from "@/integrations/supabase/client";
  - L48: const { error } = await supabase.auth.signInWithOtp({

### /workspaces/car-detective-mvp/src/modules/auth/ResetPasswordPage.tsx  (LOC 280)
exports: ResetPasswordPage
functions: formSchema, resetFormSchema, ResetPasswordPage, navigate, token, form, resetForm, onSubmit, onResetSubmit, handleGoBack
- **schema** (2)
  - L4: import { z } from "zod";
  - L6: import { zodResolver } from "@hookform/resolvers/zod";
- **storage** (3)
  - L26: import { supabase } from "@/integrations/supabase/client";
  - L85: const { error } = await supabase.auth.resetPasswordForEmail(
  - L109: const { error } = await supabase.auth.updateUser({

### /workspaces/car-detective-mvp/src/modules/qa-dashboard/components/ValuationRow.tsx  (LOC 157)
exports: ValuationRowProps, Valuation, ValuationRow
functions: getConditionLabel, ValuationRow, handleDelete
- **make** (2)
  - L47: make: string;
  - L85: {valuation.year} {valuation.make} {valuation.model}
- **model** (2)
  - L48: model: string;
  - L85: {valuation.year} {valuation.make} {valuation.model}
- **year** (2)
  - L49: year: number;
  - L85: {valuation.year} {valuation.make} {valuation.model}
- **mileage** (2)
  - L50: mileage: number;
  - L87: <td className="py-3 px-4">{valuation.mileage}</td>
- **vin** (2)
  - L46: vin: string;
  - L83: <td className="py-3 px-4">{valuation.vin}</td>
- **valuation** (20)
  - L33: valuation: Valuation;
  - L41: export interface Valuation {
  - L63: valuation,
  - L73: // Here you would typically call an API to delete the valuation
  - L81: {format(new Date(valuation.created_at), "MMM dd, yyyy HH:mm")}

### /workspaces/car-detective-mvp/src/modules/qa-dashboard/components/ValuationTable.tsx  (LOC 73)
exports: ValuationTable
functions: ValuationTable
- **valuation** (5)
  - L11: import { Valuation, ValuationRowProps } from "../types";
  - L14: valuations: Valuation[];
  - L58: {valuations.map((valuation) => (
  - L60: key={valuation.id}
  - L61: valuation={valuation}

### /workspaces/car-detective-mvp/src/modules/qa-dashboard/types.ts  (LOC 42)
exports: Valuation, ValuationRowProps, ValuationFilter, DateRangeOption
- **make** (1)
  - L7: make: string;
- **model** (1)
  - L8: model: string;
- **year** (1)
  - L9: year: number;
- **mileage** (1)
  - L10: mileage: number;
- **vin** (1)
  - L6: vin: string;
- **valuation** (2)
  - L1: export interface Valuation {
  - L23: valuation: Valuation;

### /workspaces/car-detective-mvp/src/modules/valuation-homepage/layout.tsx  (LOC 83)
exports: ValuationHomepageLayout
functions: navItems, footerSections
- **dealer** (1)
  - L38: { label: "Dealer Services", href: "/dealers" },
- **valuation** (4)
  - L18: { label: "Valuation", href: "/valuation/start" },
  - L36: { label: "Car Valuation", href: "/valuation" },
  - L57: <a href="/valuation/start">
  - L59: Get Valuation

### /workspaces/car-detective-mvp/src/modules/valuation-result/hooks/useValuationPdfHelper.ts  (LOC 41)
exports: UseValuationPdfHelperProps, useValuationPdfHelper
functions: useValuationPdfHelper, handleDownloadPdf
- **photos** (1)
  - L4: import { AICondition } from "@/types/photo";
- **valuation** (1)
  - L3: import { ValuationResult } from "@/components/valuation/valuation-core/ValuationResult";

### /workspaces/car-detective-mvp/src/modules/valuation-result/logic.ts  (LOC 163)
exports: ValuationData, PremiumCheckoutResult, formatCurrency, useValuationLogic
functions: formatCurrency, useValuationLogic, confidenceModifier, range, condition, text, score, color
- **make** (1)
  - L7: make: string;
- **model** (1)
  - L8: model: string;
- **year** (1)
  - L9: year: number;
- **price** (2)
  - L73: // Only calculate price range if confidence score is available from real data
  - L127: text = "Good time to buy at this price point";
- **mileage** (1)
  - L10: mileage: number;
- **url** (1)
  - L42: url?: string;
- **valuation** (1)
  - L52: // Hook for derived valuation logic

### /workspaces/car-detective-mvp/src/modules/valuation-result/sections/Breakdown.tsx  (LOC 125)
exports: Breakdown
functions: significantAdjustments, containerVariants, itemVariants
- **price** (2)
  - L47: Price Breakdown
  - L56: {/* Base Price */}
- **valuation** (1)
  - L106: <BodyM className="font-bold">Final Valuation</BodyM>

### /workspaces/car-detective-mvp/src/modules/valuation-result/sections/PhotoAnalysis.tsx  (LOC 61)
exports: PhotoAnalysis
- **photos** (2)
  - L25: AI Photo Analysis
  - L32: <span className="text-sm">Photo analysis completed</span>

### /workspaces/car-detective-mvp/src/modules/valuation-result/sections/Summary.tsx  (LOC 158)
exports: Summary
functions: getConfidenceColor, getConfidenceLevel, TrendIcon, getTrendText, getTrendColor
- **make** (1)
  - L127: <CDTooltip content="Current market direction for vehicles matching this make, model, and year">
- **model** (1)
  - L127: <CDTooltip content="Current market direction for vehicles matching this make, model, and year">
- **year** (1)
  - L127: <CDTooltip content="Current market direction for vehicles matching this make, model, and year">
- **price** (2)
  - L98: {/* Price Range */}
  - L106: <BodyS className="text-neutral-dark mr-1.5">Price Range</BodyS>
- **valuation** (1)
  - L74: <CDTooltip content="Our system's confidence in the accuracy of this valuation based on available data">

### /workspaces/car-detective-mvp/src/modules/valuation-result/types.ts  (LOC 100)
exports: ValuationContextProps, ValuationResultProps, HeaderProps, SummaryProps, PhotoAnalysisProps, BreakdownProps, ExplanationProps, PDFActionsProps, MobileLayoutProps
- **make** (2)
  - L32: make: string;
  - L42: make: string;
- **model** (2)
  - L33: model: string;
  - L43: model: string;
- **year** (2)
  - L31: year: number;
  - L44: year: number;
- **mileage** (2)
  - L35: mileage: number;
  - L45: mileage: number;
- **photos** (1)
  - L3: import { AICondition } from "@/types/photo";
- **valuation** (1)
  - L4: import { ValuationResult } from "@/components/valuation/valuation-core/ValuationResult";

### /workspaces/car-detective-mvp/src/pages/AboutPage.tsx  (LOC 23)
exports: AboutPage
functions: AboutPage
- **valuation** (1)
  - L14: Car Detective is an AI-powered vehicle valuation platform that provides accurate market insights for cars.

### /workspaces/car-detective-mvp/src/pages/AuthCallback.tsx  (LOC 47)
exports: AuthCallback
functions: AuthCallback, navigate, handleAuthCallback, redirectTo
- **url** (1)
  - L12: // Get the session from the URL hash
- **dedupe** (1)
  - L12: // Get the session from the URL hash
- **storage** (2)
  - L3: import { supabase } from '@/integrations/supabase/client';
  - L13: const { data, error } = await supabase.auth.getSession();

### /workspaces/car-detective-mvp/src/pages/AuthCallbackPage.tsx  (LOC 44)
exports: AuthCallbackPage
functions: AuthCallbackPage, navigate, handleAuthCallback
- **storage** (2)
  - L3: import { supabase } from "@/integrations/supabase/client";
  - L14: const { error } = await supabase.auth.getSession();

### /workspaces/car-detective-mvp/src/pages/AuthLandingPage.tsx  (LOC 245)
functions: AuthLandingPage, navigate, location, state, from
- **dealer** (7)
  - L139: {/* Dealer Card */}
  - L147: <CardTitle className="text-xl">Dealer</CardTitle>
  - L204: <span className="text-sm">Access dealer analytics</span>
  - L211: onClick={() => navigate("/login-dealer")}
  - L213: Sign In as Dealer
- **valuation** (4)
  - L43: Choose how you want to access our vehicle valuation platform
  - L98: <span className="text-sm">Save valuation history</span>
  - L115: Access premium valuation reports
  - L188: <span className="text-sm">Receive valuation leads</span>

### /workspaces/car-detective-mvp/src/pages/AuthPage.tsx  (LOC 274)
functions: navigate, location, from, handleLogin, handleRegister, handleGoogleSignIn
- **dealer** (1)
  - L259: Are you a dealer? <Link to="/dealer-signup" className="text-primary hover:underline">Register your dealership</Link>

### /workspaces/car-detective-mvp/src/pages/DashboardPage.tsx  (LOC 75)
functions: DashboardPage
- **valuation** (5)
  - L38: New Valuation
  - L43: Get an accurate valuation for your vehicle
  - L46: <Link to="/valuation">
  - L48: Start Valuation
  - L58: Valuation History

### /workspaces/car-detective-mvp/src/pages/DealerDashboard.tsx  (LOC 79)
functions: DealerDashboardContent, navigate, stats
- **price** (1)
  - L17: title: "Average Vehicle Price",
- **vin** (1)
  - L64: Run VIN, plate, or manual valuations and view saved reports.
- **dealer** (2)
  - L54: onClick={() => navigate("/dealer/inventory")}
  - L69: onClick={() => navigate("/dealer/tools")}
- **valuation** (1)
  - L62: <h3 className="text-lg font-semibold">Valuation Tools</h3>

### /workspaces/car-detective-mvp/src/pages/DealerInsightsPage.tsx  (LOC 107)
functions: DealerInsightsPage, mockTopPerformers, mockRecentActivity, mockZipCodes
- **dealer** (1)
  - L44: <CardTitle>Dealer Insights</CardTitle>
- **zip** (2)
  - L93: {mockZipCodes.map((zip: string, index: number) => (
  - L95: <div className="font-semibold">{zip}</div>
- **valuation** (2)
  - L5: import { DealerInsights } from '@/types/valuation';
  - L33: { action: 'Valuation', time: '2 hours ago' },

### /workspaces/car-detective-mvp/src/pages/DealerMessagesPage.tsx  (LOC 24)
- **dealer** (3)
  - L4: import { DealerMessagesLayout } from "@/components/dealer-messages/DealerMessagesLayout";
  - L5: import { LeadsProvider } from "@/components/dealer-messages/context/LeadsContext";
  - L11: document.title = "Dealer Inbox & Messages | Car Detective";

### /workspaces/car-detective-mvp/src/pages/DealerProfileSettings.tsx  (LOC 365)
functions: DealerProfileSettings
- **dealer** (3)
  - L27: Dealer Profile Settings
  - L229: <Label htmlFor="dealer-type">Dealer Type</Label>
  - L231: id="dealer-type"

### /workspaces/car-detective-mvp/src/pages/DealerSignup.tsx  (LOC 68)
exports: DealerSignup
functions: DealerSignup
- **dealer** (4)
  - L11: import { DealerSignupForm } from "@/components/dealer/DealerSignupForm";
  - L39: Register your dealership to access leads and exclusive dealer
  - L50: Already have a dealer account?
  - L53: <Link to="/login-dealer">Sign in to Dealer Portal</Link>
- **valuation** (1)
  - L56: Looking for personal vehicle valuation?{" "}

### /workspaces/car-detective-mvp/src/pages/DealerSubscriptionPage.tsx  (LOC 338)
functions: DealerSubscriptionPage, plans, invoices, statusColor
- **price** (5)
  - L31: price: 0,
  - L46: price: 49,
  - L61: price: 99,
  - L79: price: 249,
  - L274: <span className="text-3xl font-bold">${plan.price}</span>
- **dealer** (2)
  - L60: name: "Pro Dealer",
  - L140: <h3 className="text-xl font-bold">Pro Dealer</h3>
- **valuation** (3)
  - L35: "Basic valuation access",
  - L54: "Valuation reports PDF export",
  - L70: "White-labeled valuation reports",

### /workspaces/car-detective-mvp/src/pages/DebugMakesModels.tsx  (LOC 17)
exports: DebugMakesModels
functions: DebugMakesModels
- **storage** (1)
  - L11: Complete list of all vehicle makes and their associated models from Supabase

### /workspaces/car-detective-mvp/src/pages/EquipmentPage.tsx  (LOC 96)
functions: EquipmentPage
- **valuation** (2)
  - L11: accurate valuation. Certain features can significantly impact your
  - L89: Continue to Valuation

### /workspaces/car-detective-mvp/src/pages/EquipmentSelectionPage.tsx  (LOC 120)
exports: EquipmentSelectionPage
functions: EquipmentSelectionPage, navigate, fetchEquipmentOptions, handleSaveEquipment, selectedOptions, combinedMultiplier, totalValueAdd, equipmentNames
- **storage** (2)
  - L9: import { supabase } from "@/integrations/supabase/client";
  - L29: const { data, error } = await supabase
- **valuation** (5)
  - L4: import { EquipmentSelector } from "@/components/valuation/equipment/EquipmentSelector";
  - L60: // Store equipment info in local storage for the valuation process
  - L65: // Add equipment names for better context in the valuation
  - L86: Back to Premium Valuation
  - L95: more accurate valuation.

### /workspaces/car-detective-mvp/src/pages/GetValuationPage.tsx  (LOC 56)
exports: GetValuationPage
functions: GetValuationPage, navigate
- **vin** (1)
  - L30: Get an instant, basic vehicle valuation at no cost. Enter your VIN or license plate below.
- **dealer** (1)
  - L44: Want more detailed insights including CARFAX® history and dealer offers?
- **valuation** (3)
  - L27: Free Vehicle Valuation
  - L30: Get an instant, basic vehicle valuation at no cost. Enter your VIN or license plate below.
  - L50: Upgrade to Premium Valuation - $29.99

### /workspaces/car-detective-mvp/src/pages/HomePage.tsx  (LOC 72)
exports: HomePage
functions: HomePage
- **vin** (1)
  - L42: Professional-grade valuation in seconds. Enter your VIN or license plate to get started.
- **valuation** (4)
  - L21: {/* Main Feature: Valuation Tool - FANG Level */}
  - L22: <section className="relative py-32 px-4 overflow-hidden" data-section="valuation">
  - L31: AI-Powered Valuation Engine
  - L42: Professional-grade valuation in seconds. Enter your VIN or license plate to get started.

### /workspaces/car-detective-mvp/src/pages/ModalShowcase.tsx  (LOC 197)
exports: ModalShowcase
functions: ModalShowcase, mockVehicleInfo
- **make** (1)
  - L16: make: 'Nissan',
- **model** (1)
  - L17: model: 'Altima',
- **year** (1)
  - L15: year: '2023',
- **photos** (5)
  - L19: image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop'
  - L36: {/* Photo Tool Modal Demo */}
  - L42: <CardTitle>Photo Tool Modal</CardTitle>
  - L46: Professional step-by-step photo capture workflow with multiple options
  - L53: View Photo Modal
- **valuation** (2)
  - L80: {/* Valuation Steps Modal Demo */}
  - L86: <CardTitle>Valuation Steps Modal</CardTitle>

### /workspaces/car-detective-mvp/src/pages/MyValuationsPage.tsx  (LOC 125)
functions: fetchSavedValuations
- **make** (1)
  - L81: {valuation.year} {valuation.make} {valuation.model}
- **model** (1)
  - L81: {valuation.year} {valuation.make} {valuation.model}
- **year** (1)
  - L81: {valuation.year} {valuation.make} {valuation.model}
- **storage** (2)
  - L6: import { supabase } from "@/integrations/supabase/client";
  - L21: const { data, error } = await supabase
- **valuation** (9)
  - L66: <Link to="/valuation">Create Your First Valuation</Link>
  - L73: {valuations.map((valuation) => (
  - L75: key={valuation.id}
  - L81: {valuation.year} {valuation.make} {valuation.model}
  - L84: {formatCurrency(valuation.valuation || 0)}

### /workspaces/car-detective-mvp/src/pages/NicbVinCheckPage.tsx  (LOC 63)
- **vin** (5)
  - L15: <h1 className="text-2xl font-bold mb-2">NICB VIN Check</h1>
  - L24: Enter a VIN to check the National Insurance Crime Bureau (NICB)
  - L34: <h2 className="text-xl font-semibold mb-4">About NICB VIN Check</h2>
  - L37: The NICB VIN Check is a free service provided by the National
  - L52: While the NICB VIN Check is a valuable resource, it should not be
- **valuation** (1)
  - L10: import { NicbVinCheck } from "@/components/valuation/NicbVinCheck";

### /workspaces/car-detective-mvp/src/pages/OffersPage.tsx  (LOC 53)
exports: OffersPage
functions: OffersPage, handleCalculateValuation
- **make** (1)
  - L16: make: 'Toyota',
- **model** (1)
  - L17: model: 'Camry',
- **year** (1)
  - L18: year: 2020,
- **mileage** (1)
  - L19: mileage: 50000
- **dealer** (2)
  - L28: <h1 className="text-3xl font-bold mb-8">Dealer Offers</h1>
  - L42: <p>Calculate your vehicle valuation to receive dealer offers.</p>
- **valuation** (2)
  - L42: <p>Calculate your vehicle valuation to receive dealer offers.</p>
  - L44: {isLoading ? 'Calculating...' : 'Get Valuation'}

### /workspaces/car-detective-mvp/src/pages/PhotoAnalysisPage.tsx  (LOC 20)
functions: PhotoAnalysisPage
- **photos** (2)
  - L10: <CardTitle>Photo Analysis</CardTitle>
  - L13: <p>Photo analysis features coming soon...</p>

### /workspaces/car-detective-mvp/src/pages/PlatformDiagnosticsPage.tsx  (LOC 158)
exports: PlatformDiagnosticsPage
functions: PlatformDiagnosticsPage, checkFont, testElement, computedStyle, isInterLoaded, checkSupabase, supabaseUrl, projectRef, checkSentry, trackErrors, originalConsoleError, errorMsg, cleanup
- **storage** (5)
  - L6: import { supabase } from '@/integrations/supabase/client';
  - L33: // Check Supabase project
  - L36: const { data } = await supabase.from('_diagnose').select('project_id').limit(1).single();
  - L107: <CardTitle>Supabase Client</CardTitle>
  - L112: <p>Supabase client: {supabaseProject}</p>

### /workspaces/car-detective-mvp/src/pages/Premium.tsx  (LOC 26)
exports: Premium
functions: Premium
- **valuation** (1)
  - L14: <p>Unlock advanced vehicle valuation features with our premium plan.</p>

### /workspaces/car-detective-mvp/src/pages/PremiumConditionPage.tsx  (LOC 53)
functions: PremiumConditionPage
- **valuation** (2)
  - L13: vehicle's condition, which is a critical factor in its valuation.
  - L46: Continue to Premium Valuation

### /workspaces/car-detective-mvp/src/pages/PremiumPage.tsx  (LOC 367)
functions: PremiumPage, navigate
- **price** (2)
  - L147: desc: 'Compare offers from multiple dealers to get the best price for your vehicle.',
  - L270: 'Advanced market price adjustments',
- **vin** (1)
  - L86: Enter your VIN or license plate to begin your comprehensive vehicle analysis.
- **photos** (3)
  - L214: 'Single-photo AI demo',
  - L224: 'Multi-photo AI analysis',
  - L269: 'Multi-photo AI condition analysis',
- **dealer** (3)
  - L146: title: 'Dealer Network Offers',
  - L225: 'Dealer network offers'
  - L273: 'Real-time dealer network offers',
- **valuation** (9)
  - L35: PREMIUM VALUATION
  - L44: Professional valuation report with CARFAX, market analysis, and predicted future values that could help you earn hundreds more.
  - L54: Get Premium Valuation - $29.99
  - L61: onClick={() => navigate('/get-valuation')}
  - L83: Start Your Premium Valuation

### /workspaces/car-detective-mvp/src/pages/PremiumValuationPage.tsx  (LOC 18)
exports: PremiumValuationPage
functions: PremiumValuationPage
- **valuation** (2)
  - L10: Premium Valuation
  - L13: Get an enhanced valuation with detailed market analysis and insights.

### /workspaces/car-detective-mvp/src/pages/PricingPage.tsx  (LOC 189)
exports: PricingPage
functions: PricingPage, valuationId, returnUrl, handlePurchase
- **dealer** (3)
  - L178: <h2 className="text-2xl font-bold mb-4">Dealer Plans Available</h2>
  - L182: <Button variant="outline" size="lg" onClick={() => window.location.href = '/dealer/subscription'}>
  - L183: View Dealer Plans
- **valuation** (4)
  - L54: <CardDescription>Perfect for one-time valuation needs</CardDescription>
  - L60: <span>Full valuation report</span>
  - L106: <span>3 premium valuation reports</span>
  - L148: <span>5 premium valuation reports</span>

### /workspaces/car-detective-mvp/src/pages/Privacy.tsx  (LOC 49)
functions: Privacy
- **make** (1)
  - L16: to make, model, year, VIN, condition, and mileage. We may also collect
- **model** (1)
  - L16: to make, model, year, VIN, condition, and mileage. We may also collect
- **year** (1)
  - L16: to make, model, year, VIN, condition, and mileage. We may also collect
- **mileage** (1)
  - L16: to make, model, year, VIN, condition, and mileage. We may also collect
- **vin** (1)
  - L16: to make, model, year, VIN, condition, and mileage. We may also collect
- **dealer** (2)
  - L35: in to dealer offers, your vehicle information (but not personal
  - L36: details) may be shared with our dealer network.
- **zip** (1)
  - L17: personal information such as your name, email address, and ZIP code to

### /workspaces/car-detective-mvp/src/pages/PrivacyPolicyPage.tsx  (LOC 107)
exports: PrivacyPolicyPage
functions: PrivacyPolicyPage
- **make** (1)
  - L23: Vehicle information (VIN, license plate, make, model, year)
- **model** (1)
  - L23: Vehicle information (VIN, license plate, make, model, year)
- **year** (1)
  - L23: Vehicle information (VIN, license plate, make, model, year)
- **vin** (1)
  - L23: Vehicle information (VIN, license plate, make, model, year)
- **storage** (1)
  - L46: <li>Supabase (authentication and database)</li>
- **valuation** (1)
  - L33: <li>To provide vehicle valuation services</li>

### /workspaces/car-detective-mvp/src/pages/ProfessionalHomePage.tsx  (LOC 557)
exports: ProfessionalHomePage
functions: ProfessionalHomePage, navigate
- **model** (1)
  - L520: Access our machine learning model directly through our developer-friendly API.
- **price** (6)
  - L37: Car Price
  - L107: Car Price Perfector provided an accurate valuation that exceeded my expectations.
  - L218: desc: 'Compare offers from multiple dealers to get the best price for your vehicle.',
  - L292: ['ML Price Predictions', 'basic', 'hidden', true, true, true, 'LightGBM Accurate'],
  - L405: <span className="text-sm text-green-800">Market price comparison</span>
- **vin** (2)
  - L78: Enter your VIN or license plate to get an instant vehicle valuation.
  - L289: ['VIN Lookup', true, true, true, true, true, 'Lightning Fast'],
- **photos** (4)
  - L291: ['AI Photo Analysis', false, false, false, false, false, 'Roboflow-powered'],
  - L353: Unlock the true value of your car with CARFAX®, AI photo scoring & real-time market offers.
  - L359: <span className="text-sm text-blue-800">AI photo condition analysis</span>
  - L447: <span className="text-sm text-orange-800">AI photo scoring at intake</span>
- **dealer** (5)
  - L217: title: 'Dealer Network Offers',
  - L294: ['Real-Time Dealer Offers', false, false, true, true, false, 'Integrated quotes'],
  - L367: <span className="text-sm text-blue-800">Compare dealer offers instantly</span>
  - L464: Explore Dealer Tools
  - L551: Premium includes full CARFAX report ($44 value), market analysis, and dealer offers
- **valuation** (20)
  - L53: Get Premium Valuation
  - L60: onClick={() => navigate('/get-valuation')}
  - L63: Basic Valuation (FREE)
  - L75: Start Your Free Valuation
  - L78: Enter your VIN or license plate to get an instant vehicle valuation.

### /workspaces/car-detective-mvp/src/pages/ResetPasswordPage.tsx  (LOC 128)
functions: navigate, accessToken, refreshToken, handlePasswordReset
- **url** (1)
  - L25: // Set the session with the tokens from URL
- **storage** (3)
  - L9: import { supabase } from "@/integrations/supabase/client";
  - L26: supabase.auth.setSession({
  - L49: const { error } = await supabase.auth.updateUser({

### /workspaces/car-detective-mvp/src/pages/Terms.tsx  (LOC 50)
functions: Terms
- **make** (1)
  - L41: We provide our service on an "as is" basis and make no warranties
- **valuation** (2)
  - L15: By accessing or using our vehicle valuation services, you agree to be
  - L23: Our service provides vehicle valuation estimates based on the

### /workspaces/car-detective-mvp/src/pages/TermsOfServicePage.tsx  (LOC 56)
- **make** (1)
  - L23: make no warranties, expressed or implied, and hereby disclaims and

### /workspaces/car-detective-mvp/src/pages/ValuationFollowUpPage.tsx  (LOC 237)
exports: ValuationFollowUpPage
functions: ValuationFollowUpPage, navigate, vehicleData, handleBackToSelection, handleSubmitAnswers, userId, valuationInput, errorMessage
- **make** (4)
  - L22: make: searchParams.get('make') || '',
  - L46: make: vehicleData.make,
  - L91: make: vehicleData.make || 'Unknown',
  - L127: if (!vehicleData.make || !vehicleData.model || !vehicleData.year) {
- **model** (4)
  - L23: model: searchParams.get('model') || '',
  - L47: model: vehicleData.model,
  - L92: model: vehicleData.model || 'Unknown',
  - L127: if (!vehicleData.make || !vehicleData.model || !vehicleData.year) {
- **year** (4)
  - L21: year: parseInt(searchParams.get('year') || ''),
  - L45: year: vehicleData.year,
  - L93: year: vehicleData.year || 2020,
  - L127: if (!vehicleData.make || !vehicleData.model || !vehicleData.year) {
- **mileage** (3)
  - L78: if (!followUpData || !followUpData.mileage || !followUpData.zip_code) {
  - L80: hasMileage: !!followUpData?.mileage,
  - L95: mileage: followUpData.mileage,
- **vin** (20)
  - L25: vin: searchParams.get('vin') || '',
  - L33: source: searchParams.get('source') as 'vin' | 'plate' | 'manual' || 'vin'
  - L43: valuationLogger.followUp(vehicleData.vin, 'submit-start', {
  - L52: // FIX #1: Validate VIN first
  - L53: if (!vehicleData.vin || vehicleData.vin.length !== 17) {
- **url** (1)
  - L19: // Extract vehicle data from URL params
- **storage** (2)
  - L11: import { supabase } from '@/integrations/supabase/client';
  - L63: const { data: { user }, error: authError } = await supabase.auth.getUser();
- **valuation** (11)
  - L5: import { CarFinderQaherCard } from '@/components/valuation/CarFinderQaherCard';
  - L40: // Load actual follow-up data and create valuation
  - L88: // FIX #5: Use real follow-up data for valuation with robust fallbacks
  - L101: valuationLogger.followUp(vehicleData.vin, 'valuation-start', {
  - L108: valuationLogger.followUp(vehicleData.vin, 'valuation-success', {

### /workspaces/car-detective-mvp/src/pages/ValuationPage.tsx  (LOC 26)
exports: ValuationPage
functions: ValuationPage
- **vin** (1)
  - L14: Enter your VIN or license plate to get an instant, accurate vehicle valuation.
- **valuation** (2)
  - L11: Get Your Vehicle Valuation
  - L14: Enter your VIN or license plate to get an instant, accurate vehicle valuation.

### /workspaces/car-detective-mvp/src/pages/VehicleHistoryPage.tsx  (LOC 26)
exports: VehicleHistoryPage
functions: VehicleHistoryPage
- **valuation** (1)
  - L17: improve valuation accuracy.

### /workspaces/car-detective-mvp/src/pages/admin/AuditPage.tsx  (LOC 24)
exports: AuditPage
functions: AuditPage
- **valuation** (1)
  - L10: Comprehensive validation of market data and valuation systems

### /workspaces/car-detective-mvp/src/pages/admin/ValuationInsights.tsx  (LOC 421)
exports: ValuationInsights
functions: ValuationInsights, loadDashboardData, loadFuelHeatmap, loadMarketListingStats, groupedData, key, stats, loadAuditFailures, dailyStats, date, failures, loadTrustTrends, mockTrends, refreshData, COLORS
- **make** (11)
  - L23: make: string;
  - L90: .select('make, model, price')
  - L91: .not('make', 'is', null)
  - L98: // Group by make/model and calculate stats
  - L100: const key = `${listing.make} ${listing.model}`;
- **model** (10)
  - L24: model: string;
  - L90: .select('make, model, price')
  - L92: .not('model', 'is', null)
  - L98: // Group by make/model and calculate stats
  - L100: const key = `${listing.make} ${listing.model}`;
- **price** (8)
  - L90: .select('make, model, price')
  - L93: .not('price', 'is', null)
  - L109: acc[key].prices.push(listing.price);
  - L228: Fuel Price Heatmap - Top 10 ZIP Codes by Cost
  - L239: <Tooltip formatter={(value) => [`$${value}`, 'Price per Gallon']} />
- **zip** (1)
  - L228: Fuel Price Heatmap - Top 10 ZIP Codes by Cost
- **storage** (4)
  - L11: import { supabase } from '@/integrations/supabase/client';
  - L75: const { data, error } = await supabase
  - L88: const { data, error } = await supabase
  - L131: const { data: requests, error: requestError } = await supabase
- **valuation** (3)
  - L130: // Query valuation requests vs audit logs to find failures
  - L164: // Mock trust trends - would come from processed valuation data
  - L187: <h1 className="text-3xl font-bold">Valuation Insights Dashboard</h1>

### /workspaces/car-detective-mvp/src/pages/api/ask-ai.ts  (LOC 168)
functions: RATE_LIMIT_WINDOW, MAX_REQUESTS_PER_WINDOW, handler, clientIp, now, messages, apiKey, response, error, responseData, answer
- **make** (3)
  - L85: Use the user's context (make, model, year, mileage, condition, ZIP, premium status, dealer role) to give smart, helpful answers. Always respond in a confident, conversational tone.
  - L89: Your goal: help individuals sell smarter and help dealers make profitable decisions with speed and trust.
  - L125: // Make request to OpenAI API
- **model** (2)
  - L85: Use the user's context (make, model, year, mileage, condition, ZIP, premium status, dealer role) to give smart, helpful answers. Always respond in a confident, conversational tone.
  - L133: model: "gpt-4o-mini",
- **year** (1)
  - L85: Use the user's context (make, model, year, mileage, condition, ZIP, premium status, dealer role) to give smart, helpful answers. Always respond in a confident, conversational tone.
- **mileage** (1)
  - L85: Use the user's context (make, model, year, mileage, condition, ZIP, premium status, dealer role) to give smart, helpful answers. Always respond in a confident, conversational tone.
- **dealer** (2)
  - L83: `You are AIN — Auto Intelligence Network™, a GPT-4-powered vehicle valuation assistant built by Car Detective. Your job is to assist users with car valuations, market trends, premium report benefits, dealer offers, and CARFAX® insights.
  - L85: Use the user's context (make, model, year, mileage, condition, ZIP, premium status, dealer role) to give smart, helpful answers. Always respond in a confident, conversational tone.
- **zip** (1)
  - L85: Use the user's context (make, model, year, mileage, condition, ZIP, premium status, dealer role) to give smart, helpful answers. Always respond in a confident, conversational tone.
- **fetch** (2)
  - L43: error: "Too many requests. Please try again later.",
  - L126: const response = await fetch("https://api.openai.com/v1/chat/completions", {
- **retry** (2)
  - L39: // Check if rate limit exceeded
  - L46: status: 429,
- **openai** (6)
  - L78: // Prepare messages array for OpenAI
  - L83: `You are AIN — Auto Intelligence Network™, a GPT-4-powered vehicle valuation assistant built by Car Detective. Your job is to assist users with car valuations, market trends, premium report benefits, dealer offers, and CARFAX® insights.
  - L113: // Check for OpenAI API key
  - L125: // Make request to OpenAI API
  - L126: const response = await fetch("https://api.openai.com/v1/chat/completions", {
- **valuation** (2)
  - L83: `You are AIN — Auto Intelligence Network™, a GPT-4-powered vehicle valuation assistant built by Car Detective. Your job is to assist users with car valuations, market trends, premium report benefits, dealer offers, and CARFAX® insights.
  - L87: Never guess. If info is missing (e.g., no valuation), ask for it clearly.
- **env** (1)
  - L114: const apiKey = import.meta.env.OPENAI_API_KEY;

### /workspaces/car-detective-mvp/src/pages/api/valuation/submit-followup.ts  (LOC 50)
functions: submitFollowUp
- **mileage** (1)
  - L18: mileage: followUpData.mileage,
- **vin** (3)
  - L8: if (!followUpData.vin) {
  - L9: throw new Error('VIN is required');
  - L16: vin: followUpData.vin,
- **storage** (5)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L13: const { data: valuation, error: valuationError } = await supabase
  - L15: .insert({
  - L34: const { error: followUpError } = await supabase
  - L36: .insert({
- **valuation** (5)
  - L12: // Create a valuation record first
  - L13: const { data: valuation, error: valuationError } = await supabase
  - L30: throw new Error('Failed to create valuation');
  - L38: valuation_id: valuation.id,
  - L46: return { success: true, id: valuation.id };

### /workspaces/car-detective-mvp/src/pages/valuation/ValuationPage.tsx  (LOC 95)
exports: ValuationPage
functions: ValuationPage
- **price** (1)
  - L37: SECOND: Validate that the valuation engine correctly uses real listings for price anchoring and confidence scoring.
- **vin** (1)
  - L14: const { vin } = useParams<{ vin?: string }>();
- **openai** (3)
  - L19: {/* OpenAI Market Search Validation Test */}
  - L22: <CardTitle className="text-blue-700">🔍 OpenAI Market Search Validation (Prompt 2.2)</CardTitle>
  - L24: FIRST: Validate OpenAI-powered live web search for vehicle listings.
- **valuation** (7)
  - L37: SECOND: Validate that the valuation engine correctly uses real listings for price anchoring and confidence scoring.
  - L50: THIRD: Validate that ResultsPage correctly renders valuation results, market listings, confidence scores, and PDF/share functionality.
  - L74: <CardTitle className="text-orange-700">🚧 Complete Valuation Test</CardTitle>
  - L76: SIXTH: If all validations pass, test the complete valuation engine.
  - L80: <p className="text-center text-muted-foreground">Valuation engine test component removed - now using AIN API only</p>

### /workspaces/car-detective-mvp/src/pages/valuation/plate/PlateValuationPage.tsx  (LOC 127)
exports: PlateValuationPage
functions: PlateValuationPage, handleVehicleFound, handleFollowUpSubmit, element
- **make** (1)
  - L25: make: data.make,
- **model** (1)
  - L26: model: data.model,
- **year** (1)
  - L24: year: data.year,
- **mileage** (1)
  - L38: mileage: data.mileage || 0,
- **vin** (3)
  - L23: vin: data.vin || `PLATE_${data.plate}_${data.state}`,
  - L51: window.location.href = `/results/${followUpAnswers.vin}`;
  - L73: label: 'Try VIN Lookup',
- **valuation** (4)
  - L49: toast.success('Plate valuation completed successfully!');
  - L62: subtitle="Identification & Valuation"
  - L63: description="Enter any license plate to instantly decode vehicle details and get comprehensive valuation insights powered by advanced recognition technology."
  - L86: Enter your license plate and state to get detailed vehicle information and valuation.

### /workspaces/car-detective-mvp/src/pages/view-offer/ViewOfferPage.tsx  (LOC 282)
exports: ViewOfferPage
functions: ViewOfferPage, fetchOfferByToken, handleAcceptOffer, isAccepted
- **make** (3)
  - L26: make: string;
  - L60: make,
  - L209: {offer.valuation?.year} {offer.valuation?.make} {offer.valuation?.model}
- **model** (3)
  - L27: model: string;
  - L61: model,
  - L209: {offer.valuation?.year} {offer.valuation?.make} {offer.valuation?.model}
- **year** (3)
  - L25: year: number;
  - L59: year,
  - L209: {offer.valuation?.year} {offer.valuation?.make} {offer.valuation?.model}
- **vin** (4)
  - L28: vin: string;
  - L62: vin,
  - L213: <span className="text-muted-foreground">VIN:</span>
  - L214: <p className="font-mono text-xs">{offer.valuation?.vin}</p>
- **dealer** (10)
  - L18: dealer?: {
  - L52: // First, get the dealer lead by secure token
  - L74: // Then get the dealer offer for this valuation
  - L186: This offer has been accepted! The dealer will contact you soon.
  - L195: Dealer Offer
- **storage** (6)
  - L8: import { supabase } from '@/integrations/supabase/client';
  - L53: const { data: leadData, error: leadError } = await supabase
  - L75: const { data: offerData, error: offerError } = await supabase
  - L115: const { error: acceptError } = await supabase
  - L117: .insert({
- **valuation** (8)
  - L23: valuation?: {
  - L74: // Then get the dealer offer for this valuation
  - L97: valuation: leadData.valuations
  - L118: valuation_id: offer.valuation?.id,
  - L121: user_id: offer.valuation?.user_id,

### /workspaces/car-detective-mvp/src/schemas/ainResponseSchema.ts  (LOC 55)
exports: AINResponseSchema, AINResponse, validateAINResponse, safeValidateAINResponse
functions: AINResponseSchema, validateAINResponse, errorMessages, safeValidateAINResponse, validatedData
- **price** (1)
  - L9: priceRange: z.array(z.number()).length(2, "Price range must have exactly 2 values"),
- **schema** (2)
  - L1: import { z } from "zod";
  - L4: * Schema validation for AIN API upstream responses

### /workspaces/car-detective-mvp/src/scrapers/index.ts  (LOC 15)
exports: ScraperResult, availableScrapers
functions: availableScrapers
- **year** (1)
  - L11: year?: number;
- **price** (1)
  - L6: price: number;
- **mileage** (1)
  - L10: mileage?: number;
- **url** (1)
  - L7: url: string;

### /workspaces/car-detective-mvp/src/scrapers/types.ts  (LOC 36)
exports: MarketplaceListing, ScraperConfig, ScraperResult
- **make** (2)
  - L8: make?: string;
  - L31: make?: string;
- **model** (2)
  - L9: model?: string;
  - L32: model?: string;
- **year** (2)
  - L7: year?: number;
  - L33: year?: number;
- **price** (1)
  - L5: price: number;
- **mileage** (1)
  - L6: mileage?: number;
- **dealer** (1)
  - L16: sellerType?: 'dealer' | 'private' | 'unknown';
- **url** (1)
  - L11: url: string;
- **retry** (1)
  - L21: timeout: number;

### /workspaces/car-detective-mvp/src/scraping/brightdata/getStatVinData.ts  (LOC 87)
exports: StatVinData
functions: getStatVinData
- **make** (2)
  - L12: make?: string;
  - L59: make: data.make,
- **model** (2)
  - L13: model?: string;
  - L60: model: data.model,
- **year** (2)
  - L14: year?: string;
  - L61: year: data.year,
- **mileage** (2)
  - L15: mileage?: string;
  - L62: mileage: data.mileage || data.odometer,
- **vin** (5)
  - L5: vin: string;
  - L36: export async function getStatVinData(vin: string): Promise<StatVinData | null> {
  - L38: // Call the Supabase Edge Function for STAT.vin data
  - L40: body: { vin: vin.toUpperCase() }
  - L52: vin: data.vin || vin,
- **photos** (1)
  - L58: images: data.images || data.photos || [],
- **storage** (3)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L38: // Call the Supabase Edge Function for STAT.vin data
  - L39: const { data, error } = await supabase.functions.invoke('fetch-statvin-data', {

### /workspaces/car-detective-mvp/src/scripts/cleanPuppeteer.js  (LOC 53)
functions: fs, path, dirs, puppeteerRcContent
- **env** (3)
  - L13: process.env.PUPPETEER_SKIP_DOWNLOAD = 'true';
  - L14: process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';
  - L15: process.env.SKIP_PUPPETEER_DOWNLOAD = 'true';

### /workspaces/car-detective-mvp/src/scripts/generate-test-data.ts  (LOC 53)
functions: argv, generateTestData, supabaseUrl, supabaseServiceKey, supabase
- **storage** (4)
  - L1: import { createClient } from "@supabase/supabase-js";
  - L29: // Create a Supabase client with the service role key for admin operations
  - L37: const supabase = createClient(supabaseUrl, supabaseServiceKey);
  - L40: const { data, error } = await supabase
- **env** (2)
  - L30: const supabaseUrl = import.meta.env.SUPABASE_URL;
  - L31: const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

### /workspaces/car-detective-mvp/src/scripts/populateMsrpFromWeb.ts  (LOC 52)
functions: extractPrice, pricePatterns, matches, numStr, price, populateMsrpsFromWebSearch
- **year** (1)
  - L8: year: number;
- **price** (4)
  - L24: /price.*?\$(\d{1,3}(?:,\d{3})*)/gi,
  - L33: const price = parseInt(numStr, 10);
  - L36: if (price >= 15000 && price <= 300000) {
  - L37: return price;
- **openai** (1)
  - L3: import { openai } from '@/integrations/openai/client';
- **storage** (1)
  - L2: import { supabase } from '@/integrations/supabase/client';

### /workspaces/car-detective-mvp/src/services/UnifiedLookupService.ts  (LOC 343)
exports: UnifiedVehicleLookupResult, LookupOptions, UnifiedLookupService
functions: lookupByVin, response, smartFallbackVehicle, decodedData, smartFallbackVehicle, smartFallbackVehicle, lookupByPlate, cleanVin, currentYear, yearChar, year, wmi, vds, make, model, bodyType, engine, displacement, drivetrain, trim, fuelType, modelChar, subModelChar, lookupByVin, lookupByPlate
- **make** (12)
  - L64: make: decodedData.make,
  - L131: make: 'Honda',
  - L186: let make = "Unknown";
  - L198: make = "Toyota";
  - L269: make = "Chevrolet";
- **model** (21)
  - L65: model: decodedData.model,
  - L132: model: 'Accord',
  - L187: let model = "Vehicle";
  - L195: // Comprehensive Toyota patterns with enhanced model detection
  - L205: model = "RAV4";
- **year** (7)
  - L63: year: decodedData.year,
  - L130: year: 2020,
  - L177: let year = currentYear - 5;
  - L179: year = 2001 + parseInt(yearChar);
  - L181: year = 2010 + (yearChar.charCodeAt(0) - 65);
- **mileage** (2)
  - L144: mileage: Math.floor(Math.random() * 60000) + 30000,
  - L315: mileage: Math.floor(Math.random() * 100000) + 30000,
- **vin** (28)
  - L8: source: 'vin' | 'plate' | 'manual' | 'vpic' | 'carfax' | 'cache' | 'fallback' | 'failed';
  - L28: static async lookupByVin(vin: string, options: LookupOptions): Promise<UnifiedVehicleLookupResult> {
  - L30: if (!this.validateVin(vin)) {
  - L35: error: 'Invalid VIN format. VIN must be 17 characters (letters and numbers only, no I, O, Q)'
  - L40: body: { vin: vin.toUpperCase() }
- **storage** (2)
  - L3: import { supabase } from '@/integrations/supabase/client';
  - L39: const response = await supabase.functions.invoke('unified-decode', {

### /workspaces/car-detective-mvp/src/services/ValuationApiService.ts  (LOC 292)
exports: ValuationRequest, SourceStatus, ValuationApiService
functions: createValuationRequest, triggerAggregation, getValuationResult, getSourcesStatus, pollValuationProgress, attempts, poll, result, vinPattern, getCachedValuation
- **make** (2)
  - L7: make: string;
  - L226: make: listing.make,
- **model** (2)
  - L8: model: string;
  - L227: model: listing.model,
- **year** (2)
  - L10: year: number;
  - L225: year: listing.year,
- **price** (1)
  - L224: price: listing.price,
- **mileage** (2)
  - L11: mileage?: number;
  - L230: mileage: listing.mileage,
- **vin** (9)
  - L6: vin?: string;
  - L229: vin: listing.vin,
  - L258: * Validate VIN format
  - L260: static isValidVin(vin: string): boolean {
  - L261: // Basic VIN validation (17 characters, alphanumeric except I, O, Q)
- **openai** (1)
  - L70: * Triggers comprehensive market data aggregation using OpenAI web search
- **storage** (6)
  - L1: import { supabase } from '@/integrations/supabase/client';
  - L47: const { data, error } = await supabase.functions.invoke('valuation-request', {
  - L82: const { data: requestData } = await supabase
  - L115: const { data, error } = await supabase.functions.invoke('valuation-result', {
  - L164: const { data, error } = await supabase.functions.invoke('valuation-sources');
- **valuation** (17)
  - L2: import type { ValuationResult, AuditLog } from '@/components/valuation/valuation-core/ValuationResult';
  - L32: * Comprehensive Valuation API Service
  - L38: * POST /api/valuation/request
  - L39: * Creates a new valuation request and returns request_id
  - L47: const { data, error } = await supabase.functions.invoke('valuation-request', {

### /workspaces/car-detective-mvp/src/services/ValuationIntegrationService.ts  (LOC 422)
exports: EnrichmentData, ValuationPipelineResult, ValuationIntegrationService
functions: processVinToValuation, startTime, lookupResult, decodedVehicle, createResult, requestId, aggregationResult, valuationResult, getVinEnrichmentData, storeVinEnrichmentData, getCachedValuationByVin, cutoffTime, logComplianceAudit, cleanVin
- **make** (1)
  - L146: make: decodedVehicle.make,
- **model** (1)
  - L147: model: decodedVehicle.model,
- **year** (1)
  - L148: year: decodedVehicle.year,
- **mileage** (1)
  - L150: mileage: additionalData?.mileage || decodedVehicle.mileage,
- **vin** (42)
  - L7: vin: string;
  - L33: * Comprehensive service for integrating VIN decode → enrichment → valuation pipeline
  - L39: * Main entry point: Complete VIN to valuation pipeline
  - L42: vin: string,
  - L50: // Stage 1: VIN Decode
- **storage** (9)
  - L1: import { supabase } from '@/integrations/supabase/client';
  - L93: const { data: existingEnrichment } = await supabase
  - L119: await supabase.functions.invoke('data-quality-orchestrator', {
  - L287: const { data, error } = await supabase
  - L322: const { error } = await supabase
- **valuation** (16)
  - L3: import { ValuationApiService, ValuationRequest, ValuationResult } from '@/components/valuation/valuation-core/ValuationResult';
  - L33: * Comprehensive service for integrating VIN decode → enrichment → valuation pipeline
  - L34: * This is the single source of truth for the end-to-end valuation flow
  - L39: * Main entry point: Complete VIN to valuation pipeline
  - L143: // Stage 3: Create Valuation Request using decoded data

### /workspaces/car-detective-mvp/src/services/VinLookupService.ts  (LOC 41)
exports: VinLookupService, VinServiceResponse, vinService, decodeVin
functions: result, vinService, decodeVin, result, decodeVin
- **vin** (6)
  - L7: static lookupVin = async (vin: string): Promise<any> => {
  - L8: const result = await UnifiedLookupService.lookupByVin(vin, { tier: 'free' });
  - L25: vin: string;
  - L29: async decodeVin(vin: string): Promise<VinServiceResponse> {
  - L30: const result = await UnifiedLookupService.lookupByVin(vin, { tier: 'free' });

### /workspaces/car-detective-mvp/src/services/__tests__/photoScoring.test.ts  (LOC 121)
functions: mockPhotoUrls, mockValuationId, mockScores, mockAiCondition, result, mockPhotoUrls, mockValuationId, mockError, mockPhotoUrls, mockValuationId, mockPhotoUrls, mockValuationId, result
- **photos** (8)
  - L2: import { analyzePhotos } from "@/services/photo/analyzePhotos";
  - L13: describe("Photo Scoring Service", () => {
  - L18: it("should successfully analyze photos and return scores", async () => {
  - L45: expect(supabase.functions.invoke).toHaveBeenCalledWith("score-image", {
  - L75: expect(supabase.functions.invoke).toHaveBeenCalledWith("score-image", {
- **url** (3)
  - L26: { url: "https://example.com/photo1.jpg", score: 0.75 },
  - L27: { url: "https://example.com/photo2.jpg", score: 0.9 },
  - L51: url: score.url,
- **storage** (13)
  - L3: import { supabase } from "@/integrations/supabase/client";
  - L5: vi.mock("@/integrations/supabase/client", () => ({
  - L6: supabase: {
  - L36: (supabase.functions.invoke as any).mockResolvedValue({
  - L45: expect(supabase.functions.invoke).toHaveBeenCalledWith("score-image", {
- **valuation** (4)
  - L24: const mockValuationId = "test-valuation-id";
  - L63: const mockValuationId = "test-valuation-id";
  - L83: const mockValuationId = "test-valuation-id";
  - L102: const mockValuationId = "test-valuation-id";

### /workspaces/car-detective-mvp/src/services/adjustmentEngine.ts  (LOC 251)
exports: AdjustmentEngine
functions: confidencePenalty, mileageAdjustment, conditionAdjustment, titleAdjustment, regionalAdjustment, totalAdjustment, validMileages, avgMileage, mileageDiff, adjustmentAmount, multiplier, adjustmentAmount, penalty, adjustmentAmount, avgDaysOnMarket, adjustmentPercent, description, adjustmentAmount
- **mileage** (8)
  - L18: // 1. MILEAGE ADJUSTMENT - Only if we have real market data
  - L22: calculationNotes.push(`Mileage adjustment calculated from ${context.marketListings.length} market comparisons`);
  - L24: calculationNotes.push('Mileage adjustment skipped - insufficient market data for comparison');
  - L67: * Calculate mileage adjustment based on market comparisons
  - L77: // Calculate average mileage from market listings
- **valuation** (1)
  - L11: * Calculate all validated adjustments for a vehicle valuation

### /workspaces/car-detective-mvp/src/services/adjustmentHelpers.ts  (LOC 109)
exports: getDepreciationAdjustment, getMileageAdjustment, getConditionAdjustment
functions: getDepreciationAdjustment, currentYear, age, reliableBrands, brandMultiplier, fuelMultiplier, totalDepreciation, adjustedDepreciation, getMileageAdjustment, averageMilesPerYear, expectedMileage, excessMileage, getConditionAdjustment, normalizedCondition, getFuelCostAdjustment, fuelData, baseValue, adjustment, getFallbackFuelAdjustment
- **make** (2)
  - L7: export function getDepreciationAdjustment(year: number, make?: string, fuelType?: string): number {
  - L15: const brandMultiplier = reliableBrands.includes(make?.toLowerCase() || '') ? 0.8 : 1.0;
- **model** (1)
  - L11: if (age <= 0) return 0; // Future model year
- **year** (9)
  - L5: * Calculate depreciation adjustment based on vehicle year
  - L7: export function getDepreciationAdjustment(year: number, make?: string, fuelType?: string): number {
  - L9: const age = currentYear - year;
  - L11: if (age <= 0) return 0; // Future model year
  - L23: if (age === 1) depreciationRate = 0.15; // 15% first year (reduced from 20%)
- **mileage** (6)
  - L40: * Calculate mileage adjustment based on expected mileage
  - L42: export function getMileageAdjustment(mileage: number, basePrice?: number): number {
  - L43: if (!mileage) return 0;
  - L47: const excessMileage = mileage - expectedMileage;
  - L50: // Low mileage bonus (up to $2000)
- **valuation** (1)
  - L1: // Adjustment Helper Functions for Valuation Engine

### /workspaces/car-detective-mvp/src/services/aiExplanationService.ts  (LOC 106)
exports: ExplanationInput
functions: generateAIExplanation, explanationData, generateFallbackExplanation, positiveAdjustments, negativeAdjustments, explanation, sign
- **make** (2)
  - L14: make: string;
  - L32: vehicle: `${input.vehicle.year} ${input.vehicle.make} ${input.vehicle.model}${input.vehicle.trim ? ` ${input.vehicle.trim}` : ''}`,
- **model** (2)
  - L15: model: string;
  - L32: vehicle: `${input.vehicle.year} ${input.vehicle.make} ${input.vehicle.model}${input.vehicle.trim ? ` ${input.vehicle.trim}` : ''}`,
- **year** (2)
  - L13: year: number;
  - L32: vehicle: `${input.vehicle.year} ${input.vehicle.make} ${input.vehicle.model}${input.vehicle.trim ? ` ${input.vehicle.trim}` : ''}`,
- **mileage** (4)
  - L20: mileage: number;
  - L41: mileage: input.mileage,
  - L72: const { vehicle, baseValue, finalValue, adjustments, mileage, confidenceScore } = input;
  - L103: explanation += `- Mileage Impact Analysis\n`;
- **vin** (1)
  - L100: explanation += `- VIN Decode (Vehicle Specifications)\n`;
- **zip** (2)
  - L19: zip: string;
  - L42: location: input.zip,
- **openai** (1)
  - L48: // Call OpenAI edge function for explanation generation
- **storage** (2)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L49: const { data, error } = await supabase.functions.invoke('generate-explanation', {
- **valuation** (5)
  - L1: // AI Explanation Service for Valuation Results
  - L26: * Generate AI-powered explanation for valuation result
  - L78: let explanation = `## 📊 Valuation Breakdown\n\n`;
  - L92: explanation += "**Reasoning:** High confidence valuation based on comprehensive data analysis.\n\n";
  - L94: explanation += "**Reasoning:** Good confidence valuation with available market data.\n\n";

### /workspaces/car-detective-mvp/src/services/ainService.ts  (LOC 89)
exports: AINResponse, ChatMessage
functions: askAIN, requestBody, errorMessage
- **retry** (1)
  - L33: if (error.message?.includes('429') || error.message?.includes('rate_limit')) {
- **storage** (2)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L27: const { data, error } = await supabase.functions.invoke('ask-ain', {

### /workspaces/car-detective-mvp/src/services/auction.ts  (LOC 17)
functions: fetchAuctionResultsByVin
- **vin** (2)
  - L5: export async function fetchAuctionResultsByVin(vin: string): Promise<AuctionResult[]> {
  - L9: .eq("vin", vin)
- **storage** (2)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L6: const { data, error } = await supabase

### /workspaces/car-detective-mvp/src/services/auctionDataService.ts  (LOC 111)
exports: AuctionData
functions: fetchAuctionHistory, fetchMarketplaceListings, query, platforms, results, fetchIndustryLeaderData
- **make** (6)
  - L14: make?: string;
  - L39: make: item.make,
  - L56: export async function fetchMarketplaceListings(make: string, model: string, year: number, zipCode: string) {
  - L58: const query = `${year} ${make} ${model}`;
  - L88: export async function fetchIndustryLeaderData(vin: string, make: string, model: string, year: string) {
- **model** (6)
  - L15: model?: string;
  - L40: model: item.model,
  - L56: export async function fetchMarketplaceListings(make: string, model: string, year: number, zipCode: string) {
  - L58: const query = `${year} ${make} ${model}`;
  - L88: export async function fetchIndustryLeaderData(vin: string, make: string, model: string, year: string) {
- **year** (6)
  - L16: year?: number;
  - L41: year: item.year
  - L56: export async function fetchMarketplaceListings(make: string, model: string, year: number, zipCode: string) {
  - L58: const query = `${year} ${make} ${model}`;
  - L88: export async function fetchIndustryLeaderData(vin: string, make: string, model: string, year: string) {
- **price** (1)
  - L33: salePrice: parseInt(item.price.replace(/[^0-9]/g, '')) || 0,
- **mileage** (2)
  - L10: mileage: number;
  - L35: mileage: parseInt(item.odometer.replace(/[^0-9]/g, '')) || 0,
- **vin** (7)
  - L6: vin: string;
  - L19: export async function fetchAuctionHistory(vin: string): Promise<AuctionData[]> {
  - L25: .eq('vin', vin)
  - L31: vin: item.vin,
  - L47: body: { vin }
- **storage** (5)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L22: const { data: existingData } = await supabase
  - L46: const { data: freshData } = await supabase.functions.invoke('fetch-auction-history', {
  - L66: const { data } = await supabase.functions.invoke('fetch-marketplace-data', {
  - L91: const { data } = await supabase.functions.invoke('fetch-competitor-prices', {

### /workspaces/car-detective-mvp/src/services/basePriceService.ts  (LOC 122)
exports: BasePriceService
functions: currentYear, age, makeKey, makeMultiplier, modelKey, modelMultiplier, expectedMileage, mileageDifference, mileagePenalty, mileageBonus, currentYear, age, ageCategory, minimumValue
- **make** (5)
  - L3: make: string;
  - L14: const { make, model, year, mileage = 50000 } = params;
  - L18: // Base pricing by make/model category
  - L72: // Apply make multiplier
  - L73: const makeKey = make.toUpperCase();
- **model** (6)
  - L4: model: string;
  - L14: const { make, model, year, mileage = 50000 } = params;
  - L18: // Base pricing by make/model category
  - L40: // Model-specific adjustments
  - L77: // Apply model adjustment
- **year** (7)
  - L5: year: number;
  - L14: const { make, model, year, mileage = 50000 } = params;
  - L16: const age = currentYear - year;
  - L103: static validateValue(value: number, year: number): boolean {
  - L105: const age = currentYear - year;
- **mileage** (6)
  - L6: mileage?: number;
  - L14: const { make, model, year, mileage = 50000 } = params;
  - L82: // Mileage adjustment
  - L84: const mileageDifference = mileage - expectedMileage;
  - L87: // Higher than expected mileage - reduce value

### /workspaces/car-detective-mvp/src/services/carPricePredictionService.ts  (LOC 81)
exports: CarPricePredictionRequest, CarPricePredictionResponse
functions: getCarPricePrediction
- **make** (4)
  - L5: make: string;
  - L22: make: string;
  - L41: make: request.make,
  - L66: make: data.make || request.make,
- **model** (4)
  - L6: model: string;
  - L23: model: string;
  - L42: model: request.model,
  - L67: model: data.model || request.model,
- **year** (4)
  - L7: year: number;
  - L24: year: number;
  - L43: year: request.year,
  - L68: year: data.year || request.year,
- **price** (3)
  - L39: const { data, error } = await supabase.functions.invoke('car-price-prediction', {
  - L56: throw new Error(error.message || 'Failed to get price prediction');
  - L60: throw new Error('No data returned from price prediction service');
- **mileage** (4)
  - L8: mileage: number;
  - L25: mileage: number;
  - L44: mileage: request.mileage,
  - L69: mileage: data.mileage || request.mileage,
- **vin** (4)
  - L15: vin?: string;
  - L27: vin?: string;
  - L51: vin: request.vin
  - L71: vin: data.vin || request.vin,
- **storage** (2)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L39: const { data, error } = await supabase.functions.invoke('car-price-prediction', {

### /workspaces/car-detective-mvp/src/services/competitorPriceService.ts  (LOC 98)
exports: CompetitorPrice, calculateAverageCompetitorPrice
functions: fetchCompetitorPrices, getCachedCompetitorPrices, calculateAverageCompetitorPrice, validPrices
- **make** (3)
  - L7: make?: string
  - L26: make?: string,
  - L36: body: { vin, make, model, year }
- **model** (3)
  - L8: model?: string
  - L27: model?: string,
  - L36: body: { vin, make, model, year }
- **year** (3)
  - L9: year?: string
  - L28: year?: string
  - L36: body: { vin, make, model, year }
- **price** (5)
  - L80: * Calculate average competitor price
  - L91: .filter(price => price && price !== '0')
  - L92: .map(price => parseInt(price!, 10))
  - L93: .filter(price => !isNaN(price) && price > 0)
  - L97: return Math.round(validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length)
- **vin** (6)
  - L6: vin: string
  - L22: * Fetch competitor prices for a specific VIN
  - L25: vin: string,
  - L36: body: { vin, make, model, year }
  - L55: export async function getCachedCompetitorPrices(vin: string): Promise<CompetitorPrice | null> {
- **storage** (3)
  - L2: import { supabase } from '@/integrations/supabase/client'
  - L35: const { data, error } = await supabase.functions.invoke('fetch-competitor-prices', {
  - L57: const { data, error } = await supabase

### /workspaces/car-detective-mvp/src/services/confidenceExplainer.ts  (LOC 126)
exports: ValuationExplanationInput
functions: generateValuationExplanation, generateFallbackExplanation, hasRealMarketData, isFallbackMSRP, hasOpenAIListings, explanation, avgPrice, topListings
- **make** (3)
  - L5: make: string;
  - L39: make: input.make,
  - L77: let explanation = `This valuation for your ${input.year} ${input.make} ${input.model}`;
- **model** (3)
  - L6: model: string;
  - L40: model: input.model,
  - L77: let explanation = `This valuation for your ${input.year} ${input.make} ${input.model}`;
- **year** (3)
  - L7: year: number;
  - L41: year: input.year,
  - L77: let explanation = `This valuation for your ${input.year} ${input.make} ${input.model}`;
- **price** (3)
  - L25: price: number;
  - L87: const avgPrice = Math.round(input.marketListings!.reduce((sum, listing) => sum + listing.price, 0) / input.marketListings!.length);
  - L93: explanation += ` • ${listing.title} — $${listing.price.toLocaleString()}`;
- **mileage** (5)
  - L9: mileage?: number;
  - L42: mileage: input.mileage || 0,
  - L113: explanation += ` This estimate has limited confidence due to insufficient data. Consider providing more details like mileage, condition, and location for a more accurate valuation.`;
  - L117: if (!input.mileage || input.mileage === 0) {
  - L118: explanation += ` Providing actual mileage would significantly improve accuracy.`;
- **vin** (1)
  - L4: vin?: string;
- **zip** (2)
  - L88: explanation += ` 🏷️ **Market Listing Intelligence:** We found ${input.marketListings!.length} real-world listings near ZIP ${input.zipCode}, averaging $${avgPrice.toLocaleString()}. These listings replaced our fallback MSRP estimate and in
  - L122: explanation += ` Adding your ZIP code would account for regional market variations.`;
- **url** (1)
  - L28: url?: string;
- **openai** (1)
  - L96: explanation += ` (Source: OpenAI Web Search)`;
- **storage** (2)
  - L1: import { supabase } from "@/integrations/supabase/client";
  - L37: const { data, error } = await supabase.functions.invoke('generate-explanation', {
- **valuation** (2)
  - L77: let explanation = `This valuation for your ${input.year} ${input.make} ${input.model}`;
  - L113: explanation += ` This estimate has limited confidence due to insufficient data. Consider providing more details like mileage, condition, and location for a more accurate valuation.`;

### /workspaces/car-detective-mvp/src/services/followUpService.ts  (LOC 146)
exports: FollowUpService
functions: saveAnswers, completion, saveData, getAnswersByVin, serviceHistory, submitForValuation, isValid, completedData, saveResult, valuationData, getUserHistory, query
- **vin** (4)
  - L26: onConflict: 'vin'
  - L40: * Get follow-up answers by VIN
  - L42: static async getAnswersByVin(vin: string): Promise<{ data?: FollowUpAnswers; error?: string }> {
  - L47: .eq('vin', vin)
- **storage** (5)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L23: const { error } = await supabase
  - L25: .upsert(saveData, {
  - L44: const { data, error } = await supabase
  - L126: let query = supabase
- **valuation** (4)
  - L88: * Submit completed follow-up for valuation
  - L111: // Transform data for valuation calculation
  - L114: // Here you would typically call the valuation calculation service
  - L117: return { success: false, error: 'Failed to submit for valuation' };

### /workspaces/car-detective-mvp/src/services/fuelCostService.ts  (LOC 223)
exports: FuelCostData, FuelCostImpact, computeFuelTypeAdjustment, computeFuelCostImpact
functions: getFuelCostByZip, getFallbackFuelPrice, computeFuelTypeAdjustment, baselineFuelPrice, adjustment, explanation, electricCostPer100Mi, gasCostPer100Mi, annualSavings, hybridSavings, dieselPriceDiff, efficiencyBonus, sign, premiumPriceDiff, computeFuelCostImpact, averageAnnualMiles, baselineFuelPrice, annualFuelCost, baselineAnnualCost, annualSavings, priceDifference, explanation, fetchRegionalFuelPrice, result
- **year** (2)
  - L139: adjustment = Math.min(annualSavings * 2.5, baseValue * 0.08); // 2.5-year savings impact, cap at 8%
  - L144: const hybridSavings = (regionalFuelPrice - baselineFuelPrice) * 400; // Assume 400 gal/year difference
- **price** (3)
  - L153: adjustment = (dieselPriceDiff * -400) + (efficiencyBonus * 1000); // Price penalty offset by efficiency
  - L211: explanation = `Regional fuel price ($${regionalFuelPrice.toFixed(2)}/gal) is $${priceDifference.toFixed(2)} above national average, increasing annual costs by ~$${Math.abs(annualSavings).toFixed(0)}.`;
  - L213: explanation = `Regional fuel price ($${regionalFuelPrice.toFixed(2)}/gal) is $${Math.abs(priceDifference).toFixed(2)} below national average, saving ~$${annualSavings.toFixed(0)} annually.`;
- **zip** (5)
  - L18: * Get fuel cost by ZIP code with intelligent caching
  - L140: explanation = `Electric vehicle receives ${adjustment >= 0 ? '+' : ''}$${Math.round(adjustment)} value boost due to significant fuel cost savings versus gasoline vehicles, based on real-time fuel pricing from the U.S. Energy Information Adm
  - L147: explanation = `Hybrid vehicle receives ${adjustment >= 0 ? '+' : ''}$${Math.round(adjustment)} value boost reflecting fuel efficiency advantages over conventional vehicles, based on real regional fuel costs of $${regionalFuelPrice.toFixed(2
  - L156: explanation = `Diesel fuel type adjustment (${sign}${(Math.abs(adjustment) / baseValue * 100).toFixed(1)}%) applied based on current regional diesel pricing of $${regionalFuelPrice.toFixed(2)}/gal and efficiency characteristics in ZIP ${zip
  - L163: explanation = `Premium fuel requirement adjustment of ${adjustment >= 0 ? '+' : ''}$${Math.round(adjustment)} based on regional premium gasoline pricing of $${regionalFuelPrice.toFixed(2)}/gal in ZIP ${zipCode}.`;
- **storage** (5)
  - L1: import { supabase } from "@/integrations/supabase/client";
  - L24: const { data: cachedData, error: cacheError } = await supabase
  - L42: const { data: freshData, error: fetchError } = await supabase.functions.invoke('fetch-eia-fuel-prices', {
  - L53: await supabase
  - L55: .upsert({

### /workspaces/car-detective-mvp/src/services/generateConfidenceScore.ts  (LOC 166)
exports: ConfidenceScoreParams, ConfidenceScoreResult, generateConfidenceScore, extractTrustedSources
functions: HIGH_TRUST_DOMAINS, generateConfidenceScore, breakdown, score, boost, boost, boost, trustedDomains, boost, domainNames, match, boost, extractTrustedSources
- **vin** (3)
  - L71: // +20 for exact VIN match (highest priority)
  - L76: explanation.push('Confidence boosted for exact VIN match.');
  - L77: console.log(`📈 Confidence: +${boost} for exact VIN match`);

### /workspaces/car-detective-mvp/src/services/historyCheckService.ts  (LOC 202)
functions: lookupTitleStatus, response, data, confidence, lookupOpenRecalls, response, data, unresolved, parseNHTSARecalls, recallResults, determineRiskLevel, desc, extractComponent, components, desc, extractConsequence, sentence
- **vin** (9)
  - L7: export async function lookupTitleStatus(vin: string): Promise<TitleHistoryResult | null> {
  - L8: if (!vin || vin.length !== 17) {
  - L19: body: JSON.stringify({ vin })
  - L66: export async function lookupOpenRecalls(vin: string): Promise<RecallCheckResult | null> {
  - L67: if (!vin || vin.length !== 17) {
- **fetch** (2)
  - L13: const response = await fetch('https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/fetch_nicb_vincheck', {
  - L73: const response = await fetch(
- **storage** (3)
  - L13: const response = await fetch('https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/fetch_nicb_vincheck', {
  - L74: 'https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/fetch_nhtsa_recalls',
  - L112: * Parse NHTSA recall data into structured format
- **valuation** (1)
  - L1: import type { TitleStatus, RecallEntry, TitleHistoryResult, RecallCheckResult } from '@/types/valuation';
- **env** (1)
  - L136: if (import.meta.env.NODE_ENV === 'development' && recalls.length === 0) {

### /workspaces/car-detective-mvp/src/services/marketListings.ts  (LOC 93)
exports: fetchMarketListings, fetchNewListings, storeMarketListings
functions: fetchMarketListings, fetchNewListings, storeMarketListings
- **make** (8)
  - L10: make: string;
  - L34: * Fetch the last 10 market listings for a given make/model/year.
  - L38: make: string,
  - L44: .eq("make", make)
  - L58: make: string,
- **model** (8)
  - L11: model: string;
  - L34: * Fetch the last 10 market listings for a given make/model/year.
  - L39: model: string,
  - L45: .eq("model", model)
  - L59: model: string,
- **year** (8)
  - L12: year: number;
  - L34: * Fetch the last 10 market listings for a given make/model/year.
  - L40: year: number,
  - L46: .eq("year", year)
  - L60: year: number,
- **price** (4)
  - L8: price: number;
  - L43: .select("source, price, url")
  - L80: ([source, price]) => ({
  - L82: price: Number(price),
- **url** (3)
  - L9: url: string | null;
  - L43: .select("source, price, url")
  - L83: url: marketData.sources?.[source] ?? null,
- **schema** (1)
  - L35: * We use `any` to stop TS from inferring your entire DB schema.
- **storage** (4)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L42: const { data, error } = await (supabase.from("market_listings") as any)
  - L62: return await supabase.functions.invoke("fetch-market-listings", {
  - L92: await (supabase.from("market_listings") as any).insert(inserts);

### /workspaces/car-detective-mvp/src/services/marketSearchAgent.ts  (LOC 373)
exports: MarketSearchInput, MarketSearchResult
functions: fetchMarketComps, searchPromises, results, searchResult, foundListings, sourceName, fetchMarketplaceListings, response, result, fetchEchoParkListings, ok, maxRetries, retryCount, searchQuery, url, userAgents, randomUA, controller, timeoutId, res, html, patterns, parsed, count, price, year, make, model, trim, mileage, stockNumber, detailUrl, fetchCarsComListings, ok, makeFormatted, modelFormatted, url, res, html, listingRegex, count, price, mileage, titleMatch, jsonDataMatch, apolloState, searchMarketListings, result
- **make** (20)
  - L6: make: string;
  - L22: const { valuationId, make, model, year, zipCode } = input;
  - L30: fetchEchoParkListings({ valuationId: valuationId || crypto.randomUUID(), make, model, year, zipCode })
  - L34: fetchCarsComListings({ valuationId: valuationId || crypto.randomUUID(), make, model, year, zipCode })
  - L39: fetchMarketplaceListings(make, model, year, zipCode)
- **model** (20)
  - L7: model: string;
  - L22: const { valuationId, make, model, year, zipCode } = input;
  - L30: fetchEchoParkListings({ valuationId: valuationId || crypto.randomUUID(), make, model, year, zipCode })
  - L34: fetchCarsComListings({ valuationId: valuationId || crypto.randomUUID(), make, model, year, zipCode })
  - L39: fetchMarketplaceListings(make, model, year, zipCode)
- **year** (22)
  - L8: year: number;
  - L22: const { valuationId, make, model, year, zipCode } = input;
  - L30: fetchEchoParkListings({ valuationId: valuationId || crypto.randomUUID(), make, model, year, zipCode })
  - L34: fetchCarsComListings({ valuationId: valuationId || crypto.randomUUID(), make, model, year, zipCode })
  - L39: fetchMarketplaceListings(make, model, year, zipCode)
- **price** (14)
  - L109: price: typeof listing.price === 'number' ? listing.price : parseInt(String(listing.price || '0').replace(/[^\d]/g, '')),
  - L121: listing.price > 1000 && listing.price < 200000 // Basic validation
  - L199: /"price":(\d+).*?"year":(\d+).*?"make":"([^"]+)".*?"model":"([^"]+)".*?"trim":"([^"]*)".*?"mileage":(\d+).*?"stockNumber":"([^"]+)".*?"detailUrl":"([^"]+)"/g,
  - L200: /{"vehicleId":"[^"]*","price":(\d+),"year":(\d+),"make":"([^"]+)","model":"([^"]+)","trim":"([^"]*)","mileage":(\d+),"stockNumber":"([^"]+)","url":"([^"]+)"/g,
  - L201: /price.*?:.*?(\d{4,}).*?year.*?:.*?(\d{4}).*?make.*?:.*?"([^"]+)".*?model.*?:.*?"([^"]+)".*?mileage.*?:.*?(\d+)/gi
- **mileage** (13)
  - L110: mileage: typeof listing.mileage === 'number' ? listing.mileage : parseInt(String(listing.mileage || '0').replace(/[^\d]/g, '')),
  - L199: /"price":(\d+).*?"year":(\d+).*?"make":"([^"]+)".*?"model":"([^"]+)".*?"trim":"([^"]*)".*?"mileage":(\d+).*?"stockNumber":"([^"]+)".*?"detailUrl":"([^"]+)"/g,
  - L200: /{"vehicleId":"[^"]*","price":(\d+),"year":(\d+),"make":"([^"]+)","model":"([^"]+)","trim":"([^"]*)","mileage":(\d+),"stockNumber":"([^"]+)","url":"([^"]+)"/g,
  - L201: /price.*?:.*?(\d{4,}).*?year.*?:.*?(\d{4}).*?make.*?:.*?"([^"]+)".*?model.*?:.*?"([^"]+)".*?mileage.*?:.*?(\d+)/gi
  - L214: const mileage = parseInt(match[6] || '0');
- **vin** (1)
  - L5: vin: string;
- **photos** (2)
  - L161: 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  - L274: 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
- **dealer** (1)
  - L234: source_type: 'dealer',
- **zip** (2)
  - L90: const response = await fetch(`https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/fetch-marketplace-data?query=${year} ${make} ${model}&zip=${zipCode}&platform=all`, {
  - L269: const url = `https://www.cars.com/shopping/results/?makes[]=${makeFormatted}&models[]=${makeFormatted}-${modelFormatted}&list_price_max=&list_price_min=&makes[]=${makeFormatted}&maximum_distance=50&models[]=${modelFormatted}&page_size=20&so
- **url** (9)
  - L108: url: listing.url || listing.listing_url || '#',
  - L145: const url = `https://www.echopark.com/search?query=${searchQuery}&zipCode=${args.zipCode}&radius=50`;
  - L157: const res = await fetch(url, {
  - L200: /{"vehicleId":"[^"]*","price":(\d+),"year":(\d+),"make":"([^"]+)","model":"([^"]+)","trim":"([^"]*)","mileage":(\d+),"stockNumber":"([^"]+)","url":"([^"]+)"/g,
  - L223: url: detailUrl.startsWith('http') ? detailUrl : `https://www.echopark.com${detailUrl}`,
- **fetch** (3)
  - L90: const response = await fetch(`https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/fetch-marketplace-data?query=${year} ${make} ${model}&zip=${zipCode}&platform=all`, {
  - L157: const res = await fetch(url, {
  - L270: const res = await fetch(url, {
- **retry** (5)
  - L27: // Enhanced parallel execution with timeout protection
  - L44: // Execute all searches in parallel with timeout
  - L50: setTimeout(() => reject(new Error('Search timeout')), 20000)
  - L155: const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
  - L178: if (res.status === 429 && retryCount < maxRetries) {
- **storage** (1)
  - L90: const response = await fetch(`https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/fetch-marketplace-data?query=${year} ${make} ${model}&zip=${zipCode}&platform=all`, {
- **valuation** (2)
  - L1: import { recordListingAudit } from '@/services/valuation/listingAuditService';
  - L2: import type { MarketListing } from '@/types/valuation';

### /workspaces/car-detective-mvp/src/services/marketplaceService.ts  (LOC 124)
exports: MarketplaceListing, MarketplaceSearchParams
functions: fetchMarketplaceData, searchParams, getScrapedListings, query, searchListingsByVehicle, searchQuery
- **make** (3)
  - L99: * Search scraped listings by make and model
  - L102: make: string,
  - L107: const searchQuery = year ? `${year} ${make} ${model}` : `${make} ${model}`
- **model** (3)
  - L99: * Search scraped listings by make and model
  - L103: model: string,
  - L107: const searchQuery = year ? `${year} ${make} ${model}` : `${make} ${model}`
- **year** (2)
  - L104: year?: number
  - L107: const searchQuery = year ? `${year} ${make} ${model}` : `${make} ${model}`
- **price** (1)
  - L8: price?: number
- **mileage** (1)
  - L9: mileage?: number
- **vin** (4)
  - L6: vin?: string
  - L65: vin?: string
  - L78: if (filters?.vin) {
  - L79: query = query.eq('vin', filters.vin)
- **zip** (1)
  - L34: zip: params.zipCode,
- **url** (1)
  - L12: url: string
- **storage** (4)
  - L2: import { supabase } from '@/integrations/supabase/client'
  - L38: const { data, error } = await supabase.functions.invoke('fetch-marketplace-data', {
  - L69: let query = supabase
  - L109: const { data, error } = await supabase

### /workspaces/car-detective-mvp/src/services/persistence/persistenceMonitor.ts  (LOC 175)
exports: PersistenceHealth
functions: checkPersistenceHealth, score, testAuditLogging, testData, testValuationRequestCreation, testData, runPersistenceTests, auditTest, requestTest, overallHealth
- **mileage** (1)
  - L131: mileage: 50000,
- **vin** (2)
  - L86: vin: 'TEST' + Date.now(),
  - L129: vin: 'TEST' + Date.now(),
- **storage** (9)
  - L1: import { supabase } from '@/integrations/supabase/client';
  - L25: const { data: auditData, error: auditError } = await supabase
  - L32: const { data: requestData, error: requestError } = await supabase
  - L39: const { count: auditCount } = await supabase
  - L43: const { count: requestCount } = await supabase
- **valuation** (2)
  - L31: // Check valuation requests
  - L123: * Test valuation request creation

### /workspaces/car-detective-mvp/src/services/photo/analyzePhotos.ts  (LOC 120)
exports: PhotoAnalysisResult
functions: analyzePhotos, response, result, getFallbackAnalysis, individualScores, score, explanation, hasImageExt, overallScore, confidence
- **photos** (10)
  - L32: description: "No photos provided for analysis"
  - L38: // Call the OpenAI photo analysis edge function
  - L39: const response = await fetch(`https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/analyze-photos`, {
  - L64: // Enhanced fallback with basic image validation
  - L67: let explanation = "Photo analysis unavailable - basic validation applied";
- **url** (7)
  - L5: url: string;
  - L65: const individualScores = photoUrls.map((url, index) => {
  - L70: // Basic URL validation
  - L71: if (!url || !url.startsWith('http')) {
  - L73: qualityIssues.push("Invalid photo URL");
- **fetch** (1)
  - L39: const response = await fetch(`https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/analyze-photos`, {
- **openai** (1)
  - L38: // Call the OpenAI photo analysis edge function
- **storage** (1)
  - L39: const response = await fetch(`https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/analyze-photos`, {

### /workspaces/car-detective-mvp/src/services/photo/deletePhotos.ts  (LOC 38)
functions: deletePhotos, urlObj, filePath
- **photos** (10)
  - L2: import { Photo } from "@/types/photo";
  - L5: * Deletes photos from storage and database
  - L7: export async function deletePhotos(photos: Photo[]): Promise<void> {
  - L8: if (!photos.length) return;
  - L10: for (const photo of photos) {
- **url** (3)
  - L11: if (!photo.url) continue;
  - L14: // Extract path from URL
  - L15: const urlObj = new URL(photo.url);
- **storage** (3)
  - L1: import { supabase } from "@/integrations/supabase/client";
  - L22: await supabase.storage
  - L30: await supabase

### /workspaces/car-detective-mvp/src/services/photo/fetchPhotos.ts  (LOC 34)
functions: fetchValuationPhotos
- **photos** (3)
  - L2: import { Photo } from "@/types/photo";
  - L5: * Fetches photos for a specific valuation
  - L9: ): Promise<Photo[]> {
- **url** (2)
  - L28: url: item.photo_url,
  - L29: thumbnail: item.photo_url, // Use same URL for thumbnail
- **storage** (2)
  - L1: import { supabase } from "@/integrations/supabase/client";
  - L16: const { data, error } = await supabase
- **valuation** (2)
  - L5: * Fetches photos for a specific valuation
  - L11: throw new Error("No valuation ID provided");

### /workspaces/car-detective-mvp/src/services/photo/uploadPhotoService.ts  (LOC 45)
functions: uploadPhotos, uploadPromises, filename, url, uploadedPhotos
- **photos** (13)
  - L2: import { Photo } from "@/types/photo";
  - L7: photos: Photo[],
  - L9: ): Promise<Photo[]> {
  - L11: if (!photos.length) {
  - L15: const uploadPromises = photos.map(async (photo) => {
- **url** (2)
  - L29: const url =
  - L34: url,
- **storage** (2)
  - L1: import { supabase } from "@/integrations/supabase/client";
  - L21: const { data, error } = await supabase.storage
- **env** (1)
  - L30: `${import.meta.env.SUPABASE_URL}/storage/v1/object/public/vehicle-photos/${data?.path}`;

### /workspaces/car-detective-mvp/src/services/photoScoringService.ts  (LOC 167)
exports: scorePhotos, convertToPhotoAnalysisResult, enhancedPhotoScoring
functions: scorePhotos, overallScore, convertToPhotoAnalysisResult, enhancedPhotoScoring, score, isPrimary, avgScore, getScoreExplanation, getConditionFromScore, avgScore, calculateAverageScore, sum, generateRandomIssues, possibleIssues, numIssues, i, randomIndex
- **photos** (11)
  - L2: import { AICondition, Photo, PhotoAnalysisResult, PhotoScore, PhotoScoringResult } from '@/types/photo';
  - L4: // Mock photo scoring service implementation
  - L12: // Generate random scores for photos with proper PhotoScore structure
  - L24: // Mark the first photo as primary
  - L70: // Enhanced photo scoring with detailed analysis
- **url** (7)
  - L13: const scores: PhotoScore[] = photoUrls.map(url => ({
  - L14: url,
  - L42: photoUrl: scores.length > 0 ? scores[0].url : '',
  - L61: url: result.photoUrl || (result.photoUrls && result.photoUrls.length > 0 ? result.photoUrls[0] : ''),
  - L79: const individualScores: PhotoScore[] = photoUrls.map((url, index) => {

### /workspaces/car-detective-mvp/src/services/plateService.ts  (LOC 35)
functions: lookupPlate
- **make** (1)
  - L24: make: data.make,
- **model** (1)
  - L25: model: data.model,
- **year** (1)
  - L23: year: data.year,
- **storage** (2)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L8: const { data, error } = await supabase

### /workspaces/car-detective-mvp/src/services/realMarketplaceService.ts  (LOC 202)
exports: RealMarketplaceParams, RealMarketplaceService
functions: fetchRealListings, scrapedListings, enhancedListings, getScrapedListings, query, getVerifiedEnhancedListings, query, yearMatch, makes, lowerTitle, models, lowerTitle
- **make** (11)
  - L6: make: string;
  - L58: // Filter by make/model/year
  - L60: .ilike('title', `%${params.make}%`)
  - L82: make: this.extractMake(listing.title) || params.make,
  - L122: // Filter by make/model/year
- **model** (11)
  - L7: model: string;
  - L58: // Filter by make/model/year
  - L61: .ilike('title', `%${params.model}%`)
  - L83: model: this.extractModel(listing.title) || params.model,
  - L122: // Filter by make/model/year
- **year** (8)
  - L8: year: number;
  - L58: // Filter by make/model/year
  - L62: .ilike('title', `%${params.year}%`);
  - L81: year: this.extractYear(listing.title) || params.year,
  - L122: // Filter by make/model/year
- **price** (2)
  - L80: price: listing.price || 0,
  - L144: price: listing.price || 0,
- **mileage** (2)
  - L86: mileage: listing.mileage || 0,
  - L150: mileage: listing.mileage || 0,
- **vin** (9)
  - L5: vin?: string;
  - L54: // Filter by VIN if available
  - L55: if (params.vin) {
  - L56: query = query.eq('vin', params.vin);
  - L85: vin: listing.vin || '',
- **url** (1)
  - L90: listing_url: listing.url || '',
- **openai** (1)
  - L116: .not('id', 'like', 'openai-%');
- **storage** (3)
  - L1: import { supabase } from "@/integrations/supabase/client";
  - L48: let query = supabase
  - L106: let query = supabase

### /workspaces/car-detective-mvp/src/services/scrapedListingsService.ts  (LOC 116)
exports: ScrapedListing, calculateAverageListingPrice, formatListingsForPdf, generateMarketplaceAnalysisText
functions: getScrapedListingsByVin, calculateAverageListingPrice, validListings, total, formatListingsForPdf, validListings, lines, title, price, platform, averagePrice, generateMarketplaceAnalysisText, validListings, averagePrice, platforms, difference, percentDiff, comparisonText
- **price** (10)
  - L7: price: number | null;
  - L41: const validListings = listings.filter(listing => listing.price && listing.price > 0);
  - L47: const total = validListings.reduce((sum, listing) => sum + (listing.price || 0), 0);
  - L56: const validListings = listings.filter(listing => listing.price && listing.price > 0);
  - L66: const price = listing.price ? `$${listing.price.toLocaleString()}` : 'N/A';
- **mileage** (1)
  - L11: mileage: number | null;
- **vin** (4)
  - L12: vin: string | null;
  - L17: export async function getScrapedListingsByVin(vin: string): Promise<ScrapedListing[]> {
  - L18: if (!vin || vin.length !== 17) {
  - L26: .eq('vin', vin)
- **url** (1)
  - L8: url: string;
- **storage** (2)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L23: const { data, error } = await supabase
- **valuation** (1)
  - L107: comparisonText = `, suggesting a premium valuation ${percentDiff.toFixed(1)}% above current market listings`;

### /workspaces/car-detective-mvp/src/services/supabase/explanationService.ts  (LOC 48)
exports: ValuationExplanationData
functions: saveValuationExplanation
- **mileage** (1)
  - L8: mileage: number;
- **storage** (3)
  - L1: import { supabase } from "@/integrations/supabase/client";
  - L30: const { data: result, error } = await supabase
  - L32: .insert({

### /workspaces/car-detective-mvp/src/services/supabase/feedbackService.ts  (LOC 64)
exports: ValuationFeedback, submitValuationFeedback
functions: saveValuationFeedback, submitValuationFeedback, getFeedbackStats, query
- **vin** (4)
  - L7: vin?: string;
  - L43: export async function getFeedbackStats(vin?: string) {
  - L48: if (vin) {
  - L49: query = query.eq('vin', vin);
- **storage** (4)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L19: const { data, error } = await supabase
  - L21: .insert({
  - L44: let query = supabase
- **valuation** (1)
  - L1: // Valuation Feedback Service - Handles user feedback on valuations

### /workspaces/car-detective-mvp/src/services/supabase/heatmapService.ts  (LOC 21)
exports: HeatmapData
functions: getAdjustmentBreakdownHeatmap
- **storage** (2)
  - L1: import { supabase } from '@/integrations/supabase/client';
  - L16: const { data, error } = await supabase.rpc('get_adjustment_breakdown_heatmap');

### /workspaces/car-detective-mvp/src/services/supabase/shareTrackingService.ts  (LOC 51)
exports: SharedValuationData
functions: saveSharedValuation, getSharedValuation, incrementShareView
- **vin** (2)
  - L5: vin: string;
  - L19: vin: data.vin,
- **schema** (1)
  - L37: .eq('id', shareToken) // This would need to be adjusted based on actual schema
- **storage** (4)
  - L1: import { supabase } from '@/integrations/supabase/client';
  - L15: const { data: result, error } = await supabase
  - L17: .insert({
  - L34: const { data, error } = await supabase
- **valuation** (1)
  - L20: valuation: data.finalValue,

### /workspaces/car-detective-mvp/src/services/supabase/valuationRequestService.ts  (LOC 53)
exports: ValuationRequestData
functions: saveValuationRequest, getValuationRequest
- **mileage** (2)
  - L7: mileage: number;
  - L22: mileage: data.mileage,
- **vin** (2)
  - L5: vin: string;
  - L20: vin: data.vin,
- **storage** (4)
  - L1: import { supabase } from '@/integrations/supabase/client';
  - L16: const { data: result, error } = await supabase
  - L18: .insert({
  - L42: const { data, error } = await supabase

### /workspaces/car-detective-mvp/src/services/supabase/valuationRequestTracker.ts  (LOC 98)
exports: ValuationRequestInput, ValuationRequestRecord
functions: createValuationRequest, completeValuationRequest, failValuationRequest
- **make** (2)
  - L10: make: string;
  - L38: make: input.make || 'UNKNOWN',
- **model** (2)
  - L11: model: string;
  - L39: model: input.model || 'UNKNOWN',
- **year** (2)
  - L12: year: number;
  - L40: year: input.year || 2020,
- **mileage** (3)
  - L6: mileage?: number;
  - L20: mileage: number | null;
  - L37: mileage: input.mileage || null,
- **vin** (3)
  - L4: vin: string;
  - L18: vin: string;
  - L35: vin: input.vin,
- **storage** (5)
  - L1: import { supabase } from '@/integrations/supabase/client';
  - L31: const { data, error } = await supabase
  - L33: .insert({
  - L62: const { error } = await supabase
  - L84: const { error } = await supabase
- **valuation** (3)
  - L27: * Creates a valuation request record at the start of the valuation process
  - L54: * Updates a valuation request with completion data
  - L81: * Marks a valuation request as failed

### /workspaces/car-detective-mvp/src/services/valuation/confidenceEngine.ts  (LOC 188)
exports: calculateAdvancedConfidence, getConfidenceBreakdown
functions: calculateAdvancedConfidence, confidence, vehicleDataBonus, marketDataBonus, realListingsCount, syntheticListingsCount, spreadAnalysis, spread, spreadPercent, sourceBonus, zipMatchBonus, localListings, matchRate, msrpBonus, fuelDataBonus, maxConfidence, finalConfidence, getConfidenceBreakdown, confidence
- **mileage** (3)
  - L6: mileage: number;
  - L35: vehicleMake, vehicleModel, vehicleYear, mileage, condition, zipCode,
  - L46: if (mileage > 0 && mileage < 300000) vehicleDataBonus += 4;
- **vin** (2)
  - L56: // Check for exact VIN match from REAL data only
  - L58: marketDataBonus += 25; // Major confidence boost for exact VIN
- **zip** (2)
  - L121: // 5. ZIP Code Match Rate (up to +8 points)
  - L165: breakdown.formula = `Base(${breakdown.base}) + Vehicle(${vehicleDataBonus}) + Market(${marketDataBonus}) + Spread(${spreadAnalysis}) + Sources(${sourceBonus}) + ZIP(${zipMatchBonus}) + MSRP(${msrpBonus}) + Fuel(${fuelDataBonus}) = ${finalCo

### /workspaces/car-detective-mvp/src/services/valuation/dataValidation.ts  (LOC 140)
exports: ValidationResult, validateVin, validateMileage, validateZipCode, validateMarketListings, validateFuelPrice
functions: validateVin, cleanVin, validateMileage, validateZipCode, cleanZip, validateMarketListings, validListings, validateFuelPrice
- **price** (9)
  - L99: typeof listing.price === 'number' &&
  - L100: listing.price > 0
  - L118: export function validateFuelPrice(price: number): ValidationResult {
  - L122: if (typeof price !== 'number' || isNaN(price)) {
  - L123: errors.push('Fuel price must be a valid number');
- **mileage** (9)
  - L38: export function validateMileage(mileage: number): ValidationResult {
  - L42: if (typeof mileage !== 'number' || isNaN(mileage)) {
  - L43: errors.push('Mileage must be a valid number');
  - L47: if (mileage < 0) {
  - L48: errors.push('Mileage cannot be negative');
- **vin** (7)
  - L8: export function validateVin(vin: string): ValidationResult {
  - L12: if (!vin || typeof vin !== 'string') {
  - L13: errors.push('VIN is required');
  - L17: const cleanVin = vin.trim().toUpperCase();
  - L20: errors.push('VIN must be exactly 17 characters');
- **zip** (2)
  - L71: errors.push('ZIP code is required');
  - L78: errors.push('ZIP code must be in format 12345 or 12345-6789');
- **valuation** (1)
  - L1: // Data validation utilities for valuation system

### /workspaces/car-detective-mvp/src/services/valuation/enhancedMarketListingService.ts  (LOC 281)
exports: EnhancedMarketListing, EnhancedMarketListingFilters, EnhancedMarketListingService
functions: fetchRealMarketListings, query, limit, searchSimilarVehicles, exactMatch, broaderFilters, broaderResults, yearRange, filteredByYear, getMarketSummary, listings, prices, mileages, conditions, averagePrice, sortedPrices, medianPrice, averageMileage, conditionCounts, mostCommonCondition, requiredFields, hasRequiredFields, getCachedListings, cacheKey, cachedData, cacheTime, now, cacheAgeMinutes, freshData
- **make** (5)
  - L8: make?: string;
  - L35: make?: string;
  - L58: if (filters.make) {
  - L59: query = query.ilike('make', `%${filters.make}%`);
  - L102: make: listing.make,
- **model** (5)
  - L9: model?: string;
  - L36: model?: string;
  - L61: if (filters.model) {
  - L62: query = query.ilike('model', `%${filters.model}%`);
  - L103: model: listing.model,
- **year** (10)
  - L10: year?: number;
  - L37: year?: number;
  - L64: if (filters.year) {
  - L65: query = query.eq('year', filters.year);
  - L104: year: listing.year,
- **price** (9)
  - L12: price: number;
  - L77: query = query.gte('price', filters.minPrice);
  - L80: query = query.lte('price', filters.maxPrice);
  - L106: price: listing.price,
  - L185: const prices = listings.map(l => l.price).filter(p => p > 0);
- **mileage** (6)
  - L13: mileage?: number;
  - L107: mileage: listing.mileage,
  - L186: const mileages = listings.map(l => l.mileage).filter(m => m && m > 0);
  - L193: const averageMileage = mileages.filter(m => m != null).reduce((sum, mileage) => sum + mileage, 0) / mileages.filter(m => m != null).length || 0;
  - L235: // Validate mileage if present
- **vin** (5)
  - L7: vin?: string;
  - L44: vin?: string;
  - L73: if (filters.vin) {
  - L74: query = query.eq('vin', filters.vin);
  - L101: vin: listing.vin,
- **photos** (2)
  - L26: photos?: string[];
  - L120: photos: listing.photos || [],
- **storage** (2)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L52: let query = supabase

### /workspaces/car-detective-mvp/src/services/valuation/errorHandler.ts  (LOC 191)
exports: ValuationError, ResilientValuationError
functions: handleValuationError, classifiedError, classifyValuationError, errorMessage, errorCode, generateEmergencyFallback, currentYear, estimatedYear, baseValue, depreciation, finalValue
- **year** (2)
  - L172: const estimatedYear = input.year || (currentYear - 5);
  - L183: valuation_explanation: `Emergency valuation estimate for ${input.year || 'unknown year'} vehicle. This is a basic calculation due to service limitations. For accurate pricing, please try again later when all services are available.`,
- **vin** (3)
  - L133: // VIN decoding errors
  - L134: if (errorMessage.includes('vin') || errorMessage.includes('decode')) {
  - L137: message: 'VIN decoding failed - using manual vehicle data',
- **retry** (2)
  - L90: if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('timeout')) {
  - L101: if (errorMessage.includes('OpenAI') || errorMessage.includes('rate limit') || errorCode === 'rate_limit_exceeded') {
- **openai** (2)
  - L100: // OpenAI API errors
  - L101: if (errorMessage.includes('OpenAI') || errorMessage.includes('rate limit') || errorCode === 'rate_limit_exceeded') {
- **storage** (1)
  - L112: if (errorMessage.includes('supabase') || errorMessage.includes('database') || errorMessage.includes('relation')) {
- **valuation** (5)
  - L1: // Enhanced Error Handler for Valuation System
  - L30: * Handle valuation errors with fallback strategies
  - L166: * Generate emergency fallback valuation
  - L169: console.log('🚨 [ErrorHandler] Generating emergency fallback valuation');
  - L183: valuation_explanation: `Emergency valuation estimate for ${input.year || 'unknown year'} vehicle. This is a basic calculation due to service limitations. For accurate pricing, please try again later when all services are available.`,

### /workspaces/car-detective-mvp/src/services/valuation/index.ts  (LOC 15)
- **valuation** (1)
  - L1: // Export all valuation services for easier imports

### /workspaces/car-detective-mvp/src/services/valuation/listingAuditService.ts  (LOC 44)
functions: recordListingAudit, payload, snapshotListing, recordValuationOutcome
- **storage** (4)
  - L1: import { supabase } from '@/integrations/supabase/client';
  - L17: return await supabase.from('market_search_audit').insert(payload).select().single();
  - L26: return await supabase.from('listing_audit_snapshots').insert({
  - L39: return await supabase.from('valuation_audit_logs').update({

### /workspaces/car-detective-mvp/src/services/valuation/marketDataService.ts  (LOC 270)
exports: MarketDataResult, MarketDataFilters, MarketDataService
functions: fetchMarketData, exactListings, similarListings, fordTruckListings, broaderListings, fetchFordTruckListings, addSampleFordF150Data, sampleListings, validListings, prices, averagePrice, confidenceScore, recentListings, listingDate, thirtyDaysAgo, getMarketSummary, marketData, prices, sortedPrices, medianPrice
- **make** (8)
  - L15: make: string;
  - L37: make: filters.make,
  - L52: make: filters.make,
  - L65: if (filters.make.toLowerCase().includes('ford') && filters.model.toLowerCase().includes('f-150')) {
  - L73: // If still no matches, try broader search by make only
- **model** (6)
  - L16: model: string;
  - L38: model: filters.model,
  - L53: model: filters.model,
  - L65: if (filters.make.toLowerCase().includes('ford') && filters.model.toLowerCase().includes('f-150')) {
  - L105: .or('model.ilike.%F-150%,model.ilike.%F150%,model.ilike.%truck%')
- **year** (5)
  - L17: year: number;
  - L39: year: filters.year,
  - L50: // If no exact matches, try similar vehicles with year range
  - L54: year: filters.year,
  - L127: year: 2023,
- **price** (7)
  - L90: averagePrice: 33297, // EchoPark price as baseline
  - L129: price: 33297,
  - L194: // Calculate average price
  - L195: const prices = validListings.map(l => l.price);
  - L196: const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
- **mileage** (1)
  - L130: mileage: 48727,
- **vin** (4)
  - L19: vin?: string;
  - L41: vin: filters.vin,
  - L124: vin: '1FTEW1C83PFB21608',
  - L166: .upsert(sampleListings, { onConflict: 'vin' });
- **dealer** (1)
  - L133: source_type: 'dealer',
- **storage** (6)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L101: const { data, error } = await supabase
  - L163: // Insert sample data into enhanced_market_listings
  - L164: const { error } = await supabase
  - L166: .upsert(sampleListings, { onConflict: 'vin' });

### /workspaces/car-detective-mvp/src/services/valuation/marketListingService.ts  (LOC 163)
functions: saveMarketListings, fallbackResults, savedCount, insertListingsOneByOne, savedCount, getRecentMarketListings, query
- **make** (4)
  - L10: make?: string;
  - L57: make: listing.make,
  - L139: make?: string;
  - L151: if (filters.make) query = query.eq('make', filters.make);
- **model** (4)
  - L11: model?: string;
  - L58: model: listing.model,
  - L140: model?: string;
  - L152: if (filters.model) query = query.eq('model', filters.model);
- **year** (4)
  - L12: year?: number;
  - L59: year: listing.year,
  - L141: year?: number;
  - L153: if (filters.year) query = query.eq('year', filters.year);
- **price** (2)
  - L14: price: number;
  - L61: price: listing.price,
- **mileage** (2)
  - L15: mileage?: number;
  - L62: mileage: listing.mileage,
- **vin** (4)
  - L7: vin?: string;
  - L41: vin?: string;
  - L54: vin: context.vin,
  - L82: // Batch insert with conflict handling (avoid duplicates by URL and VIN within 24h)
- **dealer** (2)
  - L23: dealer?: string;
  - L70: dealer: listing.dealer_name,
- **url** (3)
  - L21: url?: string;
  - L68: url: listing.listing_url,
  - L82: // Batch insert with conflict handling (avoid duplicates by URL and VIN within 24h)
- **openai** (3)
  - L1: // Market Listing Database Service - Persists OpenAI market search results
  - L67: listing_url: listing.listing_url || `https://openai-generated-${Date.now()}`,
  - L79: notes: `Saved from ${listing.source || 'OpenAI search'} at ${new Date().toISOString()}`
- **storage** (11)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L36: * Batch insert market listings with error handling
  - L82: // Batch insert with conflict handling (avoid duplicates by URL and VIN within 24h)
  - L83: const { data, error } = await supabase
  - L85: .insert(listingsToInsert)

### /workspaces/car-detective-mvp/src/services/valuation/msrpLookupService.ts  (LOC 161)
functions: getDynamicMSRP, dbResult, estimatedMSRP, yearBasedMSRP, lookupMSRPFromDatabase, query, estimateMSRPFromSimilar, prices, avgMSRP, getYearBasedMSRPEstimate, currentYear, vehicleAge, basePrice, makeMultiplier, yearMultiplier
- **make** (17)
  - L15: make: string,
  - L19: console.log('🔍 Dynamic MSRP lookup for:', { year, make, model, trim });
  - L22: const dbResult = await lookupMSRPFromDatabase(year, make, model, trim);
  - L29: const estimatedMSRP = await estimateMSRPFromSimilar(year, make, model);
  - L36: const yearBasedMSRP = getYearBasedMSRPEstimate(year, make);
- **model** (11)
  - L16: model: string,
  - L19: console.log('🔍 Dynamic MSRP lookup for:', { year, make, model, trim });
  - L22: const dbResult = await lookupMSRPFromDatabase(year, make, model, trim);
  - L29: const estimatedMSRP = await estimateMSRPFromSimilar(year, make, model);
  - L44: model: string,
- **year** (18)
  - L14: year: number,
  - L19: console.log('🔍 Dynamic MSRP lookup for:', { year, make, model, trim });
  - L22: const dbResult = await lookupMSRPFromDatabase(year, make, model, trim);
  - L29: const estimatedMSRP = await estimateMSRPFromSimilar(year, make, model);
  - L35: // Strategy 3: Use year-based estimation
- **price** (1)
  - L152: const basePrice = 35000; // 2024 average new car price
- **storage** (4)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L49: let query = supabase
  - L76: const { data: generalData, error: generalError } = await supabase
  - L104: const { data: similarVehicles, error } = await supabase

### /workspaces/car-detective-mvp/src/services/valuation/vehicleDataService.ts  (LOC 87)
exports: VehicleSnapshot
functions: getVehicleDataByVin, vehicle, zip, zip, getVehicleDataByValuationId, zip
- **make** (3)
  - L26: make: vehicle.make || 'TOYOTA',
  - L54: make: requestData.make || 'TOYOTA',
  - L79: make: data.make || 'TOYOTA',
- **model** (3)
  - L27: model: vehicle.model || 'Camry',
  - L55: model: requestData.model || 'Camry',
  - L80: model: data.model || 'Camry',
- **year** (3)
  - L25: year: vehicle.year || 2018,
  - L53: year: requestData.year || 2018,
  - L78: year: data.year || 2018,
- **mileage** (3)
  - L31: mileage: vehicle.mileage || 0,
  - L58: mileage: requestData.mileage || 0,
  - L83: mileage: data.mileage || 0,
- **vin** (8)
  - L10: export async function getVehicleDataByVin(vin: string): Promise<VehicleSnapshot | null> {
  - L11: // First try to get from VIN decoding service
  - L12: const { data: vinData, error: vinError } = await supabase.functions.invoke('vin-decoder', {
  - L13: body: { vin }
  - L24: vin,
- **zip** (10)
  - L6: zip?: string;
  - L22: const zip = vehicle.zipCode || '95821';
  - L32: zip,
  - L33: zipCode: zip
  - L50: const zip = requestData.zip_code || '95821';
- **storage** (4)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L12: const { data: vinData, error: vinError } = await supabase.functions.invoke('vin-decoder', {
  - L38: const { data: requestData, error: requestError } = await supabase
  - L65: const { data, error } = await supabase
- **valuation** (1)
  - L37: // Fallback: try to get from valuation requests table

### /workspaces/car-detective-mvp/src/services/valuation/vehicleDecodeService.ts  (LOC 89)
functions: decodeVin, getDecodedVehicle, needsDecoding, existingVehicle
- **vin** (14)
  - L10: * PHASE 1 FIX: Core VIN decode service that ensures decode results are saved to database
  - L12: export async function decodeVin(vin: string): Promise<VehicleDecodeResult> {
  - L14: if (!vin || vin.length !== 17) {
  - L17: error: 'Invalid VIN format. VIN must be 17 characters long.'
  - L22: body: { vin: vin.toUpperCase() }
- **storage** (4)
  - L1: import { supabase } from '@/integrations/supabase/client';
  - L21: const { data, error } = await supabase.functions.invoke('unified-decode', {
  - L39: const { data: savedVehicle, error: verifyError } = await supabase
  - L66: const { data, error } = await supabase

### /workspaces/car-detective-mvp/src/services/valuationAuditLogger.ts  (LOC 141)
exports: ValuationAuditPayload
functions: logValuationAudit, auditData, logPipelineStage, stageData, stageKey, logValuationAuditFallback, auditId, auditData
- **vin** (4)
  - L29: vin: payload.input?.vin || 'unknown',
  - L84: vin: string,
  - L95: console.log(`📊 Pipeline stage ${stage}:`, { vin, passed: metadata.passed, reason: metadata.reason });
  - L99: vin: vin,
- **storage** (2)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L55: const { data, error } = await supabase.functions.invoke('log-valuation-audit', {
- **valuation** (5)
  - L1: // Valuation Audit Logger - Enhanced audit trail system with service role support
  - L16: * Log valuation audit - Uses edge function for service role authentication
  - L20: console.log('📝 Logging valuation audit:', {
  - L55: const { data, error } = await supabase.functions.invoke('log-valuation-audit', {
  - L66: console.log('✅ Valuation audit logged with ID:', data.id);

### /workspaces/car-detective-mvp/src/services/vehicleDecodeService.ts  (LOC 174)
functions: decodeVin, decoded, metadata, retryDecode, MAX_RETRIES, result, isTransientError, auditDecodeSystem, thirtyDaysAgo, totalFailures, totalAttempts, successRate
- **make** (1)
  - L33: decoded.make || '',
- **model** (1)
  - L34: decoded.model || '',
- **year** (1)
  - L35: decoded.year || new Date().getFullYear()
- **vin** (14)
  - L6: export async function decodeVin(vin: string): Promise<VehicleDecodeResponse> {
  - L8: console.log('🔍 Starting VIN decode for:', vin);
  - L11: body: { vin: vin.toUpperCase() }
  - L18: vin,
  - L42: vin: data.vin,
- **retry** (3)
  - L85: const isTransientError = result.error?.includes('timeout') ||
  - L91: console.log(`🔄 Detected transient error, will retry: ${result.error}`);
  - L99: console.error('❌ Retry decode failed:', error);
- **storage** (5)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L10: const { data, error } = await supabase.functions.invoke('unified-decode', {
  - L46: // Inject parsed metadata into decoded result
  - L123: const { data: failures, error } = await supabase
  - L148: const { count: successfulDecodes } = await supabase

### /workspaces/car-detective-mvp/src/services/vehicleLookupService.ts  (LOC 100)
functions: fetchVehicleByVin, decodedData, fetchVehicleByPlate, fetchTrimOptions, key
- **make** (5)
  - L21: make: decodedData.make,
  - L61: make: 'Honda',
  - L86: export async function fetchTrimOptions(make: string, model: string, year: number): Promise<string[]> {
  - L90: // Mock trim options based on make/model
  - L98: const key = `${make}_${model}`;
- **model** (5)
  - L22: model: decodedData.model,
  - L62: model: 'Accord',
  - L86: export async function fetchTrimOptions(make: string, model: string, year: number): Promise<string[]> {
  - L90: // Mock trim options based on make/model
  - L98: const key = `${make}_${model}`;
- **year** (3)
  - L20: year: decodedData.year,
  - L60: year: 2020,
  - L86: export async function fetchTrimOptions(make: string, model: string, year: number): Promise<string[]> {
- **mileage** (2)
  - L33: mileage: 0, // Default for new lookup
  - L74: mileage: 52000,
- **vin** (5)
  - L4: export async function fetchVehicleByVin(vin: string): Promise<DecodedVehicleInfo> {
  - L8: body: { vin: vin.toUpperCase() }
  - L19: vin: decodedData.vin,
  - L45: throw new Error(data?.error || 'Unable to decode VIN');
  - L48: throw error instanceof Error ? error : new Error('VIN lookup failed');
- **photos** (9)
  - L36: // Add sample photos for demo purposes
  - L37: photos: [
  - L38: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop',
  - L39: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'
  - L41: primaryPhoto: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop'
- **storage** (2)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L7: const { data, error } = await supabase.functions.invoke('unified-decode', {

### /workspaces/car-detective-mvp/src/services/vinForecastService.ts  (LOC 74)
exports: VinForecast, formatForecastText
functions: getOrCreateVinForecast, forecastData, formatForecastText, direction, amount, confidencePercent
- **vin** (5)
  - L7: vin: string;
  - L18: export async function getOrCreateVinForecast(vin: string): Promise<VinForecast | null> {
  - L24: .eq('vin', vin)
  - L35: const forecastData = await generateVinForecast(vin);
  - L41: vin,
- **storage** (4)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L21: const { data: existingForecast } = await supabase
  - L38: const { data: newForecast, error } = await supabase
  - L40: .insert({

### /workspaces/car-detective-mvp/src/tests/e2e/valuation-flow.test.tsx  (LOC 91)
- **make** (1)
  - L23: cy.get('[name="make"]').select('Honda');
- **model** (1)
  - L24: cy.get('[name="model"]').select('Accord');
- **year** (1)
  - L25: cy.get('[name="year"]').select('2019');
- **mileage** (1)
  - L26: cy.get('[name="mileage"]').type('45000');
- **vin** (6)
  - L53: it('should complete VIN lookup flow and display results with condition assessment', () => {
  - L54: // Visit the VIN lookup page
  - L55: cy.visit('/vin-lookup');
  - L57: // Enter a test VIN
  - L58: cy.get('[name="vin"]').type('1HGCV1F34JA027939');
- **photos** (5)
  - L8: * 4. Verify that the condition assessment is shown if photos were uploaded
  - L69: // Upload test photos
  - L70: cy.fixture('test-car-photo.jpg').then(fileContent => {
  - L73: fileName: 'test-car-photo.jpg',
  - L74: mimeType: 'image/jpeg'
- **zip** (1)
  - L28: cy.get('[name="zip"]').type('94103');
- **retry** (3)
  - L34: cy.contains('Valuation Result', { timeout: 10000 }).should('be.visible');
  - L64: cy.contains('Vehicle Found', { timeout: 10000 }).should('be.visible');
  - L82: cy.contains('AI Condition Assessment', { timeout: 15000 }).should('be.visible');
- **valuation** (15)
  - L2: * E2E test for valuation flow
  - L4: * This test verifies that the full valuation flow works properly:
  - L7: * 3. Check that the valuation result displays correctly
  - L17: describe('Valuation Flow', () => {
  - L18: it('should complete manual valuation flow and display results', () => {

### /workspaces/car-detective-mvp/src/tests/e2e/vinToResult.e2e.test.ts  (LOC 195)
functions: testVin, testZipCode, optionalTab, valueElement, valueText, value, confidenceElement, confidenceText, confidence, marketListingsSection, listingRows, listingCount, firstPrice, priceText, price, warningBanner, pdfButton, listingLinks, linkCount, i, link, href, response, sourceBadges, warningBanner
- **make** (1)
  - L118: await page.selectOption('select[name="make"]', 'Honda');
- **model** (1)
  - L119: await page.selectOption('select[name="model"]', 'Accord');
- **year** (1)
  - L120: await page.fill('input[name="year"]', '2020');
- **price** (3)
  - L78: // Check first listing has valid price
  - L82: const price = parseInt(priceText?.replace(/[^0-9]/g, '') || '0');
  - L83: expect(price).toBeGreaterThan(1000);
- **mileage** (4)
  - L29: await page.fill('input[name="mileage"]', '45000');
  - L121: await page.fill('input[name="mileage"]', '50000');
  - L143: await page.fill('input[name="mileage"]', '45000');
  - L181: await page.fill('input[name="mileage"]', '45000');
- **vin** (19)
  - L2: * End-to-End Test for VIN to Result Flow
  - L3: * Tests the complete valuation pipeline from VIN entry to final result display
  - L8: test.describe('VIN to Result E2E Flow', () => {
  - L9: // Test VIN - Ford F-150
  - L13: test('should complete VIN lookup to valuation result flow', async ({ page }) => {
- **zip** (1)
  - L182: await page.fill('input[name="zipCode"]', '99999'); // Use obscure ZIP to trigger fallback
- **url** (3)
  - L135: test('should verify URL accessibility for market listings', async ({ page }) => {
  - L159: // Verify URL format is valid
  - L167: console.warn(`Could not verify URL ${href}:`, error);
- **retry** (7)
  - L22: await page.waitForURL('**/valuation/followup**', { timeout: 15000 });
  - L47: await page.waitForURL('**/results/**', { timeout: 20000 });
  - L129: await page.waitForURL('**/results/**', { timeout: 15000 });
  - L140: await page.waitForURL('**/valuation/followup**', { timeout: 15000 });
  - L146: await page.waitForURL('**/results/**', { timeout: 20000 });
- **openai** (5)
  - L174: test('should detect OpenAI fallback usage', async ({ page }) => {
  - L186: // Check for indicators of OpenAI fallback
  - L187: const sourceBadges = page.locator('[data-testid="source-badge"], .badge:has-text("openai"), .badge:has-text("fallback")');
  - L190: // If OpenAI fallback was used, should see indicators
  - L192: console.log('OpenAI fallback detected - appropriate warnings displayed');
- **valuation** (18)
  - L3: * Tests the complete valuation pipeline from VIN entry to final result display
  - L13: test('should complete VIN lookup to valuation result flow', async ({ page }) => {
  - L15: await page.goto('/valuation/vin');
  - L22: await page.waitForURL('**/valuation/followup**', { timeout: 15000 });
  - L25: await expect(page.locator('h1')).toContainText('Complete Your Comprehensive Valuation');

### /workspaces/car-detective-mvp/src/types/assistant.ts  (LOC 41)
exports: ChatMessage, VehicleContext, AssistantContext, AskAIRequest, AskAIResponse
- **make** (1)
  - L8: make?: string;
- **model** (1)
  - L9: model?: string;
- **year** (1)
  - L10: year?: number;
- **mileage** (1)
  - L12: mileage?: number;
- **vin** (1)
  - L14: vin?: string;

### /workspaces/car-detective-mvp/src/types/auction.ts  (LOC 31)
exports: AuctionResult, AuctionInsight
- **make** (1)
  - L5: make: string;
- **model** (1)
  - L6: model: string;
- **year** (1)
  - L7: year: number;
- **price** (1)
  - L9: price: string | number;
- **mileage** (1)
  - L8: mileage: number;
- **vin** (1)
  - L4: vin: string;
- **photos** (1)
  - L15: photos: string[];

### /workspaces/car-detective-mvp/src/types/auctionIntelligence.ts  (LOC 31)
exports: AuctionIntelligencePriceTrend, AuctionIntelligenceFlipFlags, AuctionIntelligenceData
- **price** (1)
  - L4: price: number;
- **vin** (1)
  - L23: vin: string;

### /workspaces/car-detective-mvp/src/types/audit.ts  (LOC 53)
exports: PipelineStage, StageStatus, ApiOutcome, ExclusionReason, ListingAuditInput, ListingQualityInput
- **dealer** (1)
  - L34: source?: string;              // dealer/marketplace name
- **valuation** (1)
  - L8: | 'valuation';

### /workspaces/car-detective-mvp/src/types/dealer.ts  (LOC 49)
exports: Dealer, DealerOffer, DealerValuation, ValuationWithCondition, Valuation
- **dealer** (1)
  - L2: export interface Dealer {
- **valuation** (1)
  - L42: export interface Valuation {

### /workspaces/car-detective-mvp/src/types/dealerVehicle.ts  (LOC 26)
exports: DealerVehicle, DealerVehicleFormData
- **make** (2)
  - L3: make: string;
  - L16: make: string;
- **model** (2)
  - L4: model: string;
  - L17: model: string;
- **year** (2)
  - L5: year: number;
  - L18: year: number;
- **price** (2)
  - L7: price: number;
  - L20: price: number;
- **mileage** (2)
  - L6: mileage: number;
  - L19: mileage?: number;
- **photos** (1)
  - L25: photos?: string[];

### /workspaces/car-detective-mvp/src/types/follow-up-answers.ts  (LOC 98)
exports: ServiceHistoryDetails, ModificationDetails, AccidentDetails, TireConditionOption, ConditionOption, BrakeConditionOption, FollowUpAnswers
- **make** (1)
  - L51: make?: string;
- **model** (1)
  - L52: model?: string;
- **year** (1)
  - L53: year?: number;
- **mileage** (2)
  - L13: mileage?: string;
  - L58: mileage: number;
- **vin** (1)
  - L46: vin: string;

### /workspaces/car-detective-mvp/src/types/listing.ts  (LOC 40)
exports: Listing, RawListing
- **make** (2)
  - L16: make: string;
  - L36: make?: string;
- **model** (2)
  - L17: model: string;
  - L37: model?: string;
- **year** (2)
  - L15: year: number;
  - L35: year?: number;
- **price** (2)
  - L8: price: number;
  - L28: price: number | string;
- **mileage** (2)
  - L18: mileage: number;
  - L38: mileage?: number;
- **photos** (2)
  - L10: image: string;
  - L30: image?: string;
- **url** (2)
  - L9: url: string;
  - L29: url?: string;

### /workspaces/car-detective-mvp/src/types/listings.ts  (LOC 48)
exports: BaseListing, CarMaxListing, CraigslistListing, AutotraderListing, NormalizedListing
- **make** (1)
  - L8: make: string;
- **model** (1)
  - L9: model: string;
- **year** (1)
  - L7: year: number;
- **price** (1)
  - L5: price: number;
- **mileage** (1)
  - L6: mileage: number;
- **dealer** (2)
  - L32: sellerType?: 'dealer' | 'private' | 'other';
  - L39: dealerName?: string;
- **url** (1)
  - L10: url: string;

### /workspaces/car-detective-mvp/src/types/lookup.ts  (LOC 47)
exports: PlateLookupInfo, DecodedVehicleInfo, ManualEntryFormData
- **make** (3)
  - L5: make: string;
  - L14: make?: string;
  - L40: make: string;
- **model** (3)
  - L6: model: string;
  - L15: model?: string;
  - L41: model: string;
- **year** (3)
  - L7: year: number;
  - L16: year?: number;
  - L42: year: number;
- **mileage** (2)
  - L29: mileage?: number;
  - L43: mileage?: number;
- **vin** (3)
  - L8: vin?: string;
  - L17: vin?: string;
  - L46: vin?: string;
- **photos** (1)
  - L35: photos?: string[];

### /workspaces/car-detective-mvp/src/types/market-orchestration.ts  (LOC 90)
exports: VehicleParams, OrchestrationRequest, MarketComp, OrchestrationResult, CompSummary, SourceResult, SourceDistribution, MarketSource
- **make** (2)
  - L5: make: string;
  - L27: make?: string;
- **model** (2)
  - L6: model: string;
  - L28: model?: string;
- **year** (2)
  - L4: year: number;
  - L26: year?: number;
- **price** (1)
  - L30: price: number;
- **mileage** (2)
  - L8: mileage?: number;
  - L31: mileage?: number;
- **vin** (2)
  - L11: vin?: string;
  - L25: vin?: string;
- **valuation** (1)
  - L76: comps?: any[];

### /workspaces/car-detective-mvp/src/types/marketListing.ts  (LOC 111)
exports: MarketListing, isDatabaseListing, isLiveSearchListing, getNormalizedUrl, getNormalizedSourceType, getNormalizedDealerName, getNormalizedTimestamp, normalizeListing
functions: isDatabaseListing, isLiveSearchListing, getNormalizedUrl, getNormalizedSourceType, getNormalizedDealerName, getNormalizedTimestamp, normalizeListing
- **make** (1)
  - L9: make?: string;
- **model** (1)
  - L10: model?: string;
- **year** (1)
  - L8: year?: number;
- **price** (1)
  - L6: price: number;
- **mileage** (1)
  - L7: mileage?: number;
- **vin** (1)
  - L13: vin?: string;
- **photos** (1)
  - L37: photos?: string[];
- **dealer** (7)
  - L29: // Dealer and source information
  - L30: dealer?: string;       // Generic dealer field
  - L31: dealerName?: string;
  - L33: sourceType?: string;   // 'live' | 'database' | 'dealer' | 'auction' | 'classified'
  - L89: // Helper to get normalized dealer name
- **zip** (1)
  - L14: zip?: string;
- **url** (2)
  - L23: url?: string;         // Generic URL field (for compatibility)
  - L79: // Helper to get normalized URL from either format
- **openai** (1)
  - L17: source: string; // e.g., 'Cars.com', 'AutoTrader', 'Enhanced DB', 'OpenAI Search'

### /workspaces/car-detective-mvp/src/types/nicb.ts  (LOC 9)
exports: NicbData
- **make** (1)
  - L6: make?: string;
- **model** (1)
  - L7: model?: string;
- **year** (1)
  - L8: year?: number;
- **vin** (1)
  - L5: vin: string;

### /workspaces/car-detective-mvp/src/types/photo.ts  (LOC 68)
exports: PhotoScore, PhotoAnalysisResult, PhotoScoringResult, AICondition, Photo, PhotoUploadProps, MAX_FILES, MIN_FILES
functions: MAX_FILES, MIN_FILES
- **photos** (1)
  - L46: export interface Photo {
- **url** (3)
  - L3: url: string;
  - L20: url: string;
  - L48: url: string;

### /workspaces/car-detective-mvp/src/types/premium-valuation.ts  (LOC 97)
exports: FeatureOption, FormData, FormDataKey
- **make** (1)
  - L11: make: string;
- **model** (1)
  - L12: model: string;
- **year** (1)
  - L13: year: number;
- **mileage** (1)
  - L14: mileage: number;
- **vin** (1)
  - L23: vin?: string;
- **photos** (2)
  - L78: // Photos and media
  - L79: photos?: File[];
- **dealer** (1)
  - L63: serviceHistory?: 'dealer' | 'independent' | 'owner' | 'unknown';
- **valuation** (2)
  - L84: // Valuation results
  - L85: valuation?: number;

### /workspaces/car-detective-mvp/src/types/serviceRecord.d.ts  (LOC 9)
exports: ServiceRecord
- **mileage** (1)
  - L5: mileage: number;
- **vin** (1)
  - L3: vin: string;

### /workspaces/car-detective-mvp/src/types/steps.ts  (LOC 16)
exports: StepConfig, VehicleInfo
- **make** (1)
  - L9: make: string;
- **model** (1)
  - L10: model: string;
- **year** (1)
  - L8: year: number;
- **mileage** (1)
  - L12: mileage?: number;
- **vin** (1)
  - L14: vin?: string;

### /workspaces/car-detective-mvp/src/types/unified-lookup.ts  (LOC 85)
exports: UnifiedVehicleData, UnifiedLookupFormData, UnifiedLookupResult, LookupMethod, LookupTier, LookupSource, DecodedVehicleInfo, LegacyVehicleData, LookupFormData, VehicleLookupResult
- **make** (2)
  - L11: make: string;
  - L54: make?: string;
- **model** (2)
  - L12: model: string;
  - L55: model?: string;
- **year** (2)
  - L10: year: number;
  - L56: year?: string;
- **mileage** (2)
  - L32: mileage?: number;
  - L57: mileage?: string;
- **vin** (6)
  - L5: vin?: string;
  - L46: // VIN lookup
  - L47: vin?: string;
  - L67: source: 'vin' | 'plate' | 'manual' | 'vpic' | 'carfax';
  - L77: export type LookupMethod = 'vin' | 'plate' | 'manual';
- **photos** (1)
  - L37: photos?: string[];
- **valuation** (1)
  - L40: // Valuation

### /workspaces/car-detective-mvp/src/types/unified.ts  (LOC 74)
exports: Vehicle, ValuationAdjustment, ValuationData, TitleRecallInfo, UserProfile, DealerOffer
- **make** (1)
  - L5: make: string;
- **model** (1)
  - L6: model: string;
- **year** (1)
  - L4: year: number;
- **mileage** (1)
  - L8: mileage: number;
- **vin** (1)
  - L10: vin?: string;
- **dealer** (1)
  - L58: role: 'individual' | 'dealer' | 'admin';

### /workspaces/car-detective-mvp/src/types/valuation-history.ts  (LOC 31)
exports: Valuation, ValuationHistory, ValuationBreakdownItem
- **make** (2)
  - L5: make?: string;
  - L19: make: string;
- **model** (2)
  - L6: model?: string;
  - L20: model: string;
- **year** (2)
  - L7: year?: number;
  - L21: year: number;
- **vin** (2)
  - L8: vin?: string;
  - L22: vin?: string;
- **valuation** (1)
  - L2: export interface Valuation {

### /workspaces/car-detective-mvp/src/types/valuation.js  (LOC 7)
exports: NHTSARecall, VehicleSpecification, EnrichedVehicleProfile
- **valuation** (1)
  - L1: // Proxy module to re-export valuation types for test compatibility

### /workspaces/car-detective-mvp/src/types/valuation.ts  (LOC 504)
exports: NHTSARecall, VehicleSpecification, EnrichedVehicleProfile, ReportData, AdjustmentBreakdown, AIConditionResult, ReportOptions, SectionParams, PdfOptions, AICondition, LegacyValuationResult, ValuationResult, AuditLog, EnhancedAuditLog, ValuationInput, UnifiedValuationResult, ValuationAdjustment, EnhancedValuationResult, ValueBreakdown, DealerInsights, SavedValuation, ChatMessage, ValuationPipeline, ModificationDetails, TitleStatus, RecallEntry, TitleHistoryResult, RecallCheckResult
- **make** (8)
  - L18: make: string;
  - L47: make: string;
  - L148: make: string;
  - L250: make: string;
  - L272: make: string;
- **model** (8)
  - L19: model: string;
  - L48: model: string;
  - L149: model: string;
  - L251: model: string;
  - L273: model: string;
- **year** (8)
  - L20: year: number;
  - L49: year: number;
  - L150: year: number;
  - L252: year: number;
  - L271: year: number;
- **price** (2)
  - L54: price: number;
  - L302: price: number;
- **mileage** (8)
  - L51: mileage: number;
  - L151: mileage?: number;
  - L213: mileage?: number;
  - L253: mileage?: number;
  - L278: mileage?: number;
- **vin** (10)
  - L17: vin: string;
  - L32: vin: string;
  - L46: vin?: string;
  - L170: vin?: string;
  - L209: vin: string;
- **dealer** (1)
  - L320: // ENHANCED: Dealer Source Contributions for Transparency
- **zip** (3)
  - L212: zip: string;
  - L229: zip: boolean;
  - L277: zip: string;
- **url** (2)
  - L308: url?: string;
  - L397: exclusionReasons: Array<{ source: string; url: string; reason: string }>;
- **valuation** (5)
  - L188: median: number;
  - L207: // Enhanced audit log for valuation traceability
  - L247: // Valuation input interface
  - L266: // Unified valuation result interface
  - L360: // Enhanced valuation result interface

### /workspaces/car-detective-mvp/src/types/valuationTypes.ts  (LOC 25)
exports: MarketSearchInput, MarketPriceEstimate
- **make** (1)
  - L6: make: string;
- **model** (1)
  - L7: model: string;
- **year** (1)
  - L8: year: number;
- **mileage** (1)
  - L10: mileage?: number;
- **vin** (1)
  - L5: vin?: string;
- **zip** (2)
  - L12: zip?: string;
  - L13: zipCode?: string; // Alternative name for zip
- **openai** (1)
  - L3: // Market search types for the OpenAI agent
- **valuation** (1)
  - L19: median: number | null;

### /workspaces/car-detective-mvp/src/types/vehicle-decode.ts  (LOC 13)
exports: VehicleDecodeResponse
- **vin** (1)
  - L9: vin: string;

### /workspaces/car-detective-mvp/src/types/vehicle-lookup.ts  (LOC 27)
exports: LookupFormData, VehicleLookupResult, LookupMethod, LookupTier
- **make** (1)
  - L11: make?: string;
- **model** (1)
  - L12: model?: string;
- **year** (1)
  - L13: year?: string;
- **mileage** (1)
  - L14: mileage?: string;
- **vin** (2)
  - L8: vin?: string;
  - L26: export type LookupMethod = 'vin' | 'plate' | 'manual';
- **valuation** (1)
  - L21: valuation?: number;

### /workspaces/car-detective-mvp/src/types/vehicle.ts  (LOC 112)
exports: Vehicle, DecodedVehicleInfo, PlateLookupInfo, VehicleTrim, UnifiedVehicleData
- **make** (5)
  - L5: make: string;
  - L18: make: string;
  - L59: make?: string;
  - L71: make: string;
  - L84: make: string;
- **model** (5)
  - L6: model: string;
  - L19: model: string;
  - L60: model?: string;
  - L72: model: string;
  - L85: model: string;
- **year** (5)
  - L7: year: number;
  - L17: year: number;
  - L58: year?: number;
  - L70: year: number;
  - L83: year: number;
- **mileage** (4)
  - L8: mileage: number;
  - L33: mileage?: number;
  - L62: mileage?: number;
  - L99: mileage?: number;
- **vin** (5)
  - L4: vin: string;
  - L14: vin?: string;
  - L41: // VIN enrichment fields
  - L57: vin?: string;
  - L80: vin?: string;
- **photos** (2)
  - L38: photos?: string[];
  - L102: photos?: string[];
- **valuation** (2)
  - L111: } from '../../apps/ain-valuation-engine/src/types/canonical';
  - L112: export { toCanonicalVehicleData } from '../../apps/ain-valuation-engine/src/types/canonical';

### /workspaces/car-detective-mvp/src/types/vpic.ts  (LOC 37)
exports: VpicVehicleData, VpicResponse, VpicError
- **make** (1)
  - L3: make: string | null;
- **model** (1)
  - L4: model: string | null;
- **year** (2)
  - L5: modelYear: number | null; // This is what's used instead of year
  - L6: year?: number; // Adding this to fix compatibility issues
- **vin** (1)
  - L2: vin: string;

### /workspaces/car-detective-mvp/src/utils/adjustments/conditionAdjustments.ts  (LOC 65)
exports: getConditionMultiplier, getConditionDescription, getConditionAdjustment
functions: CONDITION_MULTIPLIERS, getConditionMultiplier, normalizedCondition, getConditionDescription, normalizedCondition, getConditionAdjustment, multiplier
- **price** (1)
  - L56: * @param basePrice The base price of the vehicle
- **valuation** (2)
  - L7: * Standard condition multipliers based on industry valuation practices
  - L49: return "Vehicle condition is unspecified. Assuming average condition for valuation purposes.";

### /workspaces/car-detective-mvp/src/utils/adjustments/descriptions.ts  (LOC 13)
exports: getMileageDescription
functions: getMileageDescription
- **mileage** (10)
  - L1: export function getMileageDescription(mileage: number): string {
  - L2: if (mileage < 30000) {
  - L3: return "Vehicle has low mileage (below 30,000 miles)";
  - L4: } else if (mileage <= 60000) {
  - L5: return "Vehicle has average mileage";

### /workspaces/car-detective-mvp/src/utils/adjustments/features/database.ts  (LOC 128)
exports: PREMIUM_FEATURES
- **valuation** (1)
  - L6: * This database contains standard valuation adjustments for premium vehicle features.

### /workspaces/car-detective-mvp/src/utils/adjustments/locationAdjustments.ts  (LOC 42)
exports: LocationAdjustment, getLocationAdjustment, getZipAdjustment, getRegionNameFromZip
functions: getLocationAdjustment, adjustment, getZipAdjustment, adjustment, getRegionNameFromZip
- **valuation** (1)
  - L2: // Location-based valuation adjustments

### /workspaces/car-detective-mvp/src/utils/adjustments/mileageAdjustments.ts  (LOC 75)
exports: mileageAdjustmentCurve, getMileageDescription, getMileageAdjustment
functions: mileageAdjustmentCurve, getMileageDescription, getMileageAdjustment, multiplier
- **price** (1)
  - L66: * @param basePrice The base price of the vehicle
- **mileage** (42)
  - L2: * Mileage Adjustment Calculator
  - L3: * Calculates value adjustments based on vehicle mileage using industry standard
  - L8: * Calculates the mileage adjustment multiplier based on the vehicle's mileage
  - L9: * @param mileage The vehicle mileage
  - L12: export function mileageAdjustmentCurve(mileage: number): number {

### /workspaces/car-detective-mvp/src/utils/adjustments/packageAdjustments.ts  (LOC 122)
exports: PackageAdjustment, getPackageAdjustments, getTotalPackageValue
functions: getPackageAdjustments, trimLower, featuresList, universalFeatures, hasFeature, getTotalPackageValue, adjustments
- **make** (5)
  - L13: make: string,
  - L23: if (make.toLowerCase() === 'toyota') {
  - L65: if (make.toLowerCase() === 'honda') {
  - L115: make: string,
  - L120: const adjustments = getPackageAdjustments(make, model, trim, features);
- **model** (3)
  - L14: model: string,
  - L116: model: string,
  - L120: const adjustments = getPackageAdjustments(make, model, trim, features);

### /workspaces/car-detective-mvp/src/utils/adjustments/titleStatusAdjustments.ts  (LOC 74)
exports: getTitleStatusAdjustment
functions: getTitleStatusAdjustmentFromDB, status, multiplier, adjustment, getTitleStatusAdjustment, multiplier, adjustment
- **price** (2)
  - L4: * Calculate the price adjustment based on the vehicle's title status
  - L6: * and calculates the adjustment based on the base price
- **storage** (2)
  - L1: import { supabase } from "@/integrations/supabase/client";
  - L17: const { data, error } = await supabase

### /workspaces/car-detective-mvp/src/utils/adjustments/trimAdjustments.ts  (LOC 43)
exports: getTrimAdjustment
functions: getTrimAdjustment, modelTrimData, trimAdjustment
- **make** (2)
  - L2: make: string,
  - L36: const modelTrimData = trimData[make]?.[model];
- **model** (2)
  - L3: model: string,
  - L36: const modelTrimData = trimData[make]?.[model];

### /workspaces/car-detective-mvp/src/utils/ain/generateSummaryForPdf.ts  (LOC 75)
exports: generateSummaryForPdf
functions: generateSummaryForPdf, vehicle, value, confidence, summary, difference, percentDiff, avgMarketPrice, marketDiff, marketPercentDiff, auctionCount, positiveAdj, negativeAdj, isAboveCompetitors
- **make** (1)
  - L5: const vehicle = `${reportData.year} ${reportData.make} ${reportData.model}`;
- **model** (1)
  - L5: const vehicle = `${reportData.year} ${reportData.make} ${reportData.model}`;
- **year** (1)
  - L5: const vehicle = `${reportData.year} ${reportData.make} ${reportData.model}`;
- **price** (2)
  - L27: const avgMarketPrice = reportData.marketplaceListings.reduce((sum: number, listing: any) => sum + listing.price, 0) / reportData.marketplaceListings.length;
  - L31: summary += ` Based on ${reportData.marketplaceListings.length} similar marketplace listings with an average price of $${avgMarketPrice.toLocaleString()}, `;
- **valuation** (7)
  - L17: summary += ` Our valuation is ${Math.abs(parseFloat(percentDiff))}% higher than competitor averages of $${reportData.competitorAverage.toLocaleString()}.`;
  - L19: summary += ` Our valuation is ${Math.abs(parseFloat(percentDiff))}% lower than competitor averages of $${reportData.competitorAverage.toLocaleString()}.`;
  - L21: summary += ` Our valuation aligns closely with competitor averages of $${reportData.competitorAverage.toLocaleString()}.`;
  - L34: summary += `our valuation is ${Math.abs(parseFloat(marketPercentDiff))}% above market average.`;
  - L36: summary += `our valuation is ${Math.abs(parseFloat(marketPercentDiff))}% below market average.`;

### /workspaces/car-detective-mvp/src/utils/ain/scoreDealerOffers.ts  (LOC 88)
exports: DealerOffer, ScoredOffer, scoreDealerOffers, getBestOffer, getOfferInsights
functions: scoreDealerOffers, delta, percentageDiff, score, summary, getBestOffer, getOfferInsights, bestOffer, averageOffer, totalOffers
- **dealer** (2)
  - L50: ? `This dealer is offering $${delta.toLocaleString()} **above** your valuation.`
  - L51: : `This dealer is offering $${Math.abs(delta).toLocaleString()} **below** your valuation.`;
- **valuation** (2)
  - L50: ? `This dealer is offering $${delta.toLocaleString()} **above** your valuation.`
  - L51: : `This dealer is offering $${Math.abs(delta).toLocaleString()} **below** your valuation.`;

### /workspaces/car-detective-mvp/src/utils/api-utils.ts  (LOC 196)
exports: ApiResponse, EnhancedApiError, handleApiError
functions: handleApiError, response, result, enhancedError, loadingToast, enhancedError
- **fetch** (1)
  - L103: const response = await fetch(endpoint, {
- **retry** (5)
  - L16: RATE_LIMIT = "rate_limit",
  - L62: // Rate limit
  - L63: if (error.message.includes("rate limit") || error.message.includes("429")) {
  - L65: message: "Rate limit exceeded. Please try again later.",
  - L66: type: ApiErrorType.RATE_LIMIT,
- **storage** (4)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L42: // Supabase specific error
  - L145: * Wrapper for Supabase functions with improved error handling
  - L158: const { data, error } = await supabase.functions.invoke(functionName, {

### /workspaces/car-detective-mvp/src/utils/assistantContext.ts  (LOC 149)
exports: VehicleContext, AssistantContext, ChatMessage, AskAIRequest, AskAIResponse, detectIntent, generateResponse
functions: detectIntent, message_lower, generateResponse, vehicleInfo, response
- **make** (3)
  - L5: make?: string;
  - L87: ? `${(vehicle || vehicleContext)?.year || ''} ${(vehicle || vehicleContext)?.make || ''} ${(vehicle || vehicleContext)?.model || ''}`.trim()
  - L97: response = `I'd be happy to help you determine the value of your ${vehicleInfo}. For an accurate valuation, I'll need some key information: the year, make, model, current mileage, overall condition, and your ZIP code. With these details, I 
- **model** (3)
  - L6: model?: string;
  - L87: ? `${(vehicle || vehicleContext)?.year || ''} ${(vehicle || vehicleContext)?.make || ''} ${(vehicle || vehicleContext)?.model || ''}`.trim()
  - L97: response = `I'd be happy to help you determine the value of your ${vehicleInfo}. For an accurate valuation, I'll need some key information: the year, make, model, current mileage, overall condition, and your ZIP code. With these details, I 
- **year** (3)
  - L7: year?: number;
  - L87: ? `${(vehicle || vehicleContext)?.year || ''} ${(vehicle || vehicleContext)?.make || ''} ${(vehicle || vehicleContext)?.model || ''}`.trim()
  - L97: response = `I'd be happy to help you determine the value of your ${vehicleInfo}. For an accurate valuation, I'll need some key information: the year, make, model, current mileage, overall condition, and your ZIP code. With these details, I 
- **price** (4)
  - L59: if (message_lower.includes('value') || message_lower.includes('worth') || message_lower.includes('price') || message_lower.includes('cost')) {
  - L95: response = `Based on our comprehensive market analysis, your ${vehicleInfo} has an estimated value of $${(vehicle || vehicleContext)?.estimatedValue?.toLocaleString()}. This valuation factors in current market conditions, the vehicle's age,
  - L110: response = `To maximize your ${vehicleInfo}'s selling price, I recommend these steps: 1) Detail it thoroughly inside and out, 2) Gather all maintenance records and repair documentation, 3) Take high-quality photos from multiple angles in go
  - L115: response = `As a premium member, you're enjoying our complete suite of valuation tools for your ${vehicleInfo}. Your benefits include: full CARFAX® vehicle history integration, 12-month price forecast projections, detailed market analysis a
- **mileage** (5)
  - L9: mileage?: number;
  - L95: response = `Based on our comprehensive market analysis, your ${vehicleInfo} has an estimated value of $${(vehicle || vehicleContext)?.estimatedValue?.toLocaleString()}. This valuation factors in current market conditions, the vehicle's age,
  - L97: response = `I'd be happy to help you determine the value of your ${vehicleInfo}. For an accurate valuation, I'll need some key information: the year, make, model, current mileage, overall condition, and your ZIP code. With these details, I 
  - L127: response = `Your premium access includes full CARFAX® vehicle history for your ${vehicleInfo}. This report shows ${(vehicle || vehicleContext)?.accidentCount || 'all'} reported incidents, ownership history (${Math.floor(Math.random() * 3) +
  - L129: response = `A complete vehicle history report is crucial for accurately valuing your ${vehicleInfo}. Our premium package includes full CARFAX® integration, revealing accident reports, service records, ownership history, title status, and mi
- **vin** (1)
  - L11: vin?: string;
- **photos** (1)
  - L110: response = `To maximize your ${vehicleInfo}'s selling price, I recommend these steps: 1) Detail it thoroughly inside and out, 2) Gather all maintenance records and repair documentation, 3) Take high-quality photos from multiple angles in go
- **dealer** (5)
  - L67: } else if (message_lower.includes('dealer') || message_lower.includes('offer') || message_lower.includes('dealership')) {
  - L115: response = `As a premium member, you're enjoying our complete suite of valuation tools for your ${vehicleInfo}. Your benefits include: full CARFAX® vehicle history integration, 12-month price forecast projections, detailed market analysis a
  - L117: response = `Our premium valuation package unlocks powerful insights for your ${vehicleInfo}. For just $29.99, you'll receive: complete CARFAX® vehicle history integration, 12-month value forecasting, comprehensive market analysis across dea
  - L122: response = `Dealer offers for your ${vehicleInfo} typically range 10-15% below private party values. This difference accounts for the dealer's overhead, reconditioning costs (typically $500-1,500), profit margin (usually 4-8%), and market r
  - L134: response = `The market for vehicles like your ${vehicleInfo} is currently showing ${Math.random() > 0.5 ? 'upward' : 'downward'} pressure. Over the past 3 months, similar vehicles have ${Math.random() > 0.5 ? 'appreciated' : 'depreciated'} 
- **zip** (2)
  - L27: zip?: string;
  - L97: response = `I'd be happy to help you determine the value of your ${vehicleInfo}. For an accurate valuation, I'll need some key information: the year, make, model, current mileage, overall condition, and your ZIP code. With these details, I 
- **storage** (2)
  - L103: response = `For your ${vehicleInfo}, our data shows ${(vehicle || vehicleContext)?.accidentCount || 'some'} reported accidents. This typically reduces a vehicle's market value by 10-30% depending on severity and repair quality. The ${(vehic
  - L127: response = `Your premium access includes full CARFAX® vehicle history for your ${vehicleInfo}. This report shows ${(vehicle || vehicleContext)?.accidentCount || 'all'} reported incidents, ownership history (${Math.floor(Math.random() * 3) +
- **valuation** (11)
  - L55: // Intent detection for car valuation assistant
  - L80: // Enhanced response generation for car valuation assistant
  - L95: response = `Based on our comprehensive market analysis, your ${vehicleInfo} has an estimated value of $${(vehicle || vehicleContext)?.estimatedValue?.toLocaleString()}. This valuation factors in current market conditions, the vehicle's age,
  - L97: response = `I'd be happy to help you determine the value of your ${vehicleInfo}. For an accurate valuation, I'll need some key information: the year, make, model, current mileage, overall condition, and your ZIP code. With these details, I 
  - L103: response = `For your ${vehicleInfo}, our data shows ${(vehicle || vehicleContext)?.accidentCount || 'some'} reported accidents. This typically reduces a vehicle's market value by 10-30% depending on severity and repair quality. The ${(vehic

### /workspaces/car-detective-mvp/src/utils/auctionFetcher.ts  (LOC 109)
functions: getAuctionResultsByVin, triggerAuctionDataFetch, sevenDaysAgo, fetchBidCarsByVin, fetchAutoAuctionsByVin
- **make** (2)
  - L21: make?: string;
  - L34: make?: string;
- **model** (2)
  - L22: model?: string;
  - L35: model?: string;
- **year** (2)
  - L20: year?: string;
  - L33: year?: string;
- **price** (3)
  - L7: price: string;
  - L18: price: string;
  - L31: price: string;
- **vin** (14)
  - L6: vin: string;
  - L17: vin: string;
  - L30: vin: string;
  - L44: export async function getAuctionResultsByVin(vin: string): Promise<AuctionResult[]> {
  - L48: .eq('vin', vin)
- **photos** (2)
  - L25: image?: string;
  - L39: image?: string;
- **storage** (7)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L45: const { data, error } = await supabase
  - L61: const { count, error } = await supabase
  - L71: const { data: recentData } = await supabase
  - L84: await supabase.functions.invoke('fetch-auction-data', {

### /workspaces/car-detective-mvp/src/utils/auditLogger.ts  (LOC 175)
exports: ValuationAuditEntry, ValuationAuditLogger, auditLogger
functions: entries, allSources, uniqueSources, calculationMethods, auditLogger
- **valuation** (8)
  - L2: * Audit logging utility for valuation calculations
  - L3: * Ensures all valuation steps are traceable and auditable
  - L12: entityType: 'valuation' | 'adjustment' | 'calculation';
  - L34: * Log a valuation calculation step
  - L49: * Log valuation data sources used

### /workspaces/car-detective-mvp/src/utils/buildTimeChecks.ts  (LOC 56)
exports: validateAINConfiguration
functions: USE_AIN_VALUATION, AIN_UPSTREAM_URL, AIN_API_KEY, NODE_ENV, PROD, validateAINConfiguration, requireAIN
- **env** (5)
  - L8: const USE_AIN_VALUATION = import.meta.env.USE_AIN_VALUATION;
  - L9: const AIN_UPSTREAM_URL = import.meta.env.AIN_UPSTREAM_URL;
  - L10: const AIN_API_KEY = import.meta.env.AIN_API_KEY;
  - L11: const NODE_ENV = import.meta.env.NODE_ENV;
  - L12: const PROD = import.meta.env.PROD;

### /workspaces/car-detective-mvp/src/utils/carfax/carfaxService.ts  (LOC 18)
exports: CarfaxData, carfaxService
functions: carfaxService
- **vin** (1)
  - L14: getCarfaxData: async (vin: string): Promise<CarfaxData | null> => {

### /workspaces/car-detective-mvp/src/utils/confidenceCalculator.test.ts  (LOC 128)
functions: score, level, score, level, score, score
- **make** (4)
  - L14: make: "BMW",
  - L38: make: "Honda",
  - L65: make: "BMW",
  - L87: make: "",
- **model** (4)
  - L15: model: "3 Series",
  - L39: model: "Civic",
  - L66: model: "3 Series",
  - L88: model: "",
- **year** (4)
  - L13: year: 2019,
  - L37: year: 2015,
  - L64: year: 2019,
  - L86: year: 1980, // Very old car
- **mileage** (4)
  - L12: mileage: 25000,
  - L36: mileage: 75000,
  - L63: mileage: 25000,
  - L85: mileage: 1000000, // Very high mileage
- **vin** (4)
  - L10: vin: "WBAJB0C51JB085775",
  - L34: vin: undefined,
  - L51: // Expect a lower score without VIN, ZIP, Carfax, etc.
  - L61: vin: "WBAJB0C51JB085775",
- **zip** (4)
  - L11: zip: "94103",
  - L35: zip: undefined,
  - L51: // Expect a lower score without VIN, ZIP, Carfax, etc.
  - L62: zip: "94103",

### /workspaces/car-detective-mvp/src/utils/confidenceCalculator.ts  (LOC 62)
exports: InputFactors, calculateConfidenceScore, getConfidenceLevel
functions: calculateConfidenceScore, score, getConfidenceLevel
- **make** (3)
  - L6: make: string;
  - L28: // Make and model provide a baseline
  - L29: if (input.make) score += 5;
- **model** (3)
  - L7: model: string;
  - L28: // Make and model provide a baseline
  - L30: if (input.model) score += 5;
- **year** (3)
  - L5: year: number;
  - L24: // Mileage and year are crucial for depreciation
  - L26: score += Math.min((new Date().getFullYear() - input.year) * 2, 10); // Scale age to a max of 10 points
- **mileage** (3)
  - L4: mileage: number;
  - L24: // Mileage and year are crucial for depreciation
  - L25: score += Math.min(input.mileage / 10000, 10); // Scale mileage to a max of 10 points
- **vin** (3)
  - L2: vin?: string;
  - L20: // VIN and ZIP provide strong location and vehicle specific data
  - L21: if (input.vin) score += 20;
- **photos** (1)
  - L38: // Photo score indicates visual appeal
- **zip** (3)
  - L3: zip?: string;
  - L20: // VIN and ZIP provide strong location and vehicle specific data
  - L22: if (input.zip) score += 10;

### /workspaces/car-detective-mvp/src/utils/confidenceRules.ts  (LOC 14)
exports: fetchRules
functions: fetchRules
- **mileage** (1)
  - L8: mileage: 15, // Mileage information adds 15 points
- **vin** (1)
  - L6: vin: 25, // VIN presence adds 25 points
- **photos** (1)
  - L12: photo: 15, // Photo scoring adds 15 points
- **zip** (1)
  - L7: zip: 15, // ZIP code presence adds 15 points
- **valuation** (1)
  - L1: // Confidence rules for vehicle valuation

### /workspaces/car-detective-mvp/src/utils/confidenceScore.ts  (LOC 76)
exports: ConfidenceScoreInputs, calculateConfidenceScore, getConfidenceLevel
functions: calculateConfidenceScore, score, getConfidenceLevel
- **make** (3)
  - L9: make?: string;
  - L40: // Basic vehicle identification (year/make/model)
  - L41: if (inputs.year && inputs.make?.trim() && inputs.model?.trim()) {
- **model** (3)
  - L10: model?: string;
  - L40: // Basic vehicle identification (year/make/model)
  - L41: if (inputs.year && inputs.make?.trim() && inputs.model?.trim()) {
- **year** (3)
  - L8: year?: string | number;
  - L40: // Basic vehicle identification (year/make/model)
  - L41: if (inputs.year && inputs.make?.trim() && inputs.model?.trim()) {
- **mileage** (3)
  - L7: mileage?: number;
  - L35: // Mileage is crucial for accurate valuation
  - L36: if (typeof inputs.mileage === "number" && inputs.mileage >= 0) {
- **vin** (3)
  - L5: vin?: string;
  - L25: // VIN provides the highest confidence boost as it's a unique identifier
  - L26: if (inputs.vin?.trim()) {
- **zip** (2)
  - L6: zip?: string;
  - L31: if (inputs.zip?.trim()) {
- **dedupe** (1)
  - L25: // VIN provides the highest confidence boost as it's a unique identifier
- **valuation** (1)
  - L35: // Mileage is crucial for accurate valuation

### /workspaces/car-detective-mvp/src/utils/dateUtils.ts  (LOC 26)
exports: safeDateParse, formatDate
functions: safeDateParse, date, formatDate, date
- **year** (1)
  - L22: year: 'numeric',

### /workspaces/car-detective-mvp/src/utils/dealerSources.ts  (LOC 112)
exports: RetailDealerSources, dealerTierWeights, dealerDomainMap, DealerSourceResult, WeightedListing, getDealerTier, getDealerTrustWeight, getDealerDomain, AllDealerSources
functions: RetailDealerSources, dealerTierWeights, getDealerTier, getDealerTrustWeight, tier, getDealerDomain, AllDealerSources
- **price** (1)
  - L71: price: number;
- **mileage** (1)
  - L72: mileage: number;
- **dealer** (6)
  - L1: // FANG-Grade Retail Dealer Sources for AIN Market Intelligence
  - L38: // Tier 2 - Verified Dealer Networks
  - L49: // Tier 3 - Regional Dealer Groups
  - L79: dealer?: string;
  - L104: return dealerDomainMap[sourceName] || 'unknown-dealer.com';
- **url** (1)
  - L77: url?: string;
- **valuation** (1)
  - L2: // Organized by trust tier for weighted valuation accuracy

### /workspaces/car-detective-mvp/src/utils/diagnostics/marketDataDiagnostics.ts  (LOC 262)
exports: MarketDataDiagnosticResult, logMarketDataSummary
functions: runMarketDataDiagnostics, availability, auctionTest, marketTest, competitorTest, logMarketDataSummary
- **make** (1)
  - L121: .select('kbb_value, carvana_value, make, model, year')
- **model** (1)
  - L121: .select('kbb_value, carvana_value, make, model, year')
- **year** (2)
  - L61: .eq('year', 2024)
  - L121: .select('kbb_value, carvana_value, make, model, year')
- **price** (14)
  - L13: sampleEntries: Array<{ price: string; source: string; date: string }>;
  - L83: .select('price, auction_source, sold_date')
  - L91: price: item.price || 'Unknown',
  - L104: .select('source, price')
  - L118: console.log('💲 Checking competitor price data...');
- **vin** (9)
  - L34: console.log('🔍 Starting market data diagnostics for VIN:', testVin);
  - L80: console.log('🏁 Checking auction results for test VIN...');
  - L84: .eq('vin', testVin)
  - L97: console.log('❌ No auction results found for VIN:', testVin);
  - L122: .eq('vin', testVin);
- **storage** (8)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L51: const { data: msrpData } = await supabase
  - L81: const { data: auctionResults } = await supabase
  - L102: const { data: marketListings } = await supabase
  - L119: const { data: competitorPrices } = await supabase

### /workspaces/car-detective-mvp/src/utils/diagnostics/systemHealth.ts  (LOC 145)
exports: SystemHealthCheck, printSystemHealth
functions: runSystemHealthCheck, dbStart, dbLatency, criticalTables, yesterday, printSystemHealth, healthy, degraded, down, icon, line, overallStatus
- **storage** (5)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L18: const { data, error } = await supabase
  - L58: const { count, error } = await supabase
  - L59: .from(table)
  - L87: const { count } = await supabase

### /workspaces/car-detective-mvp/src/utils/diagnostics/valuationAudit.ts  (LOC 229)
exports: AuditResult, printAuditReport
functions: runValuationAudit, status, runBatchAudit, result, printAuditReport
- **make** (3)
  - L45: if (!valuation.make || !valuation.model) errors.push('❌ Missing make/model in valuation');
  - L156: if (valuation.make !== decodedVehicle?.make) {
  - L157: warnings.push(`⚠️ Make mismatch: Valuation(${valuation.make}) vs Decoded(${decodedVehicle?.make})`);
- **model** (3)
  - L45: if (!valuation.make || !valuation.model) errors.push('❌ Missing make/model in valuation');
  - L159: if (valuation.model !== decodedVehicle?.model) {
  - L160: warnings.push(`⚠️ Model mismatch: Valuation(${valuation.model}) vs Decoded(${decodedVehicle?.model})`);
- **year** (2)
  - L162: if (valuation.year !== decodedVehicle?.year) {
  - L163: warnings.push(`⚠️ Year mismatch: Valuation(${valuation.year}) vs Decoded(${decodedVehicle?.year})`);
- **mileage** (1)
  - L74: if (followupAnswers.mileage === null) warnings.push('⚠️ Missing mileage in follow-up answers');
- **vin** (30)
  - L5: vin: string;
  - L13: export async function runValuationAudit(vin: string): Promise<AuditResult> {
  - L18: console.log(`🔍 Starting diagnostic audit for VIN: ${vin}`);
  - L21: // 1. Verify VIN format and valuation record
  - L22: if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
- **dealer** (4)
  - L109: // 6. Check dealer offers
  - L118: console.log(`✅ Found ${dealerOffers.length} dealer offers`);
  - L120: warnings.push(`⚠️ No dealer offers found for this valuation`);
  - L218: console.log(`  • Dealer Offers: ${result.dataPoints.dealerOffers ? `✅ (${result.dataPoints.dealerOffers.length})` : '⚠️'}`);
- **zip** (1)
  - L76: if (!followupAnswers.zip_code) warnings.push('⚠️ Missing ZIP code in follow-up answers');
- **storage** (9)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L26: const { data: valuation, error: valErr } = await supabase
  - L49: const { data: decodedVehicle } = await supabase
  - L63: const { data: followupAnswers } = await supabase
  - L82: const { data: auctionResults } = await supabase
- **valuation** (21)
  - L21: // 1. Verify VIN format and valuation record
  - L26: const { data: valuation, error: valErr } = await supabase
  - L35: errors.push(`❌ Database error fetching valuation: ${valErr.message}`);
  - L36: } else if (!valuation) {
  - L37: errors.push(`❌ No valuation record found for VIN: ${vin}`);

### /workspaces/car-detective-mvp/src/utils/diagnostics/vehicleDataDiagnostics.ts  (LOC 96)
exports: VehicleDataDiagnostics, logDiagnosticsReport
functions: diagnoseVehicleData, makeIds, modelMakeIds, makesWithModels, makesWithoutModels, orphanedModels, modelsWithoutMake, logDiagnosticsReport
- **make** (4)
  - L20: .neq('make_name', 'Unknown Make');
  - L37: .filter(make => !modelMakeIds.has(make.id))
  - L38: .map(make => `${make.make_name} (${make.id})`);
  - L54: recommendations.push(`Fix ${orphanedModels.length} models with invalid make references`);
- **model** (3)
  - L41: .filter(model => model.make_id && !makeIds.has(model.make_id))
  - L42: .map(model => `${model.model_name} (make_id: ${model.make_id})`);
  - L44: const modelsWithoutMake = (allModels || []).filter(model => !model.make_id).length;
- **storage** (4)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L17: const { data: allMakes, error: makesError } = await supabase
  - L25: const { data: allModels, error: modelsError } = await supabase
  - L35: const makesWithModels = Array.from(makeIds).filter(makeId => modelMakeIds.has(makeId));

### /workspaces/car-detective-mvp/src/utils/error-handling.ts  (LOC 86)
exports: ErrorReport, errorHandler, errorToString
functions: errorMessage, severity, errorHandler, errorToString
- **env** (1)
  - L32: if (import.meta.env.NODE_ENV === 'development') {

### /workspaces/car-detective-mvp/src/utils/errorClassification.ts  (LOC 81)
exports: ClassifiedError, classifyError, shouldShowRetryButton, getRetryDelay
functions: classifyError, errorMessage, shouldShowRetryButton, getRetryDelay
- **retry** (2)
  - L45: errorMessage.includes('timeout') ||
  - L79: // Exponential backoff: 1s, 2s, 4s, 8s, max 10s

### /workspaces/car-detective-mvp/src/utils/errorHandling.ts  (LOC 144)
exports: setupTrackingErrorHandler, errorToString, enableReactDevMode, setupPuppeteerErrorHandler
functions: setupTrackingErrorHandler, originalConsoleError, errorMessage, suppressPatterns, errorToString, enableReactDevMode, win, originalInject, setupPuppeteerErrorHandler
- **env** (1)
  - L90: if (typeof window === 'undefined' || import.meta.env.MODE !== 'development') return;

### /workspaces/car-detective-mvp/src/utils/followUpDataHelpers.ts  (LOC 156)
exports: getCompletionPercentage, shouldShowNextStep, getStepValidation, calculateAdjustments, calculateCompletionPercentage, validateFormData, transformForValuation, processModifications
functions: getCompletionPercentage, requiredFields, optionalFields, completedRequired, completedOptional, requiredWeight, optionalWeight, requiredScore, optionalScore, shouldShowNextStep, getStepValidation, calculateAdjustments, calculateCompletionPercentage, validateFormData, transformForValuation, processModifications
- **mileage** (10)
  - L7: const optionalFields = ['mileage', 'condition', 'additional_notes'];
  - L97: // Mileage adjustment
  - L98: if (formData.mileage) {
  - L99: if (formData.mileage < 30000) {
  - L101: factor: 'Low Mileage',
- **vin** (5)
  - L6: const requiredFields = ['vin', 'zip_code'];
  - L52: return !!(formData.vin && formData.zip_code);
  - L66: 1: !!(formData.vin && formData.zip_code),
  - L122: return !!(formData.vin && formData.zip_code);
  - L127: vin: formData.vin,
- **valuation** (1)
  - L2: import { ModificationDetails } from '@/types/valuation';

### /workspaces/car-detective-mvp/src/utils/followUpFormValidation.ts  (LOC 102)
exports: ValidationResult, ValidCondition, validateCondition, validateBasicInfo, sanitizeCondition, getValidationSummary
functions: VALID_CONDITIONS, validateCondition, validateBasicInfo, conditionResult, sanitizeCondition, normalized, getValidationSummary, basicInfo, issues, requiredFields, completedCount, completionPercentage
- **mileage** (7)
  - L37: mileage?: number;
  - L50: // Mileage validation
  - L51: if (!data.mileage || data.mileage <= 0) {
  - L52: errors.push('Mileage must be greater than 0');
  - L53: } else if (data.mileage > 1000000) {
- **zip** (3)
  - L43: // ZIP code validation
  - L45: errors.push('ZIP code is required');
  - L47: errors.push('ZIP code must be 5 digits');

### /workspaces/car-detective-mvp/src/utils/forecasting/generateVinForecast.ts  (LOC 186)
functions: generateVinForecast, marketFactors, forecast, analyzeMarketFactors, recentPrices, olderPrices, recentAvg, olderAvg, daysOnMarket, days, currentMonth, seasonalIndex, calculateForecast, scoreImpact, baseValue, predictedDelta, dataConfidence, overallConfidence, reasoning, getSeasonalIndex, getDefaultMarketFactors
- **model** (1)
  - L42: // Generate prediction using simple ML model
- **price** (5)
  - L26: .select('price, sold_date')
  - L34: .select('price, created_at')
  - L59: // Analyze auction price trends
  - L62: const recentPrices = auctionData.slice(0, 3).map(a => parseFloat(a.price) || 0);
  - L63: const olderPrices = auctionData.slice(3, 6).map(a => parseFloat(a.price) || 0);
- **vin** (3)
  - L21: export async function generateVinForecast(vin: string): Promise<ForecastResult> {
  - L27: .eq('vin', vin)
  - L35: .eq('vin', vin)
- **storage** (3)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L24: const { data: auctionData } = await supabase
  - L32: const { data: marketplaceData } = await supabase

### /workspaces/car-detective-mvp/src/utils/forecasting/valuation-forecast.ts  (LOC 47)
exports: ForecastData, ForecastResult, generateForecast
functions: generateForecast, randomTrend, generateValuationForecast
- **valuation** (1)
  - L46: throw new Error('This mock forecast function is deprecated. Use the real valuation-forecast Edge Function instead.');

### /workspaces/car-detective-mvp/src/utils/format.ts  (LOC 30)
exports: formatCurrency, formatDate, formatNumber
functions: formatCurrency, formatDate, date, formatNumber
- **year** (1)
  - L19: year: "numeric",

### /workspaces/car-detective-mvp/src/utils/formatters/adjustment-formatter.ts  (LOC 49)
exports: formatAdjustmentValue, formatAdjustmentPercentage, convertNewAdjustmentsToLegacyFormat, convertLegacyAdjustmentsToNewFormat
functions: formatAdjustmentValue, formatted, formatAdjustmentPercentage, formatted, convertNewAdjustmentsToLegacyFormat, convertLegacyAdjustmentsToNewFormat
- **valuation** (1)
  - L2: import { AdjustmentBreakdown } from "@/types/valuation";

### /workspaces/car-detective-mvp/src/utils/formatters/formatVin.ts  (LOC 11)
exports: formatVin
functions: formatVin
- **vin** (6)
  - L2: * Formats a VIN (Vehicle Identification Number)
  - L3: * @param vin The VIN to format
  - L4: * @returns The formatted VIN
  - L6: export function formatVin(vin: string): string {
  - L7: if (!vin) return "";

### /workspaces/car-detective-mvp/src/utils/formatters.ts  (LOC 41)
exports: formatCurrency, formatNumber, formatPercentage, formatDate, formatDateTime
functions: formatCurrency, formatNumber, formatPercentage, formatDate, dateObj, formatDateTime, dateObj
- **year** (2)
  - L26: year: 'numeric',
  - L35: year: 'numeric',

### /workspaces/car-detective-mvp/src/utils/generateValuationExplanation.ts  (LOC 42)
functions: generateValuationExplanation
- **make** (1)
  - L5: make: string;
- **model** (1)
  - L6: model: string;
- **year** (1)
  - L7: year: number;
- **mileage** (1)
  - L8: mileage: number;
- **storage** (2)
  - L1: import { supabase } from "@/integrations/supabase/client";
  - L20: const { data, error } = await supabase.functions.invoke("generate-explanation", {
- **valuation** (2)
  - L11: valuation: number;
  - L23: baseMarketValue: params.valuation,

### /workspaces/car-detective-mvp/src/utils/getConditionAnalysis.ts  (LOC 51)
exports: AIConditionResult
functions: getConditionAnalysis, getConditionRating
- **storage** (2)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L15: const { data, error } = await supabase

### /workspaces/car-detective-mvp/src/utils/getListingsWithCondition.ts  (LOC 120)
exports: ConditionFilterOption, ValuationWithCondition
functions: getListingsWithCondition, offset, query, photoConditionScores, getListingsCount, query
- **dealer** (1)
  - L2: import { Valuation } from "@/types/dealer";
- **storage** (3)
  - L1: import { supabase } from "@/integrations/supabase/client";
  - L28: let query = supabase
  - L87: let query = supabase
- **valuation** (2)
  - L2: import { Valuation } from "@/types/dealer";
  - L10: export interface ValuationWithCondition extends Valuation {

### /workspaces/car-detective-mvp/src/utils/getValuationContext.ts  (LOC 64)
functions: getValuationContext, mapConditionScore
- **make** (2)
  - L15: make,
  - L40: make: data.make,
- **model** (2)
  - L16: model,
  - L41: model: data.model,
- **year** (2)
  - L17: year,
  - L42: year: data.year,
- **mileage** (2)
  - L18: mileage,
  - L43: mileage: data.mileage,
- **storage** (2)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L11: const { data, error } = await supabase
- **valuation** (1)
  - L3: import { LegacyValuationResult } from "@/types/valuation";

### /workspaces/car-detective-mvp/src/utils/helpers.ts  (LOC 30)
exports: generateUniqueId, truncateString, capitalizeFirstLetter
functions: generateUniqueId, truncateString, capitalizeFirstLetter
- **dedupe** (2)
  - L4: * Generate a unique ID
  - L5: * @returns A unique ID string

### /workspaces/car-detective-mvp/src/utils/index.ts  (LOC 24)
- **valuation** (1)
  - L19: // AIN-only implementation - no legacy valuation engines

### /workspaces/car-detective-mvp/src/utils/lookupService.ts  (LOC 129)
exports: LookupResult, VinLookupOptions, PlateLookupOptions, vinLookup, plateLookup
functions: lookupByVin, lookupByPlate, unifiedLookup, vinLookup, plateLookup
- **make** (2)
  - L32: make: 'Toyota',
  - L75: make: 'Honda',
- **model** (2)
  - L33: model: 'Camry',
  - L76: model: 'Accord',
- **year** (2)
  - L31: year: 2020,
  - L74: year: 2019,
- **mileage** (2)
  - L44: mileage: 45000,
  - L87: mileage: 35000,
- **vin** (12)
  - L2: // Consolidated lookup service combining VIN, plate, and manual lookup functionality
  - L9: source: 'vin' | 'plate' | 'manual';
  - L22: // VIN Lookup functionality
  - L23: export async function lookupByVin(vin: string, options: VinLookupOptions = {}): Promise<LookupResult> {
  - L25: // Simulate VIN lookup API call

### /workspaces/car-detective-mvp/src/utils/marketListings/processListings.ts  (LOC 65)
exports: processExistingListings
functions: processExistingListings, prices, averagePrice, sourceGroups, averages, sources, url
- **price** (4)
  - L29: const prices = listings.map(listing => listing.price);
  - L30: const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  - L37: acc[listing.source].push(listing.price);
  - L42: acc[source] = sourcePrices.reduce((sum, price) => sum + price, 0) / sourcePrices.length;
- **url** (3)
  - L47: const url = listing.url || listing.link || listing.listingUrl || listing.listing_url;
  - L48: if (url) {
  - L49: acc[listing.source] = url;

### /workspaces/car-detective-mvp/src/utils/normalization/normalizeListings.ts  (LOC 71)
exports: NormalizedListing, normalizeListing, normalizeListings
functions: normalizeListing, normalizeListings, normalizeString, normalizeCondition, normalized, generateId
- **make** (3)
  - L6: make: string;
  - L26: make: normalizeString(rawListing.make),
  - L46: .filter(listing => listing && listing.make && listing.model)
- **model** (3)
  - L7: model: string;
  - L27: model: normalizeString(rawListing.model),
  - L46: .filter(listing => listing && listing.make && listing.model)
- **year** (3)
  - L8: year: number;
  - L28: year: parseInt(rawListing.year) || 0,
  - L48: .filter(listing => listing.price > 0 && listing.year > 1900);
- **price** (3)
  - L9: price: number;
  - L29: price: parseFloat(rawListing.price) || 0,
  - L48: .filter(listing => listing.price > 0 && listing.year > 1900);
- **mileage** (2)
  - L10: mileage: number;
  - L30: mileage: parseInt(rawListing.mileage) || 0,
- **url** (2)
  - L14: url?: string;
  - L34: url: rawListing.url,

### /workspaces/car-detective-mvp/src/utils/p2pSources.ts  (LOC 88)
exports: PrivateMarketplaces, p2pTierWeights, p2pDomainMap, P2PSourceResult, P2PListing, getP2PTier, getP2PTrustWeight, getP2PDomain, AllP2PSources
functions: PrivateMarketplaces, p2pTierWeights, getP2PTier, getP2PTrustWeight, tier, getP2PDomain, AllP2PSources
- **price** (2)
  - L46: price: number;
  - L55: askingPrice: number; // Often higher than final sale price
- **mileage** (1)
  - L47: mileage: number;
- **url** (1)
  - L52: url?: string;

### /workspaces/car-detective-mvp/src/utils/parsers/listingParser.ts  (LOC 164)
exports: ParsedListing, parseVehicleListingsFromWeb, formatListingsForExplanation
functions: parseVehicleListingsFromWeb, patterns, knownSources, make, model, make, model, source, surroundingText, zipMatch, zipCode, dbPattern, year, make, model, mileage, price, isValidListing, cleanTitle, deduplicateListings, seen, key, formatListingsForExplanation, priceRange
- **make** (10)
  - L23: // Pattern 3: Standard dealer format (Year Make Model - Price - Mileage)
  - L48: // Full format with year, make, model
  - L50: const make = match[2];
  - L54: title = `${year} ${make} ${model}`;
  - L56: // Make Model format
- **model** (10)
  - L23: // Pattern 3: Standard dealer format (Year Make Model - Price - Mileage)
  - L48: // Full format with year, make, model
  - L51: const model = match[3];
  - L54: title = `${year} ${make} ${model}`;
  - L56: // Make Model format
- **year** (8)
  - L23: // Pattern 3: Standard dealer format (Year Make Model - Price - Mileage)
  - L44: let price: number, mileage: number, title: string, year: number | undefined;
  - L48: // Full format with year, make, model
  - L49: year = parseInt(match[1], 10);
  - L54: title = `${year} ${make} ${model}`;
- **price** (21)
  - L5: price: number;
  - L17: // Pattern 1: Direct price-mileage extraction from dealer listings
  - L20: // Pattern 2: Price in title format
  - L23: // Pattern 3: Standard dealer format (Year Make Model - Price - Mileage)
  - L44: let price: number, mileage: number, title: string, year: number | undefined;
- **mileage** (18)
  - L6: mileage?: number;
  - L17: // Pattern 1: Direct price-mileage extraction from dealer listings
  - L23: // Pattern 3: Standard dealer format (Year Make Model - Price - Mileage)
  - L44: let price: number, mileage: number, title: string, year: number | undefined;
  - L53: mileage = parseInt(match[5].replace(/,/g, ''), 10);
- **dealer** (3)
  - L17: // Pattern 1: Direct price-mileage extraction from dealer listings
  - L23: // Pattern 3: Standard dealer format (Year Make Model - Price - Mileage)
  - L36: { name: 'Dealer', pattern: /dealer|dealership/i }
- **zip** (1)
  - L82: // Extract ZIP code from surrounding context
- **url** (1)
  - L9: url?: string;

### /workspaces/car-detective-mvp/src/utils/pdf/defaultReportOptions.ts  (LOC 15)
exports: defaultReportOptions
- **valuation** (1)
  - L2: import { ReportOptions } from '@/types/valuation';

### /workspaces/car-detective-mvp/src/utils/pdf/generateDebugInfo.ts  (LOC 79)
exports: DebugInfo, generateDebugInfo, formatDebugInfoForPdf
functions: generateDebugInfo, basePrice, mileage, condition, getConditionMultiplier, formatDebugInfoForPdf
- **make** (1)
  - L19: basePriceLogic: `Base Price: $${basePrice.toLocaleString()} (Market average for ${reportData.year} ${reportData.make} ${reportData.model})`,
- **model** (1)
  - L19: basePriceLogic: `Base Price: $${basePrice.toLocaleString()} (Market average for ${reportData.year} ${reportData.make} ${reportData.model})`,
- **year** (1)
  - L19: basePriceLogic: `Base Price: $${basePrice.toLocaleString()} (Market average for ${reportData.year} ${reportData.make} ${reportData.model})`,
- **price** (2)
  - L19: basePriceLogic: `Base Price: $${basePrice.toLocaleString()} (Market average for ${reportData.year} ${reportData.make} ${reportData.model})`,
  - L39: `1. Base Price: $${basePrice.toLocaleString()}`,
- **mileage** (4)
  - L15: const mileage = reportData.mileage || 0;
  - L21: mileageAdjustment: `Mileage: ${mileage.toLocaleString()} miles
  - L22: - Standard depreciation: $${Math.round(mileage * 0.05)}
  - L23: - High mileage penalty: ${mileage > 100000 ? '$500' : '$0'}`,
- **vin** (1)
  - L36: - VIN decode accuracy: 90%`,
- **zip** (1)
  - L25: zipAdjustment: `ZIP Code: ${reportData.zipCode}

### /workspaces/car-detective-mvp/src/utils/pdf/generateValuationPdf.ts  (LOC 460)
functions: generateValuationPdf, pdfDoc, page, font, boldFont, margin, yPosition, primaryColor, successColor, textColor, lightGray, addText, xPos, textWidth, textWidth, addDivider, vehicleInfo, titleColor, details, riskColor, truncatedSummary, titleColor, truncatedRecall, normalizedListings, enhancedListings, platform, platformSummary, prices, sign, color, explanationLines, newPage, pdfBytes, splitTextIntoLines, words, currentLine, testLine, testWidth, downloadValuationPdf, pdfBlob, url, link
- **make** (2)
  - L106: ['Vehicle:', `${result.vehicle.year} ${result.vehicle.make} ${result.vehicle.model} ${result.vehicle.trim || ''}`],
  - L454: link.download = `valuation-report-${result.vehicle.year}-${result.vehicle.make}-${result.vehicle.model}-${Date.now()}.pdf`;
- **model** (2)
  - L106: ['Vehicle:', `${result.vehicle.year} ${result.vehicle.make} ${result.vehicle.model} ${result.vehicle.trim || ''}`],
  - L454: link.download = `valuation-report-${result.vehicle.year}-${result.vehicle.make}-${result.vehicle.model}-${Date.now()}.pdf`;
- **year** (2)
  - L106: ['Vehicle:', `${result.vehicle.year} ${result.vehicle.make} ${result.vehicle.model} ${result.vehicle.trim || ''}`],
  - L454: link.download = `valuation-report-${result.vehicle.year}-${result.vehicle.make}-${result.vehicle.model}-${Date.now()}.pdf`;
- **price** (3)
  - L266: // Price range from enhanced listings
  - L268: const prices = enhancedListings.map((l: any) => l.price).sort((a: any, b: any) => a - b);
  - L269: addText('Price Range:', { size: 10, font: boldFont });
- **mileage** (1)
  - L107: ['Mileage:', `${result.mileage?.toLocaleString() || 'N/A'} miles`],
- **zip** (1)
  - L108: ['Location:', `ZIP ${result.zip}`],
- **url** (3)
  - L450: const url = URL.createObjectURL(pdfBlob);
  - L453: link.href = url;
  - L459: URL.revokeObjectURL(url);
- **openai** (2)
  - L183: addText('Data verified by OpenAI Web Intelligence', {
  - L278: addText('OpenAI Web Intelligence', {
- **storage** (2)
  - L374: // Split explanation into lines that fit
  - L421: // Helper function to split text into lines
- **valuation** (7)
  - L4: import type { UnifiedValuationResult } from '@/components/valuation/UnifiedValuationResult';
  - L84: addText('VEHICLE VALUATION REPORT', {
  - L288: // Valuation Summary
  - L289: addText('VALUATION SUMMARY', { font: boldFont, size: 16, color: primaryColor });
  - L371: addText('VALUATION ANALYSIS', { font: boldFont, size: 16, color: primaryColor });

### /workspaces/car-detective-mvp/src/utils/pdfService.ts  (LOC 514)
exports: ReportData, PdfOptions, convertVehicleInfoToReportData, downloadPdf, generateReport
functions: convertVehicleInfoToReportData, generateTrackingId, timestamp, vinPart, userPart, randomPart, addWatermarkAndTracking, pdfDoc, pages, font, watermarkText, logPdfGeneration, generateValuationPdf, pdfDoc, page, font, boldFont, margin, yPosition, vehicleInfo, adjustmentText, normalizedListings, avgPrice, topListings, dealerName, url, sourceType, listingText, fallbackText, msrpText, footerY, pdfBytes, trackingId, downloadValuationPdf, pdfBuffer, blob, url, link, uploadValuationPdf, pdfBuffer, fileName, filePath, downloadPdf, generateReport
- **make** (4)
  - L10: make: string;
  - L51: make: vehicleInfo.make,
  - L173: ['Make:', data.make || 'N/A'],
  - L468: link.download = `valuation-${data.make}-${data.model}-${data.year}.pdf`;
- **model** (4)
  - L11: model: string;
  - L52: model: vehicleInfo.model,
  - L174: ['Model:', data.model || 'N/A'],
  - L468: link.download = `valuation-${data.make}-${data.model}-${data.year}.pdf`;
- **year** (4)
  - L12: year: number;
  - L53: year: vehicleInfo.year,
  - L172: ['Year:', data.year?.toString() || 'N/A'],
  - L468: link.download = `valuation-${data.make}-${data.model}-${data.year}.pdf`;
- **price** (6)
  - L16: price: number;
  - L57: price: valuationData.estimatedValue,
  - L242: page.drawText(`Price Range: $${data.priceRange[0]?.toLocaleString()} - $${data.priceRange[1]?.toLocaleString()}`, {
  - L323: const avgPrice = Math.round(normalizedListings.reduce((sum, listing) => sum + (listing.price || 0), 0) / normalizedListings.length);
  - L334: page.drawText(`• Average market price: $${avgPrice.toLocaleString()}`, {
- **mileage** (3)
  - L13: mileage: number;
  - L54: mileage: valuationData.mileage,
  - L175: ['Mileage:', data.mileage?.toLocaleString() || 'N/A'],
- **vin** (10)
  - L18: vin?: string;
  - L59: vin: vehicleInfo.vin,
  - L69: function generateTrackingId(userId?: string, vin?: string): string {
  - L71: const vinPart = vin ? vin.slice(-6) : 'NOVIN';
  - L126: vin: string,
- **dealer** (3)
  - L90: ? 'CarPerfector Premium Valuation – For Dealer Use Only'
  - L346: const dealerName = listing.dealerName || listing.dealer_name || listing.dealer || 'Private Seller';
  - L350: const listingText = `- ${dealerName} — $${(listing.price || 0).toLocaleString()} [${sourceType}]`.substring(0, 60);
- **zip** (1)
  - L177: ['ZIP Code:', data.zipCode || 'N/A'],
- **url** (4)
  - L347: const url = getNormalizedUrl(listing);
  - L464: const url = URL.createObjectURL(blob);
  - L467: link.href = url;
  - L473: URL.revokeObjectURL(url);
- **storage** (8)
  - L3: import { supabase } from '@/integrations/supabase/client';
  - L132: const { error } = await supabase
  - L134: .insert({
  - L456: return Buffer.from(pdfBytes);
  - L476: // Upload PDF to Supabase Storage
- **valuation** (11)
  - L90: ? 'CarPerfector Premium Valuation – For Dealer Use Only'
  - L91: : 'CarPerfector Valuation Report';
  - L160: page.drawText('Vehicle Valuation Report', {
  - L200: // Valuation Results
  - L202: page.drawText('Valuation Results', {

### /workspaces/car-detective-mvp/src/utils/photoService.ts  (LOC 166)
exports: PhotoAnalysisResult, PhotoUploadResult, calculatePhotoScore, getBestPhoto, getConditionAdjustment, uploadPhoto, analyzePhoto, scorePhoto
functions: uploadAndAnalyzePhoto, url, analysisResult, analyzePhotoCondition, condition, issuesDetected, recommendations, confidenceScore, photoScore, aiSummary, generateAISummary, calculatePhotoScore, score, conditionScores, analyzeBatchPhotos, results, getBestPhoto, bestResult, bestScore, currentScore, getConditionAdjustment, uploadPhoto, analyzePhoto, scorePhoto
- **photos** (10)
  - L2: // Consolidated photo and AI condition assessment service
  - L19: // Photo upload and processing
  - L23: if (!file.type.startsWith('image/')) {
  - L24: throw new Error('File must be an image');
  - L35: const url = `https://example.com/photos/${Date.now()}-${file.name}`;
- **url** (8)
  - L14: url?: string;
  - L34: // Mock URL
  - L35: const url = `https://example.com/photos/${Date.now()}-${file.name}`;
  - L38: const analysisResult = await analyzePhotoCondition(url);
  - L42: url,
- **valuation** (1)
  - L151: // Photo condition to valuation adjustment

### /workspaces/car-detective-mvp/src/utils/profileService.ts  (LOC 71)
functions: getProfile, newProfile, updateProfile
- **storage** (5)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L9: const { data, error } = await supabase
  - L27: const { data: createdProfile, error: createError } = await supabase
  - L29: .insert(newProfile)
  - L55: const { data, error } = await supabase

### /workspaces/car-detective-mvp/src/utils/publicShareService.ts  (LOC 79)
exports: SharedValuation
functions: getValuationByToken, now, expiresAt, valuation
- **make** (3)
  - L5: make: string;
  - L28: make,
  - L60: make: data.valuations[0].make,
- **model** (3)
  - L6: model: string;
  - L29: model,
  - L61: model: data.valuations[0].model,
- **year** (3)
  - L7: year: number;
  - L30: year,
  - L62: year: Number(data.valuations[0].year),
- **mileage** (3)
  - L8: mileage: number;
  - L31: mileage,
  - L63: mileage: Number(data.valuations[0].mileage),
- **storage** (2)
  - L1: import { supabase } from "@/integrations/supabase/client";
  - L19: const { data, error } = await supabase
- **valuation** (3)
  - L15: * Fetches a valuation by public token
  - L57: const valuation = Array.isArray(data.valuations)
  - L72: valuation,

### /workspaces/car-detective-mvp/src/utils/qrCodeGenerator.ts  (LOC 33)
functions: generateQRCode, size, modules, moduleSize, hash, svg, row, col, shouldFill, x, y
- **photos** (2)
  - L29: return `data:image/svg+xml;base64,${btoa(svg)}`;
  - L31: return `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#f0f0f0"/><text x="50" y="50" text-anchor="middle" dy=".3em" font-size="12">QR Error</text></svg
- **dedupe** (3)
  - L9: // Generate a simple pattern based on text hash
  - L10: const hash = text.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  - L18: const shouldFill = (row + col + hash) % 3 === 0;

### /workspaces/car-detective-mvp/src/utils/queryMakesModels.ts  (LOC 87)
functions: queryAllMakesWithModels, modelNames, executeMakesModelsQuery, makesWithModels
- **make** (9)
  - L5: make: string;
  - L31: // For each make, get all associated models
  - L34: for (const make of makes) {
  - L38: .eq('make_id', make.id)
  - L42: console.error(`❌ Error fetching models for ${make.make_name}:`, modelsError);
- **model** (3)
  - L46: const modelNames = models?.map(model => model.model_name) || [];
  - L73: makeData.models.forEach((model, modelIndex) => {
  - L74: console.log(`   ${modelIndex + 1}. ${model}`);
- **storage** (4)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L11: console.log('🔍 Fetching all makes and their models from Supabase...');
  - L14: const { data: makes, error: makesError } = await supabase
  - L35: const { data: models, error: modelsError } = await supabase

### /workspaces/car-detective-mvp/src/utils/rules/RulesEngine.ts  (LOC 99)
exports: RulesEngine
functions: accidentCalc, conditionCalc, input, result, input, result, adjustment, finalValue
- **make** (1)
  - L52: make: data.make || '',
- **model** (1)
  - L53: model: data.model || '',
- **year** (1)
  - L54: year: data.year || 2020,
- **mileage** (1)
  - L55: mileage: data.mileage || 0,
- **valuation** (1)
  - L3: import { RulesEngineInput, ValuationData, Adjustment } from '../valuation/rules/types';

### /workspaces/car-detective-mvp/src/utils/rules/calculators/accidentCalculator.ts  (LOC 24)
exports: AccidentCalculator, accidentCalculator
functions: accidentCount, impact, accidentCalculator
- **valuation** (1)
  - L2: import { AdjustmentCalculator, RulesEngineInput, AdjustmentBreakdown } from "../../valuation/rules/types";

### /workspaces/car-detective-mvp/src/utils/rules/calculators/conditionCalculator.ts  (LOC 35)
exports: ConditionCalculator, conditionCalculator
functions: conditionValue, adjustment, conditionCalculator
- **valuation** (1)
  - L6: } from "../../valuation/rules/types";

### /workspaces/car-detective-mvp/src/utils/rules/calculators/equipmentCalculator.ts  (LOC 42)
exports: calculateEquipmentAdjustment, findMaxValue
functions: calculateEquipmentAdjustment, validEquipment, adjustments, findMaxValue, numericValues, result
- **price** (1)
  - L7: * @param prices - An object mapping equipment codes to their corresponding price adjustments.

### /workspaces/car-detective-mvp/src/utils/rules/calculators/helpers.ts  (LOC 50)
exports: calculateBaseValue, applyAdjustment, sum, average, max, min
functions: calculateBaseValue, makeValue, ageAdjustment, applyAdjustment, sum, average, max, min
- **make** (2)
  - L3: export function calculateBaseValue(make: string, model: string, year: number): number {
  - L13: const makeValue = baseValues[make] || 20000;
- **model** (1)
  - L3: export function calculateBaseValue(make: string, model: string, year: number): number {
- **year** (2)
  - L3: export function calculateBaseValue(make: string, model: string, year: number): number {
  - L14: const ageAdjustment = Math.max(0, (year - 2000) * 100);

### /workspaces/car-detective-mvp/src/utils/rules/calculators/mileageCalculator.ts  (LOC 45)
exports: mileageCalculator
functions: currentYear, vehicleAge, expectedMileage, mileageDifference, impact, description, excessMiles, underMiles
- **year** (3)
  - L10: if (!data.mileage || !data.year) {
  - L15: const vehicleAge = currentYear - data.year;
  - L16: const expectedMileage = vehicleAge * 12000; // Average 12k miles per year
- **mileage** (10)
  - L6: name: 'Mileage Calculator',
  - L7: description: 'Calculates adjustments based on vehicle mileage relative to age',
  - L10: if (!data.mileage || !data.year) {
  - L17: const mileageDifference = data.mileage - expectedMileage;
  - L19: // No significant adjustment for mileage within normal range

### /workspaces/car-detective-mvp/src/utils/rules/calculators/photoScoreCalculator.ts  (LOC 45)
exports: photoScoreCalculator
functions: score, impact, description
- **photos** (8)
  - L6: name: 'Photo Score Calculator',
  - L7: description: 'Calculates adjustments based on photo quality and condition assessment',
  - L20: description = 'Excellent photo quality shows pristine condition (+$500)';
  - L23: description = 'Good photo quality shows well-maintained vehicle (+$200)';
  - L26: description = 'Average photo quality, no adjustment';

### /workspaces/car-detective-mvp/src/utils/rules/calculators/transmissionCalculator.ts  (LOC 44)
exports: transmissionCalculator
functions: transmission
- **make** (1)
  - L18: if (data.make && ['porsche', 'ferrari', 'lamborghini', 'mclaren'].includes(data.make.toLowerCase())) {

### /workspaces/car-detective-mvp/src/utils/rules/interfaces/Calculator.ts  (LOC 8)
exports: Calculator
- **valuation** (1)
  - L2: import { ValuationData, Adjustment } from '../../valuation/rules/types';

### /workspaces/car-detective-mvp/src/utils/rules/types.ts  (LOC 10)
- **valuation** (1)
  - L10: } from '../valuation/rules/types';

### /workspaces/car-detective-mvp/src/utils/safeDataAccess.ts  (LOC 42)
exports: safeGet, safeGetNested, safeVehicleData, validateRequiredVehicleData, withDefaults
functions: safeVehicleData, validateRequiredVehicleData, required, missing
- **make** (2)
  - L16: make: safeGet(data, 'make') || 'Unknown',
  - L31: const required = ['make', 'model', 'year'];
- **model** (2)
  - L17: model: safeGet(data, 'model') || 'Unknown',
  - L31: const required = ['make', 'model', 'year'];
- **year** (2)
  - L18: year: safeGet(data, 'year') || new Date().getFullYear(),
  - L31: const required = ['make', 'model', 'year'];
- **mileage** (1)
  - L21: mileage: safeGet(data, 'mileage') || 0,
- **vin** (1)
  - L20: vin: safeGet(data, 'vin') || '',

### /workspaces/car-detective-mvp/src/utils/schemas.ts  (LOC 23)
exports: VehicleLookupSchema, VehicleLookupFormData, PlateSchema, VinSchema
functions: VehicleLookupSchema, PlateSchema, VinSchema
- **make** (1)
  - L9: make: z.string().min(1, "Make is required"),
- **model** (1)
  - L10: model: z.string().min(1, "Model is required"),
- **year** (3)
  - L11: year: z.number()
  - L13: .min(1900, "Year must be 1900 or later")
  - L14: .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
- **vin** (1)
  - L6: mode: z.enum(["vin", "plate", "manual"]).default("vin"),
- **schema** (1)
  - L2: import { z } from "zod";

### /workspaces/car-detective-mvp/src/utils/scrapers/fetchBidCarsData.ts  (LOC 85)
exports: AuctionData
functions: serverSupabase, AuctionDataSchema, fetchBidCarsData, browser, page, searchUrl, firstLink, hasResult, soldDate, price, odometer, location, condition, auctionSource, imageHandles, src, validated
- **price** (3)
  - L17: price: z.string(),
  - L44: const price = await page.locator("text=Final Bid").locator(".. >> span").textContent();
  - L61: price: price?.trim() || "N/A",
- **vin** (5)
  - L15: vin: z.string(),
  - L27: export async function fetchBidCarsData(vin: string): Promise<AuctionData | null> {
  - L32: const searchUrl = `https://bid.cars/en/search-results/all-years/all-makes/all-models?query=${vin}`;
  - L38: if (!hasResult) throw new Error(`No results found on Bid.Cars for VIN: ${vin}`);
  - L59: vin,
- **photos** (1)
  - L50: const imageHandles = await page.locator("img.vehicle-image").all();
- **retry** (1)
  - L33: await page.goto(searchUrl, { timeout: 30000, waitUntil: "domcontentloaded" });
- **schema** (2)
  - L5: import { z } from "zod";
  - L13: // Auction result schema
- **storage** (3)
  - L4: import { createClient } from "@supabase/supabase-js";
  - L73: .insert([validated]);
  - L76: throw new Error(`Supabase insert failed: ${error.message}`);
- **env** (2)
  - L9: import.meta.env.SUPABASE_URL!,
  - L10: import.meta.env.SUPABASE_SERVICE_ROLE_KEY!,

### /workspaces/car-detective-mvp/src/utils/scrapers/utils/normalizeVehicleData.ts  (LOC 63)
exports: normalizeVehicleData
functions: normalizeVehicleData, extractYear, yearRegex, match, extractMake, commonMakes, extractModel
- **make** (6)
  - L27: // Extract year, make, model from title if possible
  - L29: make: extractMake(data.title),
  - L42: // Helper function to extract make from title
  - L49: for (const make of commonMakes) {
  - L50: if (title.toLowerCase().includes(make.toLowerCase())) {
- **model** (3)
  - L27: // Extract year, make, model from title if possible
  - L30: model: extractModel(data.title),
  - L58: // Helper function to extract model from title
- **year** (3)
  - L27: // Extract year, make, model from title if possible
  - L28: year: extractYear(data.title),
  - L35: // Helper function to extract year from title
- **price** (2)
  - L12: price: number;
  - L21: price: data.price,
- **mileage** (1)
  - L31: mileage: 0, // Default value, would be populated later
- **photos** (1)
  - L22: image: data.images[0] || '',
- **url** (2)
  - L11: url: string;
  - L20: url: data.url,
- **storage** (1)
  - L5: * Normalizes vehicle data from various sources into a standard format

### /workspaces/car-detective-mvp/src/utils/shareUtils.ts  (LOC 93)
exports: ShareLinkData, GeneratedShareData, extractDataFromShareToken
functions: generateShareLinkAndQR, token, baseUrl, shareLink, qrCodeDataUrl, generateShareToken, tokenData, hash, i, char, token, extractDataFromShareToken, generateQRCodeOnly
- **vin** (2)
  - L4: vin: string;
  - L48: const tokenData = `${data.vin}-${data.zipCode}-${data.finalValue}-${data.timestamp}`;
- **url** (3)
  - L23: // Create the shareable URL
  - L80: export async function generateQRCodeOnly(url: string): Promise<string> {
  - L82: return await QRCode.toDataURL(url, {
- **dedupe** (7)
  - L20: // Generate a unique token for this valuation
  - L47: // Create a deterministic but unique token based on the valuation data
  - L50: // Simple hash function (in production, use crypto.subtle or a proper library)
  - L51: let hash = 0;
  - L54: hash = ((hash << 5) - hash) + char;
- **valuation** (2)
  - L20: // Generate a unique token for this valuation
  - L47: // Create a deterministic but unique token based on the valuation data

### /workspaces/car-detective-mvp/src/utils/startupValidation.ts  (LOC 6)
- **env** (1)
  - L3: if (import.meta.env.PROD && import.meta.env.MODE === 'production') {

### /workspaces/car-detective-mvp/src/utils/storage.ts  (LOC 17)
functions: uploadToS3
- **url** (2)
  - L11: // For now, simulate a successful upload and return a URL
  - L15: // Return mock S3 URL
- **valuation** (1)
  - L16: return `https://example-bucket.s3.amazonaws.com/${fileName}`;

### /workspaces/car-detective-mvp/src/utils/stripe-error-handling.ts  (LOC 127)
exports: getStripeErrorDetails, formatStripeError
functions: getStripeErrorDetails, errorMessage, formatStripeError, details
- **retry** (1)
  - L101: errorMessage.includes("rate limit") ||

### /workspaces/car-detective-mvp/src/utils/stripeClient.ts  (LOC 50)
exports: CheckoutOptions
functions: createCheckoutSession, verifyPaymentSession
- **storage** (3)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L16: const { data, error } = await supabase.functions.invoke('create-checkout', {
  - L38: const { data, error } = await supabase.functions.invoke('verify-payment', {

### /workspaces/car-detective-mvp/src/utils/stripeService.ts  (LOC 218)
exports: STRIPE_PRODUCTS, CheckoutResponse
functions: STRIPE_PRODUCTS, checkoutSingleReport, checkoutBundle3Reports, checkoutBundle5Reports, checkoutDealerSubscription, createCheckoutSession, getStripePortalLink, verifyPaymentSession
- **price** (7)
  - L8: price: 1999, // $19.99 in cents
  - L13: price: 4999, // $49.99 in cents
  - L18: price: 7999, // $79.99 in cents
  - L23: price: 9900, // $99.00 in cents per month
  - L29: price: 19900, // $199.00 in cents per month
- **dealer** (4)
  - L22: name: 'Dealer Starter Plan',
  - L28: name: 'Dealer Pro Plan',
  - L34: name: 'Dealer Enterprise Plan',
  - L78: * Create a checkout session for a dealer subscription
- **url** (7)
  - L89: url: string;
  - L142: url: '',
  - L150: url: data.url,
  - L157: url: '',
  - L178: url: '',
- **storage** (5)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L96: * Create a Stripe checkout session through Supabase Edge Function
  - L125: const { data, error } = await supabase.functions.invoke('create-checkout', {
  - L169: const { data, error } = await supabase.functions.invoke('customer-portal', {
  - L206: const { data, error } = await supabase.functions.invoke('verify-payment', {

### /workspaces/car-detective-mvp/src/utils/types/unifiedTypes.ts  (LOC 64)
exports: ValuationInput, ValuationResult, MarketListing, Adjustment
- **make** (2)
  - L6: make: string;
  - L39: make: string;
- **model** (2)
  - L7: model: string;
  - L40: model: string;
- **year** (2)
  - L8: year: number;
  - L41: year: number;
- **price** (1)
  - L43: price: number;
- **mileage** (2)
  - L9: mileage?: number;
  - L44: mileage: number;
- **vin** (2)
  - L5: vin: string;
  - L38: vin?: string;
- **photos** (1)
  - L50: photos?: string[];
- **valuation** (1)
  - L2: // Consolidates all valuation and market listing types

### /workspaces/car-detective-mvp/src/utils/unifiedConfidenceCalculator.ts  (LOC 223)
exports: UnifiedConfidenceInput, ConfidenceBreakdown, calculateUnifiedConfidence, getConfidenceLevel, generateConfidenceExplanation
functions: calculateUnifiedConfidence, spread, getConfidenceLevel, generateConfidenceExplanation, explanation
- **make** (8)
  - L15: make?: string;
  - L90: else if (!input.make || !input.model || !input.year) {
  - L128: if (input.make?.toLowerCase().includes('ford') && input.model?.toLowerCase().includes('f-150')) {
  - L131: breakdown.fuelCostMatch = input.fuelDataQuality || (input.make && input.model ? 75 : 50);
  - L134: if (!input.year || !input.make || !input.model) {
- **model** (8)
  - L16: model?: string;
  - L90: else if (!input.make || !input.model || !input.year) {
  - L128: if (input.make?.toLowerCase().includes('ford') && input.model?.toLowerCase().includes('f-150')) {
  - L131: breakdown.fuelCostMatch = input.fuelDataQuality || (input.make && input.model ? 75 : 50);
  - L134: if (!input.year || !input.make || !input.model) {
- **year** (4)
  - L14: year?: number;
  - L90: else if (!input.make || !input.model || !input.year) {
  - L134: if (!input.year || !input.make || !input.model) {
  - L143: (input.make && input.model && input.year ? 80 : 50);
- **price** (1)
  - L116: // Adjust based on price range spread (lower spread = higher confidence)
- **mileage** (5)
  - L13: mileage?: number;
  - L154: // Add mileage recommendation if needed
  - L155: if (!input.mileage || input.mileage === 0) {
  - L156: breakdown.recommendations.push("Enter your vehicle's actual mileage for a more accurate valuation");
  - L214: explanation = "Low confidence due to insufficient market information. Please provide more details like actual mileage and condition for a better estimate.";
- **vin** (10)
  - L9: vin?: string;
  - L81: // VIN Accuracy calculation (0-100)
  - L82: if (input.vin && input.vin.length === 17) {
  - L83: breakdown.vinAccuracy = 85; // Base VIN presence
  - L85: // Exact VIN match is a strong positive
- **zip** (1)
  - L10: zip?: string;
- **valuation** (1)
  - L156: breakdown.recommendations.push("Enter your vehicle's actual mileage for a more accurate valuation");

### /workspaces/car-detective-mvp/src/utils/validation/CarDetectiveValidator.ts  (LOC 32)
exports: CarDetectiveValidator
functions: currentYear
- **make** (1)
  - L7: if (!data.make) errors.push('Make is required');
- **model** (1)
  - L8: if (!data.model) errors.push('Model is required');
- **year** (4)
  - L9: if (!data.year) errors.push('Year is required');
  - L11: // Year validation
  - L13: if (data.year < 1900 || data.year > currentYear + 1) {
  - L14: errors.push('Year must be between 1900 and current year');
- **mileage** (3)
  - L17: // Mileage validation
  - L18: if (data.mileage && (data.mileage < 0 || data.mileage > 999999)) {
  - L19: errors.push('Mileage must be between 0 and 999,999');

### /workspaces/car-detective-mvp/src/utils/validation/__tests__/zipCodeValidator.test.ts  (LOC 86)
functions: result, result, result, result, result
- **zip** (5)
  - L24: it("should reject ZIP codes that are not 5 digits", async () => {
  - L29: it("should reject ZIP codes with non-digit characters", async () => {
  - L34: it("should reject empty ZIP codes", async () => {
  - L39: it("should call the API for valid-format ZIP codes", async () => {
  - L70: // Mock a 404 API response for non-existent ZIP
- **url** (1)
  - L58: // Verify the API was called with the correct URL
- **storage** (4)
  - L8: // Mock the supabase client
  - L9: vi.mock("@/integrations/supabase/client", () => ({
  - L10: supabase: {
  - L15: insert: vi.fn().mockResolvedValue({ data: null, error: null }),

### /workspaces/car-detective-mvp/src/utils/validation/enhanced-vin-validation.ts  (LOC 51)
exports: VIN_REGEX, EnhancedManualEntrySchema, VinValidationResult, validateVin, validateVIN, isValidVIN
functions: VIN_REGEX, EnhancedManualEntrySchema, validateVin, validateVIN, isValidVIN
- **make** (1)
  - L11: make: z.string().min(1, "Make is required"),
- **model** (1)
  - L12: model: z.string().min(1, "Model is required"),
- **year** (1)
  - L13: year: z.number().min(1900).max(new Date().getFullYear() + 1),
- **mileage** (1)
  - L14: mileage: z.number().min(0),
- **vin** (10)
  - L4: // Export the VIN regex for reuse
  - L24: vin: z.string().regex(/^[A-HJ-NPR-Z0-9]{17}$/, "Invalid VIN format").optional(),
  - L33: export function validateVin(vin: string): VinValidationResult {
  - L34: if (!vin) {
  - L35: return { isValid: false, message: "VIN is required", error: "VIN is required" };
- **zip** (1)
  - L16: zipCode: z.string().regex(/^\d{5}$/, "ZIP code must be 5 digits"),
- **schema** (2)
  - L2: import { z } from "zod";
  - L8: * Schema for manual entry validation

### /workspaces/car-detective-mvp/src/utils/validation/schemas.ts  (LOC 18)
exports: vehicleSchema, vinSchema, plateSchema
functions: vehicleSchema, vinSchema, plateSchema
- **make** (1)
  - L5: make: z.string().min(1),
- **model** (1)
  - L6: model: z.string().min(1),
- **year** (1)
  - L7: year: z.number().min(1900).max(new Date().getFullYear() + 1),
- **mileage** (1)
  - L8: mileage: z.number().min(0),
- **schema** (1)
  - L2: import { z } from 'zod';

### /workspaces/car-detective-mvp/src/utils/validation/validateCorrectedPipeline.ts  (LOC 86)
exports: printValidationReport
functions: validateCorrectedPipeline, validation, printValidationReport, checks, icon, overallStatus
- **vin** (6)
  - L4: export async function validateCorrectedPipeline(vin: string) {
  - L5: console.log('🔒 Starting validation for corrected pipeline:', vin);
  - L21: .eq('vin', vin)
  - L47: .eq('vin', vin);
  - L65: export function printValidationReport(validation: any, vin: string) {
- **storage** (4)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L18: const { data: valuation } = await supabase
  - L34: const { data: listings } = await supabase
  - L44: const { data: auctions } = await supabase
- **valuation** (6)
  - L17: // Check updated valuation record
  - L18: const { data: valuation } = await supabase
  - L24: if (valuation) {
  - L26: validation.confidence = valuation.confidence_score || 0;
  - L28: if (valuation.ain_summary && !valuation.ain_summary.includes('Highlander')) {

### /workspaces/car-detective-mvp/src/utils/validation/vin-validation-helpers.tsx  (LOC 17)
exports: VinInfoMessage
- **vin** (2)
  - L5: * Informational component to explain VIN format
  - L12: Find your 17-character VIN on your vehicle registration, insurance card,

### /workspaces/car-detective-mvp/src/utils/validation/vin-validation.ts  (LOC 26)
exports: VinValidationResult, validateVin, validateVIN, isValidVIN
functions: validateVin, validateVIN, isValidVIN
- **vin** (8)
  - L8: export function validateVin(vin: string): VinValidationResult {
  - L9: if (!vin) {
  - L10: return { isValid: false, message: "VIN is required", error: "VIN is required" };
  - L13: if (vin.length !== 17) {
  - L14: return { isValid: false, message: "VIN must be exactly 17 characters", error: "VIN must be exactly 17 characters" };

### /workspaces/car-detective-mvp/src/utils/validation/zipCodeValidator.ts  (LOC 121)
exports: ZipValidationResult, debounce
functions: DEBOUNCE_TIME, later, validateZipCode, response, place
- **zip** (6)
  - L47: * Validate a ZIP code using the Zippopotam.us API.
  - L51: zip: string,
  - L53: if (!zip || zip.length !== 5 || !/^\d{5}$/.test(zip)) {
  - L62: .eq("zip", zip)
  - L79: const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
- **fetch** (1)
  - L79: const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
- **retry** (5)
  - L31: let timeout: ReturnType<typeof setTimeout> | null = null;
  - L35: timeout = null;
  - L39: if (timeout !== null) {
  - L40: clearTimeout(timeout);
  - L42: timeout = setTimeout(later, wait);
- **storage** (3)
  - L1: import { supabase } from "@/integrations/supabase/client";
  - L59: const { data: cachedZip, error } = await supabase
  - L106: await supabase.from("zip_validations").insert({

### /workspaces/car-detective-mvp/src/utils/validation.ts  (LOC 52)
exports: validateVin, validatePlate, validateMileage, validateZipCode
functions: validateVin, vinRegex, validatePlate, validateMileage, mileageNum, validateZipCode, zipRegex
- **mileage** (6)
  - L32: export const validateMileage = (mileage: string | number): string | null => {
  - L33: if (typeof mileage === 'string' && !mileage) return 'Mileage is required';
  - L35: const mileageNum = Number(mileage);
  - L36: if (isNaN(mileageNum)) return 'Mileage must be a number';
  - L37: if (mileageNum < 0) return 'Mileage cannot be negative';
- **vin** (6)
  - L4: export const validateVin = (vin: string): string | null => {
  - L5: if (!vin) return 'VIN is required';
  - L6: if (vin.length !== 17) return 'VIN must be exactly 17 characters';
  - L8: // Additional VIN validation logic
  - L10: if (!vinRegex.test(vin)) {
- **zip** (2)
  - L44: if (!zipCode) return 'ZIP code is required';
  - L48: return 'ZIP code must be 5 digits';

### /workspaces/car-detective-mvp/src/utils/valuation/aggregateValuationSources.ts  (LOC 154)
exports: EnrichedDataSource
functions: aggregateValuationSources, baseMarketValue, adjustments, locationMultiplier, mileageAdjustment, conditionAdjustment, finalValue, confidenceScore, estimateBaseValue, currentYear, vehicleAge, baseValue, calculateMileageAdjustment, currentYear, vehicleAge, expectedMileage, mileageDifference, getMileageDescription, calculateConditionAdjustment, conditionMultipliers, multiplier, calculateConfidenceScore, score
- **make** (2)
  - L74: make: params.make || '',
  - L147: if (params.make && params.model) score += 10;
- **model** (2)
  - L75: model: params.model || '',
  - L147: if (params.make && params.model) score += 10;
- **year** (7)
  - L38: const mileageAdjustment = calculateMileageAdjustment(params.mileage, params.year || new Date().getFullYear());
  - L76: year: params.year || new Date().getFullYear(),
  - L94: const vehicleAge = currentYear - (params.year || currentYear);
  - L99: // Age depreciation (roughly 15% per year for first 5 years, then slower)
  - L109: function calculateMileageAdjustment(mileage: number, year: number): number {
- **price** (1)
  - L66: // Calculate price range
- **mileage** (13)
  - L36: // Mileage adjustment
  - L37: if (params.mileage) {
  - L38: const mileageAdjustment = calculateMileageAdjustment(params.mileage, params.year || new Date().getFullYear());
  - L41: factor: "Mileage",
  - L43: description: getMileageDescription(params.mileage)
- **vin** (2)
  - L86: vin: params.vin,
  - L143: if (params.vin) score += 15;
- **valuation** (3)
  - L2: import { LegacyValuationResult } from "@/types/valuation";
  - L3: import { EnhancedValuationParams } from "@/utils/valuation/types";
  - L4: import { calculateVehicleValue } from "@/valuation/calculateVehicleValue";

### /workspaces/car-detective-mvp/src/utils/valuation/calculateUnifiedConfidence.ts  (LOC 66)
exports: ConfidenceContext, calculateUnifiedConfidence
functions: calculateUnifiedConfidence, confidence, realListingsCount, maxConfidence, finalConfidence
- **mileage** (3)
  - L43: // Mileage data quality
  - L45: confidence += 5; // Normal mileage
  - L47: confidence -= 8; // High mileage penalty affects confidence
- **vin** (1)
  - L24: // Exact VIN match bonus

### /workspaces/car-detective-mvp/src/utils/valuation/conditionHelpers.ts  (LOC 66)
exports: getConditionTips, getConditionValueImpact, getConditionColorClass
functions: getConditionTips, getConditionValueImpact, getConditionColorClass
- **mileage** (1)
  - L11: return "Vehicle shows normal wear for age and mileage. May have minor cosmetic issues and possibly minor mechanical issues that don't affect reliability.";

### /workspaces/car-detective-mvp/src/utils/valuation/confidenceExplainer.ts  (LOC 112)
exports: ConfidenceExplanation, explainConfidenceScore, getConfidenceText
functions: explainConfidenceScore, canRetry, getConfidenceText, levelEmoji
- **mileage** (2)
  - L55: reasons.push('Mileage information missing');
  - L56: suggestions.push('Provide current mileage for better accuracy');
- **vin** (5)
  - L41: // VIN availability
  - L44: reasons.push('Exact VIN match found in market listings');
  - L46: reasons.push('VIN provided for detailed analysis');
  - L49: reasons.push('No VIN provided - estimates based on general vehicle data');
  - L50: suggestions.push('Provide VIN for more accurate valuation');
- **retry** (2)
  - L82: suggestions.push('Retry search to find more market listings');
  - L88: suggestions.push('Retry search for updated market data');
- **valuation** (1)
  - L50: suggestions.push('Provide VIN for more accurate valuation');

### /workspaces/car-detective-mvp/src/utils/valuation/depreciation.ts  (LOC 23)
exports: calculateDepreciation
functions: calculateDepreciation, currentYear, vehicleAge, yearOneDepreciation, subsequentYearDepreciation, totalDepreciation
- **make** (1)
  - L1: export function calculateDepreciation(year: number, make: string, model: string): number {
- **model** (1)
  - L1: export function calculateDepreciation(year: number, make: string, model: string): number {
- **year** (4)
  - L1: export function calculateDepreciation(year: number, make: string, model: string): number {
  - L3: const vehicleAge = currentYear - year;
  - L8: const yearOneDepreciation = 0.20; // 20% first year
  - L9: const subsequentYearDepreciation = 0.15; // 15% per year after

### /workspaces/car-detective-mvp/src/utils/valuation/emergencyFallbackUtils.ts  (LOC 370)
exports: generateEmergencyFallbackValue
functions: generateEmergencyFallbackValue, currentYear, vehicleAge, makeLower, modelLower, baseValue, makeValues, yearEstimate, finalValue, i, expectedMiles, excessMiles, mileagePenalty, conditionLower, minimumValue, trackValuationFallback
- **make** (3)
  - L21: // Base value estimation by make/model with comprehensive coverage
  - L261: const makeLower = vehicleData.make?.toLowerCase() || 'unknown';
  - L269: // Use average for make if specific model not found
- **model** (7)
  - L21: // Base value estimation by make/model with comprehensive coverage
  - L248: 'model 3': 40000,
  - L249: 'model s': 80000,
  - L250: 'model x': 85000,
  - L251: 'model y': 50000
- **year** (7)
  - L19: const vehicleAge = currentYear - (vehicleData.year || currentYear);
  - L273: // Use vehicle year to estimate base value for unknown makes
  - L274: const yearEstimate = vehicleData.year || currentYear;
  - L289: // First year depreciation (20%)
  - L293: // Subsequent years (12% per year for first 5 years, 8% after)
- **mileage** (4)
  - L13: mileage: number,
  - L303: // Mileage adjustment
  - L305: const excessMiles = Math.max(0, mileage - expectedMiles);
  - L340: mileage: mileage,
- **vin** (2)
  - L351: vin: string,
  - L358: vin,
- **valuation** (7)
  - L4: * Emergency fallback utilities for valuation system
  - L5: * Used when primary valuation methods fail or return invalid results
  - L9: * Generate emergency fallback value when primary valuation fails
  - L16: console.log('🚨 Generating emergency fallback valuation for:', vehicleData);
  - L333: console.log('✅ Generated emergency fallback valuation:', {

### /workspaces/car-detective-mvp/src/utils/valuation/examples.ts  (LOC 174)
exports: baseMarketValue, mileage, condition, zipCode, premiumFeatures, valuationParams, valuationResult, enhancedValuationParams, finalValuationResult
functions: baseMarketValue, mileage, zipCode, premiumFeatures
- **make** (2)
  - L30: make: "Toyota",
  - L98: make: "Toyota",
- **model** (2)
  - L31: model: "Camry",
  - L99: model: "Camry",
- **year** (2)
  - L32: year: 2018,
  - L100: year: 2018,
- **mileage** (10)
  - L11: // Example mileage
  - L12: export const mileage = 50000;
  - L26: mileage: mileage,
  - L40: name: "Mileage",
  - L42: description: "Below average mileage",
- **zip** (1)
  - L17: // Example zip code
- **valuation** (1)
  - L6: } from "@/components/valuation/valuation-core/ValuationResult";

### /workspaces/car-detective-mvp/src/utils/valuation/featureAdjustments.ts  (LOC 66)
exports: featureValueMap, getFeatureValue, calculateTotalFeatureValue, getFeatureValueBreakdown
functions: getFeatureValue, calculateTotalFeatureValue, getFeatureValueBreakdown, value
- **valuation** (1)
  - L5: * to ensure accurate valuation adjustments.

### /workspaces/car-detective-mvp/src/utils/valuation/generateConfidenceExplanation.ts  (LOC 16)
exports: generateConfidenceExplanation
functions: generateConfidenceExplanation
- **model** (2)
  - L12: return `Moderate confidence valuation${marketListingsCount > 0 ? ` based on ${marketListingsCount} listings` : ' using fallback pricing model'}.`;
  - L14: return `Limited confidence valuation${marketListingsCount === 0 ? ' using estimated pricing model due to limited market data' : ` with only ${marketListingsCount} comparable listings`}.`;
- **vin** (2)
  - L8: return `High confidence valuation based on ${marketListingsCount} market listings from ${sources.length} sources${exactVinMatch ? ' with exact VIN match' : ''}.`;
  - L10: return `Good confidence valuation with ${marketListingsCount} comparable listings${exactVinMatch ? ' including exact VIN match' : ''}.`;
- **valuation** (4)
  - L8: return `High confidence valuation based on ${marketListingsCount} market listings from ${sources.length} sources${exactVinMatch ? ' with exact VIN match' : ''}.`;
  - L10: return `Good confidence valuation with ${marketListingsCount} comparable listings${exactVinMatch ? ' including exact VIN match' : ''}.`;
  - L12: return `Moderate confidence valuation${marketListingsCount > 0 ? ` based on ${marketListingsCount} listings` : ' using fallback pricing model'}.`;
  - L14: return `Limited confidence valuation${marketListingsCount === 0 ? ' using estimated pricing model due to limited market data' : ` with only ${marketListingsCount} comparable listings`}.`;

### /workspaces/car-detective-mvp/src/utils/valuation/legacyConverter.ts  (LOC 71)
exports: convertLegacyToUnified
functions: convertLegacyToUnified
- **make** (2)
  - L26: make: string;
  - L44: make: vehicleInfo.make,
- **model** (2)
  - L27: model: string;
  - L45: model: vehicleInfo.model,
- **year** (2)
  - L25: year: number;
  - L43: year: vehicleInfo.year,
- **mileage** (2)
  - L29: mileage?: number;
  - L50: mileage: vehicleInfo.mileage || 0,
- **vin** (2)
  - L31: vin?: string;
  - L41: vin: vehicleInfo.vin || '',
- **zip** (1)
  - L49: zip: vehicleInfo.zipCode || valuationData.zip_code || '',
- **valuation** (1)
  - L2: import type { UnifiedValuationResult } from '@/components/valuation/UnifiedValuationResult';

### /workspaces/car-detective-mvp/src/utils/valuation/listingInclusionAnalyzer.ts  (LOC 25)
exports: scoreListingQuality
functions: scoreListingQuality, score, tier
- **photos** (1)
  - L11: // Photos

### /workspaces/car-detective-mvp/src/utils/valuation/marketData.ts  (LOC 72)
exports: getMarketMultiplierDescription
functions: marketMultiplierCache, CACHE_EXPIRY, getMarketMultiplier, now, cached, multiplier, getMarketMultiplierDescription
- **zip** (2)
  - L11: * Retrieves the market adjustment multiplier for a given ZIP code
  - L12: * @param zipCode The ZIP code to get the market multiplier for
- **storage** (2)
  - L1: import { supabase } from "@/integrations/supabase/client";
  - L28: const { data, error } = await supabase

### /workspaces/car-detective-mvp/src/utils/valuation/mileageAdjustment.ts  (LOC 13)
exports: calculateMileageAdjustment
functions: calculateMileageAdjustment, currentYear, vehicleAge, averageMilesPerYear, expectedMileage, mileageDifference, adjustmentPerMile
- **year** (2)
  - L1: export function calculateMileageAdjustment(mileage: number, year: number): number {
  - L3: const vehicleAge = Math.max(1, currentYear - year);
- **mileage** (2)
  - L1: export function calculateMileageAdjustment(mileage: number, year: number): number {
  - L7: const mileageDifference = mileage - expectedMileage;

### /workspaces/car-detective-mvp/src/utils/valuation/missingFieldAnalyzer.ts  (LOC 283)
exports: MissingFieldImpact, MissingDataAnalysis, analyzeMissingFields, getMissingFieldMessage
functions: analyzeMissingFields, validation, priorityOrder, completionPercentage, baseAccuracy, totalImprovements, improvedAccuracy, confidenceBoost, getMissingFieldMessage, topFields, vehicleDescription, message
- **make** (2)
  - L252: vehicleInfo?: { make?: string; model?: string; year?: number }
  - L262: ? `${vehicleInfo.year || ''} ${vehicleInfo.make || ''} ${vehicleInfo.model || ''}`.trim()
- **model** (2)
  - L252: vehicleInfo?: { make?: string; model?: string; year?: number }
  - L262: ? `${vehicleInfo.year || ''} ${vehicleInfo.make || ''} ${vehicleInfo.model || ''}`.trim()
- **year** (2)
  - L252: vehicleInfo?: { make?: string; model?: string; year?: number }
  - L262: ? `${vehicleInfo.year || ''} ${vehicleInfo.make || ''} ${vehicleInfo.model || ''}`.trim()
- **mileage** (4)
  - L35: mileage: {
  - L38: impactDescription: 'Mileage is the strongest predictor of vehicle value',
  - L161: if (!formData.mileage || formData.mileage <= 0) {
  - L162: missingFields.push({ field: 'mileage', ...FIELD_IMPACTS.mileage });
- **vin** (1)
  - L279: message += `**Tip:** Uploading 3–8 clear photos (interior, exterior, VIN plate) enables our AI condition scoring — one of the most accurate in the industry.\n\n`;
- **photos** (8)
  - L116: photos: {
  - L119: impactDescription: 'Photos enable AI condition scoring and verification',
  - L121: helpText: '3-8 clear photos unlock AI analysis and condition verification',
  - L202: // Check photos (if premium)
  - L204: missingFields.push({ field: 'photos', ...FIELD_IMPACTS.photos });
- **zip** (1)
  - L31: helpText: 'ZIP code enables regional market analysis and local pricing trends',
- **valuation** (5)
  - L49: helpText: 'Honest assessment of vehicle condition for accurate valuation',
  - L146: * Analyzes form data to identify missing fields that would improve valuation accuracy
  - L257: return "Your valuation data is complete! We have everything needed for maximum accuracy.";
  - L265: let message = `We're almost ready — just a few details left to finalize your ${vehicleDescription} valuation.\n\n`;
  - L276: message += `Completing these fields can reduce your valuation range from ${currentAccuracyRange} to as low as ${improvedAccuracyRange}, giving you a number you can confidently defend in any sale, trade-in, or insurance claim.\n\n`;

### /workspaces/car-detective-mvp/src/utils/valuation/msrpInflationNormalizer.ts  (LOC 192)
exports: normalizeMsrpForInflation, applyMarketAdjustments, getFullyNormalizedMsrp
functions: normalizeMsrpForInflation, vehicleYearData, targetYearData, yearDiff, estimatedInflation, cumulativeInflation, year, yearData, normalizedMsrp, confidence, yearSpan, applyMarketAdjustments, marketFactors, adjustedMsrp, luxuryBrands, luxuryPremium, evKeywords, isEV, evAdjustment, chipShortageAdjustment, getFullyNormalizedMsrp, inflationResult, marketResult
- **make** (5)
  - L105: make: string,
  - L121: if (luxuryBrands.includes(make)) {
  - L134: model.toLowerCase().includes(keyword) || make.toLowerCase() === 'tesla'
  - L169: make: string,
  - L180: make,
- **model** (4)
  - L106: model: string,
  - L134: model.toLowerCase().includes(keyword) || make.toLowerCase() === 'tesla'
  - L170: model: string,
  - L181: model,
- **year** (26)
  - L7: year: number;
  - L14: { year: 2015, cpi: 237.0, automotiveInflation: 1.02 },
  - L15: { year: 2016, cpi: 240.0, automotiveInflation: 1.03 },
  - L16: { year: 2017, cpi: 245.1, automotiveInflation: 1.04 },
  - L17: { year: 2018, cpi: 251.1, automotiveInflation: 1.06 },
- **price** (1)
  - L8: cpi: number; // Consumer Price Index
- **dedupe** (1)
  - L143: description: 'EV market has unique pricing dynamics and incentives'

### /workspaces/car-detective-mvp/src/utils/valuation/photoUtils.ts  (LOC 84)
functions: getBestPhotoUrl, getValuationPhotos, updateValuationWithPhotoMetadata
- **photos** (6)
  - L4: * Gets the best photo URL for a valuation
  - L6: * @returns The URL of the best photo, or null if no photos exist
  - L31: * Gets all photos for a valuation
  - L33: * @returns Array of photo objects
  - L54: * Updates valuation with photo metadata
- **url** (2)
  - L4: * Gets the best photo URL for a valuation
  - L6: * @returns The URL of the best photo, or null if no photos exist
- **schema** (1)
  - L71: // If explanation is supported in your schema, include it
- **storage** (6)
  - L1: import { supabase } from "@/integrations/supabase/client";
  - L12: const { data, error } = await supabase
  - L37: const { data, error } = await supabase
  - L64: // Insert or update valuation_photos table
  - L65: const { error } = await supabase
- **valuation** (5)
  - L4: * Gets the best photo URL for a valuation
  - L5: * @param valuationId The valuation ID
  - L31: * Gets all photos for a valuation
  - L32: * @param valuationId The valuation ID
  - L54: * Updates valuation with photo metadata

### /workspaces/car-detective-mvp/src/utils/valuation/progressTracker.ts  (LOC 169)
exports: ValuationStep, EngineeringPhase, ValuationProgressTracker, ENGINEERING_PHASES, getOverallEngineeringProgress, getCurrentPhase
functions: step, step, step, completedWeight, completedWeight, getOverallEngineeringProgress, totalWeight, completedWeight, getCurrentPhase
- **mileage** (1)
  - L25: { id: 'mileage', name: 'Mileage Adjustment', weight: 15, status: 'pending' },
- **vin** (4)
  - L23: { id: 'vin_decode', name: 'VIN Decode & MSRP', weight: 5, status: 'pending' },
  - L120: description: 'EIA fuel costs, OpenAI market search, VIN decode',
  - L122: steps: ['EIA API', 'OpenAI integration', 'VIN decoder', 'Error handling']
  - L150: steps: ['Unit tests', 'Integration tests', 'Real VIN testing', 'Performance optimization']
- **openai** (2)
  - L120: description: 'EIA fuel costs, OpenAI market search, VIN decode',
  - L122: steps: ['EIA API', 'OpenAI integration', 'VIN decoder', 'Error handling']
- **valuation** (3)
  - L106: description: 'Deep analysis of existing valuation systems',
  - L113: description: 'Unified valuation processing pipeline',
  - L127: description: 'Intelligent valuation reasoning and confidence scoring',

### /workspaces/car-detective-mvp/src/utils/valuation/quickValidateMarketSearch.ts  (LOC 51)
exports: validateMarketSearchOutput, runValidation
functions: validateMarketSearchOutput, testInput, result, isValidResult, validListings
- **make** (1)
  - L12: make: 'Toyota',
- **model** (1)
  - L13: model: 'Camry',
- **year** (1)
  - L14: year: 2020,
- **price** (2)
  - L32: typeof listing.price === 'number' &&
  - L33: listing.price > 0 &&

### /workspaces/car-detective-mvp/src/utils/valuation/rules/types.ts  (LOC 67)
exports: RulesEngineInput, AdjustmentBreakdown, ValuationData, Adjustment, AdjustmentCalculator, Calculator
- **make** (1)
  - L4: make: string;
- **model** (1)
  - L5: model: string;
- **year** (1)
  - L6: year: number;
- **mileage** (1)
  - L7: mileage: number;

### /workspaces/car-detective-mvp/src/utils/valuation/rulesEngine.ts  (LOC 103)
exports: calculateAdjustments, calculateFinalValue, calculateTotalAdjustment
functions: calculateAdjustments, basePrice, conditionKey, conditionMultiplier, conditionAdjustment, accidentImpact, expectedMileage, excessMileage, mileageAdjustment, fuelMultiplier, fuelAdjustment, calculateFinalValue, totalAdjustments, finalValue, calculateTotalAdjustment
- **make** (1)
  - L9: make: input.make,
- **model** (1)
  - L10: model: input.model,
- **year** (2)
  - L11: year: input.year,
  - L52: const expectedMileage = (new Date().getFullYear() - input.year) * 12000;
- **price** (2)
  - L7: // Get base price for calculations
  - L51: // High mileage adjustment (additional to base price calculation)
- **mileage** (5)
  - L12: mileage: input.mileage
  - L51: // High mileage adjustment (additional to base price calculation)
  - L53: const excessMileage = input.mileage - expectedMileage;
  - L57: factor: 'Excess Mileage',
  - L60: name: 'Mileage Adjustment',

### /workspaces/car-detective-mvp/src/utils/valuation/specializedAdjustments.ts  (LOC 75)
exports: getMpgAdjustment, getLocationDensityAdjustment, getIncomeAdjustment
functions: getMpgAdjustment, getLocationDensityAdjustment, location, isUrban, isSuburban, getIncomeAdjustment, medianIncome
- **valuation** (1)
  - L2: * Specialized adjustment calculators for vehicle valuation

### /workspaces/car-detective-mvp/src/utils/valuation/testMarketSearchNormalization.ts  (LOC 138)
exports: validateFieldMappings
functions: testMarketSearchAgentNormalization, fordTest, nissanTest, fordComps, firstListing, nissanListings, allListingsValid, validateFieldMappings, url, sourceType
- **make** (2)
  - L13: make: 'Ford',
  - L21: make: 'Nissan',
- **model** (2)
  - L14: model: 'F-150',
  - L22: model: 'Altima',
- **year** (2)
  - L15: year: 2021,
  - L23: year: 2022,
- **price** (6)
  - L44: hasPrice: typeof firstListing.price === 'number' && firstListing.price > 0,
  - L65: typeof listing.price === 'number' &&
  - L66: listing.price > 0 &&
  - L105: price: 35000,
  - L113: price: 32000,
- **dealer** (2)
  - L108: dealerName: 'Bob\'s Cars', // Live format
  - L131: dealer: listing.dealerName || listing.dealer_name,
- **url** (2)
  - L124: const url = getNormalizedUrl(listing);
  - L129: url,
- **valuation** (1)
  - L32: console.log('✅ Ford F-150 Market Comps:', {

### /workspaces/car-detective-mvp/src/utils/valuation/testResultsAndPdfIntegration.ts  (LOC 219)
exports: testResultsPageAndPdfIntegration, testUIFieldMappings
functions: testResultsPageAndPdfIntegration, normalizedForDisplay, displayValidation, mockVehicleInfo, mockValuationData, pdfReportData, pdfListingsValid, normalized, dealerName, url, sourceType, isCpo, allTestsPassed, testUIFieldMappings
- **make** (3)
  - L22: make: 'Ford',
  - L96: make: 'Ford',
  - L119: make: pdfReportData.make,
- **model** (3)
  - L23: model: 'F-150',
  - L97: model: 'F-150',
  - L120: model: pdfReportData.model,
- **year** (3)
  - L24: year: 2021,
  - L98: year: 2021,
  - L121: year: pdfReportData.year,
- **price** (12)
  - L29: price: 34500,
  - L40: price: 35500,
  - L51: price: 36000,
  - L70: price: listing.price,
  - L81: typeof listing.price === 'number' &&
- **mileage** (4)
  - L30: mileage: 45000,
  - L41: mileage: 42000,
  - L52: mileage: 40000,
  - L106: mileage: 45000,
- **vin** (1)
  - L99: vin: '1FTEW1CP7MKD73632'
- **dealer** (6)
  - L33: dealerName: 'Bob\'s Cars',
  - L55: dealer: 'Auto World',
  - L74: dealer: listing.dealerName || listing.dealer_name || listing.dealer,
  - L145: const dealerName = listing.dealerName || listing.dealer_name || listing.dealer || 'Unknown';
  - L150: console.log(`Listing ${index + 1}: ${dealerName} - $${listing.price.toLocaleString()} [${sourceType}] CPO: ${isCpo}`);
- **url** (4)
  - L54: url: 'https://cargurus.com/listing3',
  - L72: url: getNormalizedUrl(listing),
  - L85: getNormalizedUrl(listing) // Has some form of URL
  - L146: const url = getNormalizedUrl(listing);
- **valuation** (3)
  - L3: import { EnhancedValuationResult } from '@/components/valuation/result/EnhancedValuationResult';
  - L12: // Mock enhanced valuation result with mixed MarketListing formats
  - L60: explanation: 'Enhanced valuation based on 3 market listings with 88% confidence.'

### /workspaces/car-detective-mvp/src/utils/valuation/types.ts  (LOC 132)
exports: ValuationAdjustment, ValuationParams, ValuationResult, EnhancedValuationParams, FinalValuationResult, ValuationInput
- **make** (4)
  - L20: make?: string;
  - L47: make?: string;
  - L95: make?: string;
  - L111: make?: string;
- **model** (4)
  - L21: model?: string;
  - L48: model?: string;
  - L96: model?: string;
  - L112: model?: string;
- **year** (4)
  - L22: year?: number;
  - L49: year?: number;
  - L97: year?: number;
  - L113: year?: number;
- **mileage** (4)
  - L16: mileage?: number;
  - L50: mileage?: number;
  - L98: mileage?: number;
  - L114: mileage?: number;
- **vin** (5)
  - L52: vin?: string;
  - L68: identifierType?: "vin" | "plate" | "manual" | "photo";
  - L69: vin?: string;
  - L107: identifierType?: "vin" | "plate" | "manual" | "photo";
  - L108: vin?: string;
- **photos** (4)
  - L68: identifierType?: "vin" | "plate" | "manual" | "photo";
  - L72: photos?: File[];
  - L107: identifierType?: "vin" | "plate" | "manual" | "photo";
  - L122: photos?: File[];
- **zip** (1)
  - L82: zip?: string;

### /workspaces/car-detective-mvp/src/utils/valuation/unifiedValuationEngine.ts  (LOC 366)
exports: ValuationInput, ValuationResult
functions: processValuation, isPremium, tracker, vehicleYear, vehicleMake, vehicleModel, vehicleTrim, vehicleFuelType, baseValue, finalValue, sources, usingDatabaseMSRP, depreciation, afterDepreciation, mileageAdj, afterMileage, conditionAdj, afterCondition, fuelType, fuelAdj, afterFuel, packageAdjustments, totalPackageValue, marketResult, persistResult, prices, realListings, realPrices, min, max, avg, exactVinMatch, exactPrice, strongAnchorAdj, marketWeight, marketAdj, afterMarket, confidenceScore, confidenceBreakdown, explanation, auditId, calculateFinalValuation
- **make** (13)
  - L39: make: string;
  - L117: make: cachedVehicle.make,
  - L129: const vehicleMake = vehicleData.make || 'Unknown';
  - L139: make: vehicleMake,
  - L151: make: vehicleMake,
- **model** (15)
  - L40: model: string;
  - L118: model: cachedVehicle.model,
  - L130: const vehicleModel = vehicleData.model || 'Unknown';
  - L140: model: vehicleModel,
  - L152: model: vehicleModel,
- **year** (15)
  - L38: year: number;
  - L116: year: cachedVehicle.year,
  - L128: const vehicleYear = vehicleData.year || 2020;
  - L141: year: vehicleYear,
  - L153: year: vehicleYear,
- **price** (3)
  - L226: const prices = listings.map(l => l.price).filter(p => p > 0);
  - L228: const realPrices = realListings.map(l => l.price).filter(p => p > 0);
  - L235: const exactPrice = exactVinMatch.price;
- **mileage** (21)
  - L27: mileage: number;
  - L46: mileage: number;
  - L77: const { vin, zipCode, mileage, condition, userId, isPremium: inputPremium } = input;
  - L137: mileage,
  - L158: await logValuationStep('VIN_DECODE_START', vin, valuationRequest.id, { zipCode, mileage, condition }, userId, zipCode);
- **vin** (42)
  - L25: vin: string;
  - L36: vin: string;
  - L77: const { vin, zipCode, mileage, condition, userId, isPremium: inputPremium } = input;
  - L100: tracker.startStep('vin_decode', { vin });
  - L104: decoded = await decodeVin(vin);
- **dealer** (1)
  - L89: ['admin', 'dealer'].includes(userProfile.role || '') ||
- **zip** (5)
  - L45: zip: string;
  - L195: adjustments.push({ label: "Fuel Type Impact", amount: fuelAdj, reason: `${fuelType} fuel type in ZIP ${zipCode}` });
  - L196: await logAdjustmentStep(vin, valuationRequest?.id || 'fallback', { label: "Fuel Type Impact", amount: fuelAdj, reason: `${fuelType} fuel type in ZIP ${zipCode}`, baseValue: finalValue, newValue: afterFuel }, userId, zipCode);
  - L278: const explanation = await generateAIExplanation({ baseValue, adjustments, finalValue, vehicle: { year: vehicleYear, make: vehicleMake, model: vehicleModel, trim: vehicleTrim, fuelType: vehicleFuelType }, zip: zipCode, mileage, listings, con
  - L323: zip: zipCode,
- **url** (2)
  - L309: if (!pdfError && pdfData?.url) {
  - L310: pdfUrl = pdfData.url;
- **storage** (9)
  - L5: import { supabase } from "@/integrations/supabase/client";
  - L11: import { createValuationRequest, completeValuationRequest, failValuationRequest } from "@/services/supabase/valuationRequestTracker";
  - L16: import { saveValuationExplanation } from "@/services/supabase/explanationService";
  - L81: const { data: userProfile } = await supabase
  - L108: const { data: cachedVehicle } = await supabase
- **valuation** (14)
  - L3: // Use src/services/valuationEngine.ts for all production valuation logic
  - L4: // Unified Valuation Engine with Real-Time Progress Tracking
  - L12: import { ValuationProgressTracker } from "@/utils/valuation/progressTracker";
  - L13: import { getDynamicMSRP } from "@/services/valuation/msrpLookupService";
  - L14: import { calculateAdvancedConfidence, getConfidenceBreakdown } from "@/services/valuation/confidenceEngine";

### /workspaces/car-detective-mvp/src/utils/valuation/updateValuationData.ts  (LOC 116)
functions: updateValuationDataField, updateValuationDataFields
- **schema** (1)
  - L26: // Using metadata field instead of data (which appears not to exist in schema)
- **storage** (6)
  - L1: import { supabase } from "@/integrations/supabase/client";
  - L16: const { data: valuation, error: fetchError } = await supabase
  - L32: const { error: updateError } = await supabase
  - L58: const { data: valuation, error: fetchError } = await supabase
  - L69: const { error: updateError } = await supabase
- **valuation** (17)
  - L4: * Updates a specific field in the valuation metadata
  - L5: * @param valuationId Valuation ID
  - L15: // First get the current valuation
  - L16: const { data: valuation, error: fetchError } = await supabase
  - L31: // Update the valuation with the new field

### /workspaces/car-detective-mvp/src/utils/valuation/validateMarketListingIntegration.ts  (LOC 116)
exports: validateMarketListingIntegration, testConfidenceCalculation
functions: validateMarketListingIntegration, liveListing, dbListing, mixedListing, normalizedLive, normalizedDb, normalizedMixed, liveUrl, dbUrl, mixedUrl, liveSourceType, dbSourceType, pricesValid, sourcesValid, urlsAccessible, url, testConfidenceCalculation, exactMatches, prices, avgPrice, minPrice, maxPrice, confidenceScores, avgConfidence
- **price** (10)
  - L11: price: 35000,
  - L22: price: 32000,
  - L33: price: 38000,
  - L58: const pricesValid = allListings.every(listing => typeof listing.price === 'number' && listing.price > 0);
  - L82: price: 35000,
- **mileage** (6)
  - L12: mileage: 45000,
  - L23: mileage: 52000,
  - L34: mileage: 38000,
  - L83: mileage: 45000,
  - L91: mileage: 48000,
- **vin** (4)
  - L87: vin: '1FTEW1CP7MKD73632'
  - L95: vin: '1FTEW1CP7MKD73632'
  - L106: // Test exact VIN matches
  - L107: const exactMatches = testListings.filter(l => l.vin === '1FTEW1CP7MKD73632');
- **photos** (1)
  - L17: photos: ['photo1.jpg', 'photo2.jpg']
- **dealer** (2)
  - L15: dealer: 'Bob\'s Cars',
  - L37: dealerName: 'Carvana Online',
- **url** (4)
  - L36: url: 'https://carvana.com/listing3',
  - L61: const url = getNormalizedUrl(listing);
  - L62: return typeof url === 'string' && url.length > 0;
  - L101: url: 'https://cargurus.com/listing3',
- **storage** (1)
  - L20: // Test 2: Database format listing (from Supabase)

### /workspaces/car-detective-mvp/src/utils/valuation/validatePDFShareFunctionality.ts  (LOC 363)
exports: PDFShareTestCase, PDF_SHARE_TEST_CASES, PDFShareValidationResult
functions: validatePDFShareFunctionality, testCase, pdfBlob, baseUrl, shareUrl, shareText, totalChecks, passedChecks, validateAllPDFShareTestCases, result, passedTests, totalTests, overallSuccess
- **make** (4)
  - L141: make: "Ford",
  - L173: make: "Ford",
  - L219: const shareText = `Check out my ${mockValuationResult.vehicle.year} ${mockValuationResult.vehicle.make} ${mockValuationResult.vehicle.model} valuation: $${mockValuationResult.finalValue.toLocaleString()}`;
  - L226: result.shareContentPreFilled = shareText.includes(mockValuationResult.vehicle.make) && shareText.includes('$');
- **model** (4)
  - L142: model: "F-150",
  - L166: sources: testCase.expectedFallback ? ["MSRP", "Depreciation Model"] : ["AutoTrader", "CarGurus", "Facebook Marketplace"],
  - L174: model: "F-150",
  - L219: const shareText = `Check out my ${mockValuationResult.vehicle.year} ${mockValuationResult.vehicle.make} ${mockValuationResult.vehicle.model} valuation: $${mockValuationResult.finalValue.toLocaleString()}`;
- **year** (4)
  - L140: year: 2021,
  - L153: reason: "Above average mileage for year"
  - L172: year: 2021,
  - L219: const shareText = `Check out my ${mockValuationResult.vehicle.year} ${mockValuationResult.vehicle.make} ${mockValuationResult.vehicle.model} valuation: $${mockValuationResult.finalValue.toLocaleString()}`;
- **price** (1)
  - L170: price: 40000 + (i * 2000),
- **mileage** (4)
  - L147: mileage: 84000,
  - L151: label: "High Mileage",
  - L153: reason: "Above average mileage for year"
  - L171: mileage: 80000 + (i * 5000),
- **vin** (14)
  - L13: vin: string;
  - L23: vin: "1FTEW1CP7MKD73632",
  - L31: vin: "1N4BL4BV8NN341985",
  - L41: vin: string;
  - L85: export async function validatePDFShareFunctionality(vin: string): Promise<PDFShareValidationResult> {
- **dealer** (1)
  - L180: dealerName: `Dealer ${i + 1}`,
- **zip** (2)
  - L146: zip: "95821",
  - L177: zip: "95821",
- **url** (3)
  - L228: console.log(`   Share URL: ${shareUrl}`);
  - L235: result.qrCodeUsesShareUrl = true; // Uses same URL as share buttons
  - L291: if (!result.shareUrlConstructed) result.issues.push("Share URL not properly constructed");
- **valuation** (11)
  - L5: * and fallback handling in the valuation results pipeline.
  - L8: import type { UnifiedValuationResult } from '@/components/valuation/UnifiedValuationResult';
  - L22: name: "Full Working Valuation - Ford F-150",
  - L30: name: "Fallback Valuation - Nissan Altima",
  - L135: // CREATE MOCK UNIFIED VALUATION RESULT

### /workspaces/car-detective-mvp/src/utils/valuation/validateUIResultsDisplay.ts  (LOC 303)
exports: UIValidationTestCase, UI_TEST_CASES, UIValidationResult
functions: validateUIResultsDisplay, testCase, mockValuationData, totalChecks, passedChecks, validateConfidenceColor, validateAllUITestCases, result, passedTests, totalTests, overallSuccess
- **make** (1)
  - L135: make: "Ford",
- **model** (1)
  - L136: model: "F-150",
- **year** (1)
  - L134: year: 2021,
- **price** (2)
  - L142: price: 40000 + (i * 2000),
  - L163: mockValuationData.marketListings.every(l => l.price && l.source) : true;
- **mileage** (2)
  - L137: mileage: 84000,
  - L143: mileage: 80000 + (i * 5000),
- **vin** (12)
  - L17: vin: string;
  - L27: vin: "1FTEW1CP7MKD73632",
  - L35: vin: "1N4BL4BV8NN341985",
  - L45: vin: string;
  - L81: export async function validateUIResultsDisplay(vin: string): Promise<UIValidationResult> {
- **dealer** (1)
  - L145: dealerName: `Dealer ${i + 1}`,
- **valuation** (8)
  - L6: * - Estimated value from valuation engine
  - L47: // 1. Valuation Output Rendering
  - L126: // 1. VALIDATE VALUATION OUTPUT RENDERING
  - L127: console.log("✅ 1. Validating Valuation Output Rendering...");
  - L179: result.qrCodeGenerated = true; // QR code can be generated with valuation ID

### /workspaces/car-detective-mvp/src/utils/valuation/validateUnifiedPipeline.ts  (LOC 135)
exports: validateUnifiedMarketListingPipeline, quickValidation
functions: validateUnifiedMarketListingPipeline, mixedFormatListings, normalizedListings, allNormalized, uiCompatible, url, sourceType, dealer, cpo, pdfCompatible, dealerForPdf, urlForPdf, sourceForPdf, helperFunctionsWork, url1, url2, sourceType1, sourceType2, allValidationsPassed, quickValidation
- **price** (6)
  - L14: price: 34500,
  - L24: price: 35500,
  - L34: price: 36000,
  - L49: typeof listing.price === 'number' &&
  - L50: listing.price > 0 &&
- **mileage** (3)
  - L15: mileage: 45000,
  - L25: mileage: 42000,
  - L35: mileage: 40000,
- **dealer** (5)
  - L18: dealerName: 'Bob\'s Cars', // Live format field
  - L38: dealer: 'Auto World', // Generic dealer field
  - L64: const dealer = listing.dealerName || listing.dealer_name || listing.dealer;
  - L67: return !!(url && sourceType && dealer !== undefined && cpo !== undefined);
  - L77: const dealerForPdf = listing.dealer_name || listing.dealerName || listing.dealer || 'Unknown';
- **url** (4)
  - L37: url: 'https://cargurus.com/listing3', // Generic URL field
  - L62: const url = getNormalizedUrl(listing);
  - L67: return !!(url && sourceType && dealer !== undefined && cpo !== undefined);
  - L78: const urlForPdf = listing.listing_url || listing.link || listing.url || '';

### /workspaces/car-detective-mvp/src/utils/valuation-adjustments/MarketDemandCalculator.ts  (LOC 27)
exports: MarketDemandCalculator, marketDemandCalculator
functions: highDemandZips, isHighDemand, adjustment, marketDemandCalculator
- **zip** (1)
  - L8: // Simple market demand calculation based on zip code

### /workspaces/car-detective-mvp/src/utils/valuation.ts  (LOC 211)
exports: ValuationDetails, ValuationResult
functions: getValuationById, createVinValuation, decodedVehicle, createPlateValuation, createManualValuation, estimatedValue, valuationData, calculateEstimatedValue, basePrice, yearFactor, mileageFactor, conditionFactor
- **make** (5)
  - L7: make: string;
  - L24: make: string;
  - L81: make: decodedVehicle.make || 'Unknown',
  - L103: make: decodedVehicle.make,
  - L151: make: details.make,
- **model** (5)
  - L8: model: string;
  - L25: model: string;
  - L82: model: decodedVehicle.model || 'Unknown',
  - L104: model: decodedVehicle.model,
  - L152: model: details.model,
- **year** (7)
  - L6: year: number;
  - L23: year: number;
  - L83: year: decodedVehicle.year || new Date().getFullYear(),
  - L102: year: decodedVehicle.year,
  - L150: year: details.year,
- **price** (1)
  - L185: // Basic formula: base price adjusted for year, mileage, and condition
- **mileage** (7)
  - L9: mileage?: number;
  - L26: mileage?: number;
  - L84: mileage: null, // Will be filled in follow-up
  - L105: mileage: null,
  - L153: mileage: details.mileage,
- **vin** (8)
  - L12: vin?: string;
  - L29: vin?: string;
  - L57: * Creates a valuation for a VIN
  - L59: export async function createVinValuation(vin: string, userId?: string | null): Promise<ValuationResult | null> {
  - L61: // Decode VIN using the unified-decode edge function
- **storage** (9)
  - L2: import { supabase } from '@/integrations/supabase/client';
  - L40: const { data, error } = await supabase
  - L62: const { data: decodedData, error: decodeError } = await supabase.functions.invoke('unified-decode', {
  - L76: const { data: valuationRequest, error: requestError } = await supabase
  - L78: .insert({
- **valuation** (8)
  - L4: // Interface for valuation details
  - L17: // Interface for valuation result
  - L36: * Fetches a valuation by ID
  - L57: * Creates a valuation for a VIN
  - L75: // Create valuation request for processing

### /workspaces/car-detective-mvp/src/utils/valuationAuditLogger.ts  (LOC 242)
exports: AuditLogData, ValuationStepMetadata
functions: supabaseAdmin, logValuationAudit, unavailable, logValuationStep, adjustmentPercentage, isValidUUID, cleanValuationRequestId, auditEntry, logValuationError, logAdjustmentStep
- **vin** (12)
  - L12: vin?: string;
  - L31: vin: string;
  - L52: entityId: data.vin || `valuation_${Date.now()}`,
  - L55: vin: data.vin,
  - L91: console.warn('📝 Using console-only audit logging for:', { status, vin: data.vin, finalValue: data.finalValue });
- **storage** (8)
  - L2: import { supabase } from "@/integrations/supabase/client";
  - L3: import { createClient } from "@supabase/supabase-js";
  - L7: "https://xltxqqzattxogxtqrggt.supabase.co",
  - L49: const { data: safeResponse, error: safeError } = await supabase.functions.invoke('safe-audit-logger', {
  - L159: // Primary: Insert using admin client for service role access
- **valuation** (3)
  - L1: // Enhanced Valuation Audit Logger with Full Metadata Support
  - L101: * Log individual valuation steps to the new valuation_audit_logs table
  - L194: * Log valuation error with full context

### /workspaces/car-detective-mvp/src/utils/valuationErrorHandler.ts  (LOC 137)
exports: ValuationError, ValuationErrorHandler
functions: maxRetries, attempt, valuationError, delay
- **model** (1)
  - L71: userMessage: 'Market data is temporarily unavailable. We\'ll use our pricing model instead.'
- **mileage** (1)
  - L61: userMessage: 'Please complete all required fields (location, mileage, and condition).'
- **vin** (4)
  - L15: if (error?.message?.includes('Invalid VIN format')) {
  - L21: userMessage: 'Please enter a valid 17-character VIN (letters and numbers only, no I, O, or Q).'
  - L31: userMessage: 'VIN decode service is temporarily unavailable. Please try again in a moment.'
  - L50: userMessage: 'Failed to decode VIN. Please try again or use manual entry.'
- **retry** (2)
  - L100: // Exponential backoff: 1s, 2s, 4s
  - L106: * Retry wrapper for valuation operations
- **valuation** (5)
  - L2: * PHASE 4: Comprehensive error handling for valuation pipeline
  - L87: message: error?.message || 'Unknown valuation error',
  - L90: userMessage: 'Valuation process failed. Please try again or contact support.'
  - L106: * Retry wrapper for valuation operations
  - L110: operationType: 'decode' | 'valuation',

### /workspaces/car-detective-mvp/src/utils/valuationLogger.ts  (LOC 105)
exports: ValuationLogEntry, valuationLogger
functions: emoji, phaseColor, colors, valuationLogger
- **vin** (12)
  - L8: phase: 'vin-lookup' | 'follow-up' | 'valuation-engine' | 'results-display';
  - L9: vin: string;
  - L42: 'vin-lookup': '#3B82F6',     // Blue
  - L60: vinLookup(vin: string, action: string, data: Record<string, any>, success: boolean, error?: string): void {
  - L62: phase: 'vin-lookup',
- **valuation** (4)
  - L2: * Standardized logging utility for valuation flow tracing
  - L8: phase: 'vin-lookup' | 'follow-up' | 'valuation-engine' | 'results-display';
  - L44: 'valuation-engine': '#F59E0B', // Orange
  - L84: phase: 'valuation-engine',

### /workspaces/car-detective-mvp/src/utils/vehicle/cacheUtils.ts  (LOC 59)
exports: saveToCache, loadFromCache, clearCache
functions: CACHE_EXPIRY, CACHE_KEY_MAKES, CACHE_KEY_MODELS, CACHE_KEY_TIMESTAMP, saveToCache, loadFromCache, cachedMakes, cachedModels, cacheTimestamp, now, parsedTimestamp, isCacheValid, makes, models, clearCache
- **make** (2)
  - L1: import { Make, Model } from "@/hooks/types/vehicle";
  - L8: export const saveToCache = (makes: Make[], models: Model[]) => {
- **model** (2)
  - L1: import { Make, Model } from "@/hooks/types/vehicle";
  - L8: export const saveToCache = (makes: Make[], models: Model[]) => {

### /workspaces/car-detective-mvp/src/utils/vehicle/enhancedCacheUtils.ts  (LOC 256)
exports: enhancedCache
functions: CACHE_CONFIG, enhancedCache, existingCache, limitedModels, cachedData, cachedData, cachedData, modelsByMake, makeData, isExpired, clearOldCaches, oldVersions
- **make** (18)
  - L1: import { Make, Model } from "@/hooks/types/vehicle";
  - L25: // Maximum number of cached models per make (to limit storage size)
  - L33: * - Selective caching by make
  - L41: saveMakes: (makes: Make[]): void => {
  - L47: const cacheData: CachedData<Make[]> = {
- **model** (9)
  - L1: import { Make, Model } from "@/hooks/types/vehicle";
  - L70: saveModels: (models: Model[]): void => {
  - L76: const cacheData: CachedData<Model[]> = {
  - L99: saveModelsByMake: (makeId: string, models: Model[]): void => {
  - L109: let modelsByMake: Record<string, CachedData<Model[]>> = {};

### /workspaces/car-detective-mvp/src/utils/vehicleConversion.ts  (LOC 15)
exports: convertDecodedVehicleToVehicle
functions: convertDecodedVehicleToVehicle
- **make** (2)
  - L6: id: decoded.vin || `${decoded.make}_${decoded.model}_${decoded.year}`,
  - L8: make: decoded.make || '',
- **model** (2)
  - L6: id: decoded.vin || `${decoded.make}_${decoded.model}_${decoded.year}`,
  - L9: model: decoded.model || '',
- **year** (2)
  - L6: id: decoded.vin || `${decoded.make}_${decoded.model}_${decoded.year}`,
  - L10: year: decoded.year || new Date().getFullYear(),
- **mileage** (1)
  - L11: mileage: decoded.mileage || 0,
- **vin** (2)
  - L6: id: decoded.vin || `${decoded.make}_${decoded.model}_${decoded.year}`,
  - L7: vin: decoded.vin || '',

### /workspaces/car-detective-mvp/src/utils/vehicleImages.ts  (LOC 18)
functions: getVehicleImageUrl, defaultImage
- **make** (1)
  - L6: make: string,
- **model** (1)
  - L7: model: string,
- **year** (1)
  - L8: year: string,
- **photos** (3)
  - L3: * Utility for getting vehicle image URLs
  - L13: const defaultImage = 'https://placehold.co/600x400?text=Vehicle+Image';
  - L16: // Return placeholder image for now
- **url** (1)
  - L12: // For now, return a placeholder URL

### /workspaces/car-detective-mvp/src/utils/vehicleMetaParser.ts  (LOC 171)
exports: VehicleMetadata, parseVehicleMetadata, estimateMpgFromMetadata, parseVehicleMetadataWithMpg
functions: parseVehicleMetadata, trim, rawFuel, engine, estimateMpgFromMetadata, makeLower, modelLower, currentYear, vehicleAge, parseVehicleMetadataWithMpg, metadata, estimatedMpg
- **make** (4)
  - L65: make: string,
  - L71: const makeLower = make.toLowerCase();
  - L160: make: string,
  - L165: const estimatedMpg = estimateMpgFromMetadata(make, model, year, metadata.fuelType, metadata.engine);
- **model** (4)
  - L66: model: string,
  - L72: const modelLower = model.toLowerCase();
  - L161: model: string,
  - L165: const estimatedMpg = estimateMpgFromMetadata(make, model, year, metadata.fuelType, metadata.engine);
- **year** (4)
  - L67: year: number,
  - L74: const vehicleAge = currentYear - year;
  - L162: year: number
  - L165: const estimatedMpg = estimateMpgFromMetadata(make, model, year, metadata.fuelType, metadata.engine);
- **vin** (2)
  - L1: // VIN Metadata Parser - Extract trim, fuel type, and engine from decoded VIN data
  - L10: * Parses vehicle metadata from decoded VIN data

### /workspaces/car-detective-mvp/src/valuation/calculateVehicleValue.ts  (LOC 50)
exports: AdjustmentItem, calculateVehicleValue, calculatePriceRange
functions: calculateVehicleValue, totalAdjustment, calculatePriceRange, prices, min, max
- **price** (4)
  - L23: * Calculates a realistic price range based on the estimated value and available market data
  - L26: * @returns Price range as [min, max]
  - L30: marketListings?: Array<{price: number}>
  - L34: const prices = marketListings.map(listing => listing.price);

### /workspaces/car-detective-mvp/src/valuation/types.ts  (LOC 49)
exports: CalculateVehicleValueInput, VehicleValuationResult, MarketData
- **vin** (1)
  - L6: vin: string;

### /workspaces/car-detective-mvp/scripts/analyzeConfidenceFailures.ts  (LOC 151)
functions: supabase, analyzeFailures, getConfidenceStats, scores, total, above90, above80, below50, averageScore, generateConfidenceAuditReport, stats, report, noVinMatch, lowListings, criticalFailures
- **vin** (7)
  - L30: console.log(`#${i + 1}: VIN ${v.vin}`);
  - L34: console.log(`   ⚠️  Exact VIN match NOT used.`);
  - L111: ${i + 1}. VIN: ${failure.vin}
  - L115: Exact VIN Match: ${failure.exact_vin_match ? 'Yes' : 'No'}
  - L128: - Missing Exact VIN Match: ${noVinMatch}/${failures.length} (${((noVinMatch/failures.length)*100).toFixed(1)}%)
- **storage** (5)
  - L1: import { createClient } from '@supabase/supabase-js';
  - L5: const supabase = createClient(
  - L11: const { data, error } = await supabase
  - L52: const { data: stats, error } = await supabase
  - L83: const { data: failures, error } = await supabase
- **valuation** (1)
  - L141: ${failures.filter(f => !f.exact_vin_match).length > failures.length * 0.5 ? '- Fix exact VIN match logic in valuation engine' : '✅ VIN matching logic is working'}
- **env** (2)
  - L6: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  - L7: process.env.SUPABASE_SERVICE_ROLE_KEY!

### /workspaces/car-detective-mvp/scripts/clean-remaining-logs.js  (LOC 94)
functions: fs, filesToClean, cleanFile, content, originalContent, lines, lastImportIndex, i, cleanedCount
- **valuation** (7)
  - L17: 'src/components/premium/sections/valuation-tabs/CarfaxReportTab.tsx',
  - L18: 'src/components/premium/sections/valuation-tabs/TabContent.tsx',
  - L23: 'src/components/valuation/RerunValuationButton.tsx',
  - L24: 'src/components/valuation/UnifiedValuationResult.tsx',
  - L25: 'src/components/valuation/market-trend/hooks/useForecastData.ts',

### /workspaces/car-detective-mvp/scripts/inject-runtime-config.ts  (LOC 72)
functions: injectRuntimeConfig, htmlContent, clientConfig, configScript, updatedHtml, finalOutputPath, htmlPath, outputPath
- **storage** (1)
  - L55: console.log(`✅ Runtime config injected into ${finalOutputPath}`);
- **env** (5)
  - L26: SUPABASE_URL: process.env.VITE_SUPABASE_URL,
  - L27: SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
  - L28: VEHICLE_API_URL: process.env.VITE_VEHICLE_API_URL,
  - L29: FEATURE_AUDIT: process.env.VITE_FEATURE_AUDIT,
  - L30: MODE: process.env.NODE_ENV || 'production',

### /workspaces/car-detective-mvp/scripts/refactors/fix-browser-env-and-react.ts  (LOC 49)
functions: repo, project, files, changed, fileChanged, pae, txt, originalText, newText, usesReactNs, hasReactImport
- **retry** (2)
  - L29: // 2) NodeJS.Timeout => ReturnType<typeof setTimeout>
  - L31: const newText = originalText.replace(/\bNodeJS\.Timeout\b/g, 'ReturnType<typeof setTimeout>');
- **env** (4)
  - L6: const project = new Project({ tsConfigFilePath: path.join(repo, 'tsconfig.json') });
  - L17: // 1) process.env.* => import.meta.env.*
  - L22: if (txt.startsWith('process.env.')) {
  - L23: pae.replaceWithText(txt.replace(/^process\.env\./, 'import.meta.env.'));

### /workspaces/car-detective-mvp/scripts/refactors/remove-console-statements.ts  (LOC 73)
functions: project, files, totalRemovals, sourceFile, fileRemovals, callExpressions, expression, propAccess, object, property, statement
- **env** (1)
  - L6: tsConfigFilePath: resolve('tsconfig.json'),

### /workspaces/car-detective-mvp/scripts/refactors/update-valuation-imports.ts  (LOC 88)
functions: ROOT, project, globs, changed, fileChanged, filePath, imports, spec, named, includesLegacy
- **valuation** (10)
  - L20: "ValuationResultCard": "@/components/valuation/ValuationResultCard",
  - L21: "UnifiedValuationResult": "@/components/valuation/UnifiedValuationResult",
  - L22: "EnhancedValuationResult": "@/components/valuation/result/EnhancedValuationResult",
  - L24: "ValuationResultsDisplay": "@/components/valuation/UnifiedValuationResult",
  - L25: "ValuationResult": "@/components/valuation/valuation-core/ValuationResult",
- **env** (1)
  - L7: tsConfigFilePath: path.join(ROOT, "tsconfig.json"),

### /workspaces/car-detective-mvp/scripts/regressionSuite.ts  (LOC 279)
functions: runRegressionSuite, result, runSingleTest, estimatedPrice, confidenceScore, exactVinMatch, marketListings, priceDifference, percentageError, notes, generateRegressionReport, totalTests, passedTests, warningTests, failedTests, validResults, avgError, avgConfidence, exactMatches, highConfidence, statusIcon, reportData
- **make** (8)
  - L6: make: string;
  - L24: make: 'Toyota',
  - L39: make: 'Toyota',
  - L55: make: 'Honda',
  - L93: console.log(`\n🚗 Testing ${testCase.year} ${testCase.make} ${testCase.model} (VIN: ${testCase.vin})`);
- **model** (8)
  - L7: model: string;
  - L25: model: 'Camry Hybrid',
  - L40: model: 'Highlander',
  - L56: model: 'Civic',
  - L93: console.log(`\n🚗 Testing ${testCase.year} ${testCase.make} ${testCase.model} (VIN: ${testCase.vin})`);
- **year** (8)
  - L5: year: number;
  - L23: year: 2020,
  - L38: year: 2018,
  - L54: year: 2021,
  - L93: console.log(`\n🚗 Testing ${testCase.year} ${testCase.make} ${testCase.model} (VIN: ${testCase.vin})`);
- **price** (7)
  - L14: price: number;
  - L32: price: 16977,
  - L47: price: 23994,
  - L63: price: 22500,
  - L133: const { data: valuationData, error } = await supabase.functions.invoke('enhanced-car-price-prediction', {
- **mileage** (5)
  - L9: mileage: number;
  - L27: mileage: 136940,
  - L42: mileage: 72876,
  - L58: mileage: 45000,
  - L140: mileage: testCase.mileage,
- **vin** (13)
  - L4: vin: string;
  - L22: vin: '4T1J31AK0LU533704',
  - L37: vin: '5TDZZRFH8JS264189',
  - L53: vin: '1HGBH41JXMN109186',
  - L70: vin: string;
- **dealer** (5)
  - L13: dealer: string;
  - L31: dealer: 'Roseville Toyota',
  - L46: dealer: 'Roseville Future Ford',
  - L62: dealer: 'Sample Honda',
  - L64: source: 'sample-dealer.com'
- **storage** (2)
  - L1: import { supabase } from '../src/integrations/supabase/client';
  - L133: const { data: valuationData, error } = await supabase.functions.invoke('enhanced-car-price-prediction', {
- **valuation** (6)
  - L19: // 25 test VINs with known market comps for regression testing
  - L84: * Run regression suite to validate valuation accuracy
  - L87: console.log('🧪 Starting Valuation Regression Suite');
  - L132: // Simulate valuation request (in production, this would call the actual valuation API)
  - L148: throw new Error(`Valuation API error: ${error.message}`);

### /workspaces/car-detective-mvp/scripts/valuationTestRunner.ts  (LOC 331)
functions: parseArguments, args, i, arg, printSeparator, line, padding, paddedTitle, printTestInputs, printValuationResult, totalAdjustments, sign, spreadPercent, printListingDetails, printDiagnostics, realListings, syntheticListings, main, options, startTime, result, executionTime
- **make** (1)
  - L119: console.log(`   Make:  ${result.vehicle.make}`);
- **model** (1)
  - L120: console.log(`   Model: ${result.vehicle.model}`);
- **year** (1)
  - L118: console.log(`   Year:  ${result.vehicle.year}`);
- **price** (2)
  - L142: console.log(`   Price Range: $${result.listingRange.min.toLocaleString()} - $${result.listingRange.max.toLocaleString()}`);
  - L188: console.log(`   Price:     $${listing.price?.toLocaleString() || 'N/A'}`);
- **mileage** (10)
  - L10: *   npx tsx scripts/valuationTestRunner.ts JTDKARFP5M3042123 90210 --condition=excellent --mileage=45000
  - L19: mileage?: number;
  - L34: console.error('  --mileage=<number>     Vehicle mileage (default: 75000)');
  - L43: console.error('  npx tsx scripts/valuationTestRunner.ts JTDKARFP5M3042123 90210 --condition=excellent --mileage=45000');
  - L50: mileage: 75000, // Default mileage
- **vin** (8)
  - L6: *   npx tsx scripts/valuationTestRunner.ts <VIN> <ZIP> [options]
  - L17: vin: string;
  - L31: console.error('❌ Usage: npx tsx scripts/valuationTestRunner.ts <VIN> <ZIP> [options]');
  - L48: vin: args[0].toUpperCase(),
  - L94: console.log(`🔧 VIN:           ${options.vin}`);
- **dealer** (1)
  - L194: console.log(`   Dealer:    ${listing.dealer_name || 'N/A'}`);
- **zip** (3)
  - L6: *   npx tsx scripts/valuationTestRunner.ts <VIN> <ZIP> [options]
  - L31: console.error('❌ Usage: npx tsx scripts/valuationTestRunner.ts <VIN> <ZIP> [options]');
  - L95: console.log(`📍 ZIP Code:     ${options.zipCode}`);
- **url** (1)
  - L197: console.log(`   URL:       ${listing.listing_url || 'N/A'}`);
- **valuation** (10)
  - L3: * Valuation Pipeline CLI Test Runner
  - L14: import { processValuation, type ValuationInput, type ValuationResult } from '../src/utils/valuation/unifiedValuationEngine';
  - L39: console.error('  --force-new            Force new valuation (skip cache)');
  - L106: printSeparator('VALUATION RESULTS');
  - L254: // Start valuation timer
