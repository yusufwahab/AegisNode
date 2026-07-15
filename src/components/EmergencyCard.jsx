import clsx from "clsx";
import Badge from "./ui/Badge";

/**
 * The single card design shared by the onboarding review step, the
 * dashboard's "digital twin" preview, and the responder-facing scan result —
 * so a patient previewing their own card sees exactly what a paramedic will.
 */
export default function EmergencyCard({ profile, variant = "preview", className }) {
  const isScan = variant === "scan";

  return (
    <div
      className={clsx(
        "@container rounded-lg border",
        isScan
          ? "border-ink bg-ink text-paper p-6 md:p-8"
          : "border-mist bg-paper p-6 md:p-8 shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className={clsx(
              "text-xs uppercase tracking-wider",
              isScan ? "text-paper/50" : "text-slate"
            )}
          >
            Emergency Profile
          </p>
          <h3 className={clsx("mt-1 text-2xl md:text-3xl", isScan ? "text-paper" : "text-ink")}>
            {profile.name}
          </h3>
        </div>
        {isScan && <Badge tone="coral" className="whitespace-nowrap">Scanned Offline</Badge>}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6 @lg:grid-cols-4">
        <div>
          <p className={clsx("text-xs uppercase tracking-wider", isScan ? "text-paper/50" : "text-slate")}>
            Blood Type
          </p>
          <p className={clsx("mt-1 font-display text-3xl @lg:text-4xl", isScan ? "text-coral" : "text-teal")}>
            {profile.bloodType}
          </p>
        </div>
        <div className="col-span-2 @lg:col-span-1">
          <p className={clsx("text-xs uppercase tracking-wider", isScan ? "text-paper/50" : "text-slate")}>
            Allergies
          </p>
          <p className={clsx("mt-1 text-[15px] font-medium", isScan ? "text-paper" : "text-ink")}>
            {profile.allergies?.length ? profile.allergies.join(", ") : "None known"}
          </p>
        </div>
        <div className="col-span-2 @lg:col-span-2">
          <p className={clsx("text-xs uppercase tracking-wider", isScan ? "text-paper/50" : "text-slate")}>
            Conditions
          </p>
          <p className={clsx("mt-1 text-[15px] font-medium", isScan ? "text-paper" : "text-ink")}>
            {profile.conditions?.length ? profile.conditions.join(", ") : "None known"}
          </p>
        </div>
      </div>

      <div className={clsx("mt-6 border-t pt-6", isScan ? "border-paper/15" : "border-mist")}>
        <p className={clsx("text-xs uppercase tracking-wider", isScan ? "text-paper/50" : "text-slate")}>
          Emergency Contact
        </p>
        <p className={clsx("mt-1 text-[15px]", isScan ? "text-paper" : "text-ink")}>
          {profile.emergencyContact?.name} · {profile.emergencyContact?.relationship} ·{" "}
          {profile.emergencyContact?.phone}
        </p>
      </div>
    </div>
  );
}
