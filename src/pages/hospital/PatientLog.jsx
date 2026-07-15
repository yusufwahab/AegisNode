import Badge from "../../components/ui/Badge";
import { hospitalAlerts } from "../../lib/mockData";

const STATUS_TONE = {
  Incoming: "coral",
  Arrived: "teal",
  Resolved: "outline",
};

export default function PatientLog() {
  return (
    <div>
      <h1 className="text-2xl text-ink">Patient Log</h1>
      <p className="mt-1 text-sm text-slate">All scans received today, most recent first.</p>

      <div className="mt-8 overflow-x-auto rounded-card border border-mist">
        <table className="w-full min-w-[640px] text-left text-sm">
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
            {hospitalAlerts.map((alert) => (
              <tr key={alert.id}>
                <td className="px-5 py-4">
                  <p className="font-medium text-ink">{alert.name}</p>
                  <p className="text-xs text-slate">{alert.patientId}</p>
                </td>
                <td className="px-5 py-4 text-ink">{alert.bloodType}</td>
                <td className="px-5 py-4 text-slate">{alert.allergies.join(", ")}</td>
                <td className="px-5 py-4 text-slate">{alert.eta}</td>
                <td className="px-5 py-4">
                  <Badge tone={STATUS_TONE[alert.status]}>{alert.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
