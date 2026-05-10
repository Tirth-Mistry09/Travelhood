import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PlaneTakeoff } from "lucide-react";
import { tripsAPI } from "../services/api";
import AnimatedButton from "../components/AnimatedButton";

const EMOJIS = ["✈️","🏖️","🗺️","🏔️","🌴","🏝️","🌺","🗽","🏯","🌍","🎡","🛕"];

const CreateTrip = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", description: "", total_budget: "",
    start_date: "", end_date: "", cover_image: "✈️",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await tripsAPI.create(form);
      navigate(`/itinerary-builder/${data.trip.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create trip.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-1">Create New Trip</h1>
        <p className="text-white/40 text-sm mb-8">Plan your next adventure</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-3 mb-6">
            {error}
          </div>
        )}

        <div className="glass rounded-2xl p-6 space-y-5">
          {/* Cover Emoji */}
          <div>
            <label className="text-white/60 text-xs mb-2 block">Trip Icon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setForm({ ...form, cover_image: em })}
                  className={`w-10 h-10 text-xl rounded-xl transition ${
                    form.cover_image === em
                      ? "bg-blue-500/30 border border-blue-500"
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-white/60 text-xs mb-1 block">Trip Name *</label>
            <input
              className="input-field"
              placeholder="e.g. Goa Adventure"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-white/60 text-xs mb-1 block">Description</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="What's this trip about?"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div>
            <label className="text-white/60 text-xs mb-1 block">Total Budget (₹)</label>
            <input
              type="number"
              className="input-field"
              placeholder="e.g. 25000"
              value={form.total_budget}
              onChange={(e) => setForm({ ...form, total_budget: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/60 text-xs mb-1 block">Start Date</label>
              <input
                type="date"
                className="input-field"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              />
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1 block">End Date</label>
              <input
                type="date"
                className="input-field"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              />
            </div>
          </div>

          <AnimatedButton onClick={handleSubmit} disabled={loading} className="w-full justify-center">
            <PlaneTakeoff size={16} />
            {loading ? "Creating..." : "Create Trip & Build Itinerary"}
          </AnimatedButton>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateTrip;