import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import UnsplashImage from "../ui/UnsplashImage";
import { Reveal } from "../ui/Reveal";

const PANELS = [
  {
    title: "For Patients",
    query: "person wearing wearable band daily life",
    copy: [
      "Wear it like any band or tag — nothing to charge, nothing to unlock.",
      "Update your profile any time; changes sync to the tag automatically.",
      "Works with any NFC-enabled phone, no app required for responders.",
    ],
    cta: "Get your tag →",
    to: "/order",
  },
  {
    title: "For Responders",
    query: "paramedic emergency room hallway",
    copy: [
      "Tap and read structured patient data in under two seconds.",
      "No signal needed — the tag itself carries the critical fields.",
      "Sync silently alerts the receiving hospital the moment you reconnect.",
    ],
    cta: "See responder view →",
    to: "/scan-demo",
  },
];

export default function AudienceSplit() {
  return (
    <section className="bg-paper py-16 md:py-32">
      <div className="content-container grid grid-cols-1 gap-8 lg:grid-cols-2">
        {PANELS.map((panel, i) => (
          <Reveal key={panel.title} delay={i * 0.1} className="group">
            <div className="overflow-hidden rounded-lg">
              <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                <UnsplashImage query={panel.query} className="aspect-4/3 w-full" alt={panel.title} />
              </motion.div>
            </div>
            <h3 className="mt-6 text-2xl text-ink">{panel.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {panel.copy.map((line) => (
                <li key={line} className="flex gap-2 text-[15px] leading-relaxed text-slate">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-teal" />
                  {line}
                </li>
              ))}
            </ul>
            <Link
              to={panel.to}
              className="mt-5 inline-block text-sm font-medium text-teal bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat transition-[background-size] duration-300 ease-out group-hover:bg-[length:100%_1px] pb-0.5"
            >
              {panel.cta}
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
