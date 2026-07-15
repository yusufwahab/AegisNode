import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import EmergencyCard from "../../components/EmergencyCard";
import Skeleton from "../../components/ui/Skeleton";
import Card from "../../components/ui/Card";
import { mockProfile } from "../../lib/mockData";

export default function Overview() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-3xl text-ink">Welcome back, {mockProfile.name.split(" ")[0]}.</h1>
        <p className="mt-1 text-[15px] text-slate">Here's the profile responders would see today.</p>
      </motion.div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
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
                className={`h-2 w-2 rounded-full ${mockProfile.tag.pendingSync ? "bg-amber-500" : "bg-emerald-500"}`}
              />
              <span className="text-[15px] text-ink">
                Last synced: {mockProfile.tag.lastSynced}
              </span>
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
  );
}
