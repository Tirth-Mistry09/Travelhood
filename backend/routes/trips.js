const express    = require("express");
const router     = express.Router();
const auth       = require("../middleware/authMiddleware");
const {
  createTrip, getAllTrips, getTripById, updateTrip, deleteTrip,
} = require("../controllers/tripController");

router.post("/",    auth, createTrip);
router.get("/",     auth, getAllTrips);
router.get("/:id",  auth, getTripById);
router.put("/:id",  auth, updateTrip);
router.delete("/:id", auth, deleteTrip);

module.exports = router;