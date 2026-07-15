import { useState } from "react";
import { motion } from "framer-motion";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import NfcMark from "../../components/ui/NfcMark";
import { useToast } from "../../lib/toastContext";
import { mockProfile } from "../../lib/mockData";

const ORDER_HISTORY = [
  { id: "ORD-1042", date: "2026-04-02", status: "Delivered" },
];

export default function TagPage() {
  const [reissuing, setReissuing] = useState(false);
  const pushToast = useToast();

  function handleReissue() {
    setReissuing(true);
    setTimeout(() => {
      setReissuing(false);
      pushToast?.("Reissue requested — your new tag ships in 3–5 business days.");
    }, 1000);
  }

  function handleReportLost() {
    pushToast?.("Tag reported lost and deactivated immediately.");
  }

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-3xl text-ink"
      >
        My Tag
      </motion.h1>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="flex flex-col items-center gap-6 py-12 text-center sm:flex-row sm:text-left">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-teal-light">
            <NfcMark className="h-10 w-10" color="#0E4F45" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <Badge tone="teal" dot>{mockProfile.tag.status}</Badge>
            </div>
            <p className="mt-2 text-lg text-ink">Tag ID: {mockProfile.tag.id}</p>
            <p className="text-sm text-slate">Last synced {mockProfile.tag.lastSynced}</p>
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          <Button variant="secondary" onClick={handleReissue} disabled={reissuing}>
            {reissuing ? "Requesting…" : "Reissue Tag"}
          </Button>
          <Button variant="ghost-ink" onClick={handleReportLost}>
            Report Lost
          </Button>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-lg text-ink">Order History</h2>
        <div className="mt-4 divide-y divide-mist rounded-card border border-mist">
          {ORDER_HISTORY.map((order) => (
            <div key={order.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-[15px] text-ink">{order.id}</p>
                <p className="text-xs text-slate">{order.date}</p>
              </div>
              <Badge tone="outline">{order.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
