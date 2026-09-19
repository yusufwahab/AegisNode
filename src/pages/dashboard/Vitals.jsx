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
        <h1 className="text-3xl text-ink">Live Sensor</h1>
        <div className="mt-2 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-teal" />
          <p className="text-sm text-slate">Connected (simulated)</p>
        </div>
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
