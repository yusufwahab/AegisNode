import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";
import Badge from "./ui/Badge";
import { hospitalAlerts } from "../lib/mockData";

export default function HospitalDashboardPreview() {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowToast(true);
      const t = setTimeout(() => setShowToast(false), 2400);
      return () => clearTimeout(t);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-lg border border-mist bg-paper shadow-lg">
      <div className="flex items-center gap-1.5 border-b border-mist bg-mist/50 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-mist" />
        <span className="h-2.5 w-2.5 rounded-full bg-mist" />
        <span className="h-2.5 w-2.5 rounded-full bg-mist" />
        <span className="ml-3 text-xs text-slate">aegisnode.app/hospital-dashboard</span>
      </div>

      <div className="space-y-3 p-5 md:p-7">
        {hospitalAlerts.slice(0, 3).map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between gap-4 rounded-card border border-mist p-4"
          >
            <div>
              <p className="text-[15px] font-medium text-ink">{alert.name}</p>
              <p className="text-xs text-slate">{alert.patientId}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="teal">{alert.bloodType}</Badge>
              <Badge tone={alert.status === "Incoming" ? "coral" : "outline"}>{alert.status}</Badge>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-5 top-16 flex items-center gap-2 rounded-card bg-ink px-4 py-2.5 shadow-lg md:right-7"
          >
            <Bell size={14} strokeWidth={1.5} className="text-coral" />
            <span className="text-xs font-medium text-paper">New Alert Incoming</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
