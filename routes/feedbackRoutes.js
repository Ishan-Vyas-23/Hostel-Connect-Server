const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const feedbackController = require("../controllers/feedbackController");

router.post("/:id", authMiddleware, feedbackController.addFeedback);

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "warden", "staff"]),
  feedbackController.getAllFeedbacks,
);

module.exports = router;
