const db = require("../config/db");

const addItem = async (req, res) => {
  const { trip_id, item, category } = req.body;

  if (!trip_id || !item) {
    return res.status(400).json({ message: "trip_id and item are required." });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO checklist (trip_id, item, category) VALUES (?, ?, ?)",
      [trip_id, item, category || "miscellaneous"]
    );

    const [row] = await db.query("SELECT * FROM checklist WHERE id = ?", [result.insertId]);

    return res.status(201).json({ message: "Item added.", item: row[0] });
  } catch (err) {
    console.error("Add checklist error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

const getChecklist = async (req, res) => {
  const { tripId } = req.params;

  try {
    const [items] = await db.query(
      "SELECT * FROM checklist WHERE trip_id = ? ORDER BY category, created_at",
      [tripId]
    );

    return res.status(200).json({ checklist: items });
  } catch (err) {
    console.error("Get checklist error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

const updateItem = async (req, res) => {
  const { id } = req.params;
  const { is_packed, item, category } = req.body;

  try {
    await db.query(
      "UPDATE checklist SET is_packed = ?, item = ?, category = ? WHERE id = ?",
      [is_packed, item, category, id]
    );

    const [updated] = await db.query("SELECT * FROM checklist WHERE id = ?", [id]);

    return res.status(200).json({ message: "Item updated.", item: updated[0] });
  } catch (err) {
    console.error("Update checklist error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM checklist WHERE id = ?", [id]);
    return res.status(200).json({ message: "Item deleted." });
  } catch (err) {
    console.error("Delete checklist error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { addItem, getChecklist, updateItem, deleteItem };