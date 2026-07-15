import { Link } from "react-router-dom";
import Button from "./ui/Button";
import { Reveal } from "./ui/Reveal";

export default function FinalCtaBand({
  headline = "Seconds matter. Be ready.",
  ctaLabel = "Order Your Tag",
  ctaTo = "/order",
  onCtaClick,
}) {
  return (
    <section className="bg-teal py-24 md:py-32">
      <Reveal className="content-container flex flex-col items-center gap-8 text-center">
        <h2 className="max-w-2xl text-4xl text-paper md:text-6xl">{headline}</h2>
        {onCtaClick ? (
          <Button variant="coral" size="lg" onClick={onCtaClick}>
            {ctaLabel}
          </Button>
        ) : (
          <Button as={Link} to={ctaTo} variant="coral" size="lg">
            {ctaLabel}
          </Button>
        )}
      </Reveal>
    </section>
  );
}
