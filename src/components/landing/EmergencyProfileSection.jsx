import { Reveal, RevealGroup, RevealItem } from "../ui/Reveal";

const PROFILE = {
  name: "Tunde Adegbola",
  bloodType: "O+",
  conditions: ["Type 2 Diabetes", "Severe Asthma"],
  medications: ["Metformin", "Albuterol Inhaler"],
  allergies: ["Penicillin", "Latex"],
  contacts: [
    { name: "Ngozi Adegbola", relationship: "Wife", phone: "+234 803 000 1122" },
    { name: "Chidi Adegbola", relationship: "Brother", phone: "+234 801 234 5678" },
  ],
};

const INSTRUCTIONS = [
  "Sit down. Do not stand up suddenly.",
  "Call someone. Do not be alone.",
  "Do not drive yourself.",
  "Your emergency contacts have been alerted with your location.",
];

export default function EmergencyProfileSection() {
  return (
    <section className="bg-ink-deep py-16 md:py-32">
      <div className="content-container">
        <Reveal>
          <h2 className="text-3xl text-paper md:text-4xl">Ready before you arrive.</h2>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-mist/70">
            One tap gives a responder everything they need. Contacts are alerted
            with your location and a summary — before the ambulance arrives.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2" stagger={0.12}>
          {/* Emergency profile card mock */}
          <RevealItem>
            <div className="rounded-xl border border-teal/20 bg-teal/5 p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-teal">
                Helix Emergency Profile
              </p>
              <h3 className="mt-3 text-2xl text-paper">{PROFILE.name}</h3>

              <div className="mt-4 flex items-center gap-2">
                <span className="rounded-full bg-red-500/20 px-3 py-1 text-sm font-bold text-red-400">
                  {PROFILE.bloodType}
                </span>
                {PROFILE.allergies.map((a) => (
                  <span key={a} className="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
                    ⚠ {a}
                  </span>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-mist/40 uppercase tracking-wider">Conditions</p>
                  <ul className="mt-1 space-y-1">
                    {PROFILE.conditions.map((c) => (
                      <li key={c} className="text-sm text-mist/80">{c}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs text-mist/40 uppercase tracking-wider">Medications</p>
                  <ul className="mt-1 space-y-1">
                    {PROFILE.medications.map((m) => (
                      <li key={m} className="text-sm text-mist/80">{m}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 border-t border-teal/10 pt-4 space-y-2">
                {PROFILE.contacts.map((c) => (
                  <div key={c.name} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-paper">{c.name}</p>
                      <p className="text-xs text-mist/50">{c.relationship}</p>
                    </div>
                    <a
                      href={`tel:${c.phone}`}
                      className="rounded-full bg-teal/20 px-3 py-1.5 text-xs text-teal"
                    >
                      {c.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </RevealItem>

          {/* On-screen instructions mock */}
          <RevealItem>
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 h-full flex flex-col justify-center">
              <p className="text-xs font-medium uppercase tracking-wider text-red-400">
                On-screen guidance
              </p>
              <h3 className="mt-3 text-xl text-paper">While help is on the way</h3>
              <ul className="mt-5 space-y-4">
                {INSTRUCTIONS.map((inst, i) => (
                  <li key={inst} className="flex gap-3 text-[15px] leading-relaxed text-mist/80">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-xs font-bold text-red-400">
                      {i + 1}
                    </span>
                    {inst}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs text-mist/40">
                Emergency contacts receive your GPS location and a profile summary automatically.
              </p>
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
