
// Export all unified lookup components
export { UnifiedLookupTabs } from "./UnifiedLookupTabs";
export { UnifiedPlateLookup } from "./UnifiedPlateLookup";
export { UnifiedFollowUpForm } from "../followup/UnifiedFollowUpForm";

// Re-export the legacy LookupTabs wrapper for compatibility
export { LookupTabs } from "../home/LookupTabs";

// Use the premium VehicleFoundCard as the shared one
export { VehicleFoundCard } from "@/components/premium/lookup/plate/VehicleFoundCard";

// Use shared components from premium lookup for VinDecoderResults and CarfaxErrorAlert
export { default as VinDecoderResults } from "@/components/premium/lookup/vin/VinDecoderResults";
export { CarfaxErrorAlert } from "@/components/premium/lookup/vin/CarfaxErrorAlert";
