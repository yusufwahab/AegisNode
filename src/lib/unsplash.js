import { useEffect, useState } from "react";

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

// Deterministic placeholder used whenever there's no API key, the request
// fails, or we're offline — the app should never show a broken image.
// Renders as a soft duotone gradient in-palette rather than guessing at
// hotlinked Unsplash URLs that could 404 outside our control.
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const PLACEHOLDER_PAIRS = [
  ["#0E4F45", "#12181B"],
  ["#5B6664", "#0B0F10"],
  ["#0E4F45", "#5B6664"],
  ["#12181B", "#0E4F45"],
];

export function placeholderGradient(query) {
  const h = hashString(query || "aegis");
  const [a, b] = PLACEHOLDER_PAIRS[h % PLACEHOLDER_PAIRS.length];
  const angle = 115 + (h % 60);
  return `linear-gradient(${angle}deg, ${a} 0%, ${b} 100%)`;
}

const cache = new Map();

async function fetchUnsplashPhoto(query, orientation) {
  const cacheKey = `${query}|${orientation}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "1");
  url.searchParams.set("orientation", orientation);

  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
  });
  if (!res.ok) throw new Error(`Unsplash request failed: ${res.status}`);
  const data = await res.json();
  const photo = data.results?.[0];
  if (!photo) throw new Error("No Unsplash results");

  const result = {
    src: photo.urls.regular,
    alt: photo.alt_description || query,
    photographer: photo.user.name,
    photographerUrl: `${photo.user.links.html}?utm_source=aegis_node&utm_medium=referral`,
  };
  cache.set(cacheKey, result);
  return result;
}

function initialPhotoState(query) {
  return {
    loading: Boolean(ACCESS_KEY),
    src: null,
    alt: query,
    photographer: null,
    photographerUrl: null,
    isPlaceholder: !ACCESS_KEY,
  };
}

/**
 * Resolves an Unsplash photo for `query`. Falls back to a local, in-palette
 * gradient placeholder if no VITE_UNSPLASH_ACCESS_KEY is set, or the request
 * fails — the layout and attribution slot stay stable either way.
 */
export function useUnsplashPhoto(query, { orientation = "landscape" } = {}) {
  const requestKey = `${query}|${orientation}`;
  const [trackedKey, setTrackedKey] = useState(requestKey);
  const [state, setState] = useState(() => initialPhotoState(query));

  // Reset synchronously during render when the query/orientation changes,
  // rather than via an effect — the React-recommended pattern for resetting
  // state in response to a prop change.
  if (requestKey !== trackedKey) {
    setTrackedKey(requestKey);
    setState(initialPhotoState(query));
  }

  useEffect(() => {
    if (!ACCESS_KEY) return;
    let cancelled = false;

    fetchUnsplashPhoto(query, orientation)
      .then((result) => {
        if (cancelled) return;
        setState({ ...result, loading: false, isPlaceholder: false });
      })
      .catch(() => {
        if (cancelled) return;
        setState({
          loading: false,
          src: null,
          alt: query,
          photographer: null,
          photographerUrl: null,
          isPlaceholder: true,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [query, orientation]);

  return state;
}
