
// Export all unified lookup components
export { UnifiedVinLookup } from "./UnifiedVinLookup";
export { UnifiedPlateLookup } from "./UnifiedPlateLookup";
export { default as UnifiedManualEntryForm } from "./UnifiedManualEntryForm";
export { UnifiedFollowUpForm } from "../followup/UnifiedFollowUpForm";

// Export found components
export * from "./found/FoundCarCard";

// Use the premium VehicleFoundCard as the shared one
export { VehicleFoundCard } from "@/components/premium/lookup/plate/VehicleFoundCard";
