import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HeartPulse, ArrowUp, ArrowDown, Minus, ClipboardList, Utensils, TrendingUp, Volume2, VolumeX } from "lucide-react";
import clsx from "clsx";
import EmergencyCard from "../../components/EmergencyCard";
import Skeleton from "../../components/ui/Skeleton";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { mockProfile } from "../../lib/mockData";
import { useHealthStore } from "../../store/useHealthStore";
import { useVitalsStore } from "../../store/useVitalsStore";
import { getRiskLevel, RISK_COPY } from "../../lib/healthData";

function TrendArrow({ direction }) {
  if (direction === "up") return <ArrowUp size={14} strokeWidth={2.5} className="text-coral" />;
  if (direction === "down") return <ArrowDown size={14} strokeWidth={2.5} className="text-teal" />;
  return <Minus size={14} strokeWidth={2.5} className="text-slate/40" />;
}

export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const vitals = useVitalsStore();
  const insights = useHealthStore((s) => s.insights);
  const logs = useHealthStore((s) => s.logs);
  const latestLog = logs[logs.length - 1];
  const latestInsight = [...insights].sort((a, b) => (a.date < b.date ? 1 : -1))[0];

  function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      audio.currentTime = 0;
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  }

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const risk = getRiskLevel(vitals);
  const riskCopy = RISK_COPY[risk];
  const hrvTrend = vitals.hrv < 45 ? "down" : vitals.hrv > 60 ? "up" : "flat";

  return (
    <div>
      <audio ref={audioRef} src="/Yoruba_Helix.m4a" onEnded={() => setPlaying(false)} />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl text-ink">Good day, {mockProfile.name.split(" ")[0]}.</h1>
          <p className="mt-1 text-[15px] text-slate">Here's how your cardiovascular health looks today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleAudio}
            title={playing ? "Stop audio" : "Play Yoruba intro"}
            className="flex items-center gap-2 rounded-full border border-mist px-3 py-1.5 text-xs font-medium text-slate transition-colors hover:border-teal hover:text-teal"
          >
            {playing ? <VolumeX size={14} strokeWidth={1.5} /> : <Volume2 size={14} strokeWidth={1.5} />}
            {playing ? "Stop" : "Play intro"}
          </button>
          <button type="button" onClick={() => navigate("/dashboard/trends")}>
            <Badge tone={riskCopy.tone} dot className="whitespace-nowrap">
              {riskCopy.label}
            </Badge>
          </button>
        </div>
      </motion.div>

      <button type="button" onClick={() => navigate("/dashboard/trends")} className="mt-6 block w-full text-left">
        <Card
          className={clsx(
            "border-l-4",
            risk === "high" ? "border-l-coral bg-coral/5" : risk === "elevated" ? "border-l-amber bg-amber-light/40" : "border-l-teal bg-teal-light/40"
          )}
        >
          <p className="text-[15px] font-medium text-ink">{riskCopy.message}</p>
        </Card>
      </button>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wider text-slate">Latest BP</p>
          <p className="mt-1 font-display text-2xl text-ink">
            {vitals.systolic}/{vitals.diastolic}
          </p>
          <p className="text-xs text-slate">Live · updated seconds ago</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-slate">Resting HR</p>
          <p className="mt-1 font-display text-2xl text-ink">{vitals.heartRate} bpm</p>
          <p className="text-xs text-slate">From wearable feed</p>
        </Card>
        <Card>
          <div className="flex items-center gap-1.5">
            <p className="text-xs uppercase tracking-wider text-slate">HRV Trend</p>
            <TrendArrow direction={hrvTrend} />
          </div>
          <p className="mt-1 font-display text-2xl text-ink">{vitals.hrv} ms</p>
          <p className="text-xs text-slate">
            {latestLog ? `Sleep: ${latestLog.sleepQuality}/5 · Stress: ${latestLog.stressLevel}/5` : "No log yet"}
          </p>
        </Card>
      </div>

      {latestInsight && (
        <Link to={`/dashboard/insights?id=${latestInsight.id}`} className="mt-6 block">
          <Card className="transition-colors hover:border-teal">
            <p className="text-xs uppercase tracking-wider text-slate">AI Insight</p>
            <p className="mt-1.5 text-[15px] font-medium text-ink">{latestInsight.headline}</p>
            <p className="mt-1 line-clamp-2 text-sm text-slate">{latestInsight.preview}</p>
            <span className="mt-2 inline-block text-sm font-medium text-teal">Read more →</span>
            <p className="mt-3 text-[11px] text-slate/70">Not a diagnosis — consult a doctor.</p>
          </Card>
        </Link>
      )}

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link
          to="/dashboard/log"
          className="flex min-h-[52px] items-center justify-center gap-2 rounded-sm border border-mist text-sm font-medium text-ink hover:border-teal hover:text-teal"
        >
          <ClipboardList size={16} strokeWidth={1.5} />
          Log a reading
        </Link>
        <Link
          to="/dashboard/food"
          className="flex min-h-[52px] items-center justify-center gap-2 rounded-sm border border-mist text-sm font-medium text-ink hover:border-teal hover:text-teal"
        >
          <Utensils size={16} strokeWidth={1.5} />
          Log a meal
        </Link>
        <Link
          to="/dashboard/trends"
          className="flex min-h-[52px] items-center justify-center gap-2 rounded-sm border border-mist text-sm font-medium text-ink hover:border-teal hover:text-teal"
        >
          <TrendingUp size={16} strokeWidth={1.5} />
          View trends
        </Link>
      </div>

      <Link to="/dashboard/vitals" className="mt-6 block">
        <Card className="flex items-center justify-between gap-4 transition-colors hover:border-teal">
          <div className="flex items-center gap-3">
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}>
              <HeartPulse size={20} strokeWidth={1.5} className="text-teal" />
            </motion.div>
            <div>
              <p className="text-[15px] font-medium text-ink">Wearable connected</p>
              <p className="text-xs text-slate">Tap to view the live sensor feed</p>
            </div>
          </div>
          <p className="font-display text-2xl text-ink">{vitals.heartRate}</p>
        </Card>
      </Link>

      <div className="mt-12">
        <p className="text-xs uppercase tracking-wider text-slate">Your Emergency Profile</p>
        <p className="mt-1 text-sm text-slate">What a responder would see if they scanned your tag today.</p>

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          {loading ? (
            <Skeleton className="h-64" />
          ) : (
            <EmergencyCard profile={mockProfile} variant="preview" />
          )}

          <div className="flex flex-col gap-4">
            <Card>
              <p className="text-xs uppercase tracking-wider text-slate">Sync Status</p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${mockProfile.tag.pendingSync ? "bg-amber" : "bg-teal"}`}
                />
                <span className="text-[15px] text-ink">Last synced: {mockProfile.tag.lastSynced}</span>
              </div>
            </Card>

            <Card className="flex flex-col gap-2.5">
              <p className="text-xs uppercase tracking-wider text-slate">Quick Edit</p>
              <Link to="/onboarding" className="text-sm font-medium text-teal hover:underline">
                Update medical profile →
              </Link>
              <Link to="/dashboard/tag" className="text-sm font-medium text-teal hover:underline">
                Manage my tag →
              </Link>
              <Link to="/dashboard/settings" className="text-sm font-medium text-teal hover:underline">
                Account settings →
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
