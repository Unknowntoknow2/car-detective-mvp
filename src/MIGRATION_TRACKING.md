# Phase B: Service Migration Mapping

## EXTRACTED TYPES ✅
- ✅ `src/types/vehicleData.ts` - Unified VehicleData, ValuationResult, etc.
- ✅ `src/types/index.ts` - Central exports with conflict resolution

## SERVICES TO MIGRATE

### High Priority (Core Functionality)
1. **UnifiedSupabase Service**
   - From: `apps/ain-valuation-engine/src/services/unifiedSupabase.ts`
   - To: `src/services/supabase/unifiedClient.ts`
   - Status: 🔄 NEXT

2. **VIN Validation Service**
   - From: `apps/ain-valuation-engine/src/services/vinValidation.ts`  
   - To: `src/services/vinValidation.ts`
   - Status: 📋 PENDING

3. **Valuation Engine Core**
   - From: `apps/ain-valuation-engine/src/services/valuationEngine.ts`
   - Merge with: `src/services/valuationEngine.ts`
   - Status: 📋 PENDING

### Medium Priority (Enhanced Features)  
4. **Market Listings Service**
   - From: `apps/ain-valuation-engine/src/services/marketListingsService.ts`
   - Merge with: `src/services/marketListings.ts`
   - Status: 📋 PENDING

5. **Vehicle History Service** 
   - From: `apps/ain-valuation-engine/src/services/vehicleHistoryService.ts`
   - Check against: `src/services/historyCheckService.ts`
   - Status: 📋 PENDING

### Utilities
6. **Normalize Vehicle Data**
   - From: `apps/ain-valuation-engine/src/services/normalizeVehicleData.ts`
   - Check against: `src/utils/scrapers/utils/normalizeVehicleData.ts`
   - Status: 📋 PENDING

## IMPORT UPDATES NEEDED
After each service migration:
- [ ] Update imports in `src/` to use unified types from `src/types/vehicleData`
- [ ] Search and replace legacy import paths
- [ ] Verify no breaking changes in existing functionality

## TESTING STRATEGY
- [ ] Test root build after each migration: `npm run build`
- [ ] Verify legacy system still works: `ls apps/ain-valuation-engine/`
- [ ] Check for TypeScript errors: `npm run typecheck`