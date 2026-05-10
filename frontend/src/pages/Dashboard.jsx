import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Map, Bot, Activity } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { tripsAPI } from "../services/api";
import GlobeScene from "../components/GlobeScene";
import StatCard   from "../components/StatCard";
import TripCard   from "../components/TripCard";
import EmptyState from "../components/EmptyState";
import AnimatedButton from "../components/AnimatedButton";

const Dashboard = () => {
  const { user }        = useAuth();
  const navigate        = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripsAPI.getAll().then(({ data }) => {
      setTrips(data.trips || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totalBudget = trips.reduce((s, t) => s + Number(t.total_budget || 0), 0);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl overflow-hidden"
      >
        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-8 flex flex-col justify-center">
            <p className="text-blue-400 text-sm font-semibold mb-2">Welcome back 👋</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Hello, <span className="gradient-text">{user?.name?.split(" ")[0]}</span>
            </h1>
            <p className="text-white/50 text-sm mb-6">
              Ready to plan your next adventure? Your world awaits.
            </p>
            <div className="flex gap-3 flex-wrap">
              <AnimatedButton onClick={() => navigate("/create-trip")}>
                <Plus size={16} /> New Trip
              </AnimatedButton>
              <AnimatedButton variant="secondary" onClick={() => navigate("/ai-planner")}>
                <Bot size={16} /> AI Planner
              </AnimatedButton>
            </div>
          </div>
          <GlobeScene />
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="✈️" label="Total Trips"       value={trips.length}                              color="blue"   delay={0.1} />
        <StatCard icon="🗺️" label="Destinations"      value={trips.reduce((s,t)=>s+(t.stop_count||0),0)} color="purple" delay={0.2} />
        <StatCard icon="💰" label="Total Budget"      value={`₹${totalBudget.toLocaleString()}`}        color="green"  delay={0.3} />
        <StatCard icon="🤖" label="AI Plans"          value="∞"                                          color="amber"  delay={0.4} />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-white font-semibold text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: "🗺️",  label: "My Trips",      to: "/my-trips"        },
            { icon: "🔍",  label: "Search Cities",  to: "/city-search"     },
            { icon: "🎯",  label: "Activities",     to: "/activity-search" },
            { icon: "🤖",  label: "AI Planner",     to: "/ai-planner"      },
          ].map((action) => (
            <motion.button
              key={action.to}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(action.to)}
              className="glass rounded-2xl p-4 text-center hover:border-blue-500/30 transition border border-white/5"
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <p className="text-white/70 text-xs font-medium">{action.label}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Trips */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-lg">Recent Trips</h2>
          <button onClick={() => navigate("/my-trips")} className="text-blue-400 text-sm hover:underline">
            View all →
          </button>
        </div>

        {loading ? (
          <p className="text-white/40 text-sm">Loading trips...</p>
        ) : trips.length === 0 ? (
          <EmptyState
            icon="🗺️"
            title="No trips yet"
            subtitle="Create your first trip and start planning your adventure."
            action={
              <AnimatedButton onClick={() => navigate("/create-trip")}>
                <Plus size={16} /> Create Trip
              </AnimatedButton>
            }
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.slice(0, 3).map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onDelete={(id) => setTrips(trips.filter((t) => t.id !== id))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;