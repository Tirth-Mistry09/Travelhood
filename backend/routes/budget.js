const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/authMiddleware");
const { getBudget } = require("../controllers/budgetController");

router.get("/:tripId", auth, getBudget);

module.exports = router;