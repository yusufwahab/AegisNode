import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Drawer from "../../components/ui/Drawer";
import { hospitalAlerts, newAlertPool } from "../../lib/mockData";

const STATUS_TONE = {
  Incoming: "coral",
  Arrived: "teal",
  Resolved: "outline",
};

function AlertCard({ alert, onClick, isNew }) {
  return (
    <motion.button
      layout
      type="button"
      onClick={onClick}
      initial={isNew ? { opacity: 0, y: -16 } : false}
      animate={{
        opacity: 1,
        y: 0,
        backgroundColor: isNew ? ["rgba(228,87,46,0.14)", "rgba(228,87,46,0)"] : "rgba(228,87,46,0)",
      }}
      transition={{ duration: isNew ? 1.5 : 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex w-full items-center justify-between gap-4 rounded-card border border-mist p-5 text-left"
    >
      <div>
        <p className="text-[15px] font-medium text-ink">{alert.name}</p>
        <p className="mt-0.5 text-xs text-slate">{alert.patientId}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {alert.allergies.map((a) => (
            <Badge key={a} tone="outline">{a}</Badge>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Badge tone="teal">{alert.bloodType}</Badge>
        <Badge tone={STATUS_TONE[alert.status]}>{alert.status}</Badge>
        <span className="text-xs text-slate">ETA {alert.eta}</span>
      </div>
    </motion.button>
  );
}

export default function IncomingAlerts() {
  const [alerts, setAlerts] = useState(hospitalAlerts);
  const [newIds, setNewIds] = useState(new Set());
  const [selected, setSelected] = useState(null);
  const [poolIndex, setPoolIndex] = useState(0);

  function simulateNewAlert() {
    const template = newAlertPool[poolIndex % newAlertPool.length];
    const id = `sim-${Date.now()}`;
    setAlerts((prev) => [{ ...template, id }, ...prev]);
    setNewIds((prev) => new Set(prev).add(id));
    setPoolIndex((i) => i + 1);
    setTimeout(() => {
      setNewIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 1500);
  }

  function markArrived(id) {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: "Arrived", eta: "Arrived" } : a)));
    setSelected((s) => (s ? { ...s, status: "Arrived", eta: "Arrived" } : s));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-ink">Incoming Alerts</h1>
          <p className="mt-1 text-sm text-slate">Newest scans appear at the top.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={simulateNewAlert}>
          <Bell size={15} strokeWidth={1.5} />
          Simulate New Alert (Demo)
        </Button>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              isNew={newIds.has(alert.id)}
              onClick={() => setSelected(alert)}
            />
          ))}
        </AnimatePresence>
      </div>

      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name}>
        {selected && (
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate">Patient ID</p>
              <p className="mt-1 text-[15px] text-ink">{selected.patientId}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate">Blood Type</p>
              <p className="mt-1 font-display text-3xl text-teal">{selected.bloodType}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate">Allergies</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selected.allergies.map((a) => (
                  <Badge key={a} tone="outline">{a}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate">Status</p>
              <div className="mt-1">
                <Badge tone={STATUS_TONE[selected.status]}>{selected.status}</Badge>
              </div>
            </div>
            {selected.status !== "Arrived" && (
              <Button variant="primary" onClick={() => markArrived(selected.id)}>
                Mark as Arrived
              </Button>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
