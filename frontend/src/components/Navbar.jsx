import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Globe, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = ({ onMenuToggle, menuOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="glass-dark fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-4 md:px-6 gap-4">
      <button
        onClick={onMenuToggle}
        className="md:hidden text-white/60 hover:text-white transition"
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <Link to="/dashboard" className="flex items-center gap-2 mr-auto">
        <Globe size={22} className="text-blue-400" />
        <span className="gradient-text font-bold text-lg">Traveloop</span>
      </Link>

      {user && (
        <div className="flex items-center gap-3">
          <Link to="/profile">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="text-white/40 hover:text-red-400 transition"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;