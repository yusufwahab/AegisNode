import { Reveal, RevealGroup, RevealItem } from "../components/ui/Reveal";
import UnsplashImage from "../components/ui/UnsplashImage";
import { teamMembers } from "../lib/mockData";

export default function About() {
  return (
    <div>
      <div className="content-container py-20 md:py-32">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-wider text-teal">Our Mission</p>
          <p className="mt-4 max-w-3xl font-display text-3xl italic leading-tight text-ink md:text-5xl">
            "We built Aegis Node because the worst moment of someone's life
            shouldn't also be the moment their history goes silent."
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-16 max-w-2xl space-y-6 text-[17px] leading-relaxed text-slate">
          <p>
            Aegis Node started with a simple, uncomfortable observation: the
            people who most need their medical history known are often the
            ones least able to share it. Unconscious. Non-verbal. Alone at the
            scene. Responders do extraordinary work with almost no information
            to go on.
          </p>
          <p>
            We didn't want to build another app that requires a signal, a
            login, or a conscious patient to unlock. So we built a tag —
            offline-first, tap-to-read, and structured specifically for the
            handful of facts that change how a paramedic treats you in the
            first five minutes.
          </p>
          <p>
            We're early. We hedge honestly about what we've proven so far —
            this is a small team working closely with EMTs and hospital
            partners to get the details right before we scale.
          </p>
        </Reveal>
      </div>

      <UnsplashImage
        query="emergency room documentary"
        className="h-[45vh] w-full md:h-[60vh]"
        alt="Emergency response in progress"
      />

      <div className="content-container py-20 md:py-32">
        <Reveal>
          <h2 className="text-2xl text-ink md:text-3xl">Team</h2>
        </Reveal>
        <RevealGroup className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4" stagger={0.08}>
          {teamMembers.map((member) => (
            <RevealItem key={member.name}>
              <div className="aspect-square rounded-full bg-mist" />
              <p className="mt-4 text-[15px] font-medium text-ink">{member.name}</p>
              <p className="text-sm text-slate">{member.role}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </div>
  );
}
