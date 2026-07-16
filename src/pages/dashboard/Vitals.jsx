import { motion } from "framer-motion";
import VitalsMonitor from "../../components/VitalsMonitor";

export default function Vitals() {
  return (
    <div className="max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-3xl text-ink">Vitals</h1>
        <p className="mt-1 text-[15px] text-slate">
          A live readout of what responders would see alongside your emergency profile.
        </p>
      </motion.div>

      <div className="mt-8">
        <VitalsMonitor />
      </div>
    </div>
  );
}
