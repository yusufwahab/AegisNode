import clsx from "clsx";
import { useUnsplashPhoto, placeholderGradient } from "../../lib/unsplash";

/**
 * Photography treatment per prompt.md 1.4: slight desaturation + a warm
 * Paper-tone overlay at low opacity, so every photo (regardless of source
 * photographer) reads as one consistent shot library. Falls back to an
 * in-palette gradient rather than ever showing a broken image.
 */
export default function UnsplashImage({
  query,
  alt,
  orientation = "landscape",
  className,
  imgClassName,
  showAttribution = true,
}) {
  const photo = useUnsplashPhoto(query, { orientation });

  return (
    <div className={clsx("relative overflow-hidden", className)}>
      {photo.src ? (
        <img
          src={photo.src}
          alt={alt || photo.alt}
          loading="lazy"
          className={clsx("h-full w-full object-cover [filter:saturate(0.85)]", imgClassName)}
        />
      ) : (
        <div
          className="h-full w-full"
          style={{ background: placeholderGradient(query) }}
          role="img"
          aria-label={alt || query}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-paper/[0.05]" />
      {showAttribution && photo.photographer && (
        <a
          href={photo.photographerUrl}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-2 right-2 rounded-full bg-ink/50 px-2.5 py-1 text-[11px] text-paper/90 backdrop-blur-sm hover:bg-ink/70"
        >
          Photo: {photo.photographer} / Unsplash
        </a>
      )}
    </div>
  );
}
