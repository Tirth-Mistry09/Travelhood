import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-navy-900">
      <Navbar onMenuToggle={() => setMenuOpen(!menuOpen)} menuOpen={menuOpen} />
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="md:ml-60 pt-16 min-h-screen p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;