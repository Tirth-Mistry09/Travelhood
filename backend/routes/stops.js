const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/authMiddleware");
const { createStop, getStopsByTrip, deleteStop } = require("../controllers/stopController");

router.post("/",            auth, createStop);
router.get("/:tripId",      auth, getStopsByTrip);
router.delete("/:id",       auth, deleteStop);

module.exports = router;