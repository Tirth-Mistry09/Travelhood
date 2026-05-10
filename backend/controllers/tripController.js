const db = require("../config/db");

const createTrip = async (req, res) => {
  const { name, description, total_budget, start_date, end_date, cover_image } = req.body;
  const user_id = req.user.id;

  if (!name) {
    return res.status(400).json({ message: "Trip name is required." });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO trips (user_id, name, description, total_budget, start_date, end_date, cover_image)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, name, description || null, total_budget || 0, start_date || null, end_date || null, cover_image || null]
    );

    const [trip] = await db.query("SELECT * FROM trips WHERE id = ?", [result.insertId]);

    return res.status(201).json({ message: "Trip created.", trip: trip[0] });
  } catch (err) {
    console.error("Create trip error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

const getAllTrips = async (req, res) => {
  const user_id = req.user.id;

  try {
    const [trips] = await db.query(
      `SELECT t.*,
        (SELECT COUNT(*) FROM stops s WHERE s.trip_id = t.id) AS stop_count
       FROM trips t
       WHERE t.user_id = ?
       ORDER BY t.created_at DESC`,
      [user_id]
    );

    return res.status(200).json({ trips });
  } catch (err) {
    console.error("Get trips error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

const getTripById = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const [rows] = await db.query(
      "SELECT * FROM trips WHERE id = ? AND user_id = ?",
      [id, user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Trip not found." });
    }

    return res.status(200).json({ trip: rows[0] });
  } catch (err) {
    console.error("Get trip error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

const updateTrip = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  const { name, description, total_budget, start_date, end_date, cover_image, status } = req.body;

  try {
    const [existing] = await db.query(
      "SELECT id FROM trips WHERE id = ? AND user_id = ?",
      [id, user_id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Trip not found." });
    }

    await db.query(
      `UPDATE trips
       SET name = ?, description = ?, total_budget = ?, start_date = ?,
           end_date = ?, cover_image = ?, status = ?
       WHERE id = ? AND user_id = ?`,
      [name, description, total_budget, start_date, end_date, cover_image, status, id, user_id]
    );

    const [updated] = await db.query("SELECT * FROM trips WHERE id = ?", [id]);

    return res.status(200).json({ message: "Trip updated.", trip: updated[0] });
  } catch (err) {
    console.error("Update trip error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

const deleteTrip = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const [existing] = await db.query(
      "SELECT id FROM trips WHERE id = ? AND user_id = ?",
      [id, user_id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Trip not found." });
    }

    await db.query("DELETE FROM trips WHERE id = ? AND user_id = ?", [id, user_id]);

    return res.status(200).json({ message: "Trip deleted." });
  } catch (err) {
    console.error("Delete trip error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { createTrip, getAllTrips, getTripById, updateTrip, deleteTrip };