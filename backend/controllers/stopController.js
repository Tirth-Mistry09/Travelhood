const db = require("../config/db");

const createStop = async (req, res) => {
  const { trip_id, city, country, arrival_date, leave_date, order_index, notes } = req.body;

  if (!trip_id || !city || !country) {
    return res.status(400).json({ message: "trip_id, city, and country are required." });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO stops (trip_id, city, country, arrival_date, leave_date, order_index, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [trip_id, city, country, arrival_date || null, leave_date || null, order_index || 0, notes || null]
    );

    const [stop] = await db.query("SELECT * FROM stops WHERE id = ?", [result.insertId]);

    return res.status(201).json({ message: "Stop added.", stop: stop[0] });
  } catch (err) {
    console.error("Create stop error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

const getStopsByTrip = async (req, res) => {
  const { tripId } = req.params;

  try {
    const [stops] = await db.query(
      "SELECT * FROM stops WHERE trip_id = ? ORDER BY order_index ASC",
      [tripId]
    );

    return res.status(200).json({ stops });
  } catch (err) {
    console.error("Get stops error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

const deleteStop = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM stops WHERE id = ?", [id]);
    return res.status(200).json({ message: "Stop deleted." });
  } catch (err) {
    console.error("Delete stop error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { createStop, getStopsByTrip, deleteStop };