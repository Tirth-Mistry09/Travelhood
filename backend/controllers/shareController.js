const db    = require("../config/db");
const crypto = require("crypto");

const shareTrip = async (req, res) => {
  const { tripId } = req.params;

  try {
    const [existing] = await db.query(
      "SELECT * FROM shared_itineraries WHERE trip_id = ?",
      [tripId]
    );

    if (existing.length > 0) {
      return res.status(200).json({
        message: "Share link already exists.",
        share_code: existing[0].share_code,
        share_url: `${req.protocol}://${req.get("host")}/share/${existing[0].share_code}`,
      });
    }

    const share_code = crypto.randomBytes(16).toString("hex");

    await db.query(
      "INSERT INTO shared_itineraries (trip_id, share_code) VALUES (?, ?)",
      [tripId, share_code]
    );

    return res.status(201).json({
      message: "Itinerary shared successfully.",
      share_code,
      share_url: `${req.protocol}://${req.get("host")}/share/${share_code}`,
    });
  } catch (err) {
    console.error("Share error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

const getPublicItinerary = async (req, res) => {
  const { shareCode } = req.params;

  try {
    const [shareRows] = await db.query(
      `SELECT t.*, u.name AS owner_name
       FROM shared_itineraries si
       JOIN trips t ON t.id = si.trip_id
       JOIN users u ON u.id = t.user_id
       WHERE si.share_code = ? AND si.is_active = 1`,
      [shareCode]
    );

    if (shareRows.length === 0) {
      return res.status(404).json({ message: "Shared itinerary not found or inactive." });
    }

    const trip = shareRows[0];

    const [stops] = await db.query(
      "SELECT * FROM stops WHERE trip_id = ? ORDER BY order_index",
      [trip.id]
    );

    for (const stop of stops) {
      const [activities] = await db.query(
        "SELECT * FROM activities WHERE stop_id = ? ORDER BY activity_date, start_time",
        [stop.id]
      );
      stop.activities = activities;
    }

    return res.status(200).json({ trip, stops });
  } catch (err) {
    console.error("Public itinerary error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { shareTrip, getPublicItinerary };