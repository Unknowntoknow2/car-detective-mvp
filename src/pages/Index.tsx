
import { WelcomeBanner } from "@/components/home/WelcomeBanner";
import { OnboardingTour } from "@/components/home/OnboardingTour";
import { LookupTabs } from "@/components/home/LookupTabs";

export default function Index() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <OnboardingTour />
      <WelcomeBanner />
      <LookupTabs />
    </div>
  );
}
