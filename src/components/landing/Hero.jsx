import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import NfcScanVisual from "../NfcScanVisual";
import { useReducedMotion } from "../../lib/motion";

const HEADLINE = "Your Daily Health Guardian.";
const SUBHEADLINE = "Your Emergency Lifeline.";

const lineContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const wordVariant = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-ink-deep pt-32 pb-20 md:pt-40 md:pb-28">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 70% 30%, rgba(14,79,69,0.25) 0%, rgba(11,15,16,0) 70%)",
        }}
      />

      <div className="content-container relative grid grid-cols-1 items-center gap-16 lg:grid-cols-[55%_45%]">
        <div>
          <h1 className="text-[40px] leading-[1.08] text-paper md:text-[68px]">
            {reduced ? (
              <>
                {HEADLINE}
                <br />
                <span style={{ color: "var(--color-coral)" }}>{SUBHEADLINE}</span>
              </>
            ) : (
              <motion.span initial="hidden" animate="show" variants={lineContainer} className="block">
                <span className="block overflow-hidden pb-1">
                  <motion.span variants={wordVariant} className="block">{HEADLINE}</motion.span>
                </span>
                <span className="block overflow-hidden pb-1">
                  <motion.span variants={wordVariant} className="block" style={{ color: "var(--color-coral)" }}>{SUBHEADLINE}</motion.span>
                </span>
              </motion.span>
            )}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-md text-lg leading-relaxed text-mist/80"
          >
            Helix watches your heart health every day, warns you when something
            is drifting, and puts your medical profile in a responder's hands
            with one tap. Built for Nigeria.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Button as={Link} to="/dashboard" variant="primary" size="lg">
              View live demo →
            </Button>
            <Button as={Link} to="/order" variant="ghost" size="lg">
              Join the waitlist
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 flex items-center gap-3"
          >
            <span className="rounded-full bg-teal/20 px-3 py-1 text-xs font-medium text-teal">
              Blood Type: O+
            </span>
            <span className="rounded-full bg-teal/20 px-3 py-1 text-xs font-medium text-teal">
              Allergy: Penicillin
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative mx-auto aspect-4/5 w-full max-w-sm"
        >
          <NfcScanVisual loop showCaptureCard className="h-full w-full" />
        </motion.div>
      </div>
    </section>
  );
}
