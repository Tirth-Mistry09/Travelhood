import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Sparkles, Clock, MapPin, Wallet } from "lucide-react";
import { aiAPI } from "../services/api";
import AnimatedButton from "../components/AnimatedButton";

const INTERESTS  = ["sightseeing","food","adventure","shopping","culture","nature","nightlife","wellness"];
const STYLES     = ["budget","mid-range","luxury","backpacker","family-friendly"];

const AIPlanner = () => {
  const [form, setForm] = useState({
    destination: "", days: 3, budget: "", interests: [], travel_style: "mid-range",
  });
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const toggleInterest = (interest) => {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter((i) => i !== interest)
        : [...f.interests, interest],
    }));
  };

  const handleGenerate = async () => {
    if (!form.destination) return setError("Please enter a destination.");
    setError("");
    setLoading(true);
    try {
      const payload = { ...form, interests: form.interests.join(", ") };
      const { data } = await aiAPI.planTrip(payload);
      setResult(data);
    } catch {
      setError("Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Bot size={28} className="text-purple-400" />
        <div>
          <h1 className="text-3xl font-bold text-white">AI Trip Planner</h1>
          <p className="text-white/40 text-sm">Powered by AI · Get a full itinerary in seconds</p>
        </div>
      </div>

      {/* Form */}
      <div className="glass rounded-2xl p-6 space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-3">{error}</div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-white/60 text-xs mb-1 block">Destination *</label>
            <input className="input-field" placeholder="e.g. Goa, Tokyo, Paris"
              value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
          </div>
          <div>
            <label className="text-white/60 text-xs mb-1 block">Number of Days</label>
            <input type="number" min={1} max={30} className="input-field"
              value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="text-white/60 text-xs mb-1 block">Budget (₹)</label>
          <input type="number" className="input-field" placeholder="e.g. 20000"
            value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
        </div>

        <div>
          <label className="text-white/60 text-xs mb-2 block">Interests</label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((interest) => (
              <button key={interest} type="button" onClick={() => toggleInterest(interest)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  form.interests.includes(interest)
                    ? "bg-purple-500/30 text-purple-300 border border-purple-500/40"
                    : "bg-white/5 text-white/50 border border-white/10 hover:border-white/20"
                }`}>
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-white/60 text-xs mb-2 block">Travel Style</label>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((style) => (
              <button key={style} type="button" onClick={() => setForm({ ...form, travel_style: style })}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  form.travel_style === style
                    ? "bg-blue-500/30 text-blue-300 border border-blue-500/40"
                    : "bg-white/5 text-white/50 border border-white/10 hover:border-white/20"
                }`}>
                {style}
              </button>
            ))}
          </div>
        </div>

        <AnimatedButton onClick={handleGenerate} disabled={loading} className="w-full justify-center">
          <Sparkles size={16} />
          {loading ? "Generating your trip plan..." : "Generate AI Itinerary"}
        </AnimatedButton>
      </div>

      {/* Result */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* Summary */}
          <div className="glass rounded-2xl p-5">
            <h2 className="text-xl font-bold text-white mb-1">{result.destination} — {result.days} Days</h2>
            <div className="flex gap-4 flex-wrap text-sm">
              <span className="text-green-400 flex items-center gap-1"><Wallet size={14} /> {result.estimated_budget}</span>
              <span className="text-blue-400 flex items-center gap-1"><Clock size={14} /> Best: {result.best_time_to_visit}</span>
            </div>
          </div>

          {/* Day-wise Itinerary */}
          {result.itinerary?.map((day) => (
            <div key={day.day} className="glass rounded-2xl p-5">
              <h3 className="text-white font-bold mb-4">Day {day.day} — {day.title}</h3>
              <div className="space-y-3">
                {day.activities?.map((act, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-blue-400 text-xs w-20 flex-shrink-0 pt-0.5">{act.time}</span>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{act.activity}</p>
                      <p className="text-white/40 text-xs">{act.description}</p>
                      <div className="flex gap-3 mt-1 text-xs text-white/30">
                        {act.cost     && <span>💰 {act.cost}</span>}
                        {act.duration && <span>⏱ {act.duration}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Packing List */}
          {result.packing_list?.length > 0 && (
            <div className="glass rounded-2xl p-5">
              <h3 className="text-white font-bold mb-3">🎒 Packing List</h3>
              <div className="grid grid-cols-2 gap-2">
                {result.packing_list.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Travel Tips */}
          {result.travel_tips?.length > 0 && (
            <div className="glass rounded-2xl p-5">
              <h3 className="text-white font-bold mb-3">💡 Travel Tips</h3>
              <ul className="space-y-2">
                {result.travel_tips.map((tip, i) => (
                  <li key={i} className="text-white/60 text-sm flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">✦</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Local Cuisine */}
          {result.local_cuisine?.length > 0 && (
            <div className="glass rounded-2xl p-5">
              <h3 className="text-white font-bold mb-3">🍽️ Must-Try Local Food</h3>
              <div className="flex flex-wrap gap-2">
                {result.local_cuisine.map((dish, i) => (
                  <span key={i} className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-3 py-1.5 rounded-full">
                    {dish}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AIPlanner;