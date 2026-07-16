import clsx from "clsx";
import Badge from "./ui/Badge";
import { formatDob } from "../lib/nfcTag";

/**
 * The single card design shared by the onboarding review step, the
 * dashboard's "digital twin" preview, and the responder-facing scan result —
 * so a patient previewing their own card sees exactly what a paramedic will.
 */
export default function EmergencyCard({ profile, variant = "preview", className }) {
  const isScan = variant === "scan";
  const subtle = isScan ? "text-paper/50" : "text-slate";
  const body = isScan ? "text-paper" : "text-ink";

  const subtitle = [profile.id, formatDob(profile.dob)].filter(Boolean).join(" · ");

  const contact = [profile.emergencyContact?.name, profile.emergencyContact?.relationship, profile.emergencyContact?.phone]
    .filter(Boolean)
    .join(" · ");

  const fields = [
    { label: "Blood Type", value: profile.bloodType || "—", accent: true },
    { label: "Allergies", value: profile.allergies?.length ? profile.allergies.join(", ") : "None known" },
    { label: "Conditions", value: profile.conditions?.length ? profile.conditions.join(", ") : "None known" },
    { label: "Medications", value: profile.medications?.length ? profile.medications.join(", ") : "None known" },
  ];

  return (
    <div
      className={clsx(
        "rounded-lg border",
        isScan
          ? "border-ink bg-ink text-paper p-6 md:p-8"
          : "border-mist bg-paper p-6 md:p-8 shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={clsx("text-xs uppercase tracking-wider", subtle)}>Emergency Profile</p>
          <h3 className={clsx("mt-1 text-2xl md:text-3xl", body)}>{profile.name}</h3>
          {subtitle && <p className={clsx("mt-1 text-xs", subtle)}>{subtitle}</p>}
        </div>
        {isScan && (
          <Badge tone="coral" className="whitespace-nowrap">
            Scanned Offline
          </Badge>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.label}>
            <p className={clsx("text-xs uppercase tracking-wider", subtle)}>{field.label}</p>
            <p
              className={clsx(
                "mt-1",
                field.accent
                  ? clsx("font-display text-3xl", isScan ? "text-coral" : "text-teal")
                  : clsx("text-[15px] font-medium", body)
              )}
            >
              {field.value}
            </p>
          </div>
        ))}
      </div>

      <div className={clsx("mt-6 border-t pt-6", isScan ? "border-paper/15" : "border-mist")}>
        <p className={clsx("text-xs uppercase tracking-wider", subtle)}>Emergency Contact</p>
        <p className={clsx("mt-1 text-[15px]", body)}>{contact || "Not provided"}</p>
      </div>
    </div>
  );
}
