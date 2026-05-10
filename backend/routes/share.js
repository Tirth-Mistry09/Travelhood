const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/authMiddleware");
const { shareTrip, getPublicItinerary } = require("../controllers/shareController");

router.post("/public/:tripId",    auth, shareTrip);
router.get("/public/:shareCode",       getPublicItinerary);

module.exports = router;