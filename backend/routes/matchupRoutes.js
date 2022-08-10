const express = require("express");
const router = express.Router();

const {
    getMatchups,
    createMatchup,
    updateMatchup,
    deleteMatchup
} = require("../controllers/matchupController");

const {protect} = require("../middleware/authMiddleware");

router.get("/", protect, getMatchups);

router.post("/", protect, createMatchup);

router.put("/:id", protect, updateMatchup);

router.delete("/:id", protect, deleteMatchup);



module.exports = router;