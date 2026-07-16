import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Download } from "lucide-react";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Drawer from "../../components/ui/Drawer";
import Skeleton from "../../components/ui/Skeleton";
import EmergencyCard from "../../components/EmergencyCard";
import { newAlertPool } from "../../lib/mockData";
import { fetchAlerts, subscribeToAlerts } from "../../lib/alerts";
import { updateAlertStatus } from "../../lib/api";
import { isSupabaseConfigured } from "../../lib/supabaseClient";
import { buildAlertsCsv, downloadCsv } from "../../lib/csv";

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
          {alert.allergies?.length ? (
            alert.allergies.map((a) => (
              <Badge key={a} tone="outline">
                {a}
              </Badge>
            ))
          ) : (
            <Badge tone="outline">None known</Badge>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Badge tone="teal">{alert.bloodType || "—"}</Badge>
        <Badge tone={STATUS_TONE[alert.status]}>{alert.status}</Badge>
        <span className="text-xs text-slate">ETA {alert.eta || "—"}</span>
      </div>
    </motion.button>
  );
}

export default function IncomingAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newIds, setNewIds] = useState(new Set());
  const [selected, setSelected] = useState(null);
  const [poolIndex, setPoolIndex] = useState(0);

  function flashNew(id) {
    setNewIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setNewIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 1500);
  }

  useEffect(() => {
    let cancelled = false;
    fetchAlerts().then((data) => {
      if (!cancelled) {
        setAlerts(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAlerts({
      onInsert: (alert) => {
        setAlerts((prev) => [alert, ...prev]);
        flashNew(alert.id);
      },
      onUpdate: (alert) => {
        setAlerts((prev) => prev.map((a) => (a.id === alert.id ? alert : a)));
      },
    });
    return unsubscribe;
  }, []);

  function simulateNewAlert() {
    const template = newAlertPool[poolIndex % newAlertPool.length];
    const id = `sim-${Date.now()}`;
    setAlerts((prev) => [{ ...template, id, source: "mock" }, ...prev]);
    setPoolIndex((i) => i + 1);
    flashNew(id);
  }

  function handleExport() {
    downloadCsv("aegis-node-incoming-alerts.csv", buildAlertsCsv(alerts));
  }

  async function markArrived(alert) {
    setAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, status: "Arrived" } : a)));
    setSelected((s) => (s ? { ...s, status: "Arrived" } : s));

    // Rows fetched/streamed from Supabase have a real uuid `id` — mock/simulated
    // entries (from the demo button, or the pre-Supabase fallback list) don't
    // exist server-side, so there's nothing to persist for those.
    if (isSupabaseConfigured && alert.source !== "mock") {
      updateAlertStatus(alert.id, "Arrived").catch(() => {});
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-ink">Incoming Alerts</h1>
          <p className="mt-1 text-sm text-slate">Newest scans appear at the top.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost-ink" size="sm" onClick={handleExport}>
            <Download size={15} strokeWidth={1.5} />
            Export to CSV
          </Button>
          <Button variant="secondary" size="sm" onClick={simulateNewAlert}>
            <Bell size={15} strokeWidth={1.5} />
            Simulate New Alert
          </Button>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {loading ? (
          <>
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </>
        ) : (
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
        )}
      </div>

      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)}>
        {selected && (
          <div className="flex flex-col gap-6">
            <EmergencyCard
              profile={{ ...selected, id: selected.patientId || selected.id }}
              variant="preview"
            />
            {selected.status !== "Arrived" && (
              <Button variant="primary" onClick={() => markArrived(selected)}>
                Mark as Arrived
              </Button>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
