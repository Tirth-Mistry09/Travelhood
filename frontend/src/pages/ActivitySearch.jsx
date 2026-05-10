import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import activities from "../data/activities";

const TYPES = ["all","transport","stay","meals","activities","miscellaneous"];

const ActivitySearch = () => {
  const [query, setQuery]   = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = activities.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(query.toLowerCase());
    const matchFilter = filter === "all" || a.type === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Activity Search</h1>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-0">
          <Search size={16} className="absolute left-3 top-3.5 text-white/30" />
          <input className="input-field !pl-12" placeholder="Search activities..." value={query}
            onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {TYPES.map((t) => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              filter === t ? "bg-blue-500 text-white" : "glass text-white/60 hover:text-white"
            }`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((act, i) => (
          <motion.div
            key={act.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-5 card-hover"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{act.icon}</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm">{act.name}</h3>
                <p className="text-white/40 text-xs mt-0.5">{act.duration}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-white/5 text-white/50 px-2 py-0.5 rounded-full">{act.type}</span>
                  <span className="text-green-400 text-xs font-semibold">₹{act.cost.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ActivitySearch;