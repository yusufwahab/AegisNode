import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutGrid,
  ClipboardList,
  Sparkles,
  TrendingUp,
  Activity,
  Tag,
  HeartPulse,
  Settings,
  LogOut,
  Hospital,
  Smartphone,
} from "lucide-react";
import clsx from "clsx";
import NfcMark from "../ui/NfcMark";

// Desktop sidebar carries the full set — both the Helix health-monitoring
// screens and the original Aegis-tag screens. The mobile bottom nav sticks to
// the 5 items updatedPrompt.md specifies (Dashboard/Log/Insights/Trends/
// Profile); Vitals, My Tag, and Medical Profile stay reachable from the
// Dashboard's own quick actions and mini-widget instead of crowding it.
const SIDEBAR_NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/dashboard/log", label: "Log", icon: ClipboardList },
  { to: "/dashboard/insights", label: "Insights", icon: Sparkles },
  { to: "/dashboard/trends", label: "Trends", icon: TrendingUp },
  { to: "/dashboard/vitals", label: "Vitals", icon: Activity },
  { to: "/dashboard/tag", label: "My Tag", icon: Tag },
  { to: "/onboarding", label: "Medical Profile", icon: HeartPulse },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

const MOBILE_NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/dashboard/log", label: "Log", icon: ClipboardList },
  { to: "/dashboard/insights", label: "Insights", icon: Sparkles },
  { to: "/dashboard/trends", label: "Trends", icon: TrendingUp },
  { to: "/dashboard/settings", label: "Profile", icon: Settings },
];

export default function ConsumerDashboardLayout() {
  return (
    <div className="min-h-screen bg-paper md:flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-mist bg-ink md:flex">
        <Link to="/" className="flex items-center gap-2 px-6 py-7">
          <NfcMark className="h-6 w-6" color="#FAF9F6" />
          <span className="font-display text-lg text-paper">Helix</span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {SIDEBAR_NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  "flex min-h-[44px] items-center gap-3 rounded-sm px-3 text-[15px] font-medium transition-colors",
                  isActive ? "bg-paper/10 text-paper" : "text-paper/60 hover:bg-paper/5 hover:text-paper"
                )
              }
            >
              <Icon size={18} strokeWidth={1.5} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-paper/10 px-3 py-3">
          <p className="mb-1 px-3 text-[11px] uppercase tracking-wider text-paper/30">Switch demo</p>
          <Link
            to="/hospital-dashboard"
            className="flex min-h-[44px] items-center gap-3 rounded-sm px-3 text-[15px] font-medium text-paper/60 hover:bg-paper/5 hover:text-paper"
          >
            <Hospital size={18} strokeWidth={1.5} />
            Hospital demo
          </Link>
          <Link
            to="/scan-demo"
            className="flex min-h-[44px] items-center gap-3 rounded-sm px-3 text-[15px] font-medium text-paper/60 hover:bg-paper/5 hover:text-paper"
          >
            <Smartphone size={18} strokeWidth={1.5} />
            NFC scan demo
          </Link>
        </div>

        <div className="px-3 pb-6">
          <Link
            to="/"
            className="flex min-h-[44px] items-center gap-3 rounded-sm px-3 text-[15px] font-medium text-paper/60 hover:bg-paper/5 hover:text-paper"
          >
            <LogOut size={18} strokeWidth={1.5} />
            Log Out
          </Link>
        </div>
      </aside>

      <div className="flex-1 pb-20 md:pb-0">
        <main className="content-container py-8 md:py-12">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-mist bg-paper md:hidden">
        {MOBILE_NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                "flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium",
                isActive ? "text-teal" : "text-slate"
              )
            }
          >
            <Icon size={18} strokeWidth={1.5} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
