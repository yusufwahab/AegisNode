import { useState } from "react";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "../components/ui/Reveal";
import HospitalDashboardPreview from "../components/HospitalDashboardPreview";
import RequestDemoModal from "../components/RequestDemoModal";
import FinalCtaBand from "../components/FinalCtaBand";
import { hospitalFeatures } from "../lib/mockData";

export default function Hospitals() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div>
      <section className="relative overflow-hidden bg-ink-deep pt-32 pb-20 md:pt-40 md:pb-28">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 30% 30%, rgba(14,79,69,0.25) 0%, rgba(11,15,16,0) 70%)",
          }}
        />
        <div className="content-container relative">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl text-4xl text-paper md:text-6xl"
          >
            Know before they arrive.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-mist/80"
          >
            Aegis Node gives your triage team a structured alert — blood type,
            allergies, conditions — the moment a responder's scan syncs, often
            minutes before the patient arrives.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9"
          >
            <Button variant="coral" size="lg" onClick={() => setDemoOpen(true)}>
              Request a Partner Walkthrough
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-28">
        <div className="content-container">
          <Reveal>
            <h2 className="max-w-xl text-3xl text-ink md:text-4xl">
              Built for triage teams, not just IT departments.
            </h2>
          </Reveal>
          <RevealGroup className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2" stagger={0.1}>
            {hospitalFeatures.map((feature) => (
              <RevealItem key={feature.title} className="border-t border-mist pt-6">
                <h3 className="text-lg text-ink">{feature.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate">{feature.copy}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-mist/60 py-16 md:py-28">
        <div className="content-container">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl text-ink md:text-4xl">A live view of what's coming in.</h2>
            <p className="mt-4 text-[15px] text-slate">
              A preview of the Hospital Triage Dashboard your team would use —
              built for information density, not marketing polish.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mx-auto mt-12 max-w-2xl">
            <HospitalDashboardPreview />
          </Reveal>
        </div>
      </section>

      <FinalCtaBand
        headline="Ready to see it on your floor?"
        ctaLabel="Request a Partner Walkthrough"
        onCtaClick={() => setDemoOpen(true)}
      />

      <RequestDemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
}
