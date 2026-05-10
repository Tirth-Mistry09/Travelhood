const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/authMiddleware");
const { createActivity, getActivitiesByStop, deleteActivity } = require("../controllers/activityController");

router.post("/",          auth, createActivity);
router.get("/:stopId",    auth, getActivitiesByStop);
router.delete("/:id",     auth, deleteActivity);

module.exports = router;