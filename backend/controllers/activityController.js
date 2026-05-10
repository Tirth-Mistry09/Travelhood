const db = require("../config/db");

const createActivity = async (req, res) => {
  const { stop_id, name, type, cost, duration, activity_date, start_time, notes } = req.body;

  if (!stop_id || !name) {
    return res.status(400).json({ message: "stop_id and name are required." });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO activities (stop_id, name, type, cost, duration, activity_date, start_time, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        stop_id,
        name,
        type || "activities",
        cost || 0,
        duration || null,
        activity_date || null,
        start_time || null,
        notes || null,
      ]
    );

    const [activity] = await db.query("SELECT * FROM activities WHERE id = ?", [result.insertId]);

    return res.status(201).json({ message: "Activity added.", activity: activity[0] });
  } catch (err) {
    console.error("Create activity error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

const getActivitiesByStop = async (req, res) => {
  const { stopId } = req.params;

  try {
    const [activities] = await db.query(
      "SELECT * FROM activities WHERE stop_id = ? ORDER BY activity_date, start_time",
      [stopId]
    );

    return res.status(200).json({ activities });
  } catch (err) {
    console.error("Get activities error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

const deleteActivity = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM activities WHERE id = ?", [id]);
    return res.status(200).json({ message: "Activity deleted." });
  } catch (err) {
    console.error("Delete activity error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { createActivity, getActivitiesByStop, deleteActivity };