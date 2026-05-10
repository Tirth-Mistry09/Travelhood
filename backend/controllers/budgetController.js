const db = require("../config/db");

const getBudget = async (req, res) => {
  const { tripId } = req.params;

  try {
    const [tripRows] = await db.query(
      "SELECT total_budget, name, start_date, end_date FROM trips WHERE id = ?",
      [tripId]
    );

    if (tripRows.length === 0) {
      return res.status(404).json({ message: "Trip not found." });
    }

    const trip = tripRows[0];

    const [categoryRows] = await db.query(
      `SELECT a.type AS category, COALESCE(SUM(a.cost), 0) AS total
       FROM activities a
       JOIN stops s ON s.id = a.stop_id
       WHERE s.trip_id = ?
       GROUP BY a.type`,
      [tripId]
    );

    const [totalRow] = await db.query(
      `SELECT COALESCE(SUM(a.cost), 0) AS total_spent
       FROM activities a
       JOIN stops s ON s.id = a.stop_id
       WHERE s.trip_id = ?`,
      [tripId]
    );

    const totalSpent   = parseFloat(totalRow[0].total_spent) || 0;
    const totalBudget  = parseFloat(trip.total_budget) || 0;
    const remaining    = totalBudget - totalSpent;

    const start     = new Date(trip.start_date);
    const end       = new Date(trip.end_date);
    const diffDays  = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const avgPerDay = totalSpent / diffDays;

    const breakdown = {
      transport:     0,
      stay:          0,
      meals:         0,
      activities:    0,
      miscellaneous: 0,
    };

    categoryRows.forEach((row) => {
      if (breakdown.hasOwnProperty(row.category)) {
        breakdown[row.category] = parseFloat(row.total);
      }
    });

    return res.status(200).json({
      trip_name:    trip.name,
      total_budget: totalBudget,
      total_spent:  totalSpent,
      remaining,
      avg_per_day:  parseFloat(avgPerDay.toFixed(2)),
      is_over_budget: totalSpent > totalBudget,
      breakdown,
    });
  } catch (err) {
    console.error("Budget error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getBudget };