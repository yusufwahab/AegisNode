import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PublicLayout({ transparentNav = false }) {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar transparentOnTop={transparentNav} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
