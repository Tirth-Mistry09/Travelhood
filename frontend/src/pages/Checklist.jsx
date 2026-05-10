import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Trash2, Check } from "lucide-react";
import { checklistAPI } from "../services/api";
import AnimatedButton from "../components/AnimatedButton";

const CATEGORIES = ["clothing","documents","electronics","toiletries","medicines","miscellaneous"];
const CAT_EMOJIS = { clothing:"👕", documents:"📄", electronics:"🔌", toiletries:"🧴", medicines:"💊", miscellaneous:"📦" };

const Checklist = () => {
  const { tripId } = useParams();
  const [items, setItems]   = useState([]);
  const [form, setForm]     = useState({ item: "", category: "miscellaneous" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checklistAPI.getAll(tripId)
      .then(({ data }) => setItems(data.checklist || []))
      .finally(() => setLoading(false));
  }, [tripId]);

  const addItem = async () => {
    if (!form.item.trim()) return;
    const { data } = await checklistAPI.add({ ...form, trip_id: tripId });
    setItems([...items, data.item]);
    setForm({ item: "", category: "miscellaneous" });
  };

  const togglePacked = async (item) => {
    const updated = { ...item, is_packed: item.is_packed ? 0 : 1 };
    await checklistAPI.update(item.id, updated);
    setItems(items.map((i) => (i.id === item.id ? updated : i)));
  };

  const deleteItem = async (id) => {
    await checklistAPI.delete(id);
    setItems(items.filter((i) => i.id !== id));
  };

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = items.filter((i) => i.category === cat);
    return acc;
  }, {});

  const packed   = items.filter((i) => i.is_packed).length;
  const progress = items.length > 0 ? Math.round((packed / items.length) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white">Packing Checklist</h1>

      {/* Progress */}
      <div className="glass rounded-2xl p-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white/60">Packed {packed}/{items.length}</span>
          <span className="text-green-400">{progress}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div className="h-2 rounded-full bg-green-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Add Item */}
      <div className="glass rounded-2xl p-5">
        <div className="flex gap-2 flex-wrap">
          <input
            className="input-field flex-1 min-w-0"
            placeholder="Add item..."
            value={form.item}
            onChange={(e) => setForm({ ...form, item: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
          />
          <select
            className="input-field w-40"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <AnimatedButton onClick={addItem}>
            <Plus size={15} /> Add
          </AnimatedButton>
        </div>
      </div>

      {/* Grouped Items */}
      {loading ? (
        <p className="text-white/40">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-white/30 text-center py-8">No items yet. Start adding!</p>
      ) : (
        CATEGORIES.filter((c) => grouped[c].length > 0).map((cat) => (
          <motion.div key={cat} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-5">
            <h3 className="text-white/70 text-sm font-semibold mb-3">
              {CAT_EMOJIS[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
              <span className="text-white/30 ml-2">({grouped[cat].length})</span>
            </h3>
            <div className="space-y-2">
              {grouped[cat].map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <button
                    onClick={() => togglePacked(item)}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${
                      item.is_packed ? "bg-green-500 border-green-500" : "border-white/20 hover:border-green-400"
                    }`}
                  >
                    {item.is_packed ? <Check size={13} className="text-white" /> : null}
                  </button>
                  <span className={`flex-1 text-sm ${item.is_packed ? "line-through text-white/30" : "text-white"}`}>
                    {item.item}
                  </span>
                  <button onClick={() => deleteItem(item.id)} className="text-red-400/60 hover:text-red-400 transition">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default Checklist;