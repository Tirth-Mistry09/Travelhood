import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Trash2, Eye, Edit } from "lucide-react";
import { tripsAPI } from "../services/api";

const TripCard = ({ trip, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this trip?")) return;
    try {
      await tripsAPI.delete(trip.id);
      onDelete(trip.id);
    } catch {
      alert("Failed to delete trip.");
    }
  };

  const statusColors = {
    planning:  "bg-blue-500/20 text-blue-400",
    ongoing:   "bg-green-500/20 text-green-400",
    completed: "bg-purple-500/20 text-purple-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5 card-hover cursor-pointer"
      onClick={() => navigate(`/itinerary-view/${trip.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl">{trip.cover_image || "✈️"}</div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[trip.status] || statusColors.planning}`}>
          {trip.status}
        </span>
      </div>

      <h3 className="text-white font-semibold text-lg mb-1 truncate">{trip.name}</h3>
      <p className="text-white/50 text-sm mb-3 line-clamp-2">{trip.description || "No description."}</p>

      <div className="flex items-center gap-4 text-white/40 text-xs mb-4">
        <span className="flex items-center gap-1">
          <MapPin size={12} /> {trip.stop_count || 0} stops
        </span>
        {trip.start_date && (
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {new Date(trip.start_date).toLocaleDateString()}
          </span>
        )}
      </div>

      {trip.total_budget > 0 && (
        <div className="mb-4">
          <p className="text-white/40 text-xs mb-1">Budget</p>
          <p className="text-white font-semibold">₹{Number(trip.total_budget).toLocaleString()}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/itinerary-builder/${trip.id}`); }}
          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-blue-500/10 text-blue-400 text-xs hover:bg-blue-500/20 transition"
        >
          <Edit size={12} /> Edit
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/itinerary-view/${trip.id}`); }}
          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-white/5 text-white/60 text-xs hover:bg-white/10 transition"
        >
          <Eye size={12} /> View
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </motion.div>
  );
};

export default TripCard;