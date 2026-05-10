const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/authMiddleware");
const { addItem, getChecklist, updateItem, deleteItem } = require("../controllers/checklistController");

router.post("/",        auth, addItem);
router.get("/:tripId",  auth, getChecklist);
router.put("/:id",      auth, updateItem);
router.delete("/:id",   auth, deleteItem);

module.exports = router;