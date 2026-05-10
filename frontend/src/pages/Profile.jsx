import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import AnimatedButton from "../components/AnimatedButton";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white">Profile</h1>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-white font-bold text-xl">{user?.name}</h2>
            <p className="text-white/40 text-sm">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-3 border-t border-white/10 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Name</span>
            <span className="text-white">{user?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Email</span>
            <span className="text-white">{user?.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/50">User ID</span>
            <span className="text-white/40">#{user?.id}</span>
          </div>
        </div>
      </motion.div>

      <div className="glass rounded-2xl p-6 space-y-3">
        <h3 className="text-white font-semibold mb-3">Quick Links</h3>
        {[
          { label: "My Trips",   to: "/my-trips"   },
          { label: "AI Planner", to: "/ai-planner"  },
          { label: "Admin",      to: "/admin"        },
        ].map((item) => (
          <button key={item.to} onClick={() => navigate(item.to)}
            className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition text-sm">
            {item.label} →
          </button>
        ))}
      </div>

      <AnimatedButton variant="danger" onClick={handleLogout} className="w-full justify-center">
        <LogOut size={16} /> Logout
      </AnimatedButton>
    </div>
  );
};

export default Profile;