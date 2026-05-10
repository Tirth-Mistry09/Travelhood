import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { tripsAPI } from "../services/api";
import TripCard from "../components/TripCard";
import EmptyState from "../components/EmptyState";
import AnimatedButton from "../components/AnimatedButton";

const MyTrips = () => {
  const navigate = useNavigate();
  const [trips, setTrips]   = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripsAPI.getAll()
      .then(({ data }) => setTrips(data.trips || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = trips.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">My Trips</h1>
          <p className="text-white/40 text-sm">{trips.length} trip{trips.length !== 1 ? "s" : ""} planned</p>
        </div>
        <AnimatedButton onClick={() => navigate("/create-trip")}>
          <Plus size={16} /> New Trip
        </AnimatedButton>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-3.5 text-white/30" />
        <input
          className="input-field pl-9"
          placeholder="Search trips..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-white/40 text-sm">Loading trips...</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🗺️"
          title="No trips found"
          subtitle="Create your first trip to get started."
          action={
            <AnimatedButton onClick={() => navigate("/create-trip")}>
              <Plus size={16} /> Create Trip
            </AnimatedButton>
          }
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filtered.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onDelete={(id) => setTrips(trips.filter((t) => t.id !== id))}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MyTrips;