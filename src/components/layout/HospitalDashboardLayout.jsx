import { NavLink, Outlet, Link } from "react-router-dom";
import { Activity, Users, Settings, LogOut } from "lucide-react";
import clsx from "clsx";
import NfcMark from "../ui/NfcMark";

const NAV = [
  { to: "/hospital-dashboard", label: "Incoming Alerts", icon: Activity, end: true },
  { to: "/hospital-dashboard/patients", label: "Patient Log", icon: Users },
  { to: "/hospital-dashboard/settings", label: "Settings", icon: Settings },
];

export default function HospitalDashboardLayout() {
  return (
    <div className="min-h-screen bg-paper md:flex">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-mist bg-ink md:flex">
        <Link to="/" className="flex items-center gap-2 px-6 py-6">
          <NfcMark className="h-5 w-5" color="#FAF9F6" />
          <span className="font-display text-base text-paper">Aegis Node</span>
        </Link>
        <p className="px-6 pb-4 text-[11px] uppercase tracking-wider text-paper/40">
          Hospital Console
        </p>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  "flex min-h-[44px] items-center gap-3 rounded-sm px-3 text-[14px] font-medium transition-colors",
                  isActive ? "bg-paper/10 text-paper" : "text-paper/60 hover:bg-paper/5 hover:text-paper"
                )
              }
            >
              <Icon size={17} strokeWidth={1.5} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-6">
          <Link
            to="/"
            className="flex min-h-[44px] items-center gap-3 rounded-sm px-3 text-[14px] font-medium text-paper/60 hover:bg-paper/5 hover:text-paper"
          >
            <LogOut size={17} strokeWidth={1.5} />
            Log Out
          </Link>
        </div>
      </aside>

      <div className="flex-1 pb-20 md:pb-0">
        <main className="content-container max-w-none py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-mist bg-paper md:hidden">
        {NAV.map(({ to, label, icon: Icon, end }) => (
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
