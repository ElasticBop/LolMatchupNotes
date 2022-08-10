const express = require("express");
const router = express.Router();

const {
    getSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule
} = require("../controllers/scheduleController");

const {protect} = require("../middleware/authMiddleware");

router.get("/", protect, getSchedules);

router.post("/", protect, createSchedule);

router.put("/:id", protect, updateSchedule);

router.delete("/:id", protect, deleteSchedule);



module.exports = router;