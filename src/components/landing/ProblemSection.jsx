import { motion } from "framer-motion";
import { Reveal } from "../ui/Reveal";
import UnsplashImage from "../ui/UnsplashImage";
import { viewportOnce, useReducedMotion } from "../../lib/motion";

export default function ProblemSection() {
  const reduced = useReducedMotion();

  return (
    <section className="bg-paper py-16 md:py-32">
      <div className="content-container grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <h2 className="text-3xl text-ink md:text-4xl">The golden hour doesn't wait for signal.</h2>
          <p className="mt-6 text-[17px] leading-relaxed text-slate">
            Unconscious and non-verbal patients can't tell responders their blood
            type, allergies, or conditions. At accident scenes, a cell signal
            often isn't there when it matters most. Every minute spent guessing
            is a minute not spent treating — and in emergency medicine, that gap
            has a name: the golden hour.
          </p>
        </Reveal>

        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="aspect-[4/3] overflow-hidden rounded-lg"
        >
          <UnsplashImage
            query="ambulance accident response"
            className="h-full w-full"
            alt="Ambulance responding at an accident scene"
          />
        </motion.div>
      </div>
    </section>
  );
}
