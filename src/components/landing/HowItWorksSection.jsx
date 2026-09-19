import { Link } from "react-router-dom";
import { Smartphone, Bell, RadioTower, UserCheck } from "lucide-react";
import Card from "../ui/Card";
import { Reveal, RevealGroup, RevealItem } from "../ui/Reveal";
import UnsplashImage from "../ui/UnsplashImage";

const STEPS = [
  {
    Icon: Smartphone,
    title: "Log or wear",
    copy: "Check in daily with your vitals, or let the Helix Band track heart rate and HRV passively.",
    query: "person health app phone",
  },
  {
    Icon: Bell,
    title: "Helix notices a change",
    copy: "AI spots a drift in your baseline and prompts you — before it becomes a crisis.",
    query: "notification alert phone",
  },
  {
    Icon: UserCheck,
    title: "You're prompted. Contacts are alerted.",
    copy: "You get on-screen guidance. Your emergency contacts receive your GPS location and a profile summary.",
    query: "person receiving message phone",
  },
  {
    Icon: RadioTower,
    title: "Responder taps. Profile appears.",
    copy: "One tap on your Helix Tag gives any NFC-enabled phone your blood type, allergies, conditions and contacts — even with weak signal.",
    query: "paramedic emergency response",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-mist/60 py-16 md:py-32">
      <div className="content-container">
        <Reveal>
          <h2 className="text-center text-3xl text-ink md:text-4xl">
            From daily check-in to emergency response.
          </h2>
        </Reveal>

        <div className="relative mt-16">
          <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6" stagger={0.1}>
            {STEPS.map(({ Icon, title, copy, query }, i) => (
              <RevealItem key={title}>
                <Card
                  className="group h-full transition-all duration-200 hover:-translate-y-1 hover:border-teal hover:shadow-md"
                  padded={false}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-light text-teal">
                        <Icon size={18} strokeWidth={1.5} />
                      </div>
                      <span className="text-xs font-medium text-slate/50">Step {i + 1}</span>
                    </div>
                    <h3 className="mt-4 text-lg text-ink">{title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-slate">{copy}</p>
                  </div>
                  <UnsplashImage
                    query={query}
                    className="h-36 w-full rounded-b-card"
                    alt={title}
                  />
                </Card>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <Reveal className="mt-12 text-center">
          <Link to="/how-it-works" className="text-sm font-medium text-teal underline-offset-4 hover:underline">
            See the full walkthrough →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
