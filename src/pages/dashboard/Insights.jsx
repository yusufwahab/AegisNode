import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import clsx from "clsx";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import { useHealthStore } from "../../store/useHealthStore";
import { formatShortDate } from "../../lib/healthData";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "warning", label: "Warnings" },
  { key: "improvement", label: "Improvements" },
];

function sortByDateDesc(insights) {
  return [...insights].sort((a, b) => (a.date < b.date ? 1 : -1));
}

function InsightIcon({ type }) {
  if (type === "improvement") return <TrendingDown size={18} strokeWidth={1.5} className="text-teal" />;
  return <TrendingUp size={18} strokeWidth={1.5} className="text-amber" />;
}

export default function Insights() {
  const insights = useHealthStore((s) => s.insights);
  const [filter, setFilter] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const sorted = sortByDateDesc(insights);
  const filtered = filter === "all" ? sorted : sorted.filter((i) => i.type === filter);
  const openId = searchParams.get("id");
  const active = insights.find((i) => i.id === openId) || null;

  function openDetail(id) {
    setSearchParams({ id }, { replace: true });
  }

  function closeDetail() {
    setSearchParams({}, { replace: true });
  }

  return (
    <div className="max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl text-ink">AI Lifestyle Insights</h1>
        <p className="mt-1 text-[15px] text-slate">
          Patterns Helix has noticed in your logs. Not a diagnosis — consult a doctor.
        </p>
      </motion.div>

      <div className="mt-6 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={clsx(
              "min-h-[36px] rounded-full border px-4 text-sm font-medium transition-colors",
              filter === f.key ? "border-teal bg-teal-light text-teal" : "border-mist text-slate hover:border-teal"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {filtered.length === 0 && (
          <Card className="text-center text-[15px] text-slate">
            Helix hasn't spotted any patterns yet — log a few more readings and check back.
          </Card>
        )}
        {filtered.map((insight) => (
          <button key={insight.id} type="button" onClick={() => openDetail(insight.id)} className="text-left">
            <Card className="flex items-start gap-4 transition-colors hover:border-teal">
              <div className="mt-0.5 shrink-0">
                <InsightIcon type={insight.type} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[15px] font-medium text-ink">{insight.headline}</p>
                  <span className="shrink-0 text-xs text-slate">{formatShortDate(insight.date)}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-slate">{insight.preview}</p>
              </div>
            </Card>
          </button>
        ))}
      </div>

      <Modal open={Boolean(active)} onClose={closeDetail} title={active?.headline}>
        {active && (
          <div className="flex flex-col gap-4">
            <p className="text-[15px] leading-relaxed text-slate">{active.explanation}</p>

            {active.chartData?.length > 1 && (
              <div className="h-24 w-full rounded-sm bg-mist/40 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={active.chartData}>
                    <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                    <Line
                      type="monotone"
                      dataKey={active.metric || "systolic"}
                      stroke={active.type === "improvement" ? "#0E4F45" : "#B7791F"}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <p className="text-xs text-slate/70">Not a diagnosis — consult a doctor.</p>

            {active.action && (
              <Button
                variant="primary"
                onClick={() => {
                  closeDetail();
                  navigate(active.action.to);
                }}
              >
                {active.action.label}
              </Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
