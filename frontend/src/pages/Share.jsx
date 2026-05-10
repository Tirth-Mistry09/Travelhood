import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, MapPin } from "lucide-react";
import { shareAPI } from "../services/api";
import TimelineItem from "../components/TimelineItem";

const Share = () => {
  const { shareCode } = useParams();
  const [data, setData]   = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    shareAPI.getPublic(shareCode)
      .then(({ data: d }) => setData(d))
      .catch(() => setError("Itinerary not found or no longer shared."))
      .finally(() => setLoading(false));
  }, [shareCode]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900">
      <p className="text-white/40">Loading shared itinerary...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900">
      <div className="text-center">
        <p className="text-6xl mb-4">🔍</p>
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    </div>
  );

  const { trip, stops } = data;

  return (
    <div className="min-h-screen bg-travel-gradient py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Globe size={24} className="text-blue-400" />
          <span className="gradient-text font-bold text-xl">Traveloop</span>
          <span className="text-white/30 ml-2 text-sm">Shared Itinerary</span>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
          <div className="text-5xl mb-3">{trip.cover_image || "✈️"}</div>
          <h1 className="text-3xl font-bold text-white">{trip.name}</h1>
          {trip.description && <p className="text-white/50 mt-1 text-sm">{trip.description}</p>}
          <div className="flex gap-4 mt-3 text-white/40 text-sm flex-wrap">
            <span>Shared by {trip.owner_name}</span>
            {trip.start_date && <span>📅 {new Date(trip.start_date).toLocaleDateString()}</span>}
            <span>📍 {stops.length} stops</span>
          </div>
        </motion.div>

        {stops.map((stop, si) => (
          <motion.div key={stop.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.1 }}
            className="glass rounded-2xl p-5">
            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <MapPin size={16} className="text-blue-400" />
              {stop.city}, {stop.country}
            </h2>
            {stop.activities.length === 0 ? (
              <p className="text-white/30 text-sm">No activities.</p>
            ) : (
              stop.activities.map((act, ai) => <TimelineItem key={act.id} activity={act} index={ai} />)
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Share;