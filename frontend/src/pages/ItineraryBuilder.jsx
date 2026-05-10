import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Trash2, Eye, MapPin } from "lucide-react";
import { tripsAPI, stopsAPI, activitiesAPI } from "../services/api";
import AnimatedButton from "../components/AnimatedButton";

const ACTIVITY_TYPES = ["transport","stay","meals","activities","miscellaneous"];

const ItineraryBuilder = () => {
  const { tripId } = useParams();
  const navigate   = useNavigate();
  const [trip, setTrip]     = useState(null);
  const [stops, setStops]   = useState([]);
  const [newStop, setNewStop] = useState({ city:"", country:"", arrival_date:"", leave_date:"" });
  const [actForms, setActForms] = useState({});
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: td }, { data: sd }] = await Promise.all([
          tripsAPI.getById(tripId),
          stopsAPI.getByTrip(tripId),
        ]);
        setTrip(td.trip);
        const stopsWithActs = await Promise.all(
          sd.stops.map(async (s) => {
            const { data: ad } = await activitiesAPI.getByStop(s.id);
            return { ...s, activities: ad.activities || [] };
          })
        );
        setStops(stopsWithActs);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tripId]);

  const addStop = async () => {
    if (!newStop.city || !newStop.country) return alert("City and country required.");
    try {
      const { data } = await stopsAPI.create({ ...newStop, trip_id: tripId, order_index: stops.length });
      setStops([...stops, { ...data.stop, activities: [] }]);
      setNewStop({ city: "", country: "", arrival_date: "", leave_date: "" });
    } catch { alert("Failed to add stop."); }
  };

  const deleteStop = async (id) => {
    if (!window.confirm("Delete this stop and all its activities?")) return;
    await stopsAPI.delete(id);
    setStops(stops.filter((s) => s.id !== id));
  };

  const addActivity = async (stopId) => {
    const form = actForms[stopId] || {};
    if (!form.name) return alert("Activity name required.");
    try {
      const { data } = await activitiesAPI.create({ ...form, stop_id: stopId });
      setStops(stops.map((s) =>
        s.id === stopId ? { ...s, activities: [...s.activities, data.activity] } : s
      ));
      setActForms({ ...actForms, [stopId]: {} });
    } catch { alert("Failed to add activity."); }
  };

  const deleteActivity = async (stopId, actId) => {
    await activitiesAPI.delete(actId);
    setStops(stops.map((s) =>
      s.id === stopId ? { ...s, activities: s.activities.filter((a) => a.id !== actId) } : s
    ));
  };

  if (loading) return <p className="text-white/40">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">{trip?.name}</h1>
          <p className="text-white/40 text-sm">Itinerary Builder</p>
        </div>
        <AnimatedButton variant="secondary" onClick={() => navigate(`/itinerary-view/${tripId}`)}>
          <Eye size={16} /> Preview
        </AnimatedButton>
      </div>

      {/* Add Stop */}
      <div className="glass rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <MapPin size={16} className="text-blue-400" /> Add Destination
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input className="input-field" placeholder="City *" value={newStop.city}
            onChange={(e) => setNewStop({ ...newStop, city: e.target.value })} />
          <input className="input-field" placeholder="Country *" value={newStop.country}
            onChange={(e) => setNewStop({ ...newStop, country: e.target.value })} />
          <input type="date" className="input-field" value={newStop.arrival_date}
            onChange={(e) => setNewStop({ ...newStop, arrival_date: e.target.value })} />
          <input type="date" className="input-field" value={newStop.leave_date}
            onChange={(e) => setNewStop({ ...newStop, leave_date: e.target.value })} />
        </div>
        <AnimatedButton onClick={addStop}>
          <Plus size={15} /> Add Stop
        </AnimatedButton>
      </div>

      {/* Stops */}
      {stops.map((stop, si) => (
        <motion.div
          key={stop.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: si * 0.1 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-bold text-lg">
                Stop {si + 1}: {stop.city}, {stop.country}
              </h3>
              {stop.arrival_date && (
                <p className="text-white/40 text-xs">
                  {new Date(stop.arrival_date).toLocaleDateString()} →{" "}
                  {stop.leave_date ? new Date(stop.leave_date).toLocaleDateString() : "open"}
                </p>
              )}
            </div>
            <button onClick={() => deleteStop(stop.id)} className="text-red-400 hover:text-red-300 transition">
              <Trash2 size={16} />
            </button>
          </div>

          {/* Existing Activities */}
          {stop.activities.length > 0 && (
            <div className="space-y-2 mb-4">
              {stop.activities.map((act) => (
                <div key={act.id}
                  className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2 text-sm">
                  <div>
                    <span className="text-white font-medium">{act.name}</span>
                    <span className="text-white/40 ml-2">· {act.type} · ₹{act.cost}</span>
                  </div>
                  <button onClick={() => deleteActivity(stop.id, act.id)} className="text-red-400 hover:text-red-300 ml-3">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Activity Form */}
          <div className="border-t border-white/5 pt-4 space-y-2">
            <p className="text-white/40 text-xs mb-2">Add Activity</p>
            <div className="grid grid-cols-2 gap-2">
              <input className="input-field text-sm py-2" placeholder="Activity name *"
                value={actForms[stop.id]?.name || ""}
                onChange={(e) => setActForms({ ...actForms, [stop.id]: { ...actForms[stop.id], name: e.target.value } })} />
              <select className="input-field text-sm py-2"
                value={actForms[stop.id]?.type || "activities"}
                onChange={(e) => setActForms({ ...actForms, [stop.id]: { ...actForms[stop.id], type: e.target.value } })}>
                {ACTIVITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="number" className="input-field text-sm py-2" placeholder="Cost (₹)"
                value={actForms[stop.id]?.cost || ""}
                onChange={(e) => setActForms({ ...actForms, [stop.id]: { ...actForms[stop.id], cost: e.target.value } })} />
              <input className="input-field text-sm py-2" placeholder="Duration"
                value={actForms[stop.id]?.duration || ""}
                onChange={(e) => setActForms({ ...actForms, [stop.id]: { ...actForms[stop.id], duration: e.target.value } })} />
              <input type="date" className="input-field text-sm py-2"
                value={actForms[stop.id]?.activity_date || ""}
                onChange={(e) => setActForms({ ...actForms, [stop.id]: { ...actForms[stop.id], activity_date: e.target.value } })} />
              <input type="time" className="input-field text-sm py-2"
                value={actForms[stop.id]?.start_time || ""}
                onChange={(e) => setActForms({ ...actForms, [stop.id]: { ...actForms[stop.id], start_time: e.target.value } })} />
            </div>
            <textarea className="input-field text-sm resize-none" rows={2} placeholder="Notes (optional)"
              value={actForms[stop.id]?.notes || ""}
              onChange={(e) => setActForms({ ...actForms, [stop.id]: { ...actForms[stop.id], notes: e.target.value } })} />
            <AnimatedButton onClick={() => addActivity(stop.id)}>
              <Plus size={14} /> Add Activity
            </AnimatedButton>
          </div>
        </motion.div>
      ))}

      {stops.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          <AnimatedButton onClick={() => navigate(`/itinerary-view/${tripId}`)}>
            <Eye size={16} /> View Full Itinerary
          </AnimatedButton>
          <AnimatedButton variant="secondary" onClick={() => navigate(`/budget/${tripId}`)}>
            💰 Budget Breakdown
          </AnimatedButton>
          <AnimatedButton variant="secondary" onClick={() => navigate(`/checklist/${tripId}`)}>
            ✅ Packing Checklist
          </AnimatedButton>
        </div>
      )}
    </div>
  );
};

export default ItineraryBuilder;