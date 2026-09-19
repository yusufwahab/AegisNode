import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Circle, AlertTriangle } from "lucide-react";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import EmergencyCard from "./EmergencyCard";
import BystanderGuidance from "./BystanderGuidance";
import { useEmergencyStore } from "../store/useEmergencyStore";
import { useToast } from "../lib/toastContext";
import { mockProfile } from "../lib/mockData";

// Full-screen takeover — no nav chrome, mounted once at the App root so it
// covers the whole app regardless of which route is active underneath
// (updatedPrompt.md section 8). Three triggers feed into the same store:
// a threshold-breaching Daily Log reading, the Settings demo control, and
// the Live Sensor anomaly escalation.
export default function EmergencyTakeover() {
  const { active, stage, reason, notifiedCount, showProfile, toggleProfile, resolve } = useEmergencyStore();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const pushToast = useToast();

  if (!active) return null;

  function handleConfirmSafe() {
    setConfirmOpen(false);
    resolve();
    pushToast?.("Contacts notified you're safe.");
  }

  return (
    // z-45: above the app's nav chrome (Navbar/sidebar top out at z-40) but
    // below Modal's z-50, so the "I'm okay" confirm modal still stacks above
    // this takeover instead of being hidden behind it.
    <div className="fixed inset-0 z-45 flex flex-col overflow-y-auto bg-paper">
      <div className="h-1.5 w-full shrink-0 bg-coral" />

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-10 text-center">
        <AnimatePresence mode="wait">
          {showProfile ? (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-left">
              <p className="mb-4 text-center text-sm font-medium uppercase tracking-wider text-coral">
                What a bystander would see
              </p>
              <EmergencyCard profile={mockProfile} variant="scan" />
              <BystanderGuidance profile={mockProfile} />
              <Button variant="ghost-ink" className="mt-6 w-full" onClick={() => toggleProfile(false)}>
                Back to alert
              </Button>
            </motion.div>
          ) : (
            <motion.div key="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AlertTriangle size={40} strokeWidth={1.5} className="mx-auto text-coral" />
              <h1 className="mt-4 text-3xl text-ink md:text-4xl">Cardiovascular emergency detected.</h1>
              <p className="mt-3 text-[15px] leading-relaxed text-slate">{reason}</p>

              <div className="mt-8 rounded-card border border-mist p-5 text-left">
                <p className="text-sm font-medium text-ink">
                  {stage === "alerting" ? "Alerting your emergency contacts…" : "Your contacts have been notified."}
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  {mockProfile.emergencyContacts.map((contact, i) => {
                    const notified = i < notifiedCount;
                    return (
                      <div key={contact.phone} className="flex items-center gap-3">
                        {notified ? (
                          <CheckCircle2 size={18} strokeWidth={1.5} className="shrink-0 text-teal" />
                        ) : (
                          <Circle size={18} strokeWidth={1.5} className="shrink-0 text-slate/40" />
                        )}
                        <div>
                          <p className="text-[15px] text-ink">
                            {contact.name} <span className="text-slate">· {contact.relationship}</span>
                          </p>
                          <p className="text-xs text-slate">{notified ? "Notified" : "Pending…"}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {stage === "guidance" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 rounded-card bg-ink px-6 py-8"
                >
                  <p className="text-2xl leading-snug text-paper md:text-3xl">
                    Sit down. Call someone. Do not drive.
                  </p>
                </motion.div>
              )}

              {stage === "guidance" && (
                <Button variant="primary" className="mt-6 w-full" onClick={() => toggleProfile(true)}>
                  View my emergency profile
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!showProfile && (
        <div className="mx-auto w-full max-w-lg px-6 pb-8">
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="w-full py-3 text-sm font-medium text-slate underline-offset-4 hover:text-ink hover:underline"
          >
            I'm okay — cancel alert
          </button>
        </div>
      )}

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Are you sure?">
        <p className="text-[15px] text-slate">This will notify your contacts that you're safe.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
          <Button variant="coral" onClick={handleConfirmSafe} className="flex-1">
            Confirm
          </Button>
          <Button variant="ghost-ink" onClick={() => setConfirmOpen(false)} className="flex-1">
            Go back
          </Button>
        </div>
      </Modal>
    </div>
  );
}
