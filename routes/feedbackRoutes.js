const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const feedbackController = require("../controllers/feedbackController");

router.post("/:id", authMiddleware, feedbackController.addFeedback);

module.exports = router;
