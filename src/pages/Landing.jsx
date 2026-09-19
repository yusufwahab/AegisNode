import Hero from "../components/landing/Hero";
import TrustStrip from "../components/landing/TrustStrip";
import ProblemSection from "../components/landing/ProblemSection";
import PreventionFeatures from "../components/landing/PreventionFeatures";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import WearableSection from "../components/landing/WearableSection";
import EmergencyProfileSection from "../components/landing/EmergencyProfileSection";
import AudienceSplit from "../components/landing/AudienceSplit";
import WhoItsFor from "../components/landing/WhoItsFor";
import TrustPrivacy from "../components/landing/TrustPrivacy";
import CredibilityStrip from "../components/landing/CredibilityStrip";
import FinalCtaBand from "../components/FinalCtaBand";

export default function Landing() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ProblemSection />
      <PreventionFeatures />
      <HowItWorksSection />
      <WearableSection />
      <EmergencyProfileSection />
      <AudienceSplit />
      <WhoItsFor />
      <TrustPrivacy />
      <CredibilityStrip />
      <FinalCtaBand />
    </>
  );
}
