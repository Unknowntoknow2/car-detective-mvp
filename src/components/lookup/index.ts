
// Export all unified lookup components
export { UnifiedPlateLookup } from "./UnifiedPlateLookup";
export { UnifiedFollowUpForm } from "../followup/UnifiedFollowUpForm";

// Use the premium VehicleFoundCard as the shared one
export { VehicleFoundCard } from "@/components/premium/lookup/plate/VehicleFoundCard";

// Use shared components from premium lookup for VinDecoderResults and CarfaxErrorAlert
export { default as VinDecoderResults } from "@/components/premium/lookup/vin/VinDecoderResults";
export { CarfaxErrorAlert } from "@/components/premium/lookup/vin/CarfaxErrorAlert";
