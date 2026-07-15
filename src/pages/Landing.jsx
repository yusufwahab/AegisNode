import Hero from "../components/landing/Hero";
import TrustStrip from "../components/landing/TrustStrip";
import ProblemSection from "../components/landing/ProblemSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import AudienceSplit from "../components/landing/AudienceSplit";
import CredibilityStrip from "../components/landing/CredibilityStrip";
import FinalCtaBand from "../components/FinalCtaBand";

export default function Landing() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ProblemSection />
      <HowItWorksSection />
      <AudienceSplit />
      <CredibilityStrip />
      <FinalCtaBand />
    </>
  );
}
