import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../components/ui/Button";
import NfcScanVisual from "../components/NfcScanVisual";
import EmergencyCard from "../components/EmergencyCard";
import { Reveal } from "../components/ui/Reveal";
import { scanResult } from "../lib/mockData";

export default function ScanDemo() {
  const [stage, setStage] = useState("idle"); // idle | playing | result

  return (
    <div className="content-container flex min-h-[80vh] flex-col items-center justify-center py-16 text-center md:py-24">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-wider text-teal">Scan Demo</p>
        <h1 className="mt-3 max-w-xl text-3xl text-ink md:text-5xl">
          Experience the responder's side, no hardware required.
        </h1>
      </Reveal>

      <div className="relative mt-12 w-full max-w-sm">
        <AnimatePresence mode="wait">
          {stage === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                type="button"
                onClick={() => setStage("playing")}
                className="group block w-full"
              >
                <div className="aspect-[4/5] w-full overflow-hidden rounded-lg">
                  <NfcScanVisual loop showCaptureCard={false} className="h-full w-full" />
                </div>
                <span className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-sm bg-teal px-6 text-[15px] font-medium text-paper transition-colors group-hover:bg-[#0b3f37]">
                  Tap to Simulate Scan
                </span>
              </button>
            </motion.div>
          )}

          {stage === "playing" && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="aspect-[4/5] w-full overflow-hidden rounded-lg"
            >
              <NfcScanVisual
                loop={false}
                showCaptureCard={false}
                onComplete={() => setStage("result")}
                className="h-full w-full"
              />
            </motion.div>
          )}

          {stage === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-left"
            >
              <EmergencyCard profile={scanResult} variant="scan" />
              <Button
                variant="ghost-ink"
                className="mt-6 w-full"
                onClick={() => setStage("idle")}
              >
                Reset Demo
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
