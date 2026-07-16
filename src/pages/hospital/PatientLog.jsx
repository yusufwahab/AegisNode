import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import { fetchAlerts, subscribeToAlerts } from "../../lib/alerts";
import { buildAlertsCsv, downloadCsv } from "../../lib/csv";

const STATUS_TONE = {
  Incoming: "coral",
  Arrived: "teal",
  Resolved: "outline",
};

export default function PatientLog() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      onInsert: (alert) => setAlerts((prev) => [alert, ...prev]),
      onUpdate: (alert) => setAlerts((prev) => prev.map((a) => (a.id === alert.id ? alert : a))),
    });
    return unsubscribe;
  }, []);

  function handleExport() {
    downloadCsv("aegis-node-patient-log.csv", buildAlertsCsv(alerts));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-ink">Patient Log</h1>
          <p className="mt-1 text-sm text-slate">All scans received, most recent first.</p>
        </div>
        <Button variant="ghost-ink" size="sm" onClick={handleExport}>
          <Download size={15} strokeWidth={1.5} />
          Export to CSV
        </Button>
      </div>

      {loading ? (
        <div className="mt-8 flex flex-col gap-3">
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-card border border-mist">
          <table className="w-full min-w-160 text-left text-sm">
            <thead className="border-b border-mist bg-mist/40 text-xs uppercase tracking-wider text-slate">
              <tr>
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Blood Type</th>
                <th className="px-5 py-3 font-medium">Allergies</th>
                <th className="px-5 py-3 font-medium">ETA</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist">
              {alerts.map((alert) => (
                <tr key={alert.id}>
                  <td className="px-5 py-4">
                    <p className="font-medium text-ink">{alert.name}</p>
                    <p className="text-xs text-slate">{alert.patientId}</p>
                  </td>
                  <td className="px-5 py-4 text-ink">{alert.bloodType || "—"}</td>
                  <td className="px-5 py-4 text-slate">
                    {alert.allergies?.length ? alert.allergies.join(", ") : "None known"}
                  </td>
                  <td className="px-5 py-4 text-slate">{alert.eta || "—"}</td>
                  <td className="px-5 py-4">
                    <Badge tone={STATUS_TONE[alert.status]}>{alert.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
