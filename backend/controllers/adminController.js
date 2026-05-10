const db = require("../config/db");

const getStats = async (req, res) => {
  try {
    const [[{ total_users }]]  = await db.query("SELECT COUNT(*) AS total_users FROM users");
    const [[{ total_trips }]]  = await db.query("SELECT COUNT(*) AS total_trips FROM trips");
    const [[{ total_stops }]]  = await db.query("SELECT COUNT(*) AS total_stops FROM stops");
    const [[{ total_activities }]] = await db.query("SELECT COUNT(*) AS total_activities FROM activities");

    const [topCities] = await db.query(
      `SELECT city, country, COUNT(*) AS visit_count
       FROM stops
       GROUP BY city, country
       ORDER BY visit_count DESC
       LIMIT 8`
    );

    const [recentTrips] = await db.query(
      `SELECT t.id, t.name, t.status, t.created_at, u.name AS user_name, u.email
       FROM trips t
       JOIN users u ON u.id = t.user_id
       ORDER BY t.created_at DESC
       LIMIT 5`
    );

    const [budgetStats] = await db.query(
      `SELECT
         COALESCE(SUM(a.cost), 0)   AS total_revenue,
         COALESCE(AVG(a.cost), 0)   AS avg_activity_cost
       FROM activities a`
    );

    const [tripsPerMonth] = await db.query(
      `SELECT
         DATE_FORMAT(created_at, '%b %Y') AS month,
         COUNT(*)                         AS count
       FROM trips
       GROUP BY DATE_FORMAT(created_at, '%b %Y')
       ORDER BY MIN(created_at) DESC
       LIMIT 6`
    );

    return res.status(200).json({
      total_users,
      total_trips,
      total_stops,
      total_activities,
      top_cities:     topCities,
      recent_trips:   recentTrips,
      budget_stats:   budgetStats[0],
      trips_per_month: tripsPerMonth.reverse(),
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getStats };