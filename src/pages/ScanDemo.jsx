import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Database } from "lucide-react";
import clsx from "clsx";
import Button from "../components/ui/Button";
import NfcScanVisual from "../components/NfcScanVisual";
import EmergencyCard from "../components/EmergencyCard";
import VitalsMonitor from "../components/VitalsMonitor";
import { Reveal } from "../components/ui/Reveal";
import { scanResult, mockDatabaseRows } from "../lib/mockData";
import { isWebNfcSupported, readNfcTagOnce, parseTagPayload, parseTagParams } from "../lib/nfcTag";
import { postScan, notifyHospital } from "../lib/api";
import { buildDatabaseCsv, downloadCsv } from "../lib/csv";

function formatScanTimestamp(date = new Date()) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ScanDemo() {
  const [searchParams] = useSearchParams();

  // A real tag written with the URL method (see nfcTag.js) opens this exact
  // page with the patient's data already in the query string — if that's how
  // we got here, skip straight to the result instead of showing the idle screen.
  const [urlProfile] = useState(() => parseTagParams(searchParams));
  const cameFromTagUrl = Boolean(urlProfile.id || urlProfile.name);

  const [stage, setStage] = useState(cameFromTagUrl ? "result" : "idle"); // idle | waiting | playing | result
  const [profile, setProfile] = useState(cameFromTagUrl ? urlProfile : scanResult);
  const [nfcError, setNfcError] = useState("");
  const abortRef = useRef(null);
  const [nfcSupported] = useState(isWebNfcSupported);

  // idle | syncing | synced | error — only ever set for real scans (URL-tap
  // or Web NFC). The simulated demo never touches the backend.
  const [syncStatus, setSyncStatus] = useState(cameFromTagUrl ? "syncing" : "idle");

  // Real scans only — gates the "Notify Hospital" button so the simulated
  // demo never sends actual emails to real people.
  const [isRealScan, setIsRealScan] = useState(cameFromTagUrl);
  const [notifyStatus, setNotifyStatus] = useState("idle"); // idle | sending | sent | error
  const [scannedAt] = useState(() => formatScanTimestamp());

  function handleCheckDatabase() {
    const csv = buildDatabaseCsv(mockDatabaseRows, profile, scannedAt);
    downloadCsv(`aegis-node-database-${profile.id || "scan"}.csv`, csv);
  }

  async function handleNotify() {
    setNotifyStatus("sending");
    try {
      await notifyHospital(profile);
      setNotifyStatus("sent");
    } catch {
      setNotifyStatus("error");
    }
  }

  async function logRealScan(scannedProfile) {
    setSyncStatus("syncing");
    try {
      await postScan(scannedProfile);
      setSyncStatus("synced");
    } catch {
      setSyncStatus("error");
    }
  }

  useEffect(() => {
    if (!cameFromTagUrl) return;
    let cancelled = false;
    postScan(urlProfile)
      .then(() => {
        if (!cancelled) setSyncStatus("synced");
      })
      .catch(() => {
        if (!cancelled) setSyncStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [cameFromTagUrl, urlProfile]);

  function startSimulated() {
    setNfcError("");
    setSyncStatus("idle");
    setNotifyStatus("idle");
    setIsRealScan(false);
    setProfile(scanResult);
    setStage("playing");
  }

  async function startRealScan() {
    setNfcError("");
    setNotifyStatus("idle");
    setStage("waiting");
    abortRef.current = new AbortController();
    try {
      const raw = await readNfcTagOnce({ signal: abortRef.current.signal });
      const parsed = parseTagPayload(raw);
      setProfile(parsed);
      setIsRealScan(true);
      setStage("result");
      logRealScan(parsed);
    } catch (err) {
      setNfcError(err.message || "Couldn't read that tag.");
      setStage("idle");
    }
  }

  function cancelRealScan() {
    abortRef.current?.abort();
    setStage("idle");
  }

  return (
    <div className="content-container flex min-h-[80vh] flex-col items-center justify-center py-16 text-center md:py-24">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-wider text-teal">Scan Demo</p>
        <h1 className="mt-3 max-w-xl text-3xl text-ink md:text-5xl">
          Experience the responder's side, no hardware required.
        </h1>
      </Reveal>

      <div className="relative mt-12 w-full max-w-sm">
        <AnimatePresence mode="wait">
          {stage === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                type="button"
                onClick={nfcSupported ? startRealScan : startSimulated}
                className="group block w-full"
              >
                <div className="aspect-4/5 w-full overflow-hidden rounded-lg">
                  <NfcScanVisual loop showCaptureCard={false} className="h-full w-full" />
                </div>
                <span className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-sm bg-teal px-6 text-[15px] font-medium text-paper transition-colors group-hover:bg-[#0b3f37]">
                  {nfcSupported ? "Tap Your Tag to Scan" : "Tap to Simulate Scan"}
                </span>
              </button>

              {nfcSupported ? (
                <button
                  type="button"
                  onClick={startSimulated}
                  className="mt-4 text-sm text-slate underline-offset-4 hover:text-teal hover:underline"
                >
                  Or see a simulated demo instead
                </button>
              ) : (
                <p className="mt-4 text-xs text-slate">
                  Real tag scanning needs Chrome on Android over HTTPS — showing a simulated
                  preview here.
                </p>
              )}

              {nfcError && (
                <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-coral">
                  <AlertCircle size={14} strokeWidth={1.5} />
                  {nfcError}
                </p>
              )}
            </motion.div>
          )}

          {stage === "waiting" && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="aspect-4/5 w-full overflow-hidden rounded-lg">
                <NfcScanVisual loop showCaptureCard={false} className="h-full w-full" />
              </div>
              <p className="mt-6 text-[15px] font-medium text-ink">Waiting for tap…</p>
              <Button variant="ghost-ink" className="mt-4 w-full" onClick={cancelRealScan}>
                Cancel
              </Button>
            </motion.div>
          )}

          {stage === "playing" && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="aspect-4/5 w-full overflow-hidden rounded-lg"
            >
              <NfcScanVisual
                loop={false}
                showCaptureCard={false}
                onComplete={() => setStage("result")}
                className="h-full w-full"
              />
            </motion.div>
          )}

          {stage === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-left"
            >
              <EmergencyCard profile={profile} variant="scan" />

              <VitalsMonitor />

              {syncStatus !== "idle" && (
                <p
                  className={clsx(
                    "mt-3 flex items-center gap-1.5 text-sm",
                    syncStatus === "error" ? "text-coral" : "text-slate"
                  )}
                >
                  {syncStatus === "syncing" && "Syncing to hospital dashboard…"}
                  {syncStatus === "synced" && (
                    <>
                      <CheckCircle2 size={14} strokeWidth={1.5} className="text-teal" />
                      This profile has been added to the hospital database
                    </>
                  )}
                  {syncStatus === "error" && "Hospital sync isn't connected yet — tag data still shown above."}
                </p>
              )}

              {syncStatus === "synced" && (
                <Button variant="secondary" className="mt-3 w-full" onClick={handleCheckDatabase}>
                  <Database size={16} strokeWidth={1.5} />
                  Check Database
                </Button>
              )}

              {isRealScan && (
                <>
                  <Button
                    variant="primary"
                    className="mt-6 w-full"
                    onClick={handleNotify}
                    disabled={notifyStatus === "sending"}
                  >
                    {notifyStatus === "sending" && "Sending…"}
                    {notifyStatus === "sent" && "Notified ✓"}
                    {(notifyStatus === "idle" || notifyStatus === "error") &&
                      "Notify Hospital & Emergency Contact"}
                  </Button>
                  {notifyStatus === "error" && (
                    <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-coral">
                      <AlertCircle size={14} strokeWidth={1.5} />
                      Couldn't send the notification — check the email service is configured.
                    </p>
                  )}
                </>
              )}

              <Button variant="ghost-ink" className="mt-3 w-full" onClick={() => setStage("idle")}>
                Reset Demo
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
