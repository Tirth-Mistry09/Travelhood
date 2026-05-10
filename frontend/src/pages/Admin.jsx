import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { adminAPI } from "../services/api";
import StatCard from "../components/StatCard";

const COLORS = ["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ef4444","#06b6d4","#ec4899","#84cc16"];

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-white/40">Loading analytics...</p>;
  if (!stats)  return <p className="text-red-400">Failed to load stats.</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Analytics</h1>
        <p className="text-white/40 text-sm mt-1">Platform overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="👥" label="Total Users"      value={stats.total_users}      color="blue"   delay={0.1} />
        <StatCard icon="✈️" label="Total Trips"       value={stats.total_trips}      color="purple" delay={0.2} />
        <StatCard icon="📍" label="Total Stops"       value={stats.total_stops}      color="green"  delay={0.3} />
        <StatCard icon="🎯" label="Total Activities"  value={stats.total_activities} color="amber"  delay={0.4} />
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Trips Per Month */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4">Trips Per Month</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.trips_per_month}>
              <XAxis dataKey="month" tick={{ fill: "#ffffff60", fontSize: 11 }} />
              <YAxis tick={{ fill: "#ffffff60", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#1a2847", border: "none", borderRadius: "8px" }} />
              <Bar dataKey="count" radius={[6,6,0,0]} fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Cities */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4">Top Cities</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.top_cities} layout="vertical">
              <XAxis type="number" tick={{ fill: "#ffffff60", fontSize: 11 }} />
              <YAxis type="category" dataKey="city" tick={{ fill: "#ffffff60", fontSize: 11 }} width={70} />
              <Tooltip contentStyle={{ background: "#1a2847", border: "none", borderRadius: "8px" }} />
              <Bar dataKey="visit_count" radius={[0,6,6,0]}>
                {stats.top_cities.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Trips Table */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-white font-semibold mb-4">Recent Trips</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 border-b border-white/10">
                <th className="text-left py-2 pr-4">Trip</th>
                <th className="text-left py-2 pr-4">User</th>
                <th className="text-left py-2 pr-4">Status</th>
                <th className="text-left py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_trips.map((trip) => (
                <tr key={trip.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="py-3 pr-4 text-white">{trip.name}</td>
                  <td className="py-3 pr-4 text-white/60">{trip.user_name}</td>
                  <td className="py-3 pr-4">
                    <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full">
                      {trip.status}
                    </span>
                  </td>
                  <td className="py-3 text-white/40">{new Date(trip.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Budget Stats */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-white font-semibold mb-3">Budget Insights</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-white/40 text-xs">Total Activity Revenue</p>
            <p className="text-white text-xl font-bold">
              ₹{Number(stats.budget_stats?.total_revenue || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-white/40 text-xs">Avg Activity Cost</p>
            <p className="text-white text-xl font-bold">
              ₹{Math.round(Number(stats.budget_stats?.avg_activity_cost || 0)).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;