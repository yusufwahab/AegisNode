import { Link, Outlet } from "react-router-dom";
import NfcMark from "../ui/NfcMark";
import UnsplashImage from "../ui/UnsplashImage";

export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-deep px-6 py-16">
      <UnsplashImage
        query="ambulance interior"
        className="absolute inset-0 opacity-25"
        imgClassName="[filter:saturate(0.6)_brightness(0.55)]"
        showAttribution={false}
      />
      <div className="absolute inset-0 bg-ink-deep/70" />

      <Link to="/" className="absolute left-6 top-6 z-10 flex items-center gap-2 md:left-10 md:top-10">
        <NfcMark className="h-6 w-6" color="#FAF9F6" />
        <span className="font-display text-lg text-paper">Aegis Node</span>
      </Link>

      <div className="relative z-10 w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
