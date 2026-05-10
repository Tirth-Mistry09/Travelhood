import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { budgetAPI } from "../services/api";

const COLORS = ["#3b82f6","#8b5cf6","#f59e0b","#10b981","#ef4444"];

const Budget = () => {
  const { tripId } = useParams();
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    budgetAPI.getByTrip(tripId)
      .then(({ data: d }) => setData(d))
      .finally(() => setLoading(false));
  }, [tripId]);

  if (loading) return <p className="text-white/40">Loading budget...</p>;
  if (!data)   return <p className="text-red-400">Failed to load budget data.</p>;

  const pieData = Object.entries(data.breakdown)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  const barData = Object.entries(data.breakdown).map(([name, value]) => ({ name, value }));

  const pct = data.total_budget > 0
    ? Math.min(100, Math.round((data.total_spent / data.total_budget) * 100))
    : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white">Budget Breakdown</h1>
      <p className="text-white/40 text-sm -mt-4">{data.trip_name}</p>

      {data.is_over_budget && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 text-sm">
          ⚠️ You are over budget by ₹{(data.total_spent - data.total_budget).toLocaleString()}!
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Budget",   value: `₹${data.total_budget.toLocaleString()}`,  color: "blue"   },
          { label: "Total Spent",    value: `₹${data.total_spent.toLocaleString()}`,    color: "purple" },
          { label: "Remaining",      value: `₹${data.remaining.toLocaleString()}`,      color: data.remaining >= 0 ? "green" : "red" },
          { label: "Avg / Day",      value: `₹${data.avg_per_day.toLocaleString()}`,    color: "amber"  },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-4"
          >
            <p className="text-white/40 text-xs mb-1">{item.label}</p>
            <p className="text-white text-xl font-bold">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="glass rounded-2xl p-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white/60">Budget Used</span>
          <span className={pct >= 100 ? "text-red-400" : "text-green-400"}>{pct}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${pct >= 100 ? "bg-red-500" : "bg-gradient-to-r from-blue-500 to-purple-500"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={80} label={({ name }) => name}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => `₹${Number(v).toLocaleString()}`} contentStyle={{ background:"#1a2847", border:"none", borderRadius:"8px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4">Category Comparison</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fill: "#ffffff60", fontSize: 11 }} />
              <YAxis tick={{ fill: "#ffffff60", fontSize: 11 }} />
              <Tooltip formatter={(v) => `₹${Number(v).toLocaleString()}`} contentStyle={{ background:"#1a2847", border:"none", borderRadius:"8px" }} />
              <Bar dataKey="value" radius={[6,6,0,0]}>
                {barData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Budget;