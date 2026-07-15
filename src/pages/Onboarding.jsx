import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import NfcMark from "../components/ui/NfcMark";
import Button from "../components/ui/Button";
import Stepper from "../components/ui/Stepper";
import Dropzone from "../components/ui/Dropzone";
import BloodTypeSelector from "../components/ui/BloodTypeSelector";
import ChipInput from "../components/ui/ChipInput";
import FormField from "../components/ui/FormField";
import EmergencyCard from "../components/EmergencyCard";
import SuccessCheck from "../components/ui/SuccessCheck";
import { stepVariants } from "../lib/motion";

const STEPS = ["Basics", "Medical", "Emergency Contact", "Review"];

export default function Onboarding() {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    dob: "",
    photo: null,
    bloodType: "",
    allergies: [],
    conditions: [],
    contactName: "",
    contactRelationship: "",
    contactPhone: "",
  });

  function update(patch) {
    setForm((f) => ({ ...f, ...patch }));
  }

  function goNext() {
    setDirection(1);
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function goBack() {
    setDirection(-1);
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function handleConfirm() {
    setSubmitting(true);
    setTimeout(() => navigate("/dashboard"), 1400);
  }

  const profileForCard = {
    name: form.name || "Your Name",
    bloodType: form.bloodType || "—",
    allergies: form.allergies,
    conditions: form.conditions,
    emergencyContact: {
      name: form.contactName || "—",
      relationship: form.contactRelationship || "—",
      phone: form.contactPhone || "—",
    },
  };

  if (submitting) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-paper px-6 text-center">
        <SuccessCheck />
        <div>
          <h1 className="text-2xl text-ink">Profile confirmed</h1>
          <p className="mt-1 text-[15px] text-slate">Taking you to your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="content-container flex items-center justify-between py-6">
        <Link to="/" className="flex items-center gap-2">
          <NfcMark className="h-5 w-5" color="#0E4F45" />
          <span className="font-display text-base text-ink">Aegis Node</span>
        </Link>
        <Link to="/dashboard" className="text-sm text-slate hover:text-teal">
          Save &amp; exit
        </Link>
      </header>

      <div className="content-container max-w-2xl py-6">
        <Stepper steps={STEPS} currentIndex={stepIndex} />

        <div className="relative mt-12 min-h-[420px] overflow-hidden">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={stepIndex}
              custom={direction}
              variants={stepVariants(direction)}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {stepIndex === 0 && (
                <div className="flex flex-col gap-5">
                  <h2 className="text-2xl text-ink">The basics</h2>
                  <FormField label="Full Name" value={form.name} onChange={(e) => update({ name: e.target.value })} />
                  <FormField
                    label="Date of Birth"
                    type="date"
                    value={form.dob}
                    onChange={(e) => update({ dob: e.target.value })}
                  />
                  <Dropzone preview={form.photo} onFile={(file) => update({ photo: file ? URL.createObjectURL(file) : null })} />
                </div>
              )}

              {stepIndex === 1 && (
                <div className="flex flex-col gap-7">
                  <h2 className="text-2xl text-ink">Medical details</h2>
                  <div>
                    <label className="mb-3 block text-sm font-medium text-ink">Blood Type</label>
                    <BloodTypeSelector value={form.bloodType} onChange={(bloodType) => update({ bloodType })} />
                  </div>
                  <ChipInput
                    label="Allergies"
                    values={form.allergies}
                    onChange={(allergies) => update({ allergies })}
                    placeholder="e.g. Penicillin — press Enter"
                  />
                  <ChipInput
                    label="Chronic Conditions"
                    values={form.conditions}
                    onChange={(conditions) => update({ conditions })}
                    placeholder="e.g. Type 1 Diabetes — press Enter"
                  />
                </div>
              )}

              {stepIndex === 2 && (
                <div className="flex flex-col gap-5">
                  <h2 className="text-2xl text-ink">Emergency contact</h2>
                  <FormField
                    label="Contact Name"
                    value={form.contactName}
                    onChange={(e) => update({ contactName: e.target.value })}
                  />
                  <FormField
                    label="Relationship"
                    value={form.contactRelationship}
                    onChange={(e) => update({ contactRelationship: e.target.value })}
                  />
                  <FormField
                    label="Phone Number"
                    type="tel"
                    value={form.contactPhone}
                    onChange={(e) => update({ contactPhone: e.target.value })}
                  />
                </div>
              )}

              {stepIndex === 3 && (
                <div className="flex flex-col gap-5">
                  <h2 className="text-2xl text-ink">Review your emergency card</h2>
                  <p className="text-[15px] text-slate">
                    This is exactly what a responder sees when they scan your tag.
                  </p>
                  <EmergencyCard profile={profileForCard} variant="preview" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <Button variant="ghost-ink" onClick={goBack} disabled={stepIndex === 0} className={stepIndex === 0 ? "invisible" : ""}>
            Back
          </Button>
          {stepIndex < STEPS.length - 1 ? (
            <Button variant="primary" onClick={goNext}>
              Continue
            </Button>
          ) : (
            <Button variant="coral" onClick={handleConfirm}>
              Confirm &amp; Finish
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
