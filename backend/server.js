const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth",       require("./routes/auth"));
app.use("/api/trips",      require("./routes/trips"));
app.use("/api/stops",      require("./routes/stops"));
app.use("/api/activities", require("./routes/activities"));
app.use("/api/budget",     require("./routes/budget"));
app.use("/api/checklist",  require("./routes/checklist"));
app.use("/api/notes",      require("./routes/notes"));
app.use("/api/share",      require("./routes/share"));
app.use("/api/ai",         require("./routes/ai"));
app.use("/api/admin",      require("./routes/admin"));

app.get("/", (req, res) => {
  res.json({ message: "🌍 Traveloop API is running." });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Traveloop backend running on http://localhost:${PORT}`);
});