const express  = require("express");
const router   = express.Router();
const auth     = require("../middleware/authMiddleware");
const { planTrip } = require("../controllers/aiController");

router.post("/plan-trip", auth, planTrip);

module.exports = router;