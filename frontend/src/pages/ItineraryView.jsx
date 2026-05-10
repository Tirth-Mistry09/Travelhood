import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Edit, Share2, Wallet, CheckSquare, StickyNote, MapPin } from "lucide-react";
import { tripsAPI, stopsAPI, activitiesAPI, shareAPI } from "../services/api";
import TimelineItem from "../components/TimelineItem";
import AnimatedButton from "../components/AnimatedButton";

const ItineraryView = () => {
  const { tripId } = useParams();
  const navigate   = useNavigate();
  const [trip, setTrip]   = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareLink, setShareLink] = useState("");

  useEffect(() => {
    const load = async () => {
      const [{ data: td }, { data: sd }] = await Promise.all([
        tripsAPI.getById(tripId),
        stopsAPI.getByTrip(tripId),
      ]);
      setTrip(td.trip);
      const full = await Promise.all(
        sd.stops.map(async (s) => {
          const { data: ad } = await activitiesAPI.getByStop(s.id);
          return { ...s, activities: ad.activities || [] };
        })
      );
      setStops(full);
      setLoading(false);
    };
    load();
  }, [tripId]);

  const handleShare = async () => {
    try {
      const { data } = await shareAPI.share(tripId);
      const link = `${window.location.origin}/share/${data.share_code}`;
      setShareLink(link);
      navigator.clipboard.writeText(link);
      alert("Share link copied to clipboard!");
    } catch { alert("Failed to generate share link."); }
  };

  if (loading) return <p className="text-white/40">Loading itinerary...</p>;

  const totalCost = stops.flatMap((s) => s.activities).reduce((sum, a) => sum + Number(a.cost || 0), 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="text-4xl mb-2">{trip?.cover_image || "✈️"}</div>
            <h1 className="text-3xl font-bold text-white">{trip?.name}</h1>
            {trip?.description && <p className="text-white/50 text-sm mt-1">{trip.description}</p>}
            <div className="flex gap-4 mt-3 text-white/40 text-sm flex-wrap">
              <span>📍 {stops.length} stops</span>
              {trip?.start_date && <span>📅 {new Date(trip.start_date).toLocaleDateString()}</span>}
              {trip?.end_date   && <span>→ {new Date(trip.end_date).toLocaleDateString()}</span>}
              <span>💰 Total: ₹{totalCost.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <AnimatedButton variant="secondary" onClick={() => navigate(`/itinerary-builder/${tripId}`)}>
              <Edit size={15} /> Edit
            </AnimatedButton>
            <AnimatedButton variant="secondary" onClick={handleShare}>
              <Share2 size={15} /> Share
            </AnimatedButton>
          </div>
        </div>
      </motion.div>

      {/* Quick Nav */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: "Budget",    icon: <Wallet size={14} />,     to: `/budget/${tripId}`    },
          { label: "Checklist", icon: <CheckSquare size={14} />, to: `/checklist/${tripId}` },
          { label: "Notes",     icon: <StickyNote size={14} />,  to: `/notes/${tripId}`     },
        ].map((item) => (
          <AnimatedButton key={item.to} variant="secondary" onClick={() => navigate(item.to)}>
            {item.icon} {item.label}
          </AnimatedButton>
        ))}
      </div>

      {/* Timeline */}
      {stops.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <p className="text-white/40">No stops added yet.</p>
          <AnimatedButton className="mt-4" onClick={() => navigate(`/itinerary-builder/${tripId}`)}>
            <MapPin size={15} /> Add Stops
          </AnimatedButton>
        </div>
      ) : (
        stops.map((stop, si) => (
          <motion.div
            key={stop.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.1 }}
            className="glass rounded-2xl p-5"
          >
            <h2 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
              <MapPin size={16} className="text-blue-400" />
              {stop.city}, {stop.country}
            </h2>
            {stop.arrival_date && (
              <p className="text-white/40 text-xs mb-4">
                {new Date(stop.arrival_date).toLocaleDateString()} —{" "}
                {stop.leave_date ? new Date(stop.leave_date).toLocaleDateString() : "open return"}
              </p>
            )}

            {stop.activities.length === 0 ? (
              <p className="text-white/30 text-sm">No activities added.</p>
            ) : (
              <div>
                {stop.activities.map((act, ai) => (
                  <TimelineItem key={act.id} activity={act} index={ai} />
                ))}
              </div>
            )}
          </motion.div>
        ))
      )}
    </div>
  );
};

export default ItineraryView;