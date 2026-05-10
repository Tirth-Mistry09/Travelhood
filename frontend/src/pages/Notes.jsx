import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";
import { notesAPI } from "../services/api";
import AnimatedButton from "../components/AnimatedButton";
import EmptyState from "../components/EmptyState";

const Notes = () => {
  const { tripId } = useParams();
  const [notes, setNotes]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState({ title: "", content: "" });
  const [editId, setEditId]   = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    notesAPI.getByTrip(tripId)
      .then(({ data }) => setNotes(data.notes || []))
      .finally(() => setLoading(false));
  }, [tripId]);

  const addNote = async () => {
    if (!form.content.trim()) return;
    const { data } = await notesAPI.create({ ...form, trip_id: tripId });
    setNotes([data.note, ...notes]);
    setForm({ title: "", content: "" });
  };

  const saveEdit = async (id) => {
    const { data } = await notesAPI.update(id, editForm);
    setNotes(notes.map((n) => (n.id === id ? data.note : n)));
    setEditId(null);
  };

  const deleteNote = async (id) => {
    await notesAPI.delete(id);
    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white">Trip Notes</h1>

      {/* Add Note */}
      <div className="glass rounded-2xl p-5 space-y-3">
        <input
          className="input-field"
          placeholder="Note title (optional)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className="input-field resize-none"
          rows={4}
          placeholder="Write your note..."
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <AnimatedButton onClick={addNote}>
          <Plus size={15} /> Add Note
        </AnimatedButton>
      </div>

      {/* Notes List */}
      {loading ? (
        <p className="text-white/40">Loading...</p>
      ) : notes.length === 0 ? (
        <EmptyState icon="📝" title="No notes yet" subtitle="Capture your trip ideas and memories." />
      ) : (
        notes.map((note, i) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="glass rounded-2xl p-5"
          >
            {editId === note.id ? (
              <div className="space-y-3">
                <input
                  className="input-field"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
                <textarea
                  className="input-field resize-none"
                  rows={4}
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                />
                <div className="flex gap-2">
                  <AnimatedButton onClick={() => saveEdit(note.id)}><Save size={14} /> Save</AnimatedButton>
                  <AnimatedButton variant="secondary" onClick={() => setEditId(null)}><X size={14} /> Cancel</AnimatedButton>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-semibold">{note.title || "Untitled Note"}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditId(note.id); setEditForm({ title: note.title, content: note.content }); }}
                      className="text-blue-400/60 hover:text-blue-400 transition"><Edit size={15} /></button>
                    <button onClick={() => deleteNote(note.id)} className="text-red-400/60 hover:text-red-400 transition">
                      <Trash2 size={15} /></button>
                  </div>
                </div>
                <p className="text-white/70 text-sm whitespace-pre-wrap">{note.content}</p>
                <p className="text-white/25 text-xs mt-3">{new Date(note.created_at).toLocaleString()}</p>
              </>
            )}
          </motion.div>
        ))
      )}
    </div>
  );
};

export default Notes;