import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import NfcScanVisual from "../NfcScanVisual";
import { useReducedMotion } from "../../lib/motion";

const HEADLINE_LINES = ["Your medical history.", "Ready before you arrive."];

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
          <h1 className="text-[40px] leading-[1.08] text-paper md:text-[72px]">
            {reduced ? (
              <>
                {HEADLINE_LINES[0]}
                <br />
                {HEADLINE_LINES[1]}
              </>
            ) : (
              <motion.span initial="hidden" animate="show" variants={lineContainer} className="block">
                {HEADLINE_LINES.map((line) => (
                  <span key={line} className="block overflow-hidden pb-1">
                    <motion.span variants={wordVariant} className="block">
                      {line}
                    </motion.span>
                  </span>
                ))}
              </motion.span>
            )}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-md text-lg leading-relaxed text-mist/80"
          >
            Aegis Node is an offline-first NFC tag that puts your critical medical
            profile in a responder's hands the moment they tap — then alerts the
            hospital automatically once a connection returns.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Button as={Link} to="/order" variant="coral" size="lg">
              Order Your Tag →
            </Button>
            <Button as={Link} to="/how-it-works" variant="ghost" size="lg">
              See How It Works
            </Button>
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
