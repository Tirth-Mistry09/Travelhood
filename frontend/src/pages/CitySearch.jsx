import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import cities from "../data/cities";

const CitySearch = () => {
  const [query, setQuery]   = useState("");
  const [filter, setFilter] = useState("all");
  const navigate            = useNavigate();

  const filtered = cities.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(query.toLowerCase()) ||
                        c.country.toLowerCase().includes(query.toLowerCase());
    const matchFilter = filter === "all" || (filter === "popular" && c.popular);
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">City Search</h1>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-0">
          <Search size={16} className="absolute left-3 top-3.5 text-white/30" />
          <input className="input-field !pl-12" placeholder="Search cities..." value={query}
            onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {["all", "popular"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                filter === f ? "bg-blue-500 text-white" : "glass text-white/60 hover:text-white"
              }`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((city, i) => (
          <motion.div
            key={city.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-5 card-hover cursor-pointer text-center"
            onClick={() => navigate("/create-trip")}
          >
            <div className="text-4xl mb-3">{city.image}</div>
            <h3 className="text-white font-semibold text-sm">{city.name}</h3>
            <p className="text-white/40 text-xs mb-3">{city.country}</p>
            {city.popular && (
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Popular</span>
            )}
            <div className="flex flex-wrap gap-1 mt-2 justify-center">
              {city.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CitySearch;