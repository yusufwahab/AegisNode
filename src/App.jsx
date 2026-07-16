import { Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/ui/Toast";
import PublicLayout from "./components/layout/PublicLayout";
// import AuthLayout from "./components/layout/AuthLayout"; // auth disabled for now — see routes below
import ConsumerDashboardLayout from "./components/layout/ConsumerDashboardLayout";
import HospitalDashboardLayout from "./components/layout/HospitalDashboardLayout";

import Landing from "./pages/Landing";
import HowItWorks from "./pages/HowItWorks";
import Hospitals from "./pages/Hospitals";
import Order from "./pages/Order";
import About from "./pages/About";
// import Signup from "./pages/Signup"; // auth disabled for now — see routes below
// import Login from "./pages/Login"; // auth disabled for now — see routes below
import Onboarding from "./pages/Onboarding";
import ScanDemo from "./pages/ScanDemo";
import NotFound from "./pages/NotFound";

import Overview from "./pages/dashboard/Overview";
import TagPage from "./pages/dashboard/Tag";
import Vitals from "./pages/dashboard/Vitals";
import Settings from "./pages/dashboard/Settings";

import IncomingAlerts from "./pages/hospital/IncomingAlerts";
import PatientLog from "./pages/hospital/PatientLog";
import HospitalSettings from "./pages/hospital/HospitalSettings";

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<PublicLayout transparentNav />}>
          <Route path="/" element={<Landing />} />
          <Route path="/hospitals" element={<Hospitals />} />
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/order" element={<Order />} />
          <Route path="/about" element={<About />} />
          <Route path="/scan-demo" element={<ScanDemo />} />
        </Route>

        {/* Auth disabled for now — app runs as a hardcoded session user (see mockProfile
            in lib/mockData.js). Uncomment to restore login/signup. */}
        {/* <Route element={<AuthLayout />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Route> */}

        <Route path="/onboarding" element={<Onboarding />} />

        <Route element={<ConsumerDashboardLayout />}>
          <Route path="/dashboard" element={<Overview />} />
          <Route path="/dashboard/tag" element={<TagPage />} />
          <Route path="/dashboard/vitals" element={<Vitals />} />
          <Route path="/dashboard/settings" element={<Settings />} />
        </Route>

        <Route element={<HospitalDashboardLayout />}>
          <Route path="/hospital-dashboard" element={<IncomingAlerts />} />
          <Route path="/hospital-dashboard/patients" element={<PatientLog />} />
          <Route path="/hospital-dashboard/settings" element={<HospitalSettings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ToastProvider>
  );
}
