const db = require("../config/db");

const createNote = async (req, res) => {
  const { trip_id, title, content } = req.body;

  if (!trip_id || !content) {
    return res.status(400).json({ message: "trip_id and content are required." });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO notes (trip_id, title, content) VALUES (?, ?, ?)",
      [trip_id, title || "Untitled Note", content]
    );

    const [note] = await db.query("SELECT * FROM notes WHERE id = ?", [result.insertId]);

    return res.status(201).json({ message: "Note created.", note: note[0] });
  } catch (err) {
    console.error("Create note error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

const getNotesByTrip = async (req, res) => {
  const { tripId } = req.params;

  try {
    const [notes] = await db.query(
      "SELECT * FROM notes WHERE trip_id = ? ORDER BY created_at DESC",
      [tripId]
    );

    return res.status(200).json({ notes });
  } catch (err) {
    console.error("Get notes error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    await db.query(
      "UPDATE notes SET title = ?, content = ? WHERE id = ?",
      [title, content, id]
    );

    const [updated] = await db.query("SELECT * FROM notes WHERE id = ?", [id]);

    return res.status(200).json({ message: "Note updated.", note: updated[0] });
  } catch (err) {
    console.error("Update note error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

const deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM notes WHERE id = ?", [id]);
    return res.status(200).json({ message: "Note deleted." });
  } catch (err) {
    console.error("Delete note error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { createNote, getNotesByTrip, updateNote, deleteNote };