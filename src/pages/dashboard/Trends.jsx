import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "../../components/ui/Card";
import { useHealthStore } from "../../store/useHealthStore";
import { formatShortDate } from "../../lib/healthData";

const RANGES = [
  { key: "week", label: "Week", days: 7 },
  { key: "month", label: "Month", days: 30 },
  { key: "6months", label: "6 Months", days: 182 },
];

function avg(values) {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

const SUMMARY_TONES = {
  teal: { border: "border-l-teal", text: "text-teal" },
  amber: { border: "border-l-amber", text: "text-amber" },
  coral: { border: "border-l-coral", text: "text-coral" },
};

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-sm border border-mist bg-paper px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-ink">{formatShortDate(label)}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export default function Trends() {
  const logs = useHealthStore((s) => s.logs);
  const [range, setRange] = useState("6months");

  const rangeConfig = RANGES.find((r) => r.key === range);
  const windowed = useMemo(() => logs.slice(-rangeConfig.days), [logs, rangeConfig.days]);

  const summary = useMemo(() => {
    if (windowed.length < 3) return null;
    const half = Math.floor(windowed.length / 2);
    const firstAvg = avg(windowed.slice(0, half).map((l) => l.systolic));
    const secondAvg = avg(windowed.slice(half).map((l) => l.systolic));
    const delta = secondAvg - firstAvg;
    if (delta <= -3) return { label: "Improving", tone: "teal", copy: `Systolic averaging down ${Math.abs(Math.round(delta))} pts across this window.` };
    if (delta >= 3) return { label: "Rising", tone: "coral", copy: `Systolic averaging up ${Math.round(delta)} pts across this window.` };
    return { label: "Stable", tone: "amber", copy: "Readings have held steady across this window." };
  }, [windowed]);

  const tickIndices = useMemo(() => {
    const step = Math.max(1, Math.floor(windowed.length / 5));
    return windowed.filter((_, i) => i % step === 0).map((l) => l.date);
  }, [windowed]);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl text-ink">Blood Trend Intelligence</h1>
        <p className="mt-1 text-[15px] text-slate">Your BP and heart signal over time.</p>
      </motion.div>

      <div className="mt-6 inline-flex rounded-full border border-mist p-1">
        {RANGES.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setRange(r.key)}
            className={clsx(
              "min-h-[36px] rounded-full px-4 text-sm font-medium transition-colors",
              range === r.key ? "bg-teal text-paper" : "text-slate hover:text-teal"
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      {windowed.length < 3 ? (
        <Card className="mt-6 text-center text-[15px] text-slate">
          Not enough data yet for this view — try a wider range or log more readings.
        </Card>
      ) : (
        <>
          {summary && (
            <Card className={clsx("mt-6 border-l-4", SUMMARY_TONES[summary.tone].border)}>
              <p className={clsx("text-lg font-medium", SUMMARY_TONES[summary.tone].text)}>{summary.label}</p>
              <p className="mt-1 text-sm text-slate">{summary.copy}</p>
            </Card>
          )}

          <Card className="mt-6">
            <p className="text-xs uppercase tracking-wider text-slate">
              Blood Pressure <span className="text-teal">● Systolic</span> <span className="text-slate">● Diastolic</span>
            </p>
            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={windowed}>
                  <CartesianGrid stroke="#E8E6E0" vertical={false} />
                  <XAxis
                    dataKey="date"
                    ticks={tickIndices}
                    tickFormatter={formatShortDate}
                    tick={{ fontSize: 11, fill: "#5B6664" }}
                    axisLine={{ stroke: "#E8E6E0" }}
                    tickLine={false}
                  />
                  <YAxis domain={[60, 190]} tick={{ fontSize: 11, fill: "#5B6664" }} axisLine={false} tickLine={false} width={32} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="systolic" name="Systolic" stroke="#0E4F45" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="diastolic" name="Diastolic" stroke="#5B6664" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="mt-6">
            <p className="text-xs uppercase tracking-wider text-slate">
              Heart Rate &amp; HRV <span className="text-coral">● HR</span> <span className="text-teal">● HRV</span>
            </p>
            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={windowed}>
                  <CartesianGrid stroke="#E8E6E0" vertical={false} />
                  <XAxis
                    dataKey="date"
                    ticks={tickIndices}
                    tickFormatter={formatShortDate}
                    tick={{ fontSize: 11, fill: "#5B6664" }}
                    axisLine={{ stroke: "#E8E6E0" }}
                    tickLine={false}
                  />
                  <YAxis domain={[10, 160]} tick={{ fontSize: 11, fill: "#5B6664" }} axisLine={false} tickLine={false} width={32} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="heartRate" name="Heart Rate" stroke="#E4572E" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="hrv" name="HRV" stroke="#0E4F45" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
